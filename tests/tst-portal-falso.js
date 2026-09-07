/* ============================================================
 *  RÉPLICA DO PORTAL DO TST
 *
 *      node tests/tst-portal-falso.js
 *
 *  Precisa do jsdom:  npm install jsdom
 *
 *  Esta réplica reproduz DE PROPÓSITO o defeito relatado:
 *
 *    · o campo da tabela (#noreset_txCodTabela) guarda o valor entre
 *      um procedimento e outro — é o que o "noreset" do nome diz;
 *    · quando ele MUDA de valor, o portal sai para buscar a tabela e,
 *      enquanto busca, LIMPA o campo do código;
 *    · como na primeira vez ele está vazio, só o PRIMEIRO código
 *      apanha essa limpeza — do segundo em diante a tabela já está
 *      em 16 e nada é buscado;
 *    · e a tela recarrega inteira a cada procedimento salvo.
 *
 *  O teste roda os DOIS robôs contra a mesma réplica: o antigo, para
 *  mostrar o defeito acontecendo, e o novo, para mostrar que ele foi
 *  resolvido.
 * ============================================================ */

let JSDOM;
try {
    JSDOM = require('jsdom').JSDOM;
} catch (e) {
    console.log('\n  Este teste precisa do jsdom. Instale com:\n');
    console.log('      npm install jsdom\n');
    process.exit(0);
}

const fs = require('fs');
const path = require('path');
const RAIZ = path.join(__dirname, '..');

/* ── A RÉPLICA ─────────────────────────────────────────────── */
function montarPortal(lento) {
    const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>',
        { url: 'https://portal-tst-de-teste.exemplo.com/SolicitacaoSpSadtManter.do',
          pretendToBeVisual: true, runScripts: 'outside-only' });
    const win = dom.window;
    const doc = win.document;

    /* O jsdom não tem innerText. Sem isso a réplica não se pareceria com um
       navegador de verdade e o teste mediria a coisa errada. */
    /* O jsdom não desenha nada, então offsetParent é sempre null — o que
       faria todo elemento parecer escondido. Num navegador de verdade um
       elemento que está no documento tem offsetParent. */
    Object.defineProperty(win.HTMLElement.prototype, 'offsetParent', {
        configurable: true,
        get() { return this.isConnected ? (this.parentElement || doc.body) : null; }
    });

    if (!('innerText' in win.HTMLElement.prototype)) {
        Object.defineProperty(win.HTMLElement.prototype, 'innerText', {
            configurable: true,
            get() { return this.textContent; },
            set(v) { this.textContent = v; }
        });
    }

    const atraso = lento ? 3 : 1;          // portal lento = tudo três vezes mais devagar
    const portal = {
        win, doc, lento: !!lento,
        tabela: '',            // #noreset_txCodTabela guarda entre um item e outro
        buscando: false,
        lancados: [],          // o que realmente entrou
        recusas: []            // tentativas de salvar com o campo vazio
    };

    function desenharTela() {
        doc.body.innerHTML =
            '<h1>Solicitação SP/SADT</h1>' +
            '<table id="lista">' +
            portal.lancados.map(l =>
                '<tr><td>' + l.cod + '</td><td>' + l.qtd + '</td></tr>').join('') +
            '</table>' +
            '<input type="button" value="Adicionar Procedimento" name="adicionarProcedimento">';
        doc.querySelector('input[value="Adicionar Procedimento"]').addEventListener('click', abrirDialogo);
    }

    function abrirDialogo() {
        const caixa = doc.createElement('div');
        caixa.className = 'ui-dialog';
        caixa.innerHTML =
            '<span class="ui-dialog-titlebar-close">x</span>' +
            '<label>Tabela</label><input id="noreset_txCodTabela" value="' + portal.tabela + '">' +
            '<label>Código</label><input id="codItemProcedimento" value="">' +
            '<label>Qtd</label><input id="procedimento.numQtdSolicitada" value="1">' +
            '<div class="ui-dialog-buttonpane">' +
            '<button type="button">Cancelar</button>' +
            '<button type="button">Salvar</button></div>';
        doc.body.appendChild(caixa);

        const campoTabela = doc.getElementById('noreset_txCodTabela');
        campoTabela.addEventListener('change', () => {
            const novo = (campoTabela.value || '').trim();
            if (novo === portal.tabela) return;          // nada mudou: nada é buscado
            portal.tabela = novo;
            portal.buscando = true;
            /* AQUI ESTÁ O DEFEITO: buscando a tabela, o portal limpa o código */
            win.setTimeout(() => {
                const c = doc.getElementById('codItemProcedimento');
                if (c) c.value = '';
                portal.buscando = false;
            }, 700 * atraso);
        });

        caixa.querySelector('.ui-dialog-titlebar-close').addEventListener('click', () => caixa.remove());
        const botoes = caixa.querySelectorAll('.ui-dialog-buttonpane button');
        botoes[0].addEventListener('click', () => caixa.remove());
        botoes[1].addEventListener('click', salvar);
    }

    function salvar() {
        const cod = (doc.getElementById('codItemProcedimento') || {}).value || '';
        const qtd = (doc.getElementById('procedimento.numQtdSolicitada') || {}).value || '1';
        if (!cod.trim()) {
            portal.recusas.push('salvar com o campo do código vazio');
            const caixa = doc.querySelector('.ui-dialog');
            if (caixa) caixa.remove();
            return;                                       // não entra nada
        }
        portal.lancados.push({ cod: cod.trim(), qtd: qtd });
        const caixa = doc.querySelector('.ui-dialog');
        if (caixa) caixa.remove();
        /* a tela recarrega inteira a cada item salvo */
        win.setTimeout(desenharTela, 500 * atraso);
    }

    desenharTela();
    return portal;
}

