/* ============================================================
 *  TRF
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
        chave: "TRF",
        nome: "TRF",
        tipo: "moldura",
        ativo: true,
        portal: {
            seletores: ["#FormMain"],
            nota: "Formulário Benner do autorizador"
        },
        origem: "central.js v2.1.0, linhas 4171-4332",
        executar: (texto, ctx) => {
            var cods = texto.match(/\b\d{8}\b/g);
            if (!cods) { alert("Nenhum código!"); ctx.fim(); return; }
            var counts = {};
            cods.forEach(function (c) { counts[c] = (counts[c] || 0) + 1; });
            var unicos = [...new Set(cods)];
            var lista = unicos.filter(function (c) { return counts[c] === 1; })
                .concat(unicos.filter(function (c) { return counts[c] > 1; }));
            var selCod = "#FormMain > table > tbody > tr:nth-child(2) > td:nth-child(2) > table > tbody > tr > td:nth-child(1) > input.frm_field_lkp";
            var sel22 = "#FormMain > table > tbody > tr:nth-child(1) > td:nth-child(4) > table > tbody > tr > td:nth-child(1) > input.frm_field_lkp";
            var selFrase = "#FormMain > table > tbody > tr:nth-child(2) > td:nth-child(4) > table > tbody > tr > td:nth-child(1) > input.frm_field_lkp";
            var selQtd = "#FormMain > table > tbody > tr:nth-child(3) > td:nth-child(2) > input";
            var selBtnSalvar = "body > table > tbody > tr:nth-child(1) > td > div > table > tbody > tr:nth-child(2) > td > table > tbody > tr > td:nth-child(2) > table > tbody > tr > td > table > tbody > tr > td > table > tbody > tr:nth-child(1) > td > div > div.act_box > div > div > div > div:nth-child(2) > a";
            var selBtnFinalizar = "body > table > tbody > tr:nth-child(1) > td > div > table > tbody > tr:nth-child(2) > td > table > tbody > tr > td:nth-child(2) > table > tbody > tr > td > table > tbody > tr > td > table > tbody > tr:nth-child(1) > td > div > div.act_box > div > div > div > div:nth-child(3) > a";
            var selErro = "#tsk_toolbar";
            var idx = 0;

            // Acha os botões pelo TEXTO, não pela posição. Antes o robô contava
            // a posição na tela e no último código clicava no botão errado —
            // por isso o último exame ficava sem salvar.
            var textoDe = e => ((e.innerText || e.textContent || e.value || '') + '')
                .replace(/\s+/g, ' ').trim().toLowerCase();
            var acharBotao = function (d, qual) {
                try {
                    var cand = Array.from(d.querySelectorAll('a,button,input[type=button],input[type=submit],nobr'));
                    if (qual === 'novo') {
                        return cand.find(e => /^salvar\s*\/\s*novo$/.test(textoDe(e)))
                            || cand.find(e => textoDe(e).indexOf('salvar') === 0 && textoDe(e).indexOf('novo') > -1)
                            || d.querySelector(selBtnSalvar);
                    }
                    return cand.find(e => textoDe(e) === 'salvar')
                        || cand.find(e => textoDe(e).indexOf('salvar') === 0 && textoDe(e).indexOf('novo') === -1)
                        || d.querySelector(selBtnFinalizar);
                } catch (e) { return null; }
            };
            // Se o alvo for um <nobr> dentro do link, clica no link
            var clicar = function (el) {
                if (!el) return false;
                var alvo = (el.tagName === 'NOBR' && el.closest('a')) ? el.closest('a') : el;
                try { alvo.click(); return true; } catch (e) { return false; }
            };
            // O portal reclama de duas formas: no rodapé ("Verifique...") e ao lado
            // do campo Item de custo ("Registro não encontrado").
            var temErro = function (d) {
                try {
                    var t = d.body ? (d.body.innerText || d.body.textContent || '') : '';
                    return /verifique\s+mensagens|registro\s+n[ãa]o\s+encontrado/i.test(t);
                } catch (e) { return false; }
            };

            function proximoPasso() {
                if (!ctx.ativo()) return;
                if (idx >= lista.length) {
                    ctx.status("✅ TUDO FINALIZADO!");
                    ctx.fim();
                    return;
                }
                try {
                    var doc = ctx.doc();
                    var inp = doc.querySelector(selCod);
                    var erro = doc.querySelector(selErro);
                    var ehUltimo = (idx === lista.length - 1);

                    if ((erro && erro.innerText.includes("Verifique")) || temErro(doc)) {
                        ctx.status("⚠️ Corrigindo o Item de custo do " + lista[idx] + " (trocando para \"Exame\")");
                        var f = doc.querySelector(selFrase);
                        if (f) {
                            f.value = "Exame";
                            f.dispatchEvent(new Event('input', { bubbles: true }));
                            f.dispatchEvent(new Event('change', { bubbles: true }));
                            erro.innerText = "AGUARDANDO SISTEMA...";
                            setTimeout(function () {
                                if (!ctx.ativo()) return;
                                var d2 = ctx.doc();
                                var btn = ehUltimo ? acharBotao(d2, 'salvar') : acharBotao(d2, 'novo');
                                clicar(btn);
                                var checarVazio = setInterval(function () {
                                    if (!ctx.ativo()) { clearInterval(checarVazio); return; }
                                    try {
                                        var docAtual = ctx.doc();
                                        var inpAtual = docAtual.querySelector(selCod);
                                        if (ehUltimo || (inpAtual && inpAtual.value === "")) {
                                            clearInterval(checarVazio);
                                            idx++;
                                            setTimeout(proximoPasso, 300);
                                        }
                                    } catch (e) { }
                                }, 250);
                                ctx.timer(checarVazio);
                            }, 500);
                        }
                        return;
                    }

                    var codAtual = lista[idx];
                    var qtdAtual = counts[codAtual];

                    if (!inp || inp.value !== "") {
                        setTimeout(proximoPasso, 500);
                        return;
                    }

                    ctx.status("🚀 Lançando: " + codAtual + " (" + qtdAtual + "x) — " + (idx + 1) + "/" + lista.length);
                    inp.value = codAtual;
                    inp.dispatchEvent(new Event('input', { bubbles: true }));
                    inp.dispatchEvent(new Event('change', { bubbles: true }));

                    var f22 = doc.querySelector(sel22);
                    if (f22) {
                        f22.value = "22";
                        f22.dispatchEvent(new Event('input', { bubbles: true }));
                        f22.dispatchEvent(new Event('change', { bubbles: true }));
                    }

                    var fFrase = doc.querySelector(selFrase);
                    if (fFrase) {
                        fFrase.value = "Exames-Patologia Clínica";
                        fFrase.dispatchEvent(new Event('input', { bubbles: true }));
                        fFrase.dispatchEvent(new Event('change', { bubbles: true }));
                    }

                    var inpQtd = doc.querySelector(selQtd);
                    if (inpQtd) {
                        inpQtd.value = qtdAtual;
                        inpQtd.dispatchEvent(new Event('input', { bubbles: true }));
                        inpQtd.dispatchEvent(new Event('change', { bubbles: true }));
                    }

                    setTimeout(function () {
                        if (!ctx.ativo()) return;
                        var d2 = ctx.doc();
                        var btn = ehUltimo ? acharBotao(d2, 'salvar') : acharBotao(d2, 'novo');
                        clicar(btn);
                        var checarVazio = setInterval(function () {
                            if (!ctx.ativo()) { clearInterval(checarVazio); return; }
                            try {
                                var docAtual = ctx.doc();
                                var erroAtual = docAtual.querySelector(selErro);
                                if ((erroAtual && erroAtual.innerText.includes("Verifique")) || temErro(docAtual)) {
                                    clearInterval(checarVazio);
                                    setTimeout(proximoPasso, 300);
                                    return;
                                }
                                var inpAtual = docAtual.querySelector(selCod);
                                // No último código, esperamos o formulário sumir ou limpar —
                                // é o sinal de que o registro foi mesmo salvo.
                                var salvouUltimo = ehUltimo && (!inpAtual || inpAtual.value === "");
                                if (salvouUltimo || (!ehUltimo && inpAtual && inpAtual.value === "")) {
                                    clearInterval(checarVazio);
                                    idx++;
                                    setTimeout(proximoPasso, 300);
                                }
                            } catch (erroInterno) { }
                        }, 250);
                        ctx.timer(checarVazio);
                    }, 500);
                } catch (e) {
                    setTimeout(proximoPasso, 1000);
                }
            }
            setTimeout(proximoPasso, 1000);
        }
    });

    CR.registrar({
        chave: "TRF",
        nome: "TRF",
        tipo: "padrao",
        ativo: false,
        origem: "central.js v2.1.0, linhas 1898-2046",
        executar: () => {
            (function () {
                var l = prompt("Cole os códigos de 8 dígitos:");
                if (!l) return;
                var cods = l.match(/\b\d{8}\b/g);
                if (!cods) return alert("Nenhum código!");
                var counts = {};
                cods.forEach(function (c) {
                    counts[c] = (counts[c] || 0) + 1;
                });
                var unicos = [...new Set(cods)];
                var uniqueCods = unicos.filter(function (c) {
                    return counts[c] === 1;
                }).concat(unicos.filter(function (c) {
                    return counts[c] > 1;
                }));
                
                var W = window.open("", "RoboExames", "width=350,height=280");
                if (!W) return alert("ERRO: POPUP BLOQUEADO! Permita popups no navegador.");
                
                W.document.write("<body style='font-family:sans-serif;text-align:center;background:#f0f7ff;padding:20px'><h3>🤖 Robô TRF (Sincronizado)</h3><div id='msg' style='font-size:14px;color:#0056b3;font-weight:bold;'>Iniciando...</div><div id='status' style='font-size:12px;color:#666;margin-top:5px'></div><button onclick='window.close()' style='margin-top:15px;padding:8px;cursor:pointer;background:#ff4757;color:white;border:none;border-radius:5px;font-weight:bold;'>PARAR</button></body>");
                
                var s = W.document.createElement('script');
                s.textContent = `
                    var idx = 0;
                    var lista = ${JSON.stringify(uniqueCods)};
                    var qtds = ${JSON.stringify(counts)};
                    var msg = document.getElementById('msg');
                    var st = document.getElementById('status');
                    var selCod = "#FormMain > table > tbody > tr:nth-child(2) > td:nth-child(2) > table > tbody > tr > td:nth-child(1) > input.frm_field_lkp";
                    var sel22 = "#FormMain > table > tbody > tr:nth-child(1) > td:nth-child(4) > table > tbody > tr > td:nth-child(1) > input.frm_field_lkp";
                    var selFrase = "#FormMain > table > tbody > tr:nth-child(2) > td:nth-child(4) > table > tbody > tr > td:nth-child(1) > input.frm_field_lkp";
                    var selQtd = "#FormMain > table > tbody > tr:nth-child(3) > td:nth-child(2) > input";
                    var selBtnSalvar = "body > table > tbody > tr:nth-child(1) > td > div > table > tbody > tr:nth-child(2) > td > table > tbody > tr > td:nth-child(2) > table > tbody > tr > td > table > tbody > tr > td > table > tbody > tr:nth-child(1) > td > div > div.act_box > div > div > div > div:nth-child(2) > a";
                    var selBtnFinalizar = "body > table > tbody > tr:nth-child(1) > td > div > table > tbody > tr:nth-child(2) > td > table > tbody > tr > td:nth-child(2) > table > tbody > tr > td > table > tbody > tr > td > table > tbody > tr:nth-child(1) > td > div > div.act_box > div > div > div > div:nth-child(3) > a";
                    var selErro = "#tsk_toolbar";
                    function proximoPasso() {
                        if(idx >= lista.length) {
                            msg.innerHTML = "<b style='color:green'>✅ TUDO FINALIZADO!</b>";
                            st.innerText = "";
                            return;
                        }
                        
                        try {
                            var doc = window.opener.document;
                            var inp = doc.querySelector(selCod);
                            var erro = doc.querySelector(selErro);
                            var ehUltimo = (idx === lista.length - 1);
                            
                            if (erro && erro.innerText.includes("Verifique")) {
                                msg.innerText = "⚠️ Corrigindo erro no " + lista[idx];
                                var f = doc.querySelector(selFrase);
                                if(f) {
                                    f.value = "Exame";
                                    f.dispatchEvent(new Event('input', {bubbles:true}));
                                    f.dispatchEvent(new Event('change', {bubbles:true}));
                                    
                                    erro.innerText = "AGUARDANDO SISTEMA...";
                                     
                                    setTimeout(function(){
                                        var btn = ehUltimo ? doc.querySelector(selBtnFinalizar) : doc.querySelector(selBtnSalvar);
                                        if(btn) btn.click();
                                        
                                        var checarVazio = setInterval(function() {
                                            try {
                                                var docAtual = window.opener.document;
                                                var inpAtual = docAtual.querySelector(selCod);
                                                
                                                if (ehUltimo || (inpAtual && inpAtual.value === "")) {
                                                    clearInterval(checarVazio);
                                                    idx++;
                                                    setTimeout(proximoPasso, 300); 
                                                }
                                            } catch(e) {}
                                        }, 250);
                                    }, 500);
                                }
                                return; 
                            }
                            
                            var codAtual = lista[idx];
                            var qtdAtual = qtds[codAtual];
                            
                            if (!inp || inp.value !== "") {
                                setTimeout(proximoPasso, 500);
                                return;
                            }
                            
                            msg.innerText = "🚀 Lançando: " + codAtual + " (" + qtdAtual + "x)";
                            st.innerText = (idx + 1) + " / " + lista.length;
                            inp.value = codAtual;
                            inp.dispatchEvent(new Event('input', {bubbles:true}));
                            inp.dispatchEvent(new Event('change', {bubbles:true}));
                            
                            var f22 = doc.querySelector(sel22);
                            if(f22) {
                                f22.value = "22";
                                f22.dispatchEvent(new Event('input', {bubbles:true}));
                                f22.dispatchEvent(new Event('change', {bubbles:true}));
                            }
                            
                            var fFrase = doc.querySelector(selFrase);
                            if(fFrase) {
                                fFrase.value = "Exames-Patologia Clínica";
                                fFrase.dispatchEvent(new Event('input', {bubbles:true}));
                                fFrase.dispatchEvent(new Event('change', {bubbles:true}));
                            }
                            
                            var inpQtd = doc.querySelector(selQtd);
                            if(inpQtd) {
                                inpQtd.value = qtdAtual;
                                inpQtd.dispatchEvent(new Event('input', {bubbles:true}));
                                inpQtd.dispatchEvent(new Event('change', {bubbles:true}));
                            }
                            
                            setTimeout(function(){
                                var btn = ehUltimo ? doc.querySelector(selBtnFinalizar) : doc.querySelector(selBtnSalvar);
                                if(btn) btn.click();
                                
                                var checarVazio = setInterval(function() {
                                    try {
                                        var docAtual = window.opener.document;
                                        var erroAtual = docAtual.querySelector(selErro);
                                        
                                        if (erroAtual && erroAtual.innerText.includes("Verifique")) {
                                            clearInterval(checarVazio);
                                            setTimeout(proximoPasso, 300);
                                            return;
                                        }
                                        
                                        var inpAtual = docAtual.querySelector(selCod);
                                        if (ehUltimo || (inpAtual && inpAtual.value === "")) {
                                            clearInterval(checarVazio);
                                            idx++;
                                            setTimeout(proximoPasso, 300); 
                                        }
                                    } catch(erroInterno) {}
                                }, 250);
                            }, 500);
                        } catch(e) {
                            setTimeout(proximoPasso, 1000);
                        }
                    }
                    
                    setTimeout(proximoPasso, 1000);
                `;
                W.document.body.appendChild(s);
            })();
        }
    });

})(window.CentralRobos);
