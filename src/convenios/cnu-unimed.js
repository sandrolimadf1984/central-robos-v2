/* ============================================================
 *  CNU Unimed / Proasa
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
        chave: "CNU UNIMED",
        nome: "CNU Unimed / Proasa",
        tipo: "janela",
        ativo: true,
        portal: {
            seletores: ["input[name^=\"procedimentosSolicitados\"]"],
            nota: "Campos da guia SP/SADT (na janela de autorização)"
        },
        origem: "central.js v2.1.0, linhas 4512-4751",
        executar: (texto, ctx) => {
            const LIMITE = 30;

            // Códigos repetidos não viram linhas novas: viram quantidade
            const brutos = texto.match(/\b\d{8}\b/g) || [];
            if (!brutos.length) {
                ctx.status('❌ Nenhum código de 8 dígitos encontrado no texto colado.');
                ctx.fim();
                return;
            }
            // ATENÇÃO: Object.keys devolve chaves numéricas em ordem CRESCENTE,
            // não na ordem em que foram coladas. Por isso montamos a lista
            // percorrendo o texto, para respeitar a ordem do atendente.
            const contagem = {};
            brutos.forEach(c => contagem[c] = (contagem[c] || 0) + 1);
            let unicos = [];
            brutos.forEach(c => { if (unicos.indexOf(c) === -1) unicos.push(c); });
            let aviso = '';
            if (unicos.length > LIMITE) {
                aviso = ' ⚠️ o Unimed aceita no máximo 30 — os demais ficaram de fora';
                unicos = unicos.slice(0, LIMITE);
            }
            const itens = unicos.map(c => ({ cod: c, qtd: contagem[c] }));

            const espera = ms => new Promise(r => setTimeout(r, ms));
            const doc = () => ctx.doc();

            const disparar = (el, tipo) => {
                try { el.dispatchEvent(new (ctx.win().Event || Event)(tipo, { bubbles: true })); }
                catch (e) { try { el.dispatchEvent(new Event(tipo, { bubbles: true })); } catch (e2) { } }
            };

            // Cada linha da tabela: o seletor de tabela + código, descrição e quantidade
            const digitaveis = raiz => Array.from(raiz.querySelectorAll('input')).filter(i => {
                const t = (i.getAttribute('type') || 'text').toLowerCase();
                return (t === 'text' || t === '') && !i.disabled;
            });

            // Qual coluna é o quê, descoberto pelos rótulos da própria tela
            // (25-Código do Procedimento, 26-Descrição, 27-Qt. Solic.)
            const mapaColunas = () => {
                try {
                    const sel = selectsTuss(doc())[0];
                    const tabela = sel && sel.closest && sel.closest('table');
                    if (!tabela) return null;
                    for (const tr of Array.from(tabela.rows || [])) {
                        const cels = Array.from(tr.cells || []);
                        const txt = cels.map(c => (c.textContent || '').replace(/\s+/g, ' ').trim());
                        const onde = pref => txt.findIndex(t => t.indexOf(pref) === 0);
                        const iCod = onde('25-'), iDesc = onde('26-'), iQtd = onde('27-');
                        if (iCod >= 0 && iQtd >= 0) return { cod: iCod, desc: iDesc, qtd: iQtd };
                    }
                } catch (e) { }
                return null;
            };

            // Reserva: casa cada campo com a coluna pela posição na tela
            const camposPorPosicao = tr => {
                try {
                    const centro = pref => {
                        const cand = Array.from(doc().querySelectorAll('td,th,div,span,b,font,p'))
                            .filter(e => (e.textContent || '').replace(/\s+/g, ' ').trim().indexOf(pref) === 0)
                            .sort((a, b) => (a.textContent || '').length - (b.textContent || '').length);
                        for (const e of cand) {
                            const r = e.getBoundingClientRect();
                            if (r && r.width > 0) return r.left + r.width / 2;
                        }
                        return null;
                    };
                    const xCod = centro('25-'), xDesc = centro('26-'), xQtd = centro('27-');
                    if (xCod === null || xQtd === null) return null;
                    const ins = digitaveis(tr).filter(i => {
                        const r = i.getBoundingClientRect();
                        return r && r.width > 0;
                    });
                    if (ins.length < 2) return null;
                    const perto = alvo => {
                        let melhor = null, dist = Infinity;
                        ins.forEach(i => {
                            const r = i.getBoundingClientRect();
                            const d = Math.abs((r.left + r.width / 2) - alvo);
                            if (d < dist) { dist = d; melhor = i; }
                        });
                        return melhor;
                    };
                    const cod = perto(xCod), qtd = perto(xQtd);
                    if (!cod || !qtd || cod === qtd) return null;
                    let desc = xDesc === null ? null : perto(xDesc);
                    if (desc === cod || desc === qtd) desc = null;
                    return { cod, desc, qtd };
                } catch (e) { return null; }
            };

            const camposDaLinha = (tr, mapa) => {
                const doCel = cel => cel ? cel.querySelector(
                    'input:not([type=hidden]):not([type=button]):not([type=submit]):not([type=image]):not([type=checkbox]):not([type=radio])') : null;

                // 1º) pelas colunas dos rótulos
                if (mapa && tr.cells && tr.cells.length > Math.max(mapa.cod, mapa.qtd)) {
                    const cod = doCel(tr.cells[mapa.cod]);
                    const qtd = doCel(tr.cells[mapa.qtd]);
                    const desc = (mapa.desc >= 0) ? doCel(tr.cells[mapa.desc]) : null;
                    if (cod && qtd && cod !== qtd) return { cod, desc, qtd };
                }
                // 2º) pela posição na tela
                const porTela = camposPorPosicao(tr);
                if (porTela) return porTela;
                // 3º) último recurso: ordem no código
                const ins = digitaveis(tr);
                return { cod: ins[0], desc: ins[1], qtd: ins[2] };
            };

            const linhas = () => {
                const mapa = mapaColunas();
                return selectsTuss(doc()).map(sel => {
                    const tr = sel.closest('tr') || (sel.parentElement && sel.parentElement.parentElement);
                    if (!tr) return null;
                    const c = camposDaLinha(tr, mapa);
                    if (!c.cod || !c.qtd || c.cod === c.qtd) return null;
                    return { sel, tr, cod: c.cod, desc: c.desc, qtd: c.qtd };
                }).filter(Boolean);
            };

            const botaoAdicionar = () => {
                try {
                    const alvos = Array.from(doc().querySelectorAll('input[type=button],input[type=submit],button,a'));
                    return alvos.find(b => {
                        const t = ((b.value || '') + ' ' + (b.textContent || '')).trim().toLowerCase();
                        return t === 'adicionar' || /(^|\s)adicionar(\s|$)/.test(t);
                    });
                } catch (e) { return null; }
            };

            const esperarPagina = async () => {
                for (let i = 0; i < 60; i++) {
                    if (!ctx.ativo()) return false;
                    try { if (doc().readyState === 'complete') return true; } catch (e) { }
                    await espera(300);
                }
                return false;
            };

            (async () => {
                if (!await esperarPagina()) {
                    ctx.status('❌ Perdi a janela de autorização.');
                    ctx.fim();
                    return;
                }
                if (!linhas().length) {
                    ctx.status('❌ Não achei a tabela de procedimentos nessa janela.\nConfira se ela está na tela de autorização (SP/SADT).');
                    ctx.fim();
                    return;
                }

                for (let i = 0; i < itens.length; i++) {
                    if (!ctx.ativo()) return;
                    const item = itens[i];
                    ctx.status(`⏳ ${i + 1}/${itens.length} — código ${item.cod}` +
                        (item.qtd > 1 ? ` (quantidade ${item.qtd})` : '') + aviso);

                    // 1) Garante uma linha vazia; se acabaram, clica em "Adicionar"
                    let linha = null;
                    let pediuMais = false;
                    for (let t = 0; t < 50; t++) {
                        if (!ctx.ativo()) return;
                        await esperarPagina();
                        const todas = linhas();
                        linha = todas.find(l => !(l.cod.value || '').trim());
                        if (linha) break;
                        if (!pediuMais) {
                            const add = botaoAdicionar();
                            if (!add) {
                                ctx.status('❌ Não encontrei o botão "Adicionar" na janela.');
                                ctx.fim();
                                return;
                            }
                            ctx.status(`➕ Abrindo mais linhas... (${i + 1}/${itens.length})`);
                            add.click();
                            pediuMais = true;
                        }
                        await espera(400);
                    }
                    if (!linha) {
                        ctx.status(`❌ Parei no ${item.cod}: não apareceu linha vazia.`);
                        ctx.fim();
                        return;
                    }

                    // 2) Escolhe "TUSS -- Procedimentos e eventos em saúde"
                    const opcao = Array.from(linha.sel.options)
                        .find(o => /procedimentos?\s+e\s+eventos/i.test(o.textContent || ''));
                    if (opcao) {
                        linha.sel.focus();
                        linha.sel.value = opcao.value;
                        disparar(linha.sel, 'input');
                        disparar(linha.sel, 'change');
                        try { if (typeof linha.sel.onchange === 'function') linha.sel.onchange(); } catch (e) { }
                        await espera(300);
                    }

                    // 3) Digita o código do procedimento
                    try { linha.cod.focus(); } catch (e) { }
                    linha.cod.value = item.cod;
                    disparar(linha.cod, 'input');
                    disparar(linha.cod, 'change');
                    try { linha.cod.blur(); } catch (e) { }
                    disparar(linha.cod, 'blur');
                    disparar(linha.cod, 'focusout');

                    // 4) Espera o portal trazer o nome do exame
                    let nomeVeio = false;
                    for (let t = 0; t < 48; t++) {
                        if (!ctx.ativo()) return;
                        try {
                            const atual = linhas().find(l => (l.cod.value || '').trim() === item.cod);
                            if (atual) {
                                linha = atual;
                                if (atual.desc && (atual.desc.value || '').trim().length > 1) { nomeVeio = true; break; }
                            }
                        } catch (e) { }
                        await espera(250);
                    }
                    if (!nomeVeio) ctx.status(`⚠️ ${item.cod}: o nome do exame não voltou — seguindo em frente`);

                    // 5) Quantidade solicitada (nunca no campo da descrição)
                    if (linha.qtd && linha.qtd !== linha.desc && linha.qtd !== linha.cod) {
                        try { linha.qtd.focus(); } catch (e) { }
                        linha.qtd.value = item.qtd;
                        disparar(linha.qtd, 'input');
                        disparar(linha.qtd, 'change');
                        try { linha.qtd.blur(); } catch (e) { }
                        disparar(linha.qtd, 'blur');
                    }
                    await espera(300);
                }

                ctx.status(`✅ Concluído! ${itens.length} exame(s) lançado(s).${aviso}\nConfira na janela e finalize a autorização.`);
                ctx.fim();
            })();
        }
    });

    CR.registrar({
        chave: "PROASA_CNU_DESATIVADO",
        nome: "CNU Unimed / Proasa",
        tipo: "padrao",
        ativo: false,
        origem: "central.js v2.1.0, linhas 3413-3680",
        executar: () => {
            (function () {
                if (window._sawGatilho) {
                    alert("O robô já está armado, na posição " + (window._sawState.index + 1) +
                          " de " + window._sawState.codigos.length + ". Abra a janela de autorização.");
                    return;
                }
                var txt = prompt("Cole os códigos:");
                if (!txt) return;
                var m = txt.match(/\b\d{8}\b/g);
                if (!m) return alert("Nenhum código válido!");
                var counts = {};
                m.forEach(x => counts[x] = (counts[x] || 0) + 1);
                var codigos = [...new Set(m)];
                window._sawState = { codigos: codigos, counts: counts, index: 0 };
                window._sawGatilho = true;

                // Põe o botão "COLAR CÓDIGOS" dentro da janela de autorização
                var armarBotao = function (winAlvo) {
                    if (!winAlvo) return;
                    var checkLoad = setInterval(function () {
                        try {
                            var doc = winAlvo.document;
                            if (!doc || doc.readyState !== 'complete') return;
                            if (doc.getElementById('btn-robo-saw')) { clearInterval(checkLoad); return; }
                            // A tela serve se tiver os campos do formulário OU a lista de tabelas TUSS
                            var temCampos = doc.querySelector("[id*='procedimentosSolicitados']");
                            var temTuss = Array.from(doc.querySelectorAll('select')).some(function (s) {
                                return Array.from(s.options || []).some(function (o) {
                                    return /procedimentos?\s+e\s+eventos/i.test(o.textContent || '');
                                });
                            });
                            if (!temCampos && !temTuss) return;
                            clearInterval(checkLoad);

                            var b = doc.createElement('button');
                            b.id = 'btn-robo-saw';
                            var teto = Math.min(window._sawState.index + 30, window._sawState.codigos.length);
                            b.innerText = '🤖 COLAR CÓDIGOS (' + (window._sawState.index + 1) + ' a ' + teto + ')';
                            b.style.cssText = 'position:fixed;top:20px;right:20px;z-index:9999999;padding:15px 20px;background:#e67e22;color:#fff;border:3px solid #d35400;border-radius:8px;font-weight:bold;cursor:pointer;box-shadow:0 5px 15px rgba(0,0,0,0.5);font-family:Arial;font-size:14px;';
                            doc.body.appendChild(b);

                            var wait = ms => new Promise(r => setTimeout(r, ms));
                            var visivel = function (e) {
                                try { var r = e.getBoundingClientRect(); return r.width > 0; } catch (x) { return false; }
                            };

                            // ── Jeito 1: campos com nome procedimentosSolicitados[N].algo ──
                            // Descobrimos o sufixo real de cada campo em vez de supor
                            // ".tipo/.codigo/.quantidade" — cada portal usa um nome.
                            var linhasPorId = function () {
                                var grupos = {};
                                Array.from(doc.querySelectorAll("[id*='procedimentosSolicitados']")).forEach(function (e) {
                                    var mm = (e.id || '').match(/procedimentosSolicitados\[(\d+)\]\.?(.*)$/);
                                    if (!mm) return;
                                    var i = parseInt(mm[1], 10);
                                    grupos[i] = grupos[i] || {};
                                    grupos[i][mm[2] || 'raiz'] = e;
                                });
                                var achar = function (g, re, tag) {
                                    for (var k in g) if (re.test(k) && (!tag || g[k].tagName === tag)) return g[k];
                                    return null;
                                };
                                return Object.keys(grupos).sort(function (a, c) { return a - c; }).map(function (i) {
                                    var g = grupos[i];
                                    var tab = achar(g, /tipo|tabela/i, 'SELECT') || achar(g, /tipo|tabela/i);
                                    var cod = achar(g, /^codigo$|^cod$|codigoproc/i, 'INPUT') || achar(g, /codigo/i, 'INPUT');
                                    var qt = achar(g, /quant|qtd/i, 'INPUT');
                                    var de = achar(g, /desc/i, 'INPUT') || achar(g, /desc/i);
                                    return (cod && qt) ? { tabela: tab, codigo: cod, desc: de, qtd: qt } : null;
                                }).filter(Boolean);
                            };

                            // ── Jeito 2: pelos rótulos das colunas (25-Código, 26-Descrição, 27-Qt.) ──
                            var linhasPorColuna = function () {
                                try {
                                    var selects = Array.from(doc.querySelectorAll('select')).filter(function (s) {
                                        return Array.from(s.options || []).some(function (o) {
                                            return /procedimentos?\s+e\s+eventos/i.test(o.textContent || '');
                                        });
                                    });
                                    if (!selects.length) return [];
                                    var tb = selects[0].closest && selects[0].closest('table');
                                    var mapa = null;
                                    if (tb) {
                                        Array.from(tb.rows || []).forEach(function (tr) {
                                            if (mapa) return;
                                            var t = Array.from(tr.cells || []).map(function (c) {
                                                return (c.textContent || '').replace(/\s+/g, ' ').trim();
                                            });
                                            var onde = function (p) { return t.findIndex(function (x) { return x.indexOf(p) === 0; }); };
                                            var a = onde('25-'), d2 = onde('26-'), q = onde('27-');
                                            if (a >= 0 && q >= 0) mapa = { cod: a, desc: d2, qtd: q };
                                        });
                                    }
                                    if (!mapa) return [];
                                    return selects.map(function (sel) {
                                        var tr = sel.closest('tr');
                                        if (!tr || !tr.cells) return null;
                                        var pega = function (i) {
                                            var cel = tr.cells[i];
                                            return cel ? cel.querySelector('input:not([type=hidden]):not([type=button]):not([type=submit]):not([type=checkbox]):not([type=radio])') : null;
                                        };
                                        var cod = pega(mapa.cod), qt = pega(mapa.qtd);
                                        var de = mapa.desc >= 0 ? pega(mapa.desc) : null;
                                        return (cod && qt && cod !== qt) ? { tabela: sel, codigo: cod, desc: de, qtd: qt } : null;
                                    }).filter(Boolean);
                                } catch (e) { return []; }
                            };

                            var linhas = function () {
                                var a = linhasPorId();
                                return a.length ? a : linhasPorColuna();
                            };

                            var botaoAdicionar = function () {
                                var x = doc.querySelector('#qata-adicionar');
                                if (x && visivel(x)) return x;
                                return Array.from(doc.querySelectorAll('input[type=button],input[type=submit],button,a'))
                                    .find(function (e) {
                                        var t = ((e.value || '') + ' ' + (e.textContent || '')).trim().toLowerCase();
                                        return (t === 'adicionar' || /(^|\s)adicionar(\s|$)/.test(t)) && visivel(e);
                                    });
                            };

                            var escolherTuss = function (sel) {
                                if (!sel) return;
                                if (sel.tagName === 'SELECT') {
                                    var op = Array.from(sel.options).find(function (o) {
                                        return /procedimentos?\s+e\s+eventos/i.test(o.textContent || '')
                                            || /^22\b/.test((o.textContent || '').trim());
                                    });
                                    if (op) {
                                        sel.value = op.value;
                                        sel.dispatchEvent(new Event('input', { bubbles: true }));
                                        sel.dispatchEvent(new Event('change', { bubbles: true }));
                                        try { if (typeof sel.onchange === 'function') sel.onchange(); } catch (e) { }
                                    }
                                } else {
                                    try { sel.click(); } catch (e) { }
                                }
                            };

                            var escrever = function (el, v) {
                                if (!el) return;
                                try { el.focus(); } catch (e) { }
                                try {
                                    var dsc = Object.getOwnPropertyDescriptor(winAlvo.HTMLInputElement.prototype, 'value');
                                    if (dsc && dsc.set) dsc.set.call(el, String(v)); else el.value = v;
                                } catch (e) { el.value = v; }
                                el.dispatchEvent(new Event('input', { bubbles: true }));
                                el.dispatchEvent(new Event('change', { bubbles: true }));
                            };

                            b.onclick = async function () {
                                b.style.background = '#c0392b';
                                b.disabled = true;
                                var feitos = 0;

                                if (!linhas().length) {
                                    b.innerText = '⚠️ Não achei a tabela de procedimentos nesta tela.';
                                    b.style.background = '#f39c12';
                                    b.disabled = false;
                                    return;
                                }

                                while (feitos < 30 && window._sawState.index < window._sawState.codigos.length) {
                                    var cod = window._sawState.codigos[window._sawState.index];
                                    var qtd = window._sawState.counts[cod];
                                    b.innerText = '⏳ ' + (window._sawState.index + 1) + '/' +
                                                  window._sawState.codigos.length + ' — ' + cod;

                                    // Garante uma linha vazia; se acabarem, clica em "Adicionar"
                                    var linha = null, pediu = false;
                                    for (var t = 0; t < 50; t++) {
                                        var todas = linhas();
                                        linha = todas.find(function (l) { return !(l.codigo.value || '').trim(); });
                                        if (linha) break;
                                        if (!pediu) {
                                            var add = botaoAdicionar();
                                            if (!add) break;
                                            b.innerText = '➕ Abrindo mais linhas...';
                                            add.click();
                                            pediu = true;
                                        }
                                        await wait(300);
                                    }
                                    if (!linha) {
                                        b.innerText = '⚠️ Sem linha livre no ' + cod + '. Salve e clique de novo.';
                                        b.style.background = '#f39c12';
                                        b.disabled = false;
                                        return;
                                    }

                                    escolherTuss(linha.tabela);
                                    await wait(250);

                                    escrever(linha.codigo, cod);
                                    try { linha.codigo.blur(); } catch (e) { }
                                    linha.codigo.dispatchEvent(new Event('blur', { bubbles: true }));
                                    linha.codigo.dispatchEvent(new Event('focusout', { bubbles: true }));

                                    // Espera o portal trazer o nome do exame
                                    for (var w2 = 0; w2 < 40; w2++) {
                                        var at = linhas().find(function (l) { return (l.codigo.value || '').trim() === cod; });
                                        if (at) {
                                            linha = at;
                                            if (at.desc && (at.desc.value || '').trim().length > 1) break;
                                        }
                                        await wait(250);
                                    }

                                    escrever(linha.qtd, qtd);
                                    try { linha.qtd.blur(); } catch (e) { }
                                    linha.qtd.dispatchEvent(new Event('blur', { bubbles: true }));

                                    await wait(250);
                                    feitos++;
                                    window._sawState.index++;
                                }

                                if (window._sawState.index < window._sawState.codigos.length) {
                                    b.innerText = '✅ 30 inseridos! Salve e abra uma guia nova.';
                                    b.style.background = '#8e44ad';
                                } else {
                                    b.innerText = '✅ TUDO FINALIZADO! (' + feitos + ' exames)';
                                    b.style.background = '#27ae60';
                                    window._sawGatilho = false;
                                }
                                setTimeout(function () { try { b.remove(); } catch (e) { } }, 9000);
                            };
                        } catch (err) { }
                    }, 1000);
                };

                if (!window._sawOpenHooked) {
                    var origOpen = window.open;
                    window.open = function () {
                        var w = origOpen.apply(this, arguments);
                        if (w && window._sawGatilho) armarBotao(w);
                        return w;
                    };
                    window._sawOpenHooked = true;
                }
                window._sawArmar = armarBotao;

                if (!window._sawListenerAdded) {
                    document.addEventListener('click', function (e) {
                        var a = e.target.closest && e.target.closest('a');
                        if (a && a.target === '_blank' && window._sawGatilho) {
                            e.preventDefault();
                            window.open(a.href);
                        }
                    }, true);
                    window._sawListenerAdded = true;
                }

                // Se a tela de autorização já é ESTA janela, arma nela mesma
                try { armarBotao(window); } catch (e) { }
                try {
                    (window.__crJanelas || []).forEach(function (w) {
                        try { if (w && !w.closed) armarBotao(w); } catch (e) { }
                    });
                } catch (e) { }

                alert("Robô armado! Abra (ou volte para) a janela de autorização e clique no botão laranja \"COLAR CÓDIGOS\".");
            })();
        }
    });

})(window.CentralRobos);
