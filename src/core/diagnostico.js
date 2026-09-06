/* ============================================================
 *  MODO DE DIAGNÓSTICO
 *
 *  Serve para responder rápido a UMA pergunta: "o portal mudou?"
 *
 *  Ele confere se a tela aberta tem as coisas que o robô daquele
 *  convênio espera encontrar. Se faltar algo, mostra exatamente o
 *  que faltou — e o botão COPIAR RELATÓRIO gera um texto pronto
 *  para mandar para quem cuida da manutenção.
 *
 *  Nunca clica em nada e nunca preenche nada. É só leitura.
 * ============================================================ */
(function (CR) {
    "use strict";

    var U = CR.utils;

    var D = {

        /* Procura um seletor na página e também dentro dos quadros
           (frames) alcançáveis — vários portais usam quadros. */
        existe: function (seletor) {
            try { if (document.querySelector(seletor)) return true; } catch (e) { return false; }
            var quadros;
            try { quadros = document.querySelectorAll('iframe,frame'); } catch (e) { return false; }
            for (var i = 0; i < quadros.length; i++) {
                try {
                    var d = quadros[i].contentDocument;
                    if (d && d.querySelector(seletor)) return true;
                } catch (e) { /* quadro de outro domínio: não dá para olhar */ }
            }
            return false;
        },

        contarQuadros: function () {
            try { return document.querySelectorAll('iframe,frame').length; } catch (e) { return 0; }
        },

        /* Roda a checagem do convênio e devolve a lista de itens. */
        rodar: function (chave) {
            var ficha = CR.fichas[chave] || {};
            var itens = [];

            itens.push({
                ok: document.readyState === 'complete',
                texto: 'Página terminou de carregar',
                detalhe: 'readyState = ' + document.readyState
            });

            var campos = 0;
            try { campos = document.querySelectorAll('input,select,textarea').length; } catch (e) { }
            itens.push({
                ok: campos > 0,
                texto: 'Tela com campos de preenchimento',
                detalhe: campos + ' campos encontrados'
            });

            var quadros = D.contarQuadros();
            if (quadros) {
                itens.push({ ok: true, texto: 'Portal usa quadros (frames)', detalhe: quadros + ' quadro(s)' });
            }

            var p = ficha.portal;
            if (p && p.seletores && p.seletores.length) {
                for (var i = 0; i < p.seletores.length; i++) {
                    var sel = p.seletores[i];
                    itens.push({
                        ok: D.existe(sel),
                        texto: 'Elemento esperado: ' + sel,
                        detalhe: p.nota || ''
                    });
                }
            } else {
                itens.push({
                    ok: null,
                    texto: 'Estrutura específica deste convênio não mapeada',
                    detalhe: 'O relatório abaixo ainda ajuda a comparar com o que o portal era antes.'
                });
            }

            var estado = CR.avisos && CR.avisos.estadoDe ? CR.avisos.estadoDe(chave) : null;
            if (estado) {
                itens.push({
                    ok: estado.chave === 'ok',
                    texto: 'Situação informada pela equipe: ' + estado.texto,
                    detalhe: 'vem do status.json do repositório'
                });
            }

            var faltando = 0;
            for (var j = 0; j < itens.length; j++) if (itens[j].ok === false) faltando++;

            return {
                convenio: chave,
                itens: itens,
                pronto: faltando === 0,
                faltando: faltando,
                resumo: faltando === 0
                    ? 'PRONTO PARA AUTOMATIZAR'
                    : 'POSSÍVEL ALTERAÇÃO NO PORTAL (' + faltando + ' item(ns) não encontrado(s))'
            };
        },

        /* Texto pronto para copiar e mandar para a manutenção. */
        relatorio: function (r) {
            var ficha = CR.fichas[r.convenio] || {};
            var linhas = [
                'DIAGNÓSTICO — ' + r.convenio,
                'Central de Automação ' + (CR.versao || ''),
                'Quando: ' + U.dataHora(),
                'Página: ' + location.href,
                'Título da página: ' + document.title,
                'Tipo de robô: ' + (ficha.tipo || '?'),
                'Origem do robô: ' + (ficha.origem || '?'),
                'Navegador: ' + navigator.userAgent,
                '',
                'RESULTADO: ' + r.resumo,
                ''
            ];
            for (var i = 0; i < r.itens.length; i++) {
                var it = r.itens[i];
                var marca = it.ok === true ? '[ OK ]' : (it.ok === false ? '[FALTA]' : '[ -- ]');
                linhas.push(marca + ' ' + it.texto + (it.detalhe ? '  — ' + it.detalhe : ''));
            }
            linhas.push('');
            linhas.push('--- LOG ---');
            linhas.push(CR.log.texto());
            return linhas.join('\n');
        },

        /* Desenha o resultado dentro de um elemento da tela. */
        desenhar: function (destino, chave) {
            var r = D.rodar(chave);
            CR.log.info('Diagnóstico de ' + chave + ': ' + r.resumo);

            var html = '<div style="font-size:12px;font-weight:800;color:#4dc3ff;letter-spacing:1px;margin-bottom:8px;">' +
                '🛠️ DIAGNÓSTICO — ' + U.escapar(chave) + '</div>';
            for (var i = 0; i < r.itens.length; i++) {
                var it = r.itens[i];
                var cor = it.ok === true ? '#2ecc71' : (it.ok === false ? '#ff6b5e' : '#7f97bd');
                var ic = it.ok === true ? '✓' : (it.ok === false ? '✗' : '·');
                html += '<div style="margin:3px 0;color:#cfe0ff;font-size:11px;line-height:1.5;">' +
                    '<span style="color:' + cor + ';font-weight:800;">' + ic + '</span> ' +
                    U.escapar(it.texto) +
                    (it.detalhe ? '<div style="color:#7f97bd;font-size:10px;margin-left:14px;">' +
                        U.escapar(it.detalhe) + '</div>' : '') +
                    '</div>';
            }
            html += '<div style="margin-top:9px;padding-top:8px;border-top:1px solid #1b3157;font-size:11.5px;font-weight:800;color:' +
                (r.pronto ? '#2ecc71' : '#ffd633') + ';">' + U.escapar(r.resumo) + '</div>' +
                '<div style="text-align:center;margin-top:9px;">' +
                '<span data-cr="copiar-diag" style="display:inline-block;background:#0e1a2e;border:1px solid #2d7dff;' +
                'color:#cfe0ff;border-radius:9px;padding:7px 16px;font-size:10px;font-weight:800;cursor:pointer;">' +
                '📋 COPIAR RELATÓRIO</span></div>';

            destino.style.display = 'block';
            destino.style.cssText = 'display:block;margin-top:10px;background:#0a1424;border:1px solid #1b3157;' +
                'border-radius:12px;padding:13px;text-align:left;';
            destino.innerHTML = html;

            var b = destino.querySelector('[data-cr="copiar-diag"]');
            if (b) b.onclick = function () {
                b.innerText = U.copiar(D.relatorio(r)) ? '✔ COPIADO' : '✖ NÃO DEU';
                setTimeout(function () { b.innerText = '📋 COPIAR RELATÓRIO'; }, 2000);
            };
            return r;
        }
    };

    CR.diag = D;

    if (typeof module !== 'undefined' && module.exports) module.exports = D;

})(typeof window !== 'undefined'
    ? (window.CentralRobos = window.CentralRobos || {})
    : (global.CentralRobos = global.CentralRobos || {}));
