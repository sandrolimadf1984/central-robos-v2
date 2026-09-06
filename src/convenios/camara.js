/* ============================================================
 *  Câmara dos Deputados
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
        chave: "CAMARA",
        nome: "Câmara dos Deputados",
        tipo: "moldura",
        ativo: true,
        portal: {
            seletores: ["#FormMain"],
            nota: "Formulário Benner do autorizador"
        },
        origem: "central.js v2.1.0, linhas 4031-4170",
        executar: (texto, ctx) => {
            var raw = texto.match(/\b\d{8}\b/g);
            if (!raw) { alert("Nenhum código!"); ctx.fim(); return; }

            // Repetidos viram quantidade; a ordem é a da colagem
            var counts = {};
            raw.forEach(function (c) { counts[c] = (counts[c] || 0) + 1; });
            var unicos = [];
            raw.forEach(function (c) { if (unicos.indexOf(c) === -1) unicos.push(c); });
            var lista = unicos.map(function (k) { return { cod: k, qtd: counts[k] }; });
            var idx = 0;

            var rotulo = function (e) {
                return ((e.innerText || e.textContent || e.value || '') + '').replace(/\s+/g, ' ').trim();
            };
            var digitavel = function (e) {
                var t = (e.getAttribute('type') || 'text').toLowerCase();
                return (t === 'text' || t === '') && !e.disabled && !e.readOnly;
            };

            // Os campos são achados pelo RÓTULO da linha, não por posição na tela
            var campoProcedimento = function (doc) {
                try {
                    var linhas = doc.querySelectorAll('tr');
                    for (var i = 0; i < linhas.length; i++) {
                        var t = (linhas[i].textContent || '').replace(/\s+/g, ' ').trim();
                        if (!/procedimento/i.test(t) || t.length > 140) continue;
                        if (/observa|cód\.?\s*proced/i.test(t)) continue;
                        var ins = Array.prototype.slice.call(linhas[i].querySelectorAll('input')).filter(digitavel);
                        if (ins.length) return ins[0];
                    }
                    var todos = Array.prototype.slice.call(doc.querySelectorAll('input')).filter(digitavel);
                    return todos.length ? todos[0] : null;
                } catch (e) { return null; }
            };

            var campoQuantidade = function (doc) {
                try {
                    var linhas = doc.querySelectorAll('tr');
                    for (var i = 0; i < linhas.length; i++) {
                        var cel = linhas[i].cells;
                        if (!cel) continue;
                        for (var c = 0; c < cel.length; c++) {
                            var t = (cel[c].textContent || '').replace(/\s+/g, ' ').trim();
                            if (!/qtd\.?\s*solic|quantidade/i.test(t) || t.length > 40) continue;
                            for (var k = c; k < cel.length; k++) {
                                var ins = Array.prototype.slice.call(cel[k].querySelectorAll('input')).filter(digitavel);
                                if (ins.length) return ins[0];
                            }
                        }
                    }
                } catch (e) { }
                return null;
            };

            // "Salvar / Novo" nos intermediários e "Salvar" no último
            var botao = function (doc, qual) {
                try {
                    var cand = Array.prototype.slice.call(
                        doc.querySelectorAll('a,button,input[type=button],input[type=submit],nobr'));
                    var achou = null;
                    for (var i = 0; i < cand.length; i++) {
                        var t = rotulo(cand[i]).toLowerCase();
                        if (qual === 'novo') {
                            if (/^salvar\s*\/\s*novo$/.test(t)) { achou = cand[i]; break; }
                        } else {
                            if (t === 'salvar') { achou = cand[i]; break; }
                        }
                    }
                    if (!achou) return null;
                    if (achou.tagName === 'NOBR' && achou.closest && achou.closest('a')) return achou.closest('a');
                    return achou;
                } catch (e) { return null; }
            };

            var escrever = function (el, v) {
                if (!el) return;
                try { el.focus(); } catch (e) { }
                el.value = v;
                try { el.dispatchEvent(new Event('input', { bubbles: true })); } catch (e) { }
                try { el.dispatchEvent(new Event('change', { bubbles: true })); } catch (e) { }
            };

            var esperandoSalvar = false;

            function passo() {
                if (!ctx.ativo()) return;

                if (idx >= lista.length) {
                    ctx.status("✅ TUDO FINALIZADO! " + lista.length + " código(s) lançado(s).");
                    ctx.fim();
                    return;
                }

                var doc = ctx.doc();
                if (!doc) { ctx.timer(setTimeout(passo, 700)); return; }

                var inp = campoProcedimento(doc);
                if (!inp) {
                    ctx.status("⏳ Aguardando a tela da guia...");
                    ctx.timer(setTimeout(passo, 600));
                    return;
                }

                // enquanto a tela ainda mostra o código anterior, esperamos ela voltar
                if ((inp.value || '').trim() !== '') {
                    ctx.timer(setTimeout(passo, 350));
                    return;
                }
                esperandoSalvar = false;

                var item = lista[idx];
                var ehUltimo = (idx === lista.length - 1);
                ctx.status("🚀 Lançando: " + item.cod + (item.qtd > 1 ? " (" + item.qtd + "x)" : "") +
                           " — " + (idx + 1) + "/" + lista.length +
                           (ehUltimo ? "  · último, finaliza em SALVAR" : ""));

                escrever(inp, item.cod);
                var q = campoQuantidade(doc);
                if (q) escrever(q, item.qtd);

                ctx.timer(setTimeout(function () {
                    if (!ctx.ativo()) return;
                    var d2 = ctx.doc();
                    if (!d2) { ctx.timer(setTimeout(passo, 700)); return; }
                    var bt = ehUltimo ? botao(d2, 'salvar') : botao(d2, 'novo');
                    if (!bt) {
                        ctx.status("⚠️ Não achei o botão " + (ehUltimo ? '"Salvar"' : '"Salvar / Novo"') + " — tentando de novo...");
                        ctx.timer(setTimeout(passo, 900));
                        return;
                    }
                    try { bt.click(); } catch (e) { }
                    idx++;
                    esperandoSalvar = true;
                    ctx.timer(setTimeout(passo, 700));
                }, 700));
            }

            ctx.timer(setTimeout(passo, 900));
        }
    });

    CR.registrar({
        chave: "CAMARA_JANELINHA_DESATIVADA",
        nome: "Câmara dos Deputados",
        tipo: "padrao",
        ativo: false,
        origem: "central.js v2.1.0, linhas 3264-3412",
        executar: () => {
            (function () {
                var l = prompt("Cole os códigos de 8 dígitos:");
                if (!l) return;
                var raw = l.match(/\b\d{8}\b/g);
                if (!raw) return alert("Nenhum código!");

                // Repetidos viram quantidade; a ordem é a da colagem
                var counts = {};
                raw.forEach(function (c) { counts[c] = (counts[c] || 0) + 1; });
                var unicos = [];
                raw.forEach(function (c) { if (unicos.indexOf(c) === -1) unicos.push(c); });
                var cods = unicos.map(function (k) { return { cod: k, qtd: counts[k] }; });

                // Janela de controle: a tela da Câmara recarrega a cada "Salvar / Novo",
                // então o robô precisa ficar FORA dela para sobreviver.
                var W = window.open("", "RoboCamara", "width=380,height=260,top=0,left=0");
                if (!W) return alert("ERRO: POPUP BLOQUEADO! Permita popups no navegador.");

                W.document.write("<body style='font-family:sans-serif;text-align:center;background:#eef6ee;padding:18px'>" +
                    "<h3 style='margin:0 0 8px;color:#1e7a3c;'>🏛️ Robô Câmara dos Deputados</h3>" +
                    "<div id='msg' style='font-size:14px;color:#1e7a3c;font-weight:bold;'>Iniciando...</div>" +
                    "<div id='status' style='font-size:12px;color:#666;margin-top:5px'></div>" +
                    "<button onclick='window.close()' style='margin-top:14px;padding:8px 16px;cursor:pointer;" +
                    "background:#c0392b;color:#fff;border:none;border-radius:5px;font-weight:bold;'>PARAR</button></body>");

                var s = W.document.createElement('script');
                s.textContent = `
                    var idx = 0;
                    var lista = ${JSON.stringify(cods)};
                    var msg = document.getElementById('msg');
                    var st  = document.getElementById('status');

                    var rotulo = function (e) {
                        return ((e.innerText || e.textContent || e.value || '') + '')
                            .replace(/\\s+/g, ' ').trim();
                    };
                    var digitavel = function (e) {
                        var t = (e.getAttribute('type') || 'text').toLowerCase();
                        return (t === 'text' || t === '') && !e.disabled && !e.readOnly;
                    };

                    // Os campos são achados pelo RÓTULO da linha, não por posição —
                    // assim continuam funcionando se a tela mudar de lugar.
                    var campoProcedimento = function (doc) {
                        var linhas = doc.querySelectorAll('tr');
                        for (var i = 0; i < linhas.length; i++) {
                            var t = (linhas[i].textContent || '').replace(/\\s+/g, ' ').trim();
                            if (!/procedimento/i.test(t) || t.length > 140) continue;
                            if (/observa|cód\\.?\\s*proced/i.test(t)) continue;
                            var ins = Array.prototype.slice.call(linhas[i].querySelectorAll('input')).filter(digitavel);
                            if (ins.length) return ins[0];
                        }
                        var todos = Array.prototype.slice.call(doc.querySelectorAll('input')).filter(digitavel);
                        return todos.length ? todos[0] : null;
                    };

                    var campoQuantidade = function (doc) {
                        var linhas = doc.querySelectorAll('tr');
                        for (var i = 0; i < linhas.length; i++) {
                            var cel = linhas[i].cells;
                            if (!cel) continue;
                            for (var c = 0; c < cel.length; c++) {
                                var t = (cel[c].textContent || '').replace(/\\s+/g, ' ').trim();
                                if (!/qtd\\.?\\s*solic|quantidade/i.test(t) || t.length > 40) continue;
                                for (var k = c; k < cel.length; k++) {
                                    var ins = Array.prototype.slice.call(cel[k].querySelectorAll('input')).filter(digitavel);
                                    if (ins.length) return ins[0];
                                }
                            }
                        }
                        return null;
                    };

                    // "Salvar / Novo" nos intermediários e "Salvar" no último
                    var botao = function (doc, qual) {
                        var cand = Array.prototype.slice.call(
                            doc.querySelectorAll('a,button,input[type=button],input[type=submit],nobr'));
                        var achou = null;
                        for (var i = 0; i < cand.length; i++) {
                            var t = rotulo(cand[i]).toLowerCase();
                            if (qual === 'novo') {
                                if (/^salvar\\s*\\/\\s*novo$/.test(t)) { achou = cand[i]; break; }
                            } else {
                                if (t === 'salvar') { achou = cand[i]; break; }
                            }
                        }
                        if (!achou) return null;
                        // se o texto estiver dentro de um link, quem responde é o link
                        if (achou.tagName === 'NOBR' && achou.closest && achou.closest('a')) return achou.closest('a');
                        return achou;
                    };

                    var escrever = function (el, v) {
                        if (!el) return;
                        try { el.focus(); } catch (e) { }
                        el.value = v;
                        try { el.dispatchEvent(new Event('input',  { bubbles: true })); } catch (e) { }
                        try { el.dispatchEvent(new Event('change', { bubbles: true })); } catch (e) { }
                    };

                    var esperandoSalvar = false;

                    function passo() {
                        if (idx >= lista.length) {
                            msg.innerHTML = "<b style='color:#1e7a3c'>✅ TUDO FINALIZADO!</b>";
                            st.innerText = lista.length + " código(s) lançado(s)";
                            return;
                        }
                        var doc;
                        try { doc = window.opener.document; }
                        catch (e) { setTimeout(passo, 800); return; }

                        var inp = campoProcedimento(doc);
                        if (!inp) { st.innerText = 'aguardando a tela...'; setTimeout(passo, 600); return; }

                        // enquanto o portal ainda mostra o código anterior, esperamos
                        if (esperandoSalvar) {
                            if ((inp.value || '').trim() !== '') { setTimeout(passo, 300); return; }
                            esperandoSalvar = false;
                        }
                        if ((inp.value || '').trim() !== '') { setTimeout(passo, 400); return; }

                        var item = lista[idx];
                        var ehUltimo = (idx === lista.length - 1);
                        msg.innerText = "🚀 Lançando: " + item.cod + (item.qtd > 1 ? " (" + item.qtd + "x)" : "");
                        st.innerText  = (idx + 1) + " / " + lista.length + (ehUltimo ? "  — último, vai em SALVAR" : "");

                        escrever(inp, item.cod);
                        var q = campoQuantidade(doc);
                        if (q) escrever(q, item.qtd);

                        setTimeout(function () {
                            var d2;
                            try { d2 = window.opener.document; } catch (e) { setTimeout(passo, 800); return; }
                            var bt = ehUltimo ? botao(d2, 'salvar') : botao(d2, 'novo');
                            if (!bt) { st.innerText = '⚠️ não achei o botão Salvar'; setTimeout(passo, 900); return; }
                            try { bt.click(); } catch (e) { }
                            idx++;
                            esperandoSalvar = true;
                            setTimeout(passo, 700);
                        }, 700);
                    }

                    setTimeout(passo, 900);
                `;
                W.document.body.appendChild(s);
            })();
        }
    });

})(window.CentralRobos);
