/* ============================================================
 *  Plenum
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
        chave: "PLENUM",
        nome: "Plenum",
        tipo: "padrao",
        ativo: true,
        portal: {
            seletores: ["#codProc", "#qtde"],
            nota: "Campos de código e quantidade"
        },
        origem: "central.js v2.1.0, linhas 623-736",
        executar: () => {
            (function () {
                if (document.getElementById('painel-plenum')) return;
                const painel = document.createElement('div');
                painel.id = 'painel-plenum';
                painel.style.cssText = `
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    width: 300px;
                    background: #2c3e50;
                    color: #ecf0f1;
                    padding: 15px;
                    border-radius: 8px;
                    z-index: 2147483647;
                    font-family: Arial, sans-serif;
                    box-shadow: 0 4px 15px rgba(0,0,0,0.5);
                    border: 2px solid #9b59b6;
                `;
                painel.innerHTML = `
                    <h3 style="margin: 0 0 10px 0; color: #9b59b6; text-align: center;">🤖 Lançador PLENUM</h3>
                    <textarea id="plenum-txt" style="width: 100%; height: 80px; margin-bottom: 10px; border-radius: 4px; padding: 5px; color: #000; box-sizing: border-box;" placeholder="Cole os códigos aqui..."></textarea>
                    <button id="plenum-btn" style="width: 100%; padding: 10px; background: #27ae60; color: white; border: none; border-radius: 4px; font-weight: bold; cursor: pointer; margin-bottom: 5px;">▶ INICIAR (TURBO)</button>
                    <div id="plenum-status" style="font-size: 12px; color: #bdc3c7; text-align: center; margin-bottom: 5px;">Aguardando...</div>
                    <button id="plenum-fechar" style="width: 100%; padding: 8px; background: #c0392b; color: white; border: none; border-radius: 4px; font-weight: bold; cursor: pointer;">❌ FECHAR</button>
                `;
                document.body.appendChild(painel);

                const wait = ms => new Promise(r => setTimeout(r, ms));

                document.getElementById('plenum-fechar').onclick = () => painel.remove();

                document.getElementById('plenum-btn').onclick = async () => {
                    const txt = document.getElementById('plenum-txt').value;
                    let raw = txt.match(/\b\d{8}\b/g);
                    
                    if (!raw || raw.length === 0) {
                        alert("Nenhum código válido encontrado!");
                        return;
                    }

                    if (raw.length > 50) {
                        alert("⚠️ Limite de segurança ativado! Como você colou mais de 50 códigos, o sistema processará apenas os primeiros 50 itens para evitar travamentos.");
                        raw = raw.slice(0, 50);
                    }

                    document.getElementById('plenum-btn').disabled = true;
                    const status = document.getElementById('plenum-status');

                    const counts = {};
                    raw.forEach(x => counts[x] = (counts[x] || 0) + 1);
                    const unicos = [...new Set(raw)];
                    const order = unicos.filter(c => counts[c] === 1).concat(unicos.filter(c => counts[c] > 1));
                    const codigos = order.map(k => ({ cod: k, qtd: counts[k] }));

                    const setVal = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')?.set;

                    for (let i = 0; i < codigos.length; i++) {
                        let item = codigos[i];
                        status.innerText = `⚡ Processando ${i + 1}/${codigos.length}: ${item.cod} (Qtd: ${item.qtd})`;

                        let inptCod = document.querySelector('#codProc');
                        if (inptCod) {
                            inptCod.focus();
                            if (setVal) setVal.call(inptCod, item.cod);
                            else inptCod.value = item.cod;
                            
                            inptCod.dispatchEvent(new Event('input', { bubbles: true }));
                            inptCod.dispatchEvent(new Event('change', { bubbles: true }));
                            await wait(50); 
                        }

                        let btnAlteraQtd = document.querySelector('#formContainer > div:nth-child(2) > div:nth-child(2) > div.col-xs-2.col-md-2 > div > div > input.btn.btn-primary');
                        if (btnAlteraQtd) {
                            btnAlteraQtd.focus();
                            btnAlteraQtd.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
                            btnAlteraQtd.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
                            btnAlteraQtd.click();
                            await wait(300); 
                        }

                        let inptQtd = document.querySelector('#qtde');
                        if (inptQtd) {
                            inptQtd.focus();
                            if (setVal) setVal.call(inptQtd, item.qtd);
                            else inptQtd.value = item.qtd;
                            
                            inptQtd.dispatchEvent(new Event('input', { bubbles: true }));
                            inptQtd.dispatchEvent(new Event('change', { bubbles: true }));
                            await wait(50); 
                        }

                        let inptDesc = document.querySelector('#descProc');
                        if (inptDesc) {
                            inptDesc.focus();
                            inptDesc.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
                            inptDesc.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
                            inptDesc.click();
                            await wait(350); 
                        }

                        let btnIncluir = document.querySelector('#btnIncluiProc');
                        if (btnIncluir) {
                            btnIncluir.click();
                            await wait(400); 
                        }
                    }

                    status.innerText = "✅ Finalizado!";
                    document.getElementById('plenum-btn').disabled = false;
                    alert("Todos os códigos foram processados com sucesso no modo Turbo!");
                };
            })();
        }
    });

})(window.CentralRobos);
