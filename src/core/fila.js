/* ============================================================
 *  FILA DE CÓDIGOS
 *
 *  O texto colado vira uma fila: um item por código único, com a
 *  quantidade de repetições — exatamente a regra de sempre.
 *  A ORDEM da colagem é preservada do começo ao fim.
 *
 *  A fila fica guardada no navegador enquanto a automação roda.
 *  Se o portal derrubar tudo no meio, no próximo INICIAR a Central
 *  oferece CONTINUAR DE ONDE PAROU e manda para o robô apenas os
 *  códigos que ainda não apareceram na tela do portal.
 *
 *  Importante: a fila NÃO muda o que o robô recebe. O robô continua
 *  recebendo um texto de códigos igualzinho ao que uma pessoa
 *  colaria. Ela só serve para contar, mostrar progresso e retomar.
 * ============================================================ */
(function (CR) {
    "use strict";

    var U = CR.utils;

    function chaveGuardada(convenio) {
        return 'fila:' + convenio;
    }

    var F = {

        /* Cria a fila a partir do texto colado. */
        criar: function (convenio, texto) {
            var itens = U.montarFila(texto);
            var resumo = U.resumoFila(itens);
            return {
                convenio: convenio,
                criadaEm: Date.now(),
                textoOriginal: String(texto || ''),
                itens: itens,
                lancamentos: resumo.lancamentos,
                unicos: resumo.unicos
            };
        },

        /* Quantos itens em cada situação. */
        contagem: function (fila) {
            var c = { total: 0, feitos: 0, pendentes: 0, erros: 0 };
            if (!fila || !fila.itens) return c;
            c.total = fila.itens.length;
            for (var i = 0; i < fila.itens.length; i++) {
                var e = fila.itens[i].estado;
                if (e === 'feito') c.feitos++;
                else if (e === 'erro') c.erros++;
                else c.pendentes++;
            }
            return c;
        },

        /* Marca como "feito" todo código que já aparece na tela do portal.
           A lista de códigos vistos vem do leitor de tela da automação. */
        marcarPeloPortal: function (fila, codigosNaTela) {
            if (!fila || !fila.itens) return fila;
            var vistos = {};
            for (var i = 0; i < (codigosNaTela || []).length; i++) vistos[codigosNaTela[i]] = true;
            for (var j = 0; j < fila.itens.length; j++) {
                if (vistos[fila.itens[j].cod] && fila.itens[j].estado === 'pendente') {
                    fila.itens[j].estado = 'feito';
                }
            }
            return fila;
        },

        marcarErro: function (fila, codigo, motivo) {
            if (!fila || !fila.itens) return fila;
            for (var i = 0; i < fila.itens.length; i++) {
                if (fila.itens[i].cod === codigo) {
                    fila.itens[i].estado = 'erro';
                    fila.itens[i].motivo = motivo || '';
                }
            }
            return fila;
        },

        /* Só o que falta, já no formato de texto que o robô entende. */
        pendentesComoTexto: function (fila) {
            if (!fila || !fila.itens) return '';
            var faltam = [];
            for (var i = 0; i < fila.itens.length; i++) {
                if (fila.itens[i].estado !== 'feito') faltam.push(fila.itens[i]);
            }
            return U.filaParaTexto(faltam);
        },

        pendentes: function (fila) {
            if (!fila || !fila.itens) return [];
            var faltam = [];
            for (var i = 0; i < fila.itens.length; i++) {
                if (fila.itens[i].estado !== 'feito') faltam.push(fila.itens[i]);
            }
            return faltam;
        },

        /* Remove um código da fila (antes de iniciar). */
        remover: function (fila, codigo) {
            if (!fila || !fila.itens) return fila;
            var restantes = [];
            for (var i = 0; i < fila.itens.length; i++) {
                if (fila.itens[i].cod !== codigo) restantes.push(fila.itens[i]);
            }
            fila.itens = restantes;
            var r = U.resumoFila(restantes);
            fila.lancamentos = r.lancamentos;
            fila.unicos = r.unicos;
            return fila;
        },

        /* ── memória entre sessões ──────────────────────────────── */

        guardar: function (fila) {
            if (!fila) return false;
            return U.guardar(chaveGuardada(fila.convenio), fila);
        },

        recuperar: function (convenio) {
            var f = U.ler(chaveGuardada(convenio), null);
            if (!f || !f.itens) return null;
            /* fila velha demais (mais de 12h) não interessa mais */
            if (Date.now() - (f.criadaEm || 0) > 12 * 3600 * 1000) {
                U.apagar(chaveGuardada(convenio));
                return null;
            }
            return f;
        },

        descartar: function (convenio) {
            return U.apagar(chaveGuardada(convenio));
        },

        /* Existe automação interrompida com pendências para este convênio? */
        temPendencia: function (convenio) {
            var f = F.recuperar(convenio);
            if (!f) return null;
            var c = F.contagem(f);
            if (c.feitos > 0 && c.pendentes > 0) return f;
            return null;
        }
    };

    CR.fila = F;

    if (typeof module !== 'undefined' && module.exports) module.exports = F;

})(typeof window !== 'undefined'
    ? (window.CentralRobos = window.CentralRobos || {})
    : (global.CentralRobos = global.CentralRobos || {}));
