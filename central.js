/* ══════════════════════════════════════════════════════════════
 *  CENTRAL DE AUTOMAÇÃO — CLTzinho Digital
 *  V2 · carregador
 *
 *  ESTE É O ARQUIVO QUE O FAVORITO BUSCA.
 *
 *  Ele é pequeno de propósito. A função dele é montar a base,
 *  baixar os módulos do repositório e mandar rodar. Todo o resto
 *  (interface, robôs, motor) está em src/.
 *
 *  ORDEM DAS COISAS
 *    1. cria a base window.CentralRobos (CR)
 *    2. lê o manifest.json para saber a versão e a lista de módulos
 *    3. baixa todos os módulos ao mesmo tempo
 *    4. executa na ordem certa (utilidades primeiro, tela por último)
 *    5. se qualquer coisa falhar, cai no arquivo único de reserva
 *
 *  PLANO B: se um módulo não baixar (internet oscilando, GitHub
 *  fora do ar, arquivo apagado sem querer), o carregador desiste
 *  dos módulos e usa releases/ATUAL/central-completo.js, que é a
 *  mesma coisa num arquivo só. O atendente não fica na mão.
 * ══════════════════════════════════════════════════════════════ */
(function () {
    "use strict";

    /* Já tem um menu aberto? Não abre outro. */
    if (document.getElementById('menu-central-robos')) return;
    if (window.__crCarregando) return;
    window.__crCarregando = true;

    var REPO  = 'sandrolimadf1984/central-robos-v2';
    var RAMO  = 'main';
    var BASE  = 'https://raw.githubusercontent.com/' + REPO + '/' + RAMO + '/';
    var VERSAO = '3.1.0';

    /* Lista de reserva: vale quando o manifest.json não puder ser lido.
       Ao acrescentar um módulo novo, o certo é editar o manifest.json —
       esta lista aqui é só o cinto de segurança. A ORDEM IMPORTA. */
    var MODULOS = [
        'src/core/utils.js',
        'src/core/logger.js',
        'src/core/fila.js',
        'src/core/historico.js',
        'src/core/estatisticas.js',
        'src/core/notifications.js',
        'src/config/logos.js',
        'src/config/convenios.js',
        'src/core/motor.js',
        'src/convenios/affego.js',
        'src/convenios/amil.js',
        'src/convenios/assedf.js',
        'src/convenios/assefaz.js',
        'src/convenios/camara.js',
        'src/convenios/cnu-unimed.js',
        'src/convenios/inas.js',
        'src/convenios/medsenior.js',
        'src/convenios/planassiste.js',
        'src/convenios/plenum.js',
        'src/convenios/pm-stj.js',
        'src/convenios/postal.js',
        'src/convenios/sulamerica.js',
        'src/convenios/tjdf.js',
        'src/convenios/tre.js',
        'src/convenios/trf.js',
        'src/convenios/trt.js',
        'src/convenios/tst.js',
        'src/core/diagnostico.js',
        'src/core/automation.js',
        'src/core/ui.js'
    ];

    /* ── BASE COMPARTILHADA ────────────────────────────────────── */
    var CR = window.CentralRobos = window.CentralRobos || {};
    CR.versao = VERSAO;
    CR.repo = REPO;
    CR.base = BASE;

    CR.robos       = {};   /* robôs que rodam na própria página        */
    CR.roboMoldura = {};   /* robôs que rodam com o portal na moldura  */
    CR.roboJanela  = {};   /* robôs que pilotam uma janela separada    */
    CR.legado      = {};   /* robôs desativados, guardados por história */
    CR.fichas      = {};   /* dados de cada robô (tipo, portal, origem) */

    CR.estado = {
        rodando: false,
        roboAtual: null,
        elementosRobo: [],
        janelasRobo: [],
        vigias: [],
        ultimoAviso: '',
        fila: null,
        inicioEm: 0,
        erros: 0,
        ultimoSalvo: 0
    };

    /* Cada arquivo de convênio chama isto uma vez por robô.
       É a "interface padrão" da V2: a Central não precisa saber
       como o robô funciona por dentro, só o tipo dele. */
    CR.registrar = function (ficha) {
        if (!ficha || !ficha.chave || typeof ficha.executar !== 'function') return;

        /* Convênios como Postal, TRF e Planassiste têm DOIS robôs: o que está
           no ar e a versão antiga, guardada desativada. A ficha que vale é
           sempre a do robô ativo — a desativada não pode passar por cima. */
        var jaTem = CR.fichas[ficha.chave];
        if (!jaTem || !jaTem.ativo || ficha.ativo !== false) {
            CR.fichas[ficha.chave] = {
                chave: ficha.chave,
                nome: ficha.nome || ficha.chave,
                tipo: ficha.tipo || 'padrao',
                ativo: ficha.ativo !== false,
                portal: ficha.portal || null,
                origem: ficha.origem || ''
            };
        }

        if (ficha.ativo === false) { CR.legado[ficha.chave] = ficha.executar; return; }
        if (ficha.tipo === 'janela') CR.roboJanela[ficha.chave] = ficha.executar;
        else if (ficha.tipo === 'moldura') CR.roboMoldura[ficha.chave] = ficha.executar;
        else CR.robos[ficha.chave] = ficha.executar;
    };

    /* ── AVISO DE CARREGAMENTO ─────────────────────────────────── */
    var splash = document.createElement('div');
    splash.id = 'cr-carregando';
    splash.style.cssText = 'position:fixed;top:16px;left:16px;z-index:2147483647;width:270px;' +
        'background:linear-gradient(180deg,#0c1322,#0a0f1c);border:1px solid #1d3557;border-radius:14px;' +
        'padding:16px;font-family:"Segoe UI",system-ui,Arial,sans-serif;color:#dbe7ff;' +
        'box-shadow:0 0 30px rgba(45,125,255,0.28),0 18px 50px rgba(0,0,0,0.7);';
    splash.innerHTML =
        '<div style="display:flex;align-items:center;gap:9px;">' +
        '<span style="font-size:24px;">🤖</span>' +
        '<div><div style="font-size:12px;font-weight:800;color:#4dc3ff;letter-spacing:1.5px;">CENTRAL DE AUTOMAÇÃO</div>' +
        '<div style="font-size:9.5px;color:#7f97bd;">versão ' + VERSAO + '</div></div></div>' +
        '<div style="background:#0b1526;border:1px solid #1b3157;border-radius:7px;height:9px;margin-top:12px;overflow:hidden;">' +
        '<div id="cr-carregando-barra" style="height:100%;width:4%;background:linear-gradient(90deg,#2d7dff,#4dc3ff);transition:width .2s;"></div></div>' +
        '<div id="cr-carregando-txt" style="font-size:10px;color:#8fa8cf;margin-top:7px;">preparando...</div>';
    document.body.appendChild(splash);

    var prontos = 0, aoTodo = 0;
    function passo(txt) {
        var b = document.getElementById('cr-carregando-barra');
        var t = document.getElementById('cr-carregando-txt');
        if (b && aoTodo) b.style.width = Math.round((prontos / aoTodo) * 100) + '%';
        if (t && txt) t.innerText = txt;
    }
    function tirarSplash() {
        var s = document.getElementById('cr-carregando');
        if (s) s.remove();
    }

    /* ── BUSCA UM ARQUIVO DO REPOSITÓRIO ───────────────────────── */
    function buscar(caminho) {
        return fetch(BASE + caminho + '?v=' + Date.now()).then(function (r) {
            if (!r.ok) throw new Error('não baixou ' + caminho + ' (HTTP ' + r.status + ')');
            return r.text();
        });
    }

    /* ── PLANO B: arquivo único ────────────────────────────────── */
    function planoB(porque) {
        passo('usando o arquivo de reserva...');
        buscar('releases/ATUAL/central-completo.js')
            .then(function (codigo) {
                tirarSplash();
                delete window.__crCarregando;
                try { window.CentralRobos = {}; } catch (e) { }
                (0, eval)(codigo);
            })
            .catch(function (e2) {
                tirarSplash();
                delete window.__crCarregando;
                alert('A Central não conseguiu carregar.\n\n' +
                    'Motivo: ' + porque + '\n' +
                    'A reserva também falhou: ' + e2.message + '\n\n' +
                    'Confira a internet e tente de novo. Se continuar, avise o Sandro.');
            });
    }

    /* ── CARREGAMENTO ──────────────────────────────────────────── */
    var comecou = Date.now();

    /* 1) manifest.json manda na lista e na versão; se faltar, seguimos
          com a lista de reserva que está aqui em cima. */
    buscar('manifest.json')
        .then(function (t) {
            var m = JSON.parse(t);
            if (m.versao) { VERSAO = m.versao; CR.versao = m.versao; }
            if (m.modulos && m.modulos.length) MODULOS = m.modulos;
        })
        .catch(function () { /* sem manifest: lista de reserva */ })
        .then(function () {
            aoTodo = MODULOS.length;
            passo('baixando ' + aoTodo + ' arquivos...');

            /* 2) baixa tudo ao mesmo tempo (rápido), guarda cada um no lugar */
            var pedidos = MODULOS.map(function (caminho) {
                return buscar(caminho).then(function (codigo) {
                    prontos++;
                    passo('baixando... ' + prontos + '/' + aoTodo);
                    return { caminho: caminho, codigo: codigo };
                });
            });

            return Promise.all(pedidos);
        })
        .then(function (arquivos) {
            /* 3) executa NA ORDEM da lista, não na ordem em que chegaram.
                  A tela (ui.js) fica para o fim de propósito: assim os
                  avisos e a situação dos robôs já estão em mãos quando os
                  cards são desenhados. */
            passo('montando a Central...');

            var telaPorUltimo = null;
            function rodar(arq) {
                try { (0, eval)(arq.codigo); }
                catch (e) { throw new Error('erro dentro de ' + arq.caminho + ': ' + e.message); }
            }

            for (var i = 0; i < arquivos.length; i++) {
                if (/(^|\/)ui\.js$/.test(arquivos[i].caminho)) { telaPorUltimo = arquivos[i]; continue; }
                rodar(arquivos[i]);
            }

            CR.modulosCarregados = arquivos.length;
            CR.tempoCarga = Date.now() - comecou;

            /* 4) avisos e status do repositório — com prazo. Se a internet
                  demorar, a Central abre assim mesmo, sem eles. */
            return new Promise(function (segue) {
                var jaFoi = false;
                var terminar = function () { if (!jaFoi) { jaFoi = true; segue(telaPorUltimo); } };
                setTimeout(terminar, 3500);
                try { CR.avisos.carregar(terminar); } catch (e) { terminar(); }
            }).then(function (tela) {
                if (tela) rodar(tela);
                tirarSplash();
                delete window.__crCarregando;
            });
        })
        .catch(function (e) {
            try { console.log('Central V2:', e.message); } catch (e2) { }
            planoB(e.message);
        });

})();
