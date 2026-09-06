/* ============================================================
 *  ESTATÍSTICAS
 *
 *  Tudo aqui é CALCULADO a partir do histórico que já está no
 *  navegador. Não guarda número nenhum em separado e não precisa
 *  de servidor.
 *
 *  Sobre o "tempo economizado": é uma ESTIMATIVA, não uma medição.
 *  A conta é (segundos que se levava para digitar um código à mão)
 *  menos (o tempo que o robô levou). O valor de referência está em
 *  SEGUNDOS_POR_CODIGO_NA_MAO e pode ser ajustado — está declarado
 *  aqui em cima justamente para ninguém achar que é medido.
 * ============================================================ */
(function (CR) {
    "use strict";

    var U = CR.utils;

    var SEGUNDOS_POR_CODIGO_NA_MAO = 15;

    var E = {

        SEGUNDOS_POR_CODIGO_NA_MAO: SEGUNDOS_POR_CODIGO_NA_MAO,

        calcular: function (lista) {
            lista = lista || (CR.historico ? CR.historico.listar() : []);

            var r = {
                automacoes: lista.length,
                codigos: 0,
                erros: 0,
                tempoRobo: 0,
                economiaMs: 0,
                convenioMaisUsado: '—',
                roboMaisRapido: '—',
                segundosPorCodigo: {}
            };

            var porConvenio = {};
            var tempoPorConvenio = {};
            var codigosPorConvenio = {};

            for (var i = 0; i < lista.length; i++) {
                var h = lista[i];
                r.codigos += h.feitos || 0;
                r.erros += h.erros || 0;
                r.tempoRobo += h.duracao || 0;

                porConvenio[h.convenio] = (porConvenio[h.convenio] || 0) + 1;
                if (h.duracao && h.feitos) {
                    tempoPorConvenio[h.convenio] = (tempoPorConvenio[h.convenio] || 0) + h.duracao;
                    codigosPorConvenio[h.convenio] = (codigosPorConvenio[h.convenio] || 0) + h.feitos;
                }
            }

            r.economiaMs = Math.max(0, (r.codigos * SEGUNDOS_POR_CODIGO_NA_MAO * 1000) - r.tempoRobo);

            var maior = 0;
            for (var c in porConvenio) {
                if (porConvenio[c] > maior) { maior = porConvenio[c]; r.convenioMaisUsado = c; }
            }

            var melhor = null;
            for (var k in codigosPorConvenio) {
                var seg = (tempoPorConvenio[k] / 1000) / codigosPorConvenio[k];
                r.segundosPorCodigo[k] = Math.round(seg * 10) / 10;
                if (melhor === null || seg < melhor) { melhor = seg; r.roboMaisRapido = k; }
            }

            return r;
        },

        /* Números já formatados, prontos para a tela. */
        paraTela: function () {
            var r = E.calcular();
            return {
                automacoes: r.automacoes.toLocaleString('pt-BR'),
                codigos: r.codigos.toLocaleString('pt-BR'),
                erros: r.erros.toLocaleString('pt-BR'),
                economia: U.formatarDuracao(r.economiaMs),
                convenioMaisUsado: r.convenioMaisUsado,
                roboMaisRapido: r.roboMaisRapido +
                    (r.segundosPorCodigo[r.roboMaisRapido]
                        ? ' (' + r.segundosPorCodigo[r.roboMaisRapido] + 's por código)'
                        : ''),
                bruto: r
            };
        }
    };

    CR.stats = E;

    if (typeof module !== 'undefined' && module.exports) module.exports = E;

})(typeof window !== 'undefined'
    ? (window.CentralRobos = window.CentralRobos || {})
    : (global.CentralRobos = global.CentralRobos || {}));
