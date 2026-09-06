/* ============================================================
 *  HISTÓRICO DAS AUTOMAÇÕES
 *
 *  Fica guardado no próprio navegador do atendente (localStorage).
 *  Não sai do computador dele, não vai para servidor nenhum.
 *  Guarda as 60 execuções mais recentes.
 *
 *  O que entra: data/hora, convênio, quantidade de códigos,
 *  quantos entraram, quantos deram erro, duração, situação final e
 *  a mensagem que o portal ou o robô devolveu.
 *  O que NÃO entra: nada de paciente, carteirinha ou login.
 * ============================================================ */
(function (CR) {
    "use strict";

    var U = CR.utils;
    var CHAVE = 'historico';
    var LIMITE = 60;

    var H = {

        registrar: function (item) {
            var lista = H.listar();
            lista.unshift({
                em: Date.now(),
                convenio: item.convenio || '?',
                total: item.total || 0,
                feitos: item.feitos || 0,
                erros: item.erros || 0,
                duracao: item.duracao || 0,
                situacao: item.situacao || 'concluida',   // concluida | interrompida | erro
                mensagem: String(item.mensagem || '').slice(0, 400)
            });
            if (lista.length > LIMITE) lista = lista.slice(0, LIMITE);
            U.guardar(CHAVE, lista);
            return lista[0];
        },

        listar: function () {
            var l = U.ler(CHAVE, []);
            return Array.isArray(l) ? l : [];
        },

        limpar: function () { return U.apagar(CHAVE); },

        /* Ícone e cor de cada situação, para a tela de histórico. */
        marca: function (situacao) {
            if (situacao === 'interrompida') return { icone: '⏹', cor: '#ffd633' };
            if (situacao === 'erro') return { icone: '⚠', cor: '#ff6b5e' };
            return { icone: '✓', cor: '#2ecc71' };
        },

        /* Texto do histórico pronto para copiar. */
        texto: function () {
            var lista = H.listar();
            var saida = ['HISTÓRICO DE AUTOMAÇÕES — Central de Automação', ''];
            for (var i = 0; i < lista.length; i++) {
                var h = lista[i];
                saida.push(U.dataHora(h.em) + '  ·  ' + h.convenio);
                saida.push('   ' + h.total + ' códigos · ' + h.feitos + ' processados · ' +
                           h.erros + ' com erro · ' + U.formatarDuracao(h.duracao));
                if (h.mensagem) saida.push('   ' + h.mensagem.replace(/\n/g, ' '));
                saida.push('');
            }
            return saida.join('\n');
        }
    };

    CR.historico = H;

    if (typeof module !== 'undefined' && module.exports) module.exports = H;

})(typeof window !== 'undefined'
    ? (window.CentralRobos = window.CentralRobos || {})
    : (global.CentralRobos = global.CentralRobos || {}));