/* ── carrega a Central e pega um robô ──────────────────────── */
function carregarRobo(win) {
    win.CentralRobos = {};
    const carregador = fs.readFileSync(path.join(RAIZ, 'central.js'), 'utf8');
    const base = carregador.slice(carregador.indexOf('    var REPO'), carregador.indexOf('    /* ── AVISO DE CARREGAMENTO'))
        .replace(carregador.slice(carregador.indexOf('    /* Lista de reserva'), carregador.indexOf('    /* ── BASE COMPARTILHADA')), '');
    win.eval('(function(){ "use strict";\n' + base + '\n})();');
    ['src/core/utils.js', 'src/core/logger.js', 'src/convenios/tst.js']
        .forEach(m => win.eval(fs.readFileSync(path.join(RAIZ, m), 'utf8')));
    return win.CentralRobos;
}

function fazerCtx(portal, terminou) {
    return {
        doc: () => portal.doc,
        win: () => portal.win,
        status: t => { portal.ultimoStatus = t; },
        ativo: () => !portal.parou,
        timer: () => { },
        fim: () => { portal.parou = true; terminou(); }
    };
}

function rodar(qualRobo, texto, limiteMs, lento) {
    return new Promise(resolve => {
        const portal = montarPortal(lento);
        portal.win.alert = () => { portal.recusas.push('alert do robô antigo'); };
        const CR = carregarRobo(portal.win);
        const robo = qualRobo === 'novo' ? CR.roboMoldura['TST'] : CR.legado['TST_DESATIVADO_MOLDURA'];

        let acabou = false;
        const terminar = () => {
            if (acabou) return;
            acabou = true;
            portal.parou = true;
            resolve(portal);
        };
        const ctx = fazerCtx(portal, terminar);
        setTimeout(terminar, limiteMs);
        try { robo(texto, ctx); } catch (e) { portal.erro = e.message; terminar(); }
    });
}

/* ── EXECUÇÃO ──────────────────────────────────────────────── */
const problemas = [];
function conferir(nome, ok, detalhe) {
    if (ok) console.log('  \x1b[32m✓\x1b[0m ' + nome + (detalhe ? '  \x1b[90m' + detalhe + '\x1b[0m' : ''));
    else { console.log('  \x1b[31m✗ ' + nome + '\x1b[0m  ' + (detalhe || '')); problemas.push(nome); }
}

(async function () {
    const CODIGOS = '40901220\n31001112\n40808010\n31001112';

    console.log('\nROBÔ DO TST CONTRA UMA RÉPLICA DO PORTAL\n');
    console.log('  \x1b[90mColando: 40901220, 31001112, 40808010, 31001112\x1b[0m');
    console.log('  \x1b[90m(o 31001112 aparece duas vezes: vira quantidade 2)\x1b[0m\n');

    console.log('  \x1b[1mO robô antigo, para mostrar o defeito:\x1b[0m');
    const velho = await rodar('velho', CODIGOS, 30000);
    const codsVelho = velho.lancados.map(l => l.cod);
    console.log('     entrou: ' + (codsVelho.join(', ') || '(nada)'));
    conferir('o robô antigo perde mesmo o primeiro código',
        codsVelho.length > 0 && codsVelho.indexOf('40901220') === -1,
        'o portal limpou o campo enquanto ele digitava');

    console.log('\n  \x1b[1mO robô novo:\x1b[0m');
    const novo = await rodar('novo', CODIGOS, 40000);
    const codsNovo = novo.lancados.map(l => l.cod);
    console.log('     entrou: ' + (codsNovo.join(', ') || '(nada)'));

    conferir('o PRIMEIRO código entra', codsNovo.indexOf('40901220') !== -1);
    conferir('os três códigos entram', codsNovo.length === 3, codsNovo.length + ' de 3');
    conferir('na ORDEM em que foram colados',
        JSON.stringify(codsNovo) === JSON.stringify(['40901220', '31001112', '40808010']),
        codsNovo.join(' → '));
    conferir('o código repetido vira quantidade 2',
        (novo.lancados.filter(l => l.cod === '31001112')[0] || {}).qtd === '2');
    conferir('nenhuma tentativa de salvar com o campo vazio', novo.recusas.length === 0,
        novo.recusas.length + ' recusa(s)');
    conferir('o robô avisa que terminou',
        /conclu/i.test(novo.ultimoStatus || ''), (novo.ultimoStatus || '').split('\n')[0]);

    /* ── PORTAL LENTO ────────────────────────────────────────────
       Foi num portal lento que o robô do ASSEDF passou a mandar o mesmo
       exame duas vezes: ele desistia antes de o portal responder e
       tentava de novo. Este cenário existe para isso não se repetir. */
    console.log('\n  \x1b[1mCom o portal LENTO (três vezes mais devagar):\x1b[0m');
    const lento = await rodar('novo', CODIGOS, 90000, true);
    const codsLento = lento.lancados.map(l => l.cod);
    console.log('     entrou: ' + (codsLento.join(', ') || '(nada)'));

    conferir('no portal lento também entra tudo', codsLento.length === 3, codsLento.length + ' de 3');
    conferir('e NADA entra duas vezes',
        new Set(codsLento).size === codsLento.length,
        'nenhum código repetido na lista do portal');
    conferir('a ordem continua a da colagem',
        JSON.stringify(codsLento) === JSON.stringify(['40901220', '31001112', '40808010']),
        codsLento.join(' → '));

    console.log('');
    if (problemas.length) {
        console.log('\x1b[31m' + problemas.length + ' problema(s)\x1b[0m\n');
        process.exit(1);
    }
    console.log('\x1b[32mO robô novo lança tudo, na ordem, sem perder o primeiro.\x1b[0m\n');
})();
