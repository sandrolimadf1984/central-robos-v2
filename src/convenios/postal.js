/* ============================================================
 *  Postal (Correios)
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
        chave: "POSTAL",
        nome: "Postal (Correios)",
        tipo: "moldura",
        ativo: true,
        portal: {
            seletores: ["#FormMain"],
            nota: "Formulário Benner do autorizador"
        },
        origem: "central.js v2.1.0, linhas 3967-4029",
        executar: (texto, ctx) => {
            var raw = texto.match(/\b\d{8}\b/g);
            if (!raw) { alert("Sem códigos!"); ctx.fim(); return; }
            var counts = {};
            raw.forEach(x => counts[x] = (counts[x] || 0) + 1);
            var unicos = [...new Set(raw)];
            var order = unicos.filter(c => counts[c] === 1).concat(unicos.filter(c => counts[c] > 1));
            var lista = order.map(k => ({ cod: k, qtd: counts[k] }));
            var selInp = "#FormMain > table > tbody > tr:nth-child(1) > td.frm_cell_field > table > tbody > tr > td:nth-child(1) > input.frm_field_lkp_big";
            var selQtd = "#FormMain > table > tbody > tr:nth-child(3) > td:nth-child(4) > input";
            var selBtn = "body > table > tbody > tr:nth-child(1) > td > div > table > tbody > tr:nth-child(2) > td > table > tbody > tr > td:nth-child(2) > table > tbody > tr > td > table > tbody > tr > td > table > tbody > tr:nth-child(1) > td > div > div.act_box > div > div > div > div:nth-child(2) > a > nobr";
            var selBtnFinalizar = "body > table > tbody > tr:nth-child(1) > td > div > table > tbody > tr:nth-child(2) > td > table > tbody > tr > td:nth-child(2) > table > tbody > tr > td > table > tbody > tr > td > table > tbody > tr:nth-child(1) > td > div > div.act_box > div > div > div > div:nth-child(3) > a";
            var idx = 0;
            var t = setInterval(function () {
                if (!ctx.ativo()) { clearInterval(t); return; }
                if (idx >= lista.length) {
                    clearInterval(t);
                    ctx.status("✅ FIM DO LOTE!");
                    ctx.fim();
                    return;
                }
                try {
                    var doc = ctx.doc();
                    var inp = doc.querySelector(selInp);
                    if (inp && inp.value == "") {
                        var item = lista[idx];
                        var c = item.cod;
                        var q = item.qtd;
                        var ehUltimo = (idx === lista.length - 1);
                        ctx.status("Lançando: " + c + " (" + (idx + 1) + "/" + lista.length + ")" + (q > 1 ? " Qtd: " + q : ""));
                        inp.focus();
                        inp.value = c;
                        inp.dispatchEvent(new Event('input', { bubbles: true }));
                        inp.dispatchEvent(new Event('change', { bubbles: true }));
                        if (q > 1) {
                            var qInp = doc.querySelector(selQtd);
                            if (qInp) {
                                qInp.value = q;
                                qInp.dispatchEvent(new Event('input', { bubbles: true }));
                                qInp.dispatchEvent(new Event('change', { bubbles: true }));
                            }
                        }
                        setTimeout(function () {
                            if (!ctx.ativo()) return;
                            try {
                                var d2 = ctx.doc();
                                var btn = ehUltimo ? d2.querySelector(selBtnFinalizar) : d2.querySelector(selBtn);
                                if (btn) {
                                    btn.click();
                                    idx++;
                                    ctx.status(ehUltimo ? "Finalizando lote..." : "Salvando... aguarde.");
                                } else {
                                    ctx.status("ERRO: Botão sumiu!");
                                }
                            } catch (e) { }
                        }, 800);
                    }
                } catch (e) {
                    ctx.status("Aguardando página...");
                }
            }, 1500);
            ctx.timer(t);
        }
    });

    CR.registrar({
        chave: "POSTAL",
        nome: "Postal (Correios)",
        tipo: "padrao",
        ativo: false,
        origem: "central.js v2.1.0, linhas 1347-1418",
        executar: () => {
            (function () {
                var l = prompt("Cole os códigos de 8 dígitos:");
                if (!l) return;
                var raw = l.match(/\b\d{8}\b/g);
                if (!raw) return alert("Sem códigos!");
                var counts = {};
                raw.forEach(x => counts[x] = (counts[x] || 0) + 1);
                var unicos = [...new Set(raw)];
                var order = unicos.filter(c => counts[c] === 1).concat(unicos.filter(c => counts[c] > 1));
                var cods = order.map(k => ({ cod: k, qtd: counts[k] }));
                var W = window.open("", "RoboCtrl", "width=350,height=200,top=0,left=0");
                if (!W) return alert("ERRO: POPUP BLOQUEADO! Permita popups no navegador.");
                W.document.write("<body style='font-family:Arial;text-align:center;background:#eee'><h3>🤖 Robô Automático</h3><div id='msg' style='font-size:14px;margin:10px'>Iniciando...</div><button onclick='window.close()' style='padding:10px;background:red;color:white;border:none'>PARAR</button></body>");
                var s = W.document.createElement('script');
                s.textContent = `
                    var idx=0;
                    var lista=${JSON.stringify(cods)};
                    var mainWin=window.opener;
                    var selInp="#FormMain > table > tbody > tr:nth-child(1) > td.frm_cell_field > table > tbody > tr > td:nth-child(1) > input.frm_field_lkp_big";
                    var selQtd="#FormMain > table > tbody > tr:nth-child(3) > td:nth-child(4) > input";
                    var selBtn="body > table > tbody > tr:nth-child(1) > td > div > table > tbody > tr:nth-child(2) > td > table > tbody > tr > td:nth-child(2) > table > tbody > tr > td > table > tbody > tr > td > table > tbody > tr:nth-child(1) > td > div > div.act_box > div > div > div > div:nth-child(2) > a > nobr";
                    // NO BOTÃO DE FINALIZAR ADICIONADO AQUI
                    var selBtnFinalizar="body > table > tbody > tr:nth-child(1) > td > div > table > tbody > tr:nth-child(2) > td > table > tbody > tr > td:nth-child(2) > table > tbody > tr > td > table > tbody > tr > td > table > tbody > tr:nth-child(1) > td > div > div.act_box > div > div > div > div:nth-child(3) > a";
                    
                    setInterval(function(){
                        if(idx>=lista.length){
                            document.getElementById('msg').innerHTML="<b style='color:green'>FIM DO LOTE!</b>";
                            return;
                        }
                        try{
                            var doc=mainWin.document;
                            var inp=doc.querySelector(selInp);
                            if(inp&&inp.value==""){
                                var item=lista[idx];
                                var c=item.cod;
                                var q=item.qtd;
                                var ehUltimo = (idx === lista.length - 1); // VERIFICA SE É O ÚLTIMO
                                
                                document.getElementById('msg').innerText="Lançando: "+c+" ("+(idx+1)+"/"+lista.length+")"+(q>1?" Qtd: "+q:"");
                                inp.focus();
                                inp.value=c;
                                inp.dispatchEvent(new Event('input',{bubbles:true}));
                                inp.dispatchEvent(new Event('change',{bubbles:true}));
                                if(q>1){
                                    var qInp=doc.querySelector(selQtd);
                                    if(qInp){
                                        qInp.value=q;
                                        qInp.dispatchEvent(new Event('input',{bubbles:true}));
                                        qInp.dispatchEvent(new Event('change',{bubbles:true}));
                                    }
                                }
                                setTimeout(function(){
                                    // SE FOR O ÚLTIMO, PEGA O BOTÃO DE FINALIZAR. SE NÃO, PEGA O NORMAL.
                                    var btn = ehUltimo ? doc.querySelector(selBtnFinalizar) : doc.querySelector(selBtn);
                                    if(btn){
                                        btn.click();
                                        idx++;
                                        document.getElementById('msg').innerText = ehUltimo ? "Finalizando lote..." : "Salvando... aguarde.";
                                    }else{
                                        document.getElementById('msg').innerText="ERRO: Botão sumiu!";
                                    }
                                },800);
                            }
                        }catch(e){
                            document.getElementById('msg').innerText="Aguardando página...";
                        }
                    },1500);
                `;
                W.document.body.appendChild(s);
            })();
        }
    });

})(window.CentralRobos);
