/* ============================================================
 *  AVISOS, STATUS DOS ROBÔS E MENSAGENS DE ERRO
 *
 *  1) AVISOS — o arquivo avisos.json do repositório é lido toda vez
 *     que o app abre. Editando esse arquivo no GitHub, o recado
 *     chega para a equipe inteira no próximo clique do favorito.
 *     Se avisos.json não existir, o velho aviso.txt continua
 *     valendo (nada foi perdido).
 *
 *  2) STATUS — status.json diz como está cada robô (funcionando,
 *     em manutenção, portal fora do ar...). Vira uma bolinha
 *     colorida no card do convênio.
 *
 *  3) ERRO — em vez de "Erro na automação", um painel que diz o
 *     convênio, o código, o problema, a causa provável e o que
 *     fazer agora.
 * ============================================================ */
(function (CR) {
    "use strict";

    var U = CR.utils;

    /* ── ESTADOS POSSÍVEIS DE UM ROBÔ ────────────────────────── */
    var ESTADOS = {
        ok:          { icone: '🟢', cor: '#2ecc71', texto: 'Funcionando normalmente' },
        atencao:     { icone: '🟡', cor: '#ffd633', texto: 'Atualização recente' },
        manutencao:  { icone: '🟡', cor: '#ffd633', texto: 'Em manutenção' },
        atualizar:   { icone: '🟡', cor: '#ffd633', texto: 'Atualização necessária' },
        fora:        { icone: '🔴', cor: '#ff6b5e', texto: 'Portal indisponível' },
        erro:        { icone: '🔴', cor: '#ff6b5e', texto: 'Erro conhecido' },
        desativado:  { icone: '⚪', cor: '#7f97bd', texto: 'Desativado temporariamente' }
    };

    var A = {

        ESTADOS: ESTADOS,
        dados: { geral: null, convenios: {} },
        status: {},

        /* Endereço base do repositório (definido no central.js). */
        base: function () {
            return CR.base || '';
        },

        /* Lê avisos.json e status.json. Nunca derruba o app:
           se a internet falhar ou o arquivo não existir, segue a vida. */
        carregar: function (aoTerminar) {
            var faltam = 2;
            var pronto = function () { if (--faltam === 0 && aoTerminar) aoTerminar(); };
            var t = '?t=' + Date.now();

            fetch(A.base() + 'avisos.json' + t)
                .then(function (r) { if (!r.ok) throw new Error('sem avisos.json'); return r.json(); })
                .then(function (j) {
                    A.dados = { geral: j.geral || null, convenios: j.convenios || {} };
                    CR.log.info('avisos.json carregado');
                    pronto();
                })
                .catch(function () { A.lerAvisoAntigo(pronto); });

            fetch(A.base() + 'status.json' + t)
                .then(function (r) { if (!r.ok) throw new Error('sem status.json'); return r.json(); })
                .then(function (j) {
                    A.status = j.convenios || j || {};
                    CR.log.info('status.json carregado');
                    pronto();
                })
                .catch(function () { CR.log.info('sem status.json — todos os robôs considerados normais'); pronto(); });
        },

        /* Compatibilidade com o aviso.txt de sempre. */
        lerAvisoAntigo: function (pronto) {
            fetch(A.base() + 'aviso.txt?t=' + Date.now())
                .then(function (r) { if (!r.ok) throw new Error('sem aviso'); return r.text(); })
                .then(function (texto) {
                    if (texto && texto.trim() !== '') {
                        A.dados.geral = { id: 'aviso-txt', texto: texto.trim() };
                        CR.log.info('aviso.txt carregado (modo compatibilidade)');
                    }
                    if (pronto) pronto();
                })
                .catch(function () { if (pronto) pronto(); });
        },

        /* Estado de um robô, já com ícone e cor. */
        estadoDe: function (chave) {
            var s = A.status[chave];
            if (!s) return null;
            var base = ESTADOS[s.estado] || ESTADOS.atencao;
            return {
                chave: s.estado,
                icone: base.icone,
                cor: base.cor,
                texto: s.nota || base.texto
            };
        },

        /* Avisos já dispensados ficam guardados para não voltarem. */
        foiDispensado: function (id) {
            var vistos = U.ler('avisos-vistos', {});
            return !!vistos[id];
        },

        dispensar: function (id) {
            var vistos = U.ler('avisos-vistos', {});
            vistos[id] = Date.now();
            U.guardar('avisos-vistos', vistos);
        },

        /* Desenha o aviso geral no espaço reservado da tela inicial. */
        desenharGeral: function (destino) {
            if (!destino) return;
            destino.innerHTML = '';
            var g = A.dados.geral;
            if (!g || !g.texto) return;
            var id = g.id || ('geral-' + g.texto.length);
            if (A.foiDispensado(id)) return;

            var caixa = document.createElement('div');
            caixa.style.cssText = 'background:#2a2208;color:#ffd633;padding:10px 26px 10px 12px;' +
                'border-radius:8px;margin-bottom:12px;font-size:11.5px;position:relative;border:1px solid #8a6d00;';
            caixa.innerHTML =
                '<strong>⚠️ ATENÇÃO:</strong><br>' + U.escapar(g.texto).replace(/\n/g, '<br>') +
                '<div style="text-align:right;margin-top:8px;">' +
                '<span data-cr-entendi="1" style="display:inline-block;background:#8a6d00;color:#fff5cc;' +
                'border-radius:12px;padding:3px 12px;font-size:10px;font-weight:800;cursor:pointer;letter-spacing:.5px;">ENTENDI</span>' +
                '</div>';
            caixa.querySelector('[data-cr-entendi]').onclick = function () {
                A.dispensar(id);
                caixa.remove();
            };
            destino.appendChild(caixa);
        },

        /* Aviso específico de um convênio, mostrado ao abrir o card. */
        avisoDoConvenio: function (chave) {
            return A.dados.convenios ? A.dados.convenios[chave] : null;
        },

        desenharDoConvenio: function (destino, chave) {
            if (!destino) return false;
            destino.innerHTML = '';
            var av = A.avisoDoConvenio(chave);
            if (!av || !av.texto) { destino.style.display = 'none'; return false; }
            var id = av.id || (chave + '-' + av.texto.length);
            if (A.foiDispensado(id)) { destino.style.display = 'none'; return false; }

            destino.style.display = 'block';
            destino.style.cssText = 'display:block;background:#2a2208;border:1px solid #8a6d00;border-radius:10px;' +
                'padding:12px;margin-bottom:12px;color:#ffd633;font-size:11.5px;line-height:1.6;';
            destino.innerHTML =
                '<div style="font-weight:800;letter-spacing:1px;margin-bottom:6px;">🔧 ' +
                U.escapar(av.titulo || 'MANUTENÇÃO') + '</div>' +
                U.escapar(av.texto).replace(/\n/g, '<br>') +
                (av.previsao ? '<div style="margin-top:6px;"><b>Previsão:</b> ' + U.escapar(av.previsao) + '</div>' : '') +
                (av.motivo ? '<div><b>Motivo:</b> ' + U.escapar(av.motivo) + '</div>' : '') +
                '<div style="text-align:right;margin-top:8px;">' +
                '<span data-cr-entendi="1" style="display:inline-block;background:#8a6d00;color:#fff5cc;' +
                'border-radius:12px;padding:4px 14px;font-size:10px;font-weight:800;cursor:pointer;">ENTENDI</span></div>';
            destino.querySelector('[data-cr-entendi]').onclick = function () {
                A.dispensar(id);
                destino.style.display = 'none';
            };
            return true;
        }
    };

    /* ── PAINEL DE ERRO ÚTIL ─────────────────────────────────── */
    var E = {

        /* Causas prováveis conhecidas — o que já aprendemos apanhando.
           A ordem importa: a primeira que casar é a que aparece. */
        pistas: [
            { quando: /não encontrad|nao encontrad|not found|is not defined/i,
              causa: 'O portal pode ter sido atualizado e o campo mudou de nome ou de lugar.' },
            { quando: /timeout|tempo esgotado|demorou/i,
              causa: 'O portal demorou mais do que o robô esperava. Costuma ser lentidão da rede ou do sistema do convênio.' },
            { quando: /pop-?up|bloqueou/i,
              causa: 'O navegador bloqueou a janela. Libere pop-ups para este site e tente de novo.' },
            { quando: /sess|login|autentic|expirou/i,
              causa: 'A sessão do portal pode ter caído. Faça login de novo e repita.' },
            { quando: /duplicidade|já (existe|consta)|nao autorizado|não autorizado/i,
              causa: 'O portal recusou o procedimento ou entendeu como repetido. Confira a lista na tela antes de repetir.' },
            { quando: /buscando|carregando/i,
              causa: 'A tela do portal ficou presa carregando. Em portal moderno (Angular), costuma ser o motor de fundo: marque semMotor na ficha do convênio.' }
        ],

        causaProvavel: function (mensagem) {
            var m = String(mensagem || '');
            for (var i = 0; i < E.pistas.length; i++) {
                if (E.pistas[i].quando.test(m)) return E.pistas[i].causa;
            }
            return 'Ainda não sei dizer. Use o botão DIAGNÓSTICO e copie o relatório — ele mostra o que o portal respondeu.';
        },

        /* Monta o painel. acoes = { repetir: fn|null, encerrar: fn } */
        montar: function (destino, dados, acoes) {
            if (!destino) return;
            var causa = dados.causa || E.causaProvavel(dados.problema);
            CR.log.erro('[' + (dados.convenio || '?') + '] ' + dados.problema);

            destino.style.display = 'block';
            destino.style.cssText = 'display:block;margin-top:10px;background:#2a0f14;border:1px solid #b91f16;' +
                'border-radius:12px;padding:13px;font-size:11.5px;color:#ffd9d4;line-height:1.6;text-align:left;';
            destino.innerHTML =
                '<div style="font-size:12.5px;font-weight:800;color:#ff8f83;letter-spacing:1px;margin-bottom:8px;">' +
                '❌ AUTOMAÇÃO INTERROMPIDA</div>' +
                '<div><b>Convênio:</b> ' + U.escapar(dados.convenio || '—') + '</div>' +
                (dados.codigo ? '<div><b>Código:</b> <span style="font-family:Consolas,monospace;">' +
                    U.escapar(dados.codigo) + '</span></div>' : '') +
                '<div style="margin-top:6px;"><b>Problema:</b><br>' + U.escapar(dados.problema) + '</div>' +
                '<div style="margin-top:6px;"><b>Possível causa:</b><br>' + U.escapar(causa) + '</div>' +
                '<div style="display:flex;gap:6px;margin-top:11px;flex-wrap:wrap;">' +
                (acoes && acoes.repetir ? '<span data-cr="repetir" style="flex:1;min-width:110px;text-align:center;background:#0e1a2e;border:1px solid #2d7dff;color:#cfe0ff;border-radius:9px;padding:7px 8px;font-size:10px;font-weight:800;cursor:pointer;">↻ TENTAR NOVAMENTE</span>' : '') +
                '<span data-cr="copiar" style="flex:1;min-width:100px;text-align:center;background:#0e1a2e;border:1px solid #223a5e;color:#cfe0ff;border-radius:9px;padding:7px 8px;font-size:10px;font-weight:800;cursor:pointer;">📋 COPIAR RELATÓRIO</span>' +
                '<span data-cr="encerrar" style="flex:1;min-width:90px;text-align:center;background:#3a1218;border:1px solid #b91f16;color:#ff9d93;border-radius:9px;padding:7px 8px;font-size:10px;font-weight:800;cursor:pointer;">✖ ENCERRAR</span>' +
                '</div>';

            var b;
            if (acoes && acoes.repetir) {
                b = destino.querySelector('[data-cr="repetir"]');
                if (b) b.onclick = function () { destino.style.display = 'none'; acoes.repetir(); };
            }
            b = destino.querySelector('[data-cr="copiar"]');
            if (b) b.onclick = function () {
                var rel = ['RELATÓRIO DE ERRO — Central de Automação ' + (CR.versao || ''),
                           'Convênio: ' + (dados.convenio || '—'),
                           'Código: ' + (dados.codigo || '—'),
                           'Problema: ' + dados.problema,
                           'Possível causa: ' + causa,
                           'Página: ' + location.href,
                           'Quando: ' + U.dataHora(),
                           '', '--- ÚLTIMAS LINHAS DO LOG ---', CR.log.texto()].join('\n');
                b.innerText = U.copiar(rel) ? '✔ COPIADO' : '✖ NÃO DEU';
                setTimeout(function () { b.innerText = '📋 COPIAR RELATÓRIO'; }, 2000);
            };
            b = destino.querySelector('[data-cr="encerrar"]');
            if (b) b.onclick = function () {
                destino.style.display = 'none';
                if (acoes && acoes.encerrar) acoes.encerrar();
            };
        }
    };

    CR.avisos = A;
    CR.erros = E;

    if (typeof module !== 'undefined' && module.exports) module.exports = { avisos: A, erros: E };

})(typeof window !== 'undefined'
    ? (window.CentralRobos = window.CentralRobos || {})
    : (global.CentralRobos = global.CentralRobos || {}));
