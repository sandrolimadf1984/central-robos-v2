/* ============================================================
 *  LOGS
 *  Um lugar só para registrar o que aconteceu. Serve para o
 *  atendente (ver onde parou) e para a manutenção (entender por
 *  que deu errado).
 *
 *  Guarda no máximo 400 linhas na memória; as mais antigas caem
 *  fora sozinhas. Nada de dado de paciente vai para cá: só código
 *  de procedimento, nome de convênio e mensagem do portal.
 * ============================================================ */
(function (CR) {
    "use strict";

    var LIMITE = 400;
    var linhas = [];
    var ouvintes = [];

    function registrar(nivel, msg) {
        var item = { t: Date.now(), nivel: nivel, msg: String(msg) };
        linhas.push(item);
        if (linhas.length > LIMITE) linhas.splice(0, linhas.length - LIMITE);
        for (var i = 0; i < ouvintes.length; i++) {
            try { ouvintes[i](item); } catch (e) { }
        }
        return item;
    }

    var L = {
        info:  function (m) { return registrar('INFO', m); },
        ok:    function (m) { return registrar('SUCCESS', m); },
        aviso: function (m) { return registrar('WARN', m); },
        erro:  function (m) { return registrar('ERROR', m); },

        /* Todas as linhas, da mais antiga para a mais nova. */
        tudo: function () { return linhas.slice(); },

        limpar: function () { linhas = []; },

        /* Avisa alguém (a tela de logs) sempre que entrar linha nova. */
        aoRegistrar: function (fn) { ouvintes.push(fn); },

        /* Texto pronto para colar num chamado ou mandar por mensagem. */
        texto: function () {
            var U = CR.utils;
            var saida = ['CENTRAL DE AUTOMAÇÃO — LOG',
                         'Versão: ' + (CR.versao || '?'),
                         'Gerado em: ' + U.dataHora(),
                         'Página: ' + (location ? location.href : '?'),
                         ''];
            for (var i = 0; i < linhas.length; i++) {
                saida.push('[' + U.hora(linhas[i].t) + '] [' + linhas[i].nivel + '] ' + linhas[i].msg);
            }
            return saida.join('\n');
        },

        cores: {
            INFO: '#9db4d8',
            SUCCESS: '#2ecc71',
            WARN: '#ffd633',
            ERROR: '#ff6b5e'
        }
    };

    CR.log = L;

    if (typeof module !== 'undefined' && module.exports) module.exports = L;

})(typeof window !== 'undefined'
    ? (window.CentralRobos = window.CentralRobos || {})
    : (global.CentralRobos = global.CentralRobos || {}));
