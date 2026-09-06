/* ============================================================
 *  Assefaz e compartilhados
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
        chave: "ASSEFAZ",
        nome: "Assefaz e compartilhados",
        tipo: "padrao",
        ativo: true,
        portal: {
            seletores: ["#incluirProcedimento"],
            nota: "Botão de incluir procedimento"
        },
        origem: "central.js v2.1.0, linhas 3085-3259",
        executar: () => {
            (async function(){
                var origAlert=window.alert;
                window.alert=function(){console.log("Alert bloqueado");};
                var l=prompt("Cole os códigos de 8 dígitos para ASSEFAZ:");
                if(!l){window.alert=origAlert;return;}
                var raw=l.match(/\b\d{8}\b/g);
                if(!raw){window.alert=origAlert;origAlert("Sem códigos válidos!");return;}
                var counts={};
                raw.forEach(x=>counts[x]=(counts[x]||0)+1);
                var unicos=[...new Set(raw)];
                var codigos=unicos.map(k=>({cod:k,qtd:counts[k]}));
                const wait=ms=>new Promise(r=>setTimeout(r,ms));
                const painel=document.createElement('div');
                painel.style.cssText='position:fixed;top:10px;right:10px;background:#c0392b;color:#fff;padding:15px;z-index:999999;border-radius:8px;border:3px solid #922b21;font-family:Arial;box-shadow:0 4px 10px rgba(0,0,0,0.5);';
                painel.innerHTML='<h3 style="margin:0 0 10px;color:#fff;">🔥 Robô ASSEFAZ (V4 - Estabilizador)</h3><div id="assefaz-status" style="font-size:13px;">Acelerando...</div>';
                document.body.appendChild(painel);
                const status=document.getElementById('assefaz-status');
                const checkModal=async()=>{
                    let modalHandled=false;
                    while(true){
                        let mBtn=document.querySelector('#msn-procedimento-modal > div > div > div.modal-footer > button');
                        let modal=document.getElementById('msn-procedimento-modal');
                        if(mBtn&&mBtn.offsetParent!==null){
                            status.innerText='⚠️ Destruindo Modal...';
                            mBtn.click();
                            if(typeof window.$!=='undefined'){
                                try{window.$('#msn-procedimento-modal').modal('hide');}catch(e){}
                            }
                            await wait(100);
                            if(modal)modal.style.display='none';
                            document.querySelectorAll('.modal-backdrop').forEach(el=>el.remove());
                            document.body.classList.remove('modal-open');
                            await wait(400);
                            modalHandled=true;
                        }else{
                            break;
                        }
                    }
                    if(modalHandled){
                        status.innerText='⏳ Estabilizando sistema...';
                        await wait(800);
                    }
                    return modalHandled;
                };
                for(let i=0;i<codigos.length;i++){
                    let item=codigos[i];
                    let c=item.cod;
                    let q=item.qtd;
                    status.innerText=`Processando ${c} (${i+1}/${codigos.length})`;
                    await checkModal();
                    let inpCod=null;
                    let inps=Array.from(document.querySelectorAll('#registroProcedimentoCodigo input, input#registroProcedimentoCodigo'));
                    inpCod=inps.find(el=>el.offsetParent!==null&&!el.disabled);
                    if(!inpCod){
                        let btnIncluir=null;
                        for(let k=0;k<100;k++){
                            await checkModal();
                            let btns=Array.from(document.querySelectorAll('#incluirProcedimento'));
                            btnIncluir=btns.find(b=>b.offsetParent!==null);
                            if(btnIncluir)break;
                            await wait(5);
                        }
                        if(btnIncluir){
                            btnIncluir.click();
                            for(let k=0;k<100;k++){
                                inps=Array.from(document.querySelectorAll('#registroProcedimentoCodigo input, input#registroProcedimentoCodigo'));
                                inpCod=inps.find(el=>el.offsetParent!==null&&!el.disabled);
                                if(inpCod)break;
                                await wait(5);
                            }
                        }
                    }
                    if(!inpCod){
                        status.innerText=`⚠️ Campo ausente ${c}`;
                        await wait(500);
                        continue;
                    }
                    inpCod.blur();
                    await wait(50);
                    inpCod.focus();
                    let setVal=Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype,'value');
                    if(setVal&&setVal.set)setVal.set.call(inpCod,"");else inpCod.value="";
                    inpCod.dispatchEvent(new Event('input',{bubbles:true}));
                    inpCod.dispatchEvent(new Event('change',{bubbles:true}));
                    if(typeof window.$!=='undefined'){
                        try{window.$(inpCod).val('').trigger('input').trigger('change');}catch(e){}
                    }
                    await wait(200);
                    if(setVal&&setVal.set)setVal.set.call(inpCod,c);else inpCod.value=c;
                    inpCod.dispatchEvent(new Event('input',{bubbles:true}));
                    inpCod.dispatchEvent(new Event('change',{bubbles:true}));
                    inpCod.dispatchEvent(new KeyboardEvent('keyup',{key:c.charAt(c.length-1),bubbles:true}));
                    if(typeof window.$!=='undefined'){
                        try{window.$(inpCod).val(c).trigger('input').trigger('change').trigger('keyup');}catch(e){}
                    }
                    let dropItem=null;
                    for(let k=0;k<1500;k++){
                        if(await checkModal())break;
                        let drops=Array.from(document.querySelectorAll('ul[id^="ui-id-"]'));
                        // Espera a lista aparecer JÁ COM OPÇÕES. Só checar se ela
                        // existe não basta: entre uma busca e outra ela fica na
                        // página vazia, e o robô escolhia antes das opções chegarem.
                        let menuVisivel=drops.find(el=>el.offsetParent!==null&&el.querySelector('li'));
                        if(menuVisivel){dropItem=menuVisivel;break;}
                        await wait(1);
                    }
                    // Prefere clicar no item da lista que contém ESTE código.
                    // O Enter escolhe o item destacado, que pode ser de outro exame.
                    let itemCerto=null;
                    if(dropItem){
                        itemCerto=Array.from(dropItem.querySelectorAll('li,a,div'))
                            .find(el=>(el.innerText||el.textContent||'').includes(c));
                    }
                    if(itemCerto){
                        try{itemCerto.scrollIntoView({block:'center'});}catch(e){}
                        itemCerto.dispatchEvent(new MouseEvent('mouseover',{bubbles:true}));
                        itemCerto.dispatchEvent(new MouseEvent('mousedown',{bubbles:true}));
                        itemCerto.dispatchEvent(new MouseEvent('mouseup',{bubbles:true}));
                        itemCerto.dispatchEvent(new MouseEvent('click',{bubbles:true}));
                    }else{
                    inpCod.dispatchEvent(new KeyboardEvent('keydown',{key:'Enter',keyCode:13,bubbles:true}));
                    inpCod.dispatchEvent(new KeyboardEvent('keypress',{key:'Enter',keyCode:13,bubbles:true}));
                    inpCod.dispatchEvent(new KeyboardEvent('keyup',{key:'Enter',keyCode:13,bubbles:true}));
                    }
                    if(typeof window.$!=='undefined'){
                        try{window.$(inpCod).trigger(window.$.Event('keydown',{keyCode:13})).trigger(window.$.Event('keypress',{keyCode:13})).trigger(window.$.Event('keyup',{keyCode:13}));}catch(e){}
                    }
                    await wait(20);
                    await checkModal();
                    let inpQtd=null;
                    for(let k=0;k<200;k++){
                        let qtds=Array.from(document.querySelectorAll('#registroProcedimentoQuantidade input, input#registroProcedimentoQuantidade, #registroProcedimentoQuantidade > input'));
                        inpQtd=qtds.find(el=>el.offsetParent!==null&&!el.disabled);
                        if(inpQtd)break;
                        await wait(5);
                    }
                    if(inpQtd){
                        inpQtd.blur();
                        await wait(20);
                        inpQtd.focus();
                        if(setVal&&setVal.set)setVal.set.call(inpQtd,"");else inpQtd.value="";
                        inpQtd.dispatchEvent(new Event('input',{bubbles:true}));
                        await wait(50);
                        if(setVal&&setVal.set)setVal.set.call(inpQtd,q);else inpQtd.value=q;
                        inpQtd.dispatchEvent(new Event('input',{bubbles:true}));
                        inpQtd.dispatchEvent(new Event('change',{bubbles:true}));
                        inpQtd.dispatchEvent(new KeyboardEvent('keyup',{key:q.toString().slice(-1),bubbles:true}));
                        if(typeof window.$!=='undefined'){
                            try{window.$(inpQtd).val(q).trigger('input').trigger('change').trigger('keyup');}catch(e){}
                        }
                        await wait(50);
                    }
                    let btnConfirmar=null;
                    for(let k=0;k<100;k++){
                        let confirms=Array.from(document.querySelectorAll('#confirmarEdicaoDeProcedimento'));
                        btnConfirmar=confirms.find(b=>b.offsetParent!==null);
                        if(btnConfirmar)break;
                        await wait(1);
                    }
                    if(btnConfirmar){
                        btnConfirmar.click();
                        for(let k=0;k<300;k++){
                            if(await checkModal())break;
                            if(btnConfirmar.offsetParent===null)break;
                            await wait(5);
                        }
                    }
                    await checkModal();
                }
                status.innerText='✅ Finalizado!';
                window.alert=origAlert;
                setTimeout(()=>painel.remove(),3000);
            })();
        }
    });

})(window.CentralRobos);
