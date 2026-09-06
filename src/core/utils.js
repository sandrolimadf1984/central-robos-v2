/* ============================================================
 *  UTILIDADES COMUNS
 *  Funções pequenas usadas pelo resto da Central. Não mexem em
 *  portal nenhum — por isso são as mais fáceis de testar (veja
 *  tests/). Se algo aqui quebrar, os testes acusam na hora.
 * ============================================================ */
(function (CR) {
    "use strict";

    var U = {};

    /* Como os códigos são reconhecidos no texto colado.
       É EXATAMENTE o mesmo padrão que a Central já usava na v2.1.0
       (oito dígitos), para a contagem continuar batendo com o portal. */
    U.PADRAO_CODIGO = /\b\d{8}\b/g;

    /* Texto pronto para comparar: sem acento e em minúsculas.
       Assim "Unity Saúde" é achado digitando "unity saude". */
    U.semAcento = function (t) {
        return (t || '')
            .toString()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .toLowerCase();
    };

    /* Lista de códigos NA MESMA ORDEM EM QUE FORAM COLADOS.
       Regra de ouro do projeto: nunca reordenar. Por isso a lista é
       montada percorrendo o texto, e não com Object.keys() — que
       devolve chaves numéricas em ordem crescente e bagunçaria tudo. */
    U.extrairCodigos = function (texto) {
        var achados = String(texto || '').match(U.PADRAO_CODIGO);
        return achados ? achados.slice() : [];
    };

    /* Códigos únicos, também na ordem em que apareceram. */
    U.codigosUnicos = function (texto) {
        var todos = U.extrairCodigos(texto);
        var vistos = {};
        var saida = [];
        for (var i = 0; i < todos.length; i++) {
            if (!vistos[todos[i]]) { vistos[todos[i]] = true; saida.push(todos[i]); }
        }
        return saida;
    };

    /* Transforma o texto colado numa fila: um item por código único,
       com a quantidade de vezes que ele apareceu, na ordem da colagem.
       É o mesmo comportamento de sempre: código repetido vira quantidade. */
    U.montarFila = function (texto) {
        var todos = U.extrairCodigos(texto);
        var indice = {};
        var fila = [];
        for (var i = 0; i < todos.length; i++) {
            var c = todos[i];
            if (indice[c] === undefined) {
                indice[c] = fila.length;
                fila.push({ cod: c, qtd: 1, estado: 'pendente' });
            } else {
                fila[indice[c]].qtd++;
            }
        }
        return fila;
    };

    /* Resumo da fila: "5 lançamentos · 3 códigos únicos". */
    U.resumoFila = function (fila) {
        var lancamentos = 0;
        for (var i = 0; i < fila.length; i++) lancamentos += fila[i].qtd;
        return { lancamentos: lancamentos, unicos: fila.length };
    };

    /* Devolve o texto a partir de uma fila, repetindo o código conforme
       a quantidade. Usado no "continuar de onde parou": o robô recebe um
       texto igualzinho ao que receberia de uma colagem feita à mão. */
    U.filaParaTexto = function (fila) {
        var linhas = [];
        for (var i = 0; i < fila.length; i++) {
            for (var q = 0; q < fila[i].qtd; q++) linhas.push(fila[i].cod);
        }
        return linhas.join('\n');
    };

    /* Duração amigável: 92000 -> "1min 32s" */
    U.formatarDuracao = function (ms) {
        if (!ms || ms < 0) ms = 0;
        var s = Math.round(ms / 1000);
        var h = Math.floor(s / 3600);
        var m = Math.floor((s % 3600) / 60);
        var r = s % 60;
        if (h) return h + 'h ' + m + 'min';
        if (m) return m + 'min ' + r + 's';
        return r + 's';
    };

    /* Data e hora no formato brasileiro: 06/09/2026 11:42 */
    U.dataHora = function (ts) {
        var d = ts ? new Date(ts) : new Date();
        var dois = function (n) { return (n < 10 ? '0' : '') + n; };
        return dois(d.getDate()) + '/' + dois(d.getMonth() + 1) + '/' + d.getFullYear() +
            ' ' + dois(d.getHours()) + ':' + dois(d.getMinutes());
    };

    U.hora = function (ts) {
        var d = ts ? new Date(ts) : new Date();
        var dois = function (n) { return (n < 10 ? '0' : '') + n; };
        return dois(d.getHours()) + ':' + dois(d.getMinutes()) + ':' + dois(d.getSeconds());
    };

    /* Deixa um texto seguro para colocar dentro de HTML. */
    U.escapar = function (t) {
        return String(t === undefined || t === null ? '' : t)
            .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
    };

    /* Barra de progresso em texto: ███████░░░ */
    U.barra = function (feitos, total, largura) {
        largura = largura || 20;
        var pct = total > 0 ? Math.min(1, feitos / total) : 0;
        var cheio = Math.round(pct * largura);
        return new Array(cheio + 1).join('█') + new Array(largura - cheio + 1).join('░');
    };

    U.percentual = function (feitos, total) {
        if (!total) return 0;
        return Math.min(100, Math.round((feitos / total) * 100));
    };

    /* Copiar para a área de transferência, com plano B para portais
       antigos que não têm a API moderna. Devolve true se conseguiu. */
    U.copiar = function (texto) {
        try {
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(texto);
                return true;
            }
        } catch (e) { }
        try {
            var ta = document.createElement('textarea');
            ta.value = texto;
            ta.style.cssText = 'position:fixed;left:-9999px;top:0;';
            document.body.appendChild(ta);
            ta.select();
            var ok = document.execCommand('copy');
            ta.remove();
            return !!ok;
        } catch (e) { return false; }
    };

    /* Guardar e ler coisas no navegador sem NUNCA derrubar o app.
       Em portal com armazenamento bloqueado, simplesmente não guarda. */
    U.guardar = function (chave, valor) {
        try { localStorage.setItem('cr2:' + chave, JSON.stringify(valor)); return true; }
        catch (e) { return false; }
    };

    U.ler = function (chave, padrao) {
        try {
            var t = localStorage.getItem('cr2:' + chave);
            return t === null ? padrao : JSON.parse(t);
        } catch (e) { return padrao; }
    };

    U.apagar = function (chave) {
        try { localStorage.removeItem('cr2:' + chave); return true; } catch (e) { return false; }
    };

    /* Executa algo sem deixar um erro derrubar a automação.
       Regra do projeto: recurso novo nunca pode quebrar robô que funciona. */
    U.seguro = function (fn, ondeFoi) {
        try { return fn(); }
        catch (e) {
            try { if (CR.log) CR.log.erro((ondeFoi || 'interno') + ': ' + e.message); } catch (e2) { }
            return undefined;
        }
    };

    CR.utils = U;

    /* Também exporta para os testes rodarem fora do navegador (Node). */
    if (typeof module !== 'undefined' && module.exports) module.exports = U;

})(typeof window !== 'undefined'
    ? (window.CentralRobos = window.CentralRobos || {})
    : (global.CentralRobos = global.CentralRobos || {}));
