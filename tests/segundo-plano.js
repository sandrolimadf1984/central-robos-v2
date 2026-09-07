/* ============================================================
 *  TESTE DO SEGUNDO PLANO
 *
 *      node tests/segundo-plano.js
 *
 *  Simula MINIMIZAR a aba e confere se o robô continua andando.
 *  Precisa do jsdom (um navegador de mentira):
 *
 *      npm install jsdom
 *
 *  De propósito, o jsdom NÃO tem Web Worker. Então este teste também
 *  prova que a corrente de reservas funciona quando o caminho
 *  principal não está disponível — que é o que acontece em portal
 *  com regra de segurança apertada.
 * ============================================================ */

let JSDOM;
try {
    JSDOM = require('jsdom').JSDOM;
} catch (e) {
    console.log('\n  Este teste precisa do jsdom. Instale com:\n');
    console.log('      npm install jsdom\n');
    console.log('  (os outros testes, em tests/rodar.js, rodam sem instalar nada)\n');
    process.exit(0);
}

const fs = require('fs');
const path = require('path');

const RAIZ = path.join(__dirname, '..');

const modulos = JSON.parse(fs.readFileSync(path.join(RAIZ, 'manifest.json'), 'utf8')).modulos;

const dom = new JSDOM('<!DOCTYPE html><html><body><div id="portal"></div></body></html>',
    { url: 'https://portal-de-teste.exemplo.com/', pretendToBeVisual: true, runScripts: 'outside-only' });
const win = dom.window;
win.fetch = () => Promise.reject(new Error('sem rede'));
win.alert = () => {};

/* Interruptor que faz o papel do "minimizar" */
let minimizada = false;
Object.defineProperty(win.Document.prototype, 'hidden', {
    configurable: true, get: () => minimizada
});
Object.defineProperty(win.Document.prototype, 'visibilityState', {
    configurable: true, get: () => (minimizada ? 'hidden' : 'visible')
});

win.CentralRobos = {};
const carregador = fs.readFileSync(path.join(RAIZ, 'central.js'), 'utf8');
const base = carregador.slice(carregador.indexOf('    var REPO'), carregador.indexOf('    /* ── AVISO DE CARREGAMENTO'))
    .replace(carregador.slice(carregador.indexOf('    /* Lista de reserva'), carregador.indexOf('    /* ── BASE COMPARTILHADA')), '');
win.eval('(function(){ "use strict";\n' + base + '\n})();');
for (const m of modulos) win.eval(fs.readFileSync(path.join(RAIZ, m), 'utf8'));

const CR = win.CentralRobos;
const doc = win.document;
const problemas = [];

function conferir(nome, condicao, detalhe) {
    if (condicao) console.log('  \x1b[32m✓\x1b[0m ' + nome + (detalhe ? '  \x1b[90m' + detalhe + '\x1b[0m' : ''));
    else { console.log('  \x1b[31m✗ ' + nome + '\x1b[0m  ' + (detalhe || '')); problemas.push(nome); }
}

(async function () {
console.log('\nCOMPORTAMENTO COM A ABA MINIMIZADA\n');

const setTimeoutOriginal = win.setTimeout;

// ── antes de tudo ──────────────────────────────────────────────
minimizada = true;
conferir('sem a Central, a página sabe que foi minimizada', doc.hidden === true);
minimizada = false;

// ── liga o motor no modo completo ──────────────────────────────
CR.estado.rodando = true;
CR.motor.ligar(false);

console.log('  \x1b[90m   estado do motor: ' + CR.motor.diagnostico().join(' · ') + '\x1b[0m');

conferir('os relógios da página passaram a ser da Central',
    win.setTimeout !== setTimeoutOriginal);

// ── MINIMIZA ───────────────────────────────────────────────────
minimizada = true;

conferir('para o PORTAL, a aba continua à vista', doc.hidden === false, 'document.hidden = false');
conferir('para o PORTAL, o estado continua "visible"', doc.visibilityState === 'visible');
conferir('o portal continua achando que tem o foco', doc.hasFocus() === true);
conferir('mas a Central sabe a verdade — está minimizada',
    CR.motor.escondidoDeVerdade() === true,
    'é isso que faz ela escolher a batida certa');

// ── o robô continua trabalhando? ───────────────────────────────
let passos = 0;
const comeco = Date.now();
const id = win.setInterval(() => { passos++; }, 50);
conferir('as tarefas do robô entram na agenda da Central', id >= 900000000, 'id ' + id);

await new Promise(r => setTimeoutOriginal(r, 1500));
win.clearInterval(id);

const decorrido = Date.now() - comeco;
conferir('o robô continuou trabalhando com a aba minimizada',
    passos >= 5, passos + ' passos em ' + decorrido + 'ms');

// ── requestAnimationFrame não morre mais ───────────────────────
let desenhou = false;
win.requestAnimationFrame(() => { desenhou = true; });
await new Promise(r => setTimeoutOriginal(r, 600));
conferir('o relógio de tela continua respondendo minimizado', desenhou === true,
    'requestAnimationFrame normalmente morre de vez em aba escondida');

// ── volta para a frente e desliga ──────────────────────────────
minimizada = false;
CR.motor.desligar();
CR.estado.rodando = false;

conferir('ao terminar, os relógios da página voltam ao normal',
    win.setTimeout === setTimeoutOriginal);

minimizada = true;
conferir('ao terminar, o disfarce sai e a página volta a enxergar a verdade',
    doc.hidden === true);
minimizada = false;

// ── modo leve (Amil e outros portais sensíveis) ────────────────
console.log('');
CR.estado.rodando = true;
CR.motor.ligar(true);
minimizada = true;

conferir('MODO LEVE: o disfarce de visibilidade também vale', doc.hidden === false);
conferir('MODO LEVE: o relógio da página NÃO é tomado (é o que protege o Amil)',
    win.setTimeout === setTimeoutOriginal);

CR.motor.desligar();
CR.estado.rodando = false;
minimizada = false;
conferir('MODO LEVE: ao terminar também volta tudo ao normal', win.setTimeout === setTimeoutOriginal);

console.log('');
if (problemas.length) {
    console.log('\x1b[31m' + problemas.length + ' problema(s):\x1b[0m');
    problemas.forEach(p => console.log('   · ' + p));
    process.exit(1);
}
console.log('\x1b[32mA automação continua andando com a aba minimizada.\x1b[0m');
console.log('\x1b[90mObs.: este navegador falso não tem Web Worker, então o teste passou\x1b[0m');
console.log('\x1b[90mpelas reservas. No Chrome de verdade a batida principal é o Worker,\x1b[0m');
console.log('\x1b[90mque é mais rápido e mais firme do que o que foi medido aqui.\x1b[0m\n');
})();
