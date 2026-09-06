/* ============================================================
 *  TST
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
        chave: "TST",
        nome: "TST",
        tipo: "padrao",
        ativo: true,
        portal: {
            seletores: ["input[value=\"Adicionar Procedimento\"]"],
            nota: "Botão \"Adicionar Procedimento\" (a tela recarrega a cada item)"
        },
        origem: "central.js v2.1.0, linhas 1332-1346",
        executar: () => {
            (function () {
                var b = document.createElement("button");
                b.innerText = "⚖️ ROBÔ EQUILIBRADO (TUSS 16)";
                b.style = "position:fixed;top:10px;left:50%;transform:translateX(-50%);padding:15px;background:#008b8b;color:white;font-weight:bold;border:3px solid white;z-index:9999999;box-shadow:0 0 20px #000;cursor:pointer;border-radius:8px;font-family:monospace;font-size:14px;";
                b.onclick = function () {
                    var w = window.open("", "RoboSafe", "width=400,height=600");
                    if (!w) { alert('O navegador bloqueou a janelinha de controle.\nPermita pop-ups para este site e clique de novo.'); return; }
                    var h = `<html><head><title>Robô Equilibrado</title><style>body{background:#111;color:#fff;font-family:sans-serif;padding:10px}textarea{width:100%;height:150px;background:#222;color:#0f0;border:1px solid #555;font-family:monospace}button{width:100%;padding:10px;margin-top:10px;cursor:pointer;font-weight:bold}.g{background:#0d0;color:#000}.r{background:#f33;color:#fff}#l{margin-top:10px;height:300px;overflow-y:auto;background:#000;border:1px solid #444;font-family:monospace;font-size:11px;padding:5px}</style></head><body><h3>⚖️ Robô TUSS (Estável)</h3><p>Cole a lista:</p><textarea id="t"></textarea><button id="bIni" class="g" onclick="go()">▶ INICIAR</button><button id="bPar" class="r" style="display:none" onclick="stop()">⏹ PARAR</button><div id="l"></div> <script> var r=false,idx=0,lst=[],win=window.opener; function log(m){ var d=document.createElement("div"); d.innerText="["+new Date().toLocaleTimeString()+"] "+m; document.getElementById("l").prepend(d) } function modo(rodando){var i=document.getElementById("bIni"),p=document.getElementById("bPar"),t=document.getElementById("t");if(i)i.style.display=rodando?"none":"block";if(p)p.style.display=rodando?"block":"none";if(t)t.disabled=rodando;}function stop(){r=false;modo(false);log("PARADO.")} function go(){ var v=document.getElementById("t").value; var raw=v.match(/\\b\\d{8}\\b/g); if(!raw)return alert("Sem códigos!"); var counts={}; raw.forEach(x=>counts[x]=(counts[x]||0)+1); var unicos=[...new Set(raw)]; var order=unicos.filter(c=>counts[c]===1).concat(unicos.filter(c=>counts[c]>1)); lst=order.map(k=>({cod:k,qtd:counts[k]})); if(!win||win.closed)return alert("Janela principal fechada!"); r=true;idx=0;modo(true);log("Iniciando "+lst.length+" itens...");loop() } async function waitEl(sel,timeout=5000){ var t=0; while(t<timeout){ if(!r)throw new Error("Parado"); var el=win.document.querySelector(sel); if(el&&el.offsetParent!==null)return el; await new Promise(x=>setTimeout(x,200)); t+=200 } throw new Error("Timeout: "+sel) } async function pause(ms){await new Promise(x=>setTimeout(x,ms))} async function loop(){ if(!r)return; if(idx>=lst.length){r=false;modo(false);log("✅ FIM! "+lst.length+" itens lançados.");return alert("FIM!")} var item=lst[idx],c=item.cod,q=item.qtd; log("Item "+(idx+1)+": "+c+(q>1?" (Qtd: "+q+")":"")); try{ log("Aguardando botão..."); await waitEl("input[value='Adicionar Procedimento']",10000); await pause(500); var b1=win.document.querySelector("input[value='Adicionar Procedimento']")||win.document.querySelector("input[name='adicionarProcedimento']"); b1.click(); var fixo=await waitEl("#noreset_txCodTabela"); await pause(500); fixo.value="16"; fixo.dispatchEvent(new win.Event('change',{bubbles:true})); fixo.dispatchEvent(new win.Event('blur',{bubbles:true})); try{win.$(fixo).trigger('change')}catch(e){} var inp=await waitEl("#codItemProcedimento"); await pause(300); inp.value=c; inp.dispatchEvent(new win.Event('change',{bubbles:true})); inp.dispatchEvent(new win.Event('blur',{bubbles:true})); var qtd=win.document.getElementById("procedimento.numQtdSolicitada"); if(qtd){ qtd.value=q; qtd.dispatchEvent(new win.Event('input',{bubbles:true})); qtd.dispatchEvent(new win.Event('change',{bubbles:true})); } await pause(500); var b2=await waitEl(".ui-dialog-buttonpane button:nth-child(2)"); if(!b2.innerText.includes("Salvar")&&!b2.innerText.includes("Confirmar")){ var bs=win.document.querySelectorAll("button"); for(var b of bs)if(b.innerText.includes("Salvar"))b2=b } b2.click(); log("Salvo! Aguardando..."); idx++; await pause(1500); loop() }catch(e){ log("ERRO: "+e.message); r=false; modo(false); alert("Erro: "+e.message) } } <\/script></body></html>`;
                    w.document.write(h);
                    this.remove()
                };
                document.body.appendChild(b);
            })();
        }
    });

    CR.registrar({
        chave: "TST_DESATIVADO_MOLDURA",
        nome: "TST",
        tipo: "moldura",
        ativo: false,
        origem: "central.js v2.1.0, linhas 4336-4409",
        executar: (texto, ctx) => {
            var raw = texto.match(/\b\d{8}\b/g);
            if (!raw) { alert("Sem códigos!"); ctx.fim(); return; }
            var counts = {};
            raw.forEach(x => counts[x] = (counts[x] || 0) + 1);
            var unicos = [...new Set(raw)];
            var order = unicos.filter(c => counts[c] === 1).concat(unicos.filter(c => counts[c] > 1));
            var lst = order.map(k => ({ cod: k, qtd: counts[k] }));
            var idx = 0;

            const pausa = ms => new Promise(r => setTimeout(r, ms));

            async function esperarEl(sel, limite) {
                var t = 0;
                limite = limite || 5000;
                while (t < limite) {
                    if (!ctx.ativo()) throw new Error("Parado");
                    var el = ctx.doc().querySelector(sel);
                    if (el && el.offsetParent !== null) return el;
                    await pausa(200);
                    t += 200;
                }
                throw new Error("Timeout: " + sel);
            }

            (async function loop() {
                while (idx < lst.length) {
                    if (!ctx.ativo()) return;
                    var item = lst[idx], c = item.cod, q = item.qtd;
                    ctx.status("Item " + (idx + 1) + "/" + lst.length + ": " + c + (q > 1 ? " (Qtd: " + q + ")" : ""));
                    try {
                        await esperarEl("input[value='Adicionar Procedimento']", 10000);
                        await pausa(500);
                        var d = ctx.doc();
                        var w = ctx.win();
                        var b1 = d.querySelector("input[value='Adicionar Procedimento']") || d.querySelector("input[name='adicionarProcedimento']");
                        b1.click();
                        var fixo = await esperarEl("#noreset_txCodTabela");
                        await pausa(500);
                        fixo.value = "16";
                        fixo.dispatchEvent(new w.Event('change', { bubbles: true }));
                        fixo.dispatchEvent(new w.Event('blur', { bubbles: true }));
                        try { w.$(fixo).trigger('change'); } catch (e) { }
                        var inp = await esperarEl("#codItemProcedimento");
                        await pausa(300);
                        inp.value = c;
                        inp.dispatchEvent(new w.Event('change', { bubbles: true }));
                        inp.dispatchEvent(new w.Event('blur', { bubbles: true }));
                        var qtd = ctx.doc().getElementById("procedimento.numQtdSolicitada");
                        if (qtd) {
                            qtd.value = q;
                            qtd.dispatchEvent(new w.Event('input', { bubbles: true }));
                            qtd.dispatchEvent(new w.Event('change', { bubbles: true }));
                        }
                        await pausa(500);
                        var b2 = await esperarEl(".ui-dialog-buttonpane button:nth-child(2)");
                        if (!b2.innerText.includes("Salvar") && !b2.innerText.includes("Confirmar")) {
                            var bs = ctx.doc().querySelectorAll("button");
                            for (var bb of bs) if (bb.innerText.includes("Salvar")) b2 = bb;
                        }
                        b2.click();
                        ctx.status("Salvo! Aguardando...");
                        idx++;
                        await pausa(1500);
                    } catch (e) {
                        ctx.status("ERRO: " + e.message);
                        if (e.message !== "Parado") alert("Erro: " + e.message);
                        return;
                    }
                }
                ctx.status("✅ FIM!");
                ctx.fim();
            })();
        }
    });

})(window.CentralRobos);
