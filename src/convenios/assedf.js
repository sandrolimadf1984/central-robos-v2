/* ============================================================
 *  ASSEDF / Vida Card
 *  Módulo de convênio da Central de Automação V2.
 *
 *  O corpo dos robôs abaixo foi copiado do central.js v2.1.0
 *  SEM NENHUMA ALTERAÇÃO (byte a byte). Só mudou a moldura em
 *  volta: em vez de virar propriedade de um objeto gigante,
 *  cada robô se registra na Central pela função CR.registrar().
 * ============================================================ */
(function (CR) {
    "use strict";

    CR.registrar({
        chave: "ASSEDF",
        nome: "ASSEDF / Vida Card",
        tipo: "padrao",
        ativo: true,
        portal: {
            seletores: ["frame", "iframe"],
            nota: "Portal com quadros (oazez / cbhpm)"
        },
        origem: "central.js v2.1.0, linhas 2152-3084",
        executar: () => {
            (function () {
                var txt = prompt("Cole os códigos do ASSEDF / Vida Card:");
                if (!txt) return;
                var brutos = txt.match(/\b\d{8}\b/g);
                if (!brutos) { alert("Nenhum código de 8 dígitos encontrado!"); return; }

                // Repetidos viram quantidade; a ordem é a da colagem
                var conta = {};
                brutos.forEach(function (c) { conta[c] = (conta[c] || 0) + 1; });
                var unicos = [];
                brutos.forEach(function (c) { if (unicos.indexOf(c) === -1) unicos.push(c); });
                var itens = unicos.map(function (c) { return { cod: c, qtd: conta[c] }; });

                // Guarda os códigos para a janela de procedimentos pegar depois
                try {
                    localStorage.setItem('_assedfCodigos', JSON.stringify(itens));
                    localStorage.removeItem('_assedfFeitos');   // lote novo, contagem nova
                } catch (e) { }
                window._assedfCodigos = itens;

                var antigo = document.getElementById('painel-assedf');
                if (antigo) antigo.remove();
                var p = document.createElement('div');
                p.id = 'painel-assedf';
                p.style.cssText = 'position:fixed;top:10px;right:10px;width:320px;background:#1b3a6b;color:#fff;' +
                    'padding:14px;z-index:2147483647;border-radius:8px;font-family:Arial,sans-serif;' +
                    'box-shadow:0 4px 15px rgba(0,0,0,0.6);border:3px solid #4a90d9;font-size:12px;';
                p.innerHTML = '<h3 style="margin:0 0 8px;color:#9ecbff;text-align:center;">💳 ASSEDF / Vida Card</h3>' +
                    '<div id="assedf-status" style="font-size:12px;line-height:1.5;white-space:pre-line;background:#12294c;border-radius:5px;padding:8px;min-height:16px;">Guardando os códigos...</div>' +
                    '<button onclick="this.parentElement.remove()" style="width:100%;padding:6px;margin-top:8px;background:#636e72;color:#fff;border:none;border-radius:4px;cursor:pointer;">❌ Fechar</button>';
                document.body.appendChild(p);
                var diz = function (t) { document.getElementById('assedf-status').innerText = t; };

                // ══════════════════════════════════════════════════════════════
                //  AGENTE — este trecho é colocado DENTRO da janela de
                //  procedimentos e roda lá, como se fosse parte da página.
                //  É isso que faz o clique em "Inserir" valer de verdade.
                // ══════════════════════════════════════════════════════════════
                var agente = function () {
                    if (document.getElementById('painel-assedf-agente')) return;
                    try { if (window.__assedfFechado) return; } catch (e) { }

                    var lerCodigos = function () {
                        // 1) entregues direto pelo robô nesta janela
                        try { if (window.__assedfLista && window.__assedfLista.length) return window.__assedfLista; } catch (e) { }
                        // 2) guardados no navegador
                        try {
                            var g = localStorage.getItem('_assedfCodigos');
                            if (g) return JSON.parse(g);
                        } catch (e) { }
                        // 3) pela janela que abriu esta
                        try { return (window.opener && window.opener._assedfCodigos) || []; } catch (e) { }
                        return [];
                    };
                    var itens = lerCodigos();
                    if (!itens.length) return;

                    var caixa = document.createElement('div');
                    caixa.id = 'painel-assedf-agente';
                    caixa.style.cssText = 'position:fixed;bottom:12px;left:12px;z-index:2147483647;width:270px;' +
                        'background:#1b3a6b;color:#fff;padding:12px;border-radius:8px;font-family:Arial,sans-serif;' +
                        'font-size:12px;box-shadow:0 6px 20px rgba(0,0,0,.55);border:3px solid #e67e22;';
                    caixa.innerHTML =
                        '<div style="font-weight:bold;text-align:center;margin-bottom:8px;color:#ffd9a8;">💳 ASSEDF / Vida Card</div>' +
                        '<button id="ass-go" style="width:100%;padding:12px;background:#e67e22;color:#fff;border:none;' +
                        'border-radius:6px;font-weight:bold;cursor:pointer;font-size:14px;">🚀 LIBERAR CÓDIGOS (' + itens.length + ')</button>' +
                        '<div id="ass-log" style="margin-top:8px;background:#12294c;border-radius:5px;padding:8px;' +
                        'line-height:1.5;white-space:pre-line;min-height:16px;">Pronto para lançar.</div>' +
                        '<button id="ass-fechar" style="width:100%;padding:5px;margin-top:6px;background:#636e72;color:#fff;' +
                        'border:none;border-radius:4px;cursor:pointer;">❌ Fechar</button>';
                    document.body.appendChild(caixa);
                    document.getElementById('ass-fechar').onclick = function () {
                        // marca que o atendente fechou, senão a vigia reabre a caixinha
                        try { window.__assedfFechado = true; } catch (e) { }
                        caixa.remove();
                    };

                    var log = function (t) { document.getElementById('ass-log').innerText = t; };

                    // Se a função do portal recarregar a tela, o ajudante morre junto.
                    // Por isso anotamos o que já entrou: ao voltar, ele pula esses.
                    var jaFeitos = function () {
                        try { return JSON.parse(localStorage.getItem('_assedfFeitos') || '[]'); }
                        catch (e) { return []; }
                    };
                    var anotarFeito = function (cod) {
                        try {
                            var l = jaFeitos();
                            if (l.indexOf(cod) === -1) l.push(cod);
                            localStorage.setItem('_assedfFeitos', JSON.stringify(l));
                        } catch (e) { }
                    };
                    var desanotar = function (cod) {
                        try {
                            var l = jaFeitos().filter(function (c) { return c !== cod; });
                            localStorage.setItem('_assedfFeitos', JSON.stringify(l));
                        } catch (e) { }
                    };
                    var zerarFeitos = function () {
                        try { localStorage.removeItem('_assedfFeitos'); } catch (e) { }
                    };


                    var espera = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };
                    var rot = function (e) {
                        return ((e.value || '') + ' ' + (e.textContent || '')).replace(/\s+/g, ' ').trim().toLowerCase();
                    };
                    var digitaveis = function (raiz) {
                        return Array.prototype.slice.call(raiz.querySelectorAll('input')).filter(function (e) {
                            var t = (e.getAttribute('type') || 'text').toLowerCase();
                            return (t === 'text' || t === '') && !e.disabled && !e.readOnly;
                        });
                    };
                    // O portal pode montar o "Inserir" de vários jeitos e a tabela
                    // pode estar dentro de um quadro — procuramos em todos.
                    var docs = function () {
                        var l = [document];
                        try {
                            var q = document.querySelectorAll('iframe,frame');
                            for (var i = 0; i < q.length; i++) {
                                try { if (q[i].contentDocument) l.push(q[i].contentDocument); } catch (e) { }
                            }
                        } catch (e) { }
                        return l;
                    };
                    // A função inserir() do portal pode parar por dois motivos que
                    // não aparecem na tela: uma caixa de aviso que ninguém fecha, ou
                    // um pop-up bloqueado pelo navegador. Aqui desarmamos os dois e
                    // guardamos a mensagem, que é o que faltava para entender a falha.
                    var avisos = [], errosJS = [], acoes = [];
                    var instalarEscudo = function () {
                        docs().forEach(function (d) {
                            var v = d.defaultView;
                            if (!v) return;
                            try {
                                if (v.__assedfEscudo) return;
                                var abrirOrig = v.open;
                                v.alert = function (m) { avisos.push(String(m)); };
                                v.confirm = function (m) { avisos.push(String(m)); return true; };
                                v.open = function () {
                                    try { var w = abrirOrig.apply(v, arguments); if (w) return w; } catch (e) { }
                                    // pop-up bloqueado: devolvemos algo inofensivo para
                                    // o portal não quebrar no meio do lançamento
                                    return { closed: false, focus: function () { }, close: function () { },
                                             document: { write: function () { }, close: function () { } },
                                             location: { href: '' } };
                                };
                                v.addEventListener('error', function (e) {
                                    errosJS.push((e && e.message) || 'erro');
                                });

                                // Registra o que a função do portal faz por dentro.
                                // Se ela nem chega a enviar nada, é porque está
                                // desistindo no meio — e isso muda o tratamento.
                                try {
                                    var protoF = v.HTMLFormElement && v.HTMLFormElement.prototype;
                                    if (protoF && !protoF.__assedfEspiao) {
                                        var envOrig = protoF.submit;
                                        protoF.submit = function () {
                                            acoes.push('enviou o formulário' + (this.name ? ' ' + this.name : ''));
                                            return envOrig.apply(this, arguments);
                                        };
                                        protoF.__assedfEspiao = true;
                                    }
                                } catch (e) { }
                                try {
                                    var protoX = v.XMLHttpRequest && v.XMLHttpRequest.prototype;
                                    if (protoX && !protoX.__assedfEspiao) {
                                        var abrirX = protoX.open;
                                        protoX.open = function (m2, u2) {
                                            acoes.push('chamou o servidor: ' + String(u2).slice(0, 70));
                                            return abrirX.apply(this, arguments);
                                        };
                                        protoX.__assedfEspiao = true;
                                    }
                                } catch (e) { }

                                v.__assedfEscudo = true;
                            } catch (e) { }
                        });
                    };

                    var botoesInserir = function () {
                        var out = [];
                        docs().forEach(function (d) {
                            try {
                                var els = d.querySelectorAll('a,button,input,td,span,div,img');
                                for (var i = 0; i < els.length; i++) {
                                    var e = els[i];
                                    if (e.children && e.children.length > 2) continue;
                                    var t = ((e.value || '') + ' ' + (e.textContent || '') + ' ' +
                                             ((e.getAttribute && e.getAttribute('alt')) || ''))
                                            .replace(/\s+/g, ' ').trim().toLowerCase();
                                    if (t !== 'inserir') continue;
                                    // A célula que ENVOLVE o botão também casa com a
                                    // busca. Clicar nela não faz nada, então ficamos
                                    // sempre com o elemento mais interno.
                                    var interno = e;
                                    try {
                                        var filhos = e.querySelectorAll('a,button,input,span,img');
                                        for (var k = 0; k < filhos.length; k++) {
                                            var tf = ((filhos[k].value || '') + ' ' + (filhos[k].textContent || '') + ' ' +
                                                      ((filhos[k].getAttribute && filhos[k].getAttribute('alt')) || ''))
                                                     .replace(/\s+/g, ' ').trim().toLowerCase();
                                            if (tf === 'inserir') { interno = filhos[k]; break; }
                                        }
                                    } catch (e2) { }
                                    if (out.indexOf(interno) === -1) out.push(interno);
                                }
                            } catch (e) { }
                        });
                        // Botões e links primeiro; células por último
                        out.sort(function (a, b) {
                            var p = function (e) { return /^(A|BUTTON|INPUT|IMG)$/.test(e.tagName) ? 0 : (e.tagName === 'TD' ? 2 : 1); };
                            return p(a) - p(b);
                        });
                        return out;
                    };
                    var linhaLivre = function (podeLimpar) {
                        var bts = botoesInserir();
                        // Pode haver mais de um "Inserir" na tela (um deles pode ser
                        // só o título da coluna). Vale o que estiver na MESMA linha
                        // dos campos de digitação.
                        for (var i = 0; i < bts.length; i++) {
                            var tr = bts[i].closest ? bts[i].closest('tr') : null;
                            if (!tr) continue;
                            var ins = digitaveis(tr);
                            if (!ins.length) continue;
                            var ocupada = (ins[0].value || '').trim();
                            if (ocupada && !podeLimpar) continue;
                            if (ocupada && podeLimpar) {
                                ins[0].value = '';
                                if (ins.length >= 3) ins[1].value = '';
                            }
                            return {
                                tr: tr, inserir: bts[i], cod: ins[0],
                                desc: ins.length >= 3 ? ins[1] : null,
                                qtd: ins.length >= 3 ? ins[2] : (ins.length === 2 ? ins[1] : null)
                            };
                        }
                        return null;
                    };
                    var escrever = function (el, v) {
                        if (!el) return;
                        try { el.focus(); } catch (e) { }
                        el.value = v;
                        try { el.dispatchEvent(new Event('input', { bubbles: true })); } catch (e) { }
                        try { el.dispatchEvent(new Event('change', { bubbles: true })); } catch (e) { }
                        try { el.dispatchEvent(new KeyboardEvent('keyup', { bubbles: true })); } catch (e) { }
                        if (window.jQuery) {
                            try { window.jQuery(el).val(v).trigger('input').trigger('change').trigger('keyup'); } catch (e) { }
                        }
                    };
                    var sair = function (el) {
                        if (!el) return;
                        try { el.blur(); } catch (e) { }
                        ['blur', 'focusout', 'change'].forEach(function (t) {
                            try { el.dispatchEvent(new Event(t, { bubbles: true })); } catch (e) { }
                        });
                        if (window.jQuery) { try { window.jQuery(el).trigger('blur').trigger('change'); } catch (e) { } }
                    };
                    var recusou = function () {
                        var achou = false;
                        docs().forEach(function (d) {
                            try {
                                var t = d.body ? (d.body.innerText || d.body.textContent || '') : '';
                                if (/procedimento\s+n[ãa]o\s+autorizado/i.test(t)) achou = true;
                            } catch (e) { }
                        });
                        return achou;
                    };
                    var limparAviso = function () {
                        docs().forEach(function (d) {
                            try {
                                var todos = d.querySelectorAll('*');
                                for (var i = 0; i < todos.length; i++) {
                                    if (todos[i].children.length === 0 &&
                                        /procedimento\s+n[ãa]o\s+autorizado/i.test(todos[i].textContent || '')) {
                                        todos[i].textContent = '';
                                    }
                                }
                            } catch (e) { }
                        });
                    };
                    // Aciona o "Inserir" e confere se entrou antes de tentar outro
                    // jeito — assim nunca lança o mesmo exame duas vezes.
                    // Como saber que o exame ENTROU: depois de inserido, o código
                    // passa a aparecer como TEXTO na tela (antes ele só existia
                    // dentro do campo de digitação). Esse sinal é o mais confiável.
                    var textoDaTela = function () {
                        var t = '';
                        docs().forEach(function (d) {
                            try {
                                if (!d.body) return;
                                // Ignora o nosso próprio painel: ele mostra o código
                                // em andamento e faria o robô achar que já entrou.
                                var f = d.body.children;
                                for (var i = 0; i < f.length; i++) {
                                    if (f[i].id === 'painel-assedf-agente') continue;
                                    // textContent em vez de innerText: mesmo resultado
                                    // para o que precisamos, sem obrigar o navegador
                                    // a refazer o desenho da página a cada leitura.
                                    t += ' ' + (f[i].textContent || '');
                                }
                            } catch (e) { }
                        });
                        return t;
                    };
                    var entrou = function (linha, cod, jaEstava) {
                        try {
                            if (!jaEstava && textoDaTela().indexOf(cod) !== -1) return true;
                            if (linha.cod && linha.cod.isConnected === false) return true;
                            if (linha.cod && !(linha.cod.value || '').trim()) return true;
                            var nova = linhaLivre(false);
                            if (nova && nova.cod !== linha.cod) return true;
                        } catch (e) { }
                        return false;
                    };

                    // Descreve o botão — se nada funcionar, isso aparece no aviso e
                    // diz exatamente com o que estamos lidando.
                    // Lê o código-fonte da função que o portal chama. É a
                    // informação que permite reproduzir exatamente o que ela faz.
                    var fonteDaFuncao = function (el) {
                        try {
                            var a3 = acharFuncao(el);
                            if (!a3) return '';
                            if (!a3.fn) return a3.nome + '() NÃO EXISTE em nenhuma janela alcançável';
                            return String(a3.fn).replace(/\s+/g, ' ').slice(0, 500);
                        } catch (e) { return ''; }
                    };

                    var descrever = function (el) {
                        try {
                            var a = [];
                            ['href', 'onclick', 'name', 'id', 'class', 'type', 'value'].forEach(function (n) {
                                var v = el.getAttribute && el.getAttribute(n);
                                if (v) a.push(n + '="' + String(v).slice(0, 60) + '"');
                            });
                            return el.tagName + (a.length ? ' ' + a.join(' ') : '');
                        } catch (e) { return '?'; }
                    };

                    // Clique o mais parecido possível com o de uma pessoa:
                    // sequência completa de eventos, nas coordenadas reais do botão.
                    var cliqueRealista = function (el, vista) {
                        try { el.scrollIntoView({ block: 'center' }); } catch (e) { }
                        var r = { left: 0, top: 0, width: 10, height: 10 };
                        try { r = el.getBoundingClientRect(); } catch (e) { }
                        var x = Math.round(r.left + r.width / 2);
                        var y = Math.round(r.top + r.height / 2);
                        var base = {
                            bubbles: true, cancelable: true, composed: true, view: vista,
                            clientX: x, clientY: y, screenX: x, screenY: y,
                            button: 0, buttons: 1, detail: 1
                        };
                        var P = vista.PointerEvent, M = vista.MouseEvent || MouseEvent;
                        var disp = function (Ctor, tipo, extra) {
                            if (!Ctor) return;
                            var o = {};
                            for (var k in base) o[k] = base[k];
                            if (extra) for (var k2 in extra) o[k2] = extra[k2];
                            try { el.dispatchEvent(new Ctor(tipo, o)); } catch (e) { }
                        };
                        if (P) { disp(P, 'pointerover'); disp(P, 'pointerenter'); disp(P, 'pointermove'); disp(P, 'pointerdown'); }
                        disp(M, 'mouseover'); disp(M, 'mouseenter'); disp(M, 'mousemove'); disp(M, 'mousedown');
                        try { el.focus(); } catch (e) { }
                        if (P) disp(P, 'pointerup', { buttons: 0 });
                        disp(M, 'mouseup', { buttons: 0 });
                        disp(M, 'click', { buttons: 0 });
                    };

                    // A função do portal pode estar em OUTRA janela (a página usa
                    // quadros). Procuramos em todas as alcançáveis: a do próprio
                    // botão, a da tela, o pai, o topo, os quadros e a janela de origem.
                    var todasAsJanelas = function (el) {
                        var lista = [];
                        var por = function (w) {
                            try {
                                if (!w || lista.indexOf(w) !== -1) return;
                                void w.document;
                                lista.push(w);
                                for (var i = 0; i < w.frames.length; i++) por(w.frames[i]);
                            } catch (e) { }
                        };
                        try { por(el && el.ownerDocument && el.ownerDocument.defaultView); } catch (e) { }
                        por(window);
                        try { por(window.parent); } catch (e) { }
                        try { por(window.top); } catch (e) { }
                        try { por(window.opener); } catch (e) { }
                        return lista;
                    };

                    var nomeNoOnclick = function (el) {
                        try {
                            var oc = el.getAttribute && el.getAttribute('onclick');
                            if (!oc) return null;
                            var m = oc.match(/([A-Za-z_$][\w$]*)\s*\(/);
                            return m ? m[1] : null;
                        } catch (e) { return null; }
                    };

                    var acharFuncao = function (el) {
                        var nome = nomeNoOnclick(el);
                        if (!nome) return null;
                        var js = todasAsJanelas(el);
                        for (var i = 0; i < js.length; i++) {
                            try {
                                if (typeof js[i][nome] === 'function') return { nome: nome, fn: js[i][nome], win: js[i] };
                            } catch (e) { }
                        }
                        return { nome: nome, fn: null, win: null };
                    };

                    var chamarFuncao = function (el) {
                        var achado = acharFuncao(el);
                        if (!achado || !achado.fn) return false;
                        var v = achado.win;
                        var ev = null;
                        try {
                            ev = new (v.MouseEvent || MouseEvent)('click', { bubbles: true, view: v });
                            try { Object.defineProperty(ev, 'target', { value: el, configurable: true }); } catch (e) { }
                            try { Object.defineProperty(ev, 'srcElement', { value: el, configurable: true }); } catch (e) { }
                        } catch (e) { }
                        var antes = null;
                        try { antes = Object.getOwnPropertyDescriptor(v, 'event'); } catch (e) { }
                        try { Object.defineProperty(v, 'event', { value: ev, configurable: true, writable: true }); } catch (e) { }
                        try { achado.fn.call(el); return true; }
                        catch (e) { errosJS.push(achado.nome + ': ' + (e.message || 'erro')); return false; }
                        finally {
                            try {
                                if (antes) Object.defineProperty(v, 'event', antes);
                                else delete v.event;
                            } catch (e) { }
                        }
                    };

                    // Fica escutando a tela: assim que ela muda, confere na hora.
                    // Antes ele olhava a cada 120ms e perdia até 120ms por exame —
                    // com 40 exames isso vira segundos jogados fora.
                    var esperarAte = function (cond, teto) {
                        return new Promise(function (resolve) {
                            var pronto = false, ultimo = 0;
                            var obs = [], iv = null, to = null;
                            var fim = function (v) {
                                if (pronto) return;
                                pronto = true;
                                obs.forEach(function (o) { try { o.disconnect(); } catch (e) { } });
                                if (iv) clearInterval(iv);
                                if (to) clearTimeout(to);
                                resolve(v);
                            };
                            var testar = function () {
                                if (pronto) return;
                                var agora = Date.now();
                                if (agora - ultimo < 30) return;    // não conferir sem parar
                                ultimo = agora;
                                try { if (cond()) fim(true); } catch (e) { }
                            };
                            try { if (cond()) return resolve(true); } catch (e) { }
                            docs().forEach(function (d) {
                                try {
                                    var M = (d.defaultView && d.defaultView.MutationObserver) || MutationObserver;
                                    var o = new M(testar);
                                    o.observe(d.body || d.documentElement, {
                                        childList: true, subtree: true, characterData: true,
                                        attributes: true, attributeFilter: ['value']
                                    });
                                    obs.push(o);
                                } catch (e) { }
                            });
                            iv = setInterval(testar, 200);          // rede de segurança
                            to = setTimeout(function () { fim(false); }, teto);
                        });
                    };

                    var jeitoQueFunciona = -1;

                    var acionar = async function (linha, cod) {
                        limparAviso();          // aviso antigo não pode contaminar este exame
                        var base = linha.inserir;
                        try {
                            var p2 = base.closest && base.closest('a,button,input[type=button],input[type=submit]');
                            if (p2 && p2 !== base) base = p2;
                        } catch (e) { }
                        var dono = base.ownerDocument || document;
                        var vista = dono.defaultView || window;
                        var jaEstava = textoDaTela().indexOf(cod) !== -1;

                        // O tratador do clique pode estar no próprio elemento, na
                        // célula ou na linha — acionamos todos os níveis.
                        var niveis = [], p3 = base;
                        for (var n = 0; n < 5 && p3; n++) {
                            niveis.push(p3);
                            if (p3.tagName === 'TR') break;
                            p3 = p3.parentElement;
                        }

                        var disparar = function (el) {
                            var M = vista.MouseEvent || MouseEvent;
                            ['mouseover', 'mousedown', 'mouseup', 'click'].forEach(function (t) {
                                try { el.dispatchEvent(new M(t, { bubbles: true, cancelable: true, view: vista })); } catch (e) { }
                            });
                        };
                        var rodarScript = function (el) {
                            try {
                                var h = el.getAttribute && el.getAttribute('href');
                                if (h && /^javascript:/i.test(h)) { vista.eval(h.replace(/^javascript:/i, '')); return; }
                            } catch (e) { }
                            try {
                                var oc = el.getAttribute && el.getAttribute('onclick');
                                if (oc) vista.eval(oc);
                            } catch (e) { }
                        };

                        var jeitos = [
                            // 1º: chamar a função do portal NA JANELA ONDE ELA VIVE
                            function () { chamarFuncao(base); },
                            // 2º: executar o comando do botão nessa mesma janela
                            function () {
                                var a2 = acharFuncao(base);
                                if (!a2 || !a2.win) return;
                                var oc = base.getAttribute && base.getAttribute('onclick');
                                if (oc) a2.win.eval(oc);
                            },
                            // 3º: clique o mais fiel possível
                            function () { cliqueRealista(base, vista); }
                        ];

                        niveis.forEach(function (el) {
                            jeitos.push(function () { if (typeof el.click === 'function') el.click(); });
                            jeitos.push(function () { disparar(el); });
                            jeitos.push(function () { if (typeof el.onclick === 'function') el.onclick.call(el); });
                            jeitos.push(function () { rodarScript(el); });
                        });
                        jeitos.push(function () {
                            // Executa o comando do botão como o navegador executaria,
                            // com o próprio botão no lugar do "this"
                            var oc = base.getAttribute && base.getAttribute('onclick');
                            if (!oc) return;
                            var F = vista.Function || Function;
                            (new F('event', oc)).call(base, null);
                        });
                        jeitos.push(function () { if (vista.jQuery) vista.jQuery(base).trigger('click'); });
                        jeitos.push(function () {                       // Enter no campo
                            var alvo = linha.qtd || linha.cod;
                            if (!alvo) return;
                            var K = vista.KeyboardEvent || KeyboardEvent;
                            ['keydown', 'keypress', 'keyup'].forEach(function (t) {
                                try { alvo.dispatchEvent(new K(t, { key: 'Enter', keyCode: 13, which: 13, bubbles: true })); } catch (e) { }
                            });
                        });
                        // Último recurso: enviar o formulário. Fica no fim porque,
                        // sozinho, ele recarrega a tela sem inserir nada.
                        jeitos.push(function () {
                            var f = base.form || (base.closest && base.closest('form'));
                            if (f && f.requestSubmit) f.requestSubmit();
                        });
                        jeitos.push(function () {
                            var f = base.form || (base.closest && base.closest('form'));
                            if (!f) return;
                            try {
                                if (base.name) {
                                    var extra = (f.ownerDocument || document).createElement('input');
                                    extra.type = 'hidden';
                                    extra.name = base.name;
                                    extra.value = base.value || 'Inserir';
                                    f.appendChild(extra);
                                }
                                var envio = (vista.HTMLFormElement && vista.HTMLFormElement.prototype.submit) || f.submit;
                                envio.call(f);
                            } catch (e) { try { f.submit(); } catch (e2) { } }
                        });

                        // Espera o portal responder. A ordem aqui importa muito:
                        // primeiro olhamos se o exame ENTROU, e só depois o aviso.
                        // Se o aviso aparecer mas o exame estiver na lista, é aviso
                        // de repetição (nós acionamos duas vezes) — não é recusa.
                        var esperarResposta = async function (teto) {
                            var resultado = null;
                            await esperarAte(function () {
                                var tela = textoDaTela();
                                if (!jaEstava && tela.indexOf(cod) !== -1) { resultado = 'ok'; return true; }
                                if (/procedimento\s+n[ãa]o\s+autorizado/i.test(tela)) {
                                    if (tela.indexOf(cod) !== -1) { limparAviso(); resultado = 'ok'; return true; }
                                    resultado = 'recusado'; return true;
                                }
                                if (entrou(linha, cod, jaEstava)) { resultado = 'ok'; return true; }
                                return false;
                            }, teto);
                            return resultado;
                        };

                        // Se já descobrimos qual jeito funciona neste portal, usamos
                        // só ele — assim nunca acionamos duas vezes o mesmo exame.
                        if (jeitoQueFunciona >= 0 && jeitos[jeitoQueFunciona]) {
                            instalarEscudo();
                            try { jeitos[jeitoQueFunciona](); } catch (e) { errosJS.push(e.message || 'erro'); }
                            var rc = await esperarResposta(7000);    // mesmo teto de antes
                            if (rc) return rc;
                        }

                        for (var j = 0; j < jeitos.length; j++) {
                            if (j === jeitoQueFunciona) continue;
                            instalarEscudo();
                            try { jeitos[j](); } catch (e) { errosJS.push(e.message || 'erro'); }
                            // O primeiro jeito ganha uma espera bem maior: é o mais
                            // provável, e insistir cedo demais causava a duplicidade.
                            var r = await esperarResposta(j === 0 ? 7000 : 2500);
                            if (r) {
                                if (r === 'ok') jeitoQueFunciona = j;
                                return r;
                            }
                        }
                        return 'falhou';
                    };

                    // Prepara a linha: código → espera o nome → quantidade.
                    // Devolve tudo que o passo seguinte precisa.
                    var prepararLinha = async function (cod, qtd) {
                        var linha = null, voltasLinha = 0;
                        await esperarAte(function () {
                            linha = linhaLivre(++voltasLinha > 20);
                            return !!linha;
                        }, 12000);
                        if (!linha) return null;

                        var jaEstava = textoDaTela().indexOf(cod) !== -1;
                        escrever(linha.cod, cod);
                        sair(linha.cod);

                        var nome = '';
                        await esperarAte(function () {
                            if (linha.desc && (linha.desc.value || '').trim().length > 2) {
                                nome = linha.desc.value.trim(); return true;
                            }
                            var bruto = (linha.tr.textContent || '').replace(/\s+/g, ' ').trim();
                            var limpo = bruto.split(cod).join(' ')
                                .replace(/\b(inserir|zerar|inclui[r]?|excluir)\b/gi, ' ')
                                .replace(/(^|\s)P(\s|$)/g, ' ')
                                .replace(/\s+/g, ' ').trim();
                            if (limpo.length > 4) { nome = limpo; return true; }
                            return false;
                        }, 10000);

                        if (linha.qtd) { escrever(linha.qtd, qtd); sair(linha.qtd); await espera(50); }
                        return { linha: linha, nome: nome, jaEstava: jaEstava };
                    };

                    var finalizar = function (lancados, recusados, parou, b) {
                        var fim = (parou ? '⚠️ Parei: ' + parou + '\n' : '✅ Concluído! ') +
                                  lancados + ' de ' + itens.length + ' exame(s) lançado(s).';
                        if (recusados.length) {
                            fim += '\n⚠️ ' + recusados.join(', ') +
                                   (recusados.length > 1 ? ' não entraram' : ' não entrou') +
                                   ' devido paciente ter realizado recente';
                        }
                        fim += '\nConfira e clique em Gravar.';
                        if (!parou) zerarFeitos();
                        log(fim);
                        b.disabled = false;
                        b.style.background = parou ? '#e67e22' : '#27ae60';
                        b.innerText = parou ? '🔁 Tentar de novo' : '✅ Concluído';
                    };

                    // ── MODO ASSISTIDO ──
                    // Se o portal só aceitar o clique de uma pessoa de verdade, o
                    // ajudante preenche a linha e espera VOCÊ clicar em INSERIR —
                    // e assim que o exame entra, ele já prepara o próximo sozinho.
                    var modoAssistido = async function (inicio, lancados, recusados, b) {
                        b.style.background = '#2980b9';
                        b.innerText = '👆 Modo assistido';
                        for (var i = inicio; i < itens.length; i++) {
                            var cod = itens[i].cod, qtd = itens[i].qtd;
                            if (textoDaTela().indexOf(cod) !== -1) { lancados++; continue; }

                            var pre = await prepararLinha(cod, qtd);
                            if (!pre) { finalizar(lancados, recusados, 'não apareceu linha para o código ' + cod, b); return; }

                            log('👆 ' + (i + 1) + '/' + itens.length + ' — ' + cod +
                                (pre.nome ? '\n' + pre.nome.slice(0, 42) : '') +
                                '\n\nAgora CLIQUE EM "INSERIR" na tela.\nAssim que entrar eu preparo o próximo.');

                            var entregue = false;
                            for (var k = 0; k < 2400; k++) {          // espera até 10 minutos
                                await espera(250);
                                if (recusou()) {
                                    recusados.push(pre.nome || cod);
                                    desanotar(cod);
                                    limparAviso();
                                    try {
                                        var at = linhaLivre(true);
                                        if (at) { escrever(at.cod, ''); if (at.desc) escrever(at.desc, ''); }
                                    } catch (e) { }
                                    entregue = true;
                                    break;
                                }
                                if (entrou(pre.linha, cod, pre.jaEstava)) {
                                    lancados++; anotarFeito(cod); entregue = true; break;
                                }
                            }
                            if (!entregue) { finalizar(lancados, recusados, 'esperei demais pelo clique em Inserir', b); return; }
                        }
                        finalizar(lancados, recusados, null, b);
                    };

                    document.getElementById('ass-go').onclick = async function () {
                        instalarEscudo();
                        var b = document.getElementById('ass-go');
                        itens = lerCodigos();
                        b.disabled = true;
                        b.style.background = '#c0392b';
                        b.innerText = '⏳ Lançando...';

                        var lancados = 0, recusados = [], parou = null;
                        var feitos = jaFeitos();

                        for (var i = 0; i < itens.length; i++) {
                            var cod = itens[i].cod, qtd = itens[i].qtd;

                            if (feitos.indexOf(cod) !== -1 || textoDaTela().indexOf(cod) !== -1) {
                                lancados++;
                                log('↷ ' + (i + 1) + '/' + itens.length + ' — ' + cod + ' já estava lançado');
                                await espera(120);
                                continue;
                            }

                            log('⏳ ' + (i + 1) + '/' + itens.length + ' — ' + cod + (qtd > 1 ? ' (qtd ' + qtd + ')' : ''));
                            var pre = await prepararLinha(cod, qtd);
                            if (!pre) {
                                parou = (i === 0) ? 'não encontrei a tabela de procedimentos nesta tela'
                                                  : 'não apareceu linha para o código ' + cod;
                                break;
                            }

                            limparAviso();
                            anotarFeito(cod);
                            var res = await acionar(pre.linha, cod);

                            if (res === 'recusado') {
                                desanotar(cod);
                                recusados.push(pre.nome || cod);
                                limparAviso();
                                try {
                                    var atual = linhaLivre(true);
                                    if (atual) { escrever(atual.cod, ''); if (atual.desc) escrever(atual.desc, ''); }
                                } catch (e) { }
                                log('⚠️ ' + (pre.nome || cod) + ' não entrou — seguindo para o próximo');
                                await espera(500);
                            } else if (res === 'falhou') {
                                desanotar(cod);
                                b.disabled = false;

                                // Guarda tudo que descobrimos sobre a função do portal,
                                // num quadro que dá para selecionar e copiar.
                                var relato = 'BOTÃO: ' + descrever(pre.linha.inserir) +
                                    '\n\nO QUE A FUNÇÃO FEZ: ' + (acoes.length ? acoes.join(' | ') : 'NADA (desistiu calada)') +
                                    (avisos.length ? '\n\nAVISOS DO PORTAL: ' + avisos.join(' | ') : '') +
                                    (errosJS.length ? '\n\nERROS: ' + errosJS.join(' | ') : '') +
                                    '\n\nCÓDIGO DA FUNÇÃO:\n' + (fonteDaFuncao(pre.linha.inserir) || '(não consegui ler)');
                                try {
                                    var cx = document.createElement('textarea');
                                    cx.id = 'ass-diag';
                                    cx.readOnly = true;
                                    cx.value = relato;
                                    cx.style.cssText = 'width:100%;height:110px;margin-top:8px;font-size:10px;' +
                                        'font-family:Consolas,monospace;background:#0a1c33;color:#9ecbff;' +
                                        'border:1px solid #4a90d9;border-radius:4px;padding:6px;box-sizing:border-box;';
                                    var velho = document.getElementById('ass-diag');
                                    if (velho) velho.remove();
                                    document.getElementById('ass-log').insertAdjacentElement('afterend', cx);
                                    cx.select();
                                    try { document.execCommand('copy'); } catch (e) { }
                                } catch (e) { }

                                log('ℹ️ O clique automático não passou neste portal.\n' +
                                    'Copiei o diagnóstico abaixo (já está na área de transferência) —\n' +
                                    'mande para eu deixar 100% automático.\n\n' +
                                    'Enquanto isso, sigo no modo assistido: eu preencho, você só clica em INSERIR.');
                                await espera(1500);
                                await modoAssistido(i, lancados, recusados, b);
                                return;
                            } else {
                                lancados++;
                                limparAviso();   // deixa a tela limpa para o próximo
                            }
                        }

                        finalizar(lancados, recusados, parou, b);
                    };
                };

                // ── Colocar o agente dentro da janela de procedimentos ──
                // Antes eu só injetava se achasse o botão "Inserir" — se ele fosse
                // de outro tipo ou estivesse num quadro, nada aparecia. Agora basta
                // ser a janela do convênio; quem procura a tabela é o agente, lá
                // dentro, e ele avisa na própria tela se não encontrar.
                var ehJanelaDoConvenio = function (w) {
                    try {
                        if (w === window || w === window.top || w === window.parent) return false;
                        var d = w.document;
                        if (!d || !d.body) return false;
                        var url = '';
                        try { url = w.location.href || ''; } catch (e) { }
                        if (/GPSC0005b|incluir=S/i.test(url)) return true;
                        var t = (d.body.innerText || d.body.textContent || '');
                        return /guia\s+de\s+autoriza/i.test(t) || /inserir/i.test(t);
                    } catch (e) { return false; }
                };

                var injetar = function (w) {
                    try {
                        if (!w || w.closed || !w.document || !w.document.body) return false;
                        var d = w.document;
                        if (d.getElementById('painel-assedf-agente')) return true;
                        try { if (w.__assedfFechado) return true; } catch (e) { }
                        if (!ehJanelaDoConvenio(w)) return false;
                        // Entrega a lista dentro da janela (nem sempre dá para ler
                        // o armazenamento do navegador ou a janela de origem)
                        try { w.__assedfLista = JSON.parse(JSON.stringify(itens)); } catch (e) { }
                        try { w.eval('window.__assedfLista = ' + JSON.stringify(itens) + ';'); } catch (e) { }
                        var sc = d.createElement('script');
                        sc.textContent = '(' + agente.toString() + ')();';
                        d.body.appendChild(sc);
                        return !!d.getElementById('painel-assedf-agente');
                    } catch (e) { return false; }
                };

                // Relógio próprio: o app troca os relógios da página durante a
                // automação, e este vigia precisa sobreviver a isso.
                var relogioProprio = (function () {
                    try {
                        var f = document.createElement('iframe');
                        f.style.cssText = 'position:fixed;left:-9999px;width:1px;height:1px;border:0;';
                        document.body.appendChild(f);
                        var jan = f.contentWindow;
                        return function (fn, ms) { return jan.setInterval(fn, ms); };
                    } catch (e) {
                        return function (fn, ms) { return setInterval(fn, ms); };
                    }
                })();

                // Todas as janelas desta aba, inclusive os quadros (frames).
                // A página do convênio é antiga e pode usar quadros: se o botão
                // estiver dentro de um, é o window.open DELE que abre a janela.
                var janelasLocais = function () {
                    var lista = [];
                    var visitar = function (w) {
                        try {
                            if (!w || lista.indexOf(w) !== -1) return;
                            void w.document;              // testa se dá para acessar
                            lista.push(w);
                            for (var i = 0; i < w.frames.length; i++) visitar(w.frames[i]);
                        } catch (e) { }
                    };
                    visitar(window);
                    try { visitar(window.top); } catch (e) { }
                    try { visitar(window.parent); } catch (e) { }
                    return lista;
                };

                // A lista de janelas capturadas é global: assim uma vigia instalada
                // numa execução anterior continua alimentando a execução de agora.
                try { window.__assedfAlvos = window.__assedfAlvos || []; } catch (e) { }
                var alvos = window.__assedfAlvos || [];
                var lembrar = function (w) {
                    try { if (w && window.__assedfAlvos.indexOf(w) === -1) window.__assedfAlvos.push(w); } catch (e) { }
                };
                janelasLocais().forEach(function (alvo) {
                    try {
                        if (alvo.__assedfHook) return;
                        var orig = alvo.open;
                        alvo.open = function () {
                            var w = orig.apply(alvo, arguments);
                            try { if (w && window.__assedfAlvos.indexOf(w) === -1) window.__assedfAlvos.push(w); } catch (e) { }
                            return w;
                        };
                        alvo.__assedfHook = true;
                    } catch (e) { }
                });

                var marcouNome = false, tentativasNome = 0;
                janelasLocais().forEach(function (jw) {
                try {
                    jw.document.addEventListener('click', function (e) {
                        try {
                            var el = e.target && e.target.closest ? e.target.closest('a,input,button') : null;
                            if (!el) return;
                            var t = ((el.value || '') + ' ' + (el.textContent || '')).replace(/\s+/g, ' ').trim();
                            if (!/cadastrar\s+procedimentos/i.test(t)) return;
                            if (el.tagName === 'A' && el.getAttribute('target')) {
                                el.setAttribute('target', 'crAssedfProc'); marcouNome = true;
                            }
                            var f = el.form || (el.closest && el.closest('form'));
                            if (f && f.target) { f.target = 'crAssedfProc'; marcouNome = true; }
                        } catch (e2) { }
                    }, true);
                } catch (e) { }
                });

                var voltas = 0;
                var vigia = relogioProprio(function () {
                    voltas++;
                    if (voltas > 2400) { try { clearInterval(vigia); } catch (e) { } return; }   // ~36 min
                    var lista = alvos.slice();
                    try { (window.__crJanelas || []).forEach(function (w) { lista.push(w); }); } catch (e) { }
                    // Recuperar pela janela nomeada — só quando o atendente
                    // realmente clicou em "Cadastrar Procedimentos", e no máximo
                    // três vezes. Antes isso rodava sem parar e fazia a tela tremer.
                    if (marcouNome && tentativasNome < 3) {
                        tentativasNome++;
                        try {
                            var w2 = window.open('', 'crAssedfProc');
                            if (w2 && w2 !== window) lista.push(w2);
                        } catch (e) { }
                    }

                    for (var i = 0; i < lista.length; i++) {
                        if (injetar(lista[i])) {
                            // conseguiu: não precisa mais ficar varrendo
                            try { clearInterval(vigia); } catch (e) { }
                            return;
                        }
                    }
                }, 1500);

                diz('✅ ' + itens.length + ' código(s) guardado(s) na memória.\n\n' +
                    '➡️ Agora clique em "Cadastrar Procedimentos".\n' +
                    'Na janela que abrir vai aparecer o botão laranja\n' +
                    '"LIBERAR CÓDIGOS" — clique nele para lançar.');
            })();
        }
    });

})(window.CentralRobos);
