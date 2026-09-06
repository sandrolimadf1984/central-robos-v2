/* ============================================================
 *  Planassiste MPU
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
        chave: "PLANASSISTE MPU",
        nome: "Planassiste MPU",
        tipo: "moldura",
        ativo: true,
        portal: {
            seletores: ["#CODIGOTABELA_btn"],
            nota: "Botão de busca da tabela de códigos"
        },
        origem: "central.js v2.1.0, linhas 4411-4506",
        executar: (texto, ctx) => {
            var v = texto.match(/\b\d{8}\b/g);
            if (!v) { alert('Nenhum código válido.'); ctx.fim(); return; }
            var cts = {};
            for (var i = 0; i < v.length; i++) { cts[v[i]] = (cts[v[i]] || 0) + 1; }
            var q = [];
            for (var k in cts) { q.push({ c: k, qty: cts[k] }); }
            var id = 0, st = 'tabela';
            ctx.status('Processando ' + q.length + ' códigos únicos...');

            var lp = setInterval(function () {
                if (!ctx.ativo()) { clearInterval(lp); return; }
                var d, cw;
                try { cw = ctx.win(); d = cw.document; } catch (e) { return; }
                if (d.readyState !== 'complete') return;

                if (id >= q.length) {
                    clearInterval(lp);
                    ctx.status('✅ Concluído! O último código foi salvo e a tela finalizada.');
                    ctx.fim();
                    return;
                }

                if (st === 'tabela') {
                    var b = d.querySelector('#CODIGOTABELA_btn');
                    if (b) {
                        if (!cw._hk) {
                            var o = cw.open;
                            cw.open = function (a, x, c) {
                                var w = o.call(cw, a, x, c);
                                var t = setInterval(function () {
                                    try {
                                        var l = null;
                                        var es = w.document.querySelectorAll('a');
                                        for (var i = 0; i < es.length; i++) {
                                            var txt = (es[i].innerText || '').toUpperCase();
                                            if (txt.includes('22 - PROCEDIMENTO') || txt === '22' || txt === '16' || txt.includes('PROCEDIMENTO')) {
                                                l = es[i];
                                                break;
                                            }
                                        }
                                        if (!l) {
                                            l = w.document.querySelector('#FormMain > div > div > div > div > div > div > div > div > div.div_grid > table > tbody > tr:nth-child(6) > td:nth-child(1) > a');
                                        }
                                        if (!l) {
                                            for (var i = 0; i < es.length; i++) {
                                                if ((es[i].innerText || '').includes('TUSS')) { l = es[i]; break; }
                                            }
                                        }
                                        if (l) { l.click(); clearInterval(t); st = 'preencher'; }
                                    } catch (e) { }
                                }, 500);
                                ctx.timer(t);
                                return w;
                            };
                            cw._hk = true;
                            b.click();
                            ctx.status('Aguardando a tabela TUSS...');
                        }
                    } else {
                        st = 'preencher';
                    }
                } else if (st === 'preencher') {
                    var f1 = d.querySelector('#FormMain > table > tbody > tr:nth-child(1) > td:nth-child(4) > table > tbody > tr > td:nth-child(1) > input.frm_field_lkp');
                    var f2 = d.querySelector('#FormMain > table > tbody > tr:nth-child(3) > td:nth-child(2) > table > tbody > tr > td:nth-child(1) > input.frm_field_lkp');
                    var fq = d.querySelector('#FormMain > table > tbody > tr:nth-child(2) > td:nth-child(2) > input');
                    var ult = (id === q.length - 1);
                    var sb = ult
                        ? 'body > table > tbody > tr:nth-child(1) > td > div > table > tbody > tr:nth-child(2) > td > table > tbody > tr > td.StmMain > table > tbody > tr > td > table > tbody > tr > td > table > tbody > tr:nth-child(1) > td > div > div.act_box > div > div > div > div:nth-child(3) > a'
                        : 'body > table > tbody > tr:nth-child(1) > td > div > table > tbody > tr:nth-child(2) > td > table > tbody > tr > td.StmMain > table > tbody > tr > td > table > tbody > tr > td > table > tbody > tr:nth-child(1) > td > div > div.act_box > div > div > div > div:nth-child(2) > a > nobr';
                    var bt = d.querySelector(sb);
                    if (f1 && f2 && bt) {
                        if (cw._wt) return;
                        ctx.status(ult
                            ? ('⏳ Finalizando com: ' + q[id].c + ' (Qtd: ' + q[id].qty + ') - Último!')
                            : ('⏳ Inserindo: ' + q[id].c + ' (Qtd: ' + q[id].qty + ') - ' + (id + 1) + '/' + q.length));
                        f1.value = ''; f1.value = q[id].c;
                        f1.dispatchEvent(new Event('input', { bubbles: true }));
                        f1.dispatchEvent(new Event('change', { bubbles: true }));
                        f2.value = ''; f2.value = 'Exames-Patologia Clínica';
                        f2.dispatchEvent(new Event('input', { bubbles: true }));
                        f2.dispatchEvent(new Event('change', { bubbles: true }));
                        if (fq && q[id].qty > 1) {
                            fq.value = ''; fq.value = q[id].qty;
                            fq.dispatchEvent(new Event('input', { bubbles: true }));
                            fq.dispatchEvent(new Event('change', { bubbles: true }));
                        }
                        cw._wt = true;
                        setTimeout(function () { try { bt.click(); id++; } catch (e) { } }, 800);
                    } else {
                        cw._wt = false;
                    }
                }
            }, 1500);
            ctx.timer(lp);
        }
    });

    CR.registrar({
        chave: "PLANASSISTE MPU",
        nome: "Planassiste MPU",
        tipo: "padrao",
        ativo: false,
        origem: "central.js v2.1.0, linhas 501-622",
        executar: () => {
            (function(){
                if(window.__rob)return;
                window.__rob=true;
                var u=window.location.href;
                document.body.innerHTML='';
                document.head.innerHTML='';
                var ui=document.createElement('div');
                ui.style='height:120px;background:#e9ecef;padding:10px;font-family:Arial;box-sizing:border-box;overflow:hidden;border-bottom:3px solid #0056b3;';
                ui.innerHTML='<h3 style="margin:0 0 5px 0;color:#333;">🤖 Robô Automático (Agrupamento Ativo)</h3><textarea id="rc" placeholder="Cole os códigos (8 dígitos...)" style="width:300px;height:70px;vertical-align:top;border:1px solid #ccc;padding:5px;"></textarea><button id="rb" style="height:70px;padding:0 20px;margin-left:10px;background:#28a745;color:white;font-weight:bold;border:none;border-radius:5px;cursor:pointer;vertical-align:top;font-size:14px;">INICIAR MÁQUINA</button><button id="rx" style="height:70px;padding:0 20px;margin-left:10px;background:#dc3545;color:white;font-weight:bold;border:none;border-radius:5px;cursor:pointer;vertical-align:top;font-size:14px;">PARAR E FECHAR</button><span id="rs" style="margin-left:15px;font-weight:bold;color:#333;font-size:16px;">Aguardando...</span>';
                document.body.appendChild(ui);
                var frm=document.createElement('iframe');
                frm.id='sf';frm.src=u;frm.style='width:100%;height:calc(100vh - 120px);border:none;';
                document.body.appendChild(frm);
                document.body.style.margin='0';
                document.body.style.overflow='hidden';
                var q=[],id=0,st='tabela',lp=null;
                
                document.getElementById('rx').onclick=function(){
                    clearInterval(lp);window.__rob=false;ui.remove();frm.style.height='100vh';
                };
                
                document.getElementById('rb').onclick=function(){
                    var v=document.getElementById('rc').value.match(/\b\d{8}\b/g);
                    if(!v)return alert('Nenhum código válido.');
                    var cts={};
                    for(var i=0;i<v.length;i++){cts[v[i]]=(cts[v[i]]||0)+1;}
                    q=[];
                    for(var k in cts){q.push({c:k,qty:cts[k]});}
                    id=0;st='tabela';
                    document.getElementById('rs').innerText='Processando '+q.length+' códigos únicos...';
                    this.disabled=true;document.getElementById('rc').disabled=true;
                    lp=setInterval(rl,1500);
                };
                
                function rl(){
                    var d,cw;
                    try{cw=document.getElementById('sf').contentWindow;d=cw.document;}catch(e){return;}
                    if(d.readyState!=='complete')return;
                    
                    if(id>=q.length){
                        clearInterval(lp);
                        document.getElementById('rs').innerText='✅ Concluído! O último código foi salvo e a tela finalizada.';
                        document.getElementById('rs').style.color='#28a745';
                        return;
                    }
                    
                    if(st==='tabela'){
                        var b=d.querySelector('#CODIGOTABELA_btn');
                        if(b){
                            if(!cw._hk){
                                var o=cw.window.open;
                                cw.window.open=function(a,x,c){
                                    var w=o.call(cw,a,x,c);
                                    var t=setInterval(function(){
                                        try{
                                            var l=null;
                                            var es=w.document.querySelectorAll('a');
                                            
                                            for(var i=0;i<es.length;i++){
                                                var txt=(es[i].innerText||'').toUpperCase();
                                                if(txt.includes('22 - PROCEDIMENTO') || txt === '22' || txt === '16' || txt.includes('PROCEDIMENTO')){
                                                    l=es[i];
                                                    break;
                                                }
                                            }
                                            
                                            if(!l){
                                                l=w.document.querySelector('#FormMain > div > div > div > div > div > div > div > div > div.div_grid > table > tbody > tr:nth-child(6) > td:nth-child(1) > a');
                                            }
                                            
                                            if(!l){
                                                for(var i=0;i<es.length;i++){
                                                    if((es[i].innerText||'').includes('TUSS')){
                                                        l=es[i];
                                                        break;
                                                    }
                                                }
                                            }
                                            
                                            if(l){
                                                l.click();
                                                clearInterval(t);
                                                st='preencher';
                                            }
                                        }catch(e){}},500);
                                    return w;
                                };
                                cw._hk=true;
                                b.click();
                                document.getElementById('rs').innerText='Aguardando a tabela TUSS...';
                            }
                        }else{
                            st='preencher';
                        }
                    }else if(st==='preencher'){
                        var f1=d.querySelector('#FormMain > table > tbody > tr:nth-child(1) > td:nth-child(4) > table > tbody > tr > td:nth-child(1) > input.frm_field_lkp');
                        var f2=d.querySelector('#FormMain > table > tbody > tr:nth-child(3) > td:nth-child(2) > table > tbody > tr > td:nth-child(1) > input.frm_field_lkp');
                        var fq=d.querySelector('#FormMain > table > tbody > tr:nth-child(2) > td:nth-child(2) > input');
                        var ult=(id===q.length-1);
                        var sb=ult?'body > table > tbody > tr:nth-child(1) > td > div > table > tbody > tr:nth-child(2) > td > table > tbody > tr > td.StmMain > table > tbody > tr > td > table > tbody > tr > td > table > tbody > tr:nth-child(1) > td > div > div.act_box > div > div > div > div:nth-child(3) > a':'body > table > tbody > tr:nth-child(1) > td > div > table > tbody > tr:nth-child(2) > td > table > tbody > tr > td.StmMain > table > tbody > tr > td > table > tbody > tr > td > table > tbody > tr:nth-child(1) > td > div > div.act_box > div > div > div > div:nth-child(2) > a > nobr';
                        var bt=d.querySelector(sb);
                        if(f1&&f2&&bt){
                            if(cw._wt)return;
                            document.getElementById('rs').innerText=ult?('⏳ Finalizando com: '+q[id].c+' (Qtd: '+q[id].qty+') - Último!'):('⏳ Inserindo: '+q[id].c+' (Qtd: '+q[id].qty+') - '+(id+1)+'/'+q.length);
                            f1.value='';f1.value=q[id].c;
                            f1.dispatchEvent(new Event('input',{bubbles:true}));f1.dispatchEvent(new Event('change',{bubbles:true}));
                            f2.value='';f2.value='Exames-Patologia Clínica';
                            f2.dispatchEvent(new Event('input',{bubbles:true}));f2.dispatchEvent(new Event('change',{bubbles:true}));
                            if(fq&&q[id].qty>1){
                                fq.value='';fq.value=q[id].qty;
                                fq.dispatchEvent(new Event('input',{bubbles:true}));fq.dispatchEvent(new Event('change',{bubbles:true}));
                            }
                            cw._wt=true;
                            setTimeout(function(){bt.click();id++;},800);
                        }else{
                            cw._wt=false;
                        }
                    }
                }
            })();
        }
    });

})(window.CentralRobos);
