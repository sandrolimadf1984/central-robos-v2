/* ============================================================
 *  RODAR OS TESTES NO COMPUTADOR
 *
 *      node tests/rodar.js
 *
 *  Não precisa instalar nada — só o Node. No navegador, a mesma
 *  bateria roda abrindo tests/index.html.
 * ============================================================ */

/* O navegador tem localStorage; aqui a gente finge um, só para os
   testes de histórico e estatísticas terem onde guardar. */
var memoria = {};
global.localStorage = {
    getItem: function (k) { return Object.prototype.hasOwnProperty.call(memoria, k) ? memoria[k] : null; },
    setItem: function (k, v) { memoria[k] = String(v); },
    removeItem: function (k) { delete memoria[k]; },
    key: function (i) { return Object.keys(memoria)[i]; },
    get length() { return Object.keys(memoria).length; }
};

global.CentralRobos = {};

var caminho = require('path');
var raiz = caminho.join(__dirname, '..');

[
    'src/core/utils.js',
    'src/core/logger.js',
    'src/core/fila.js',
    'src/core/historico.js',
    'src/core/estatisticas.js',
    'src/core/notifications.js'
].forEach(function (m) { require(caminho.join(raiz, m)); });

var CR = global.CentralRobos;

/* Catálogo de convênios: lido sem navegador, só para conferir
   se os cards e as fichas continuam batendo. */
try {
    var fs = require('fs');
    var texto = fs.readFileSync(caminho.join(raiz, 'src/config/convenios.js'), 'utf8');
    var fn = new Function('CR', texto.replace('(function (CR) {', '').replace(/\}\)\(window\.CentralRobos\);\s*$/, ''));
    fn(CR);
} catch (e) {
    console.log('  (catálogo de convênios não pôde ser lido aqui: ' + e.message + ')');
}

var rodar = require(caminho.join(raiz, 'tests/testes.js'))(CR);

var VERDE = '\x1b[32m', VERMELHO = '\x1b[31m', CINZA = '\x1b[90m', FIM = '\x1b[0m';
console.log('\nTESTES DA CENTRAL DE AUTOMAÇÃO\n');

var r = rodar(function (situacao, nome, erro) {
    if (situacao === 'ok') console.log('  ' + VERDE + '✓' + FIM + ' ' + nome);
    else console.log('  ' + VERMELHO + '✗ ' + nome + FIM + '\n      ' + CINZA + erro + FIM);
});

console.log('\n' + (r.falhas.length === 0 ? VERDE : VERMELHO) +
    r.ok + ' de ' + r.total + ' testes passaram' + FIM + '\n');

process.exit(r.falhas.length ? 1 : 0);
