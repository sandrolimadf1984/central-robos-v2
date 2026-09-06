/* ============================================================
 *  TRT
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
        chave: "TRT",
        nome: "TRT",
        tipo: "padrao",
        ativo: true,
        portal: {
            seletores: ["#termoCodigoSolicitado", "#termoQtdSolicitada"],
            nota: "Campos de código e quantidade"
        },
        origem: "central.js v2.1.0, linhas 2047-2151",
        executar: () => {
            (function () {
                if (document.getElementById('g-painel')) return;
                const d = document.createElement('div');
                d.id = 'g-painel';
                d.style.cssText = 'position:fixed;top:10px;right:10px;width:300px;background:#2d3436;color:#fff;padding:15px;z-index:999999;border-radius:8px;font-family:Arial;box-shadow:0 4px 10px rgba(0,0,0,0.5);border:3px solid #0984e3';
                d.innerHTML = `
                    <h3 style="margin:0 0 10px;color:#74b9ff">🤖 Inserir Códigos TRT</h3>
                    <textarea id="g-txt" style="width:100%;height:80px;color:#000;border-radius:4px;padding:5px;" placeholder="Cole os códigos aqui..."></textarea>
                    <button id="g-btn" style="width:100%;padding:10px;background:#0984e3;color:#fff;border:none;border-radius:5px;cursor:pointer;margin-top:5px;font-weight:bold">INICIAR ▶</button>
                    <div id="g-status" style="margin-top:10px;font-size:12px;color:#dfe6e9">Aguardando...</div>
                    <button onclick="this.parentElement.remove()" style="width:100%;padding:5px;margin-top:10px;background:#d63031;color:#fff;border:none;border-radius:5px;cursor:pointer;font-weight:bold;">❌ FECHAR</button>
                `;
                document.body.appendChild(d);
                
                const wait = ms => new Promise(r => setTimeout(r, ms));
                
                document.getElementById('g-btn').onclick = async () => {
                    const t = document.getElementById('g-txt').value;
                    let raw = t.match(/\b\d{8}\b/g) || [];
                    if (!raw.length) return alert('Nenhum código de 8 dígitos encontrado!');
                    
                    var counts = {};
                    raw.forEach(x => counts[x] = (counts[x] || 0) + 1);
                    var unicos = [...new Set(raw)];
                    var order = unicos.filter(c => counts[c] === 1).concat(unicos.filter(c => counts[c] > 1));
                    var codigos = order.map(k => ({ cod: k, qtd: counts[k] }));
                    const status = document.getElementById('g-status');
                    document.getElementById('g-btn').disabled = true;
                    const setVal = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set;
                    
                    for (let i = 0; i < codigos.length; i++) {
                        let item = codigos[i];
                        let c = item.cod;
                        let q = item.qtd;
                        
                        status.innerText = `Processando ${i + 1}/${codigos.length}: ${c} (Qtd: ${q})`;
                        
                        let inp = document.querySelector('#termoCodigoSolicitado');
                        if (inp) {
                            inp.focus();
                            setVal.call(inp, '');
                            inp.dispatchEvent(new Event('input', { bubbles: true }));
                            await wait(300);
                            setVal.call(inp, c);
                            inp.dispatchEvent(new Event('input', { bubbles: true }));
                            inp.dispatchEvent(new Event('change', { bubbles: true }));
                            await wait(500);
                        }
                        
                        if (q > 1) {
                            let inpQtd = document.querySelector('#termoQtdSolicitada');
                            if (inpQtd) {
                                inpQtd.focus();
                                setVal.call(inpQtd, q);
                                inpQtd.dispatchEvent(new Event('input', { bubbles: true }));
                                inpQtd.dispatchEvent(new Event('change', { bubbles: true }));
                                await wait(300);
                            }
                        }
                        let inpng = document.querySelector('#termoSolicitado > div > div > div.ng-input > input[type=text]');
                        if (inpng) {
                            inpng.click();
                            inpng.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
                            await wait(300);
                            inpng.click();
                            inpng.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
                            await wait(300);
                            inpng.click();
                            inpng.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
                            await wait(500);
                            // Prefere clicar na opção que contém ESTE código. O Enter escolhe
                            // a opção destacada, que pode ser de outro exame.
                            let opcTRT = null;
                            for (let t = 0; t < 12; t++) {
                                opcTRT = Array.from(document.querySelectorAll('.ng-option, ng-dropdown-panel [role="option"], [role="option"]'))
                                    .find(o => (o.innerText || o.textContent || '').includes(c));
                                if (opcTRT) break;
                                await wait(200);
                            }
                            if (opcTRT) {
                                try { opcTRT.scrollIntoView({ block: 'center' }); } catch (e) { }
                                opcTRT.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));
                                opcTRT.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
                                opcTRT.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
                                opcTRT.dispatchEvent(new MouseEvent('click', { bubbles: true }));
                            } else {
                                inpng.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', keyCode: 13, bubbles: true }));
                            }
                        }
                        
                        await wait(1000);
                        
                        let btn = document.querySelector('app-autorizacao-modal app-aut-honorarios fieldset main form section button');
                        if (btn) {
                            btn.click();
                        } else {
                            console.log('Botão adicionar não encontrado.');
                        }
                    }
                    status.innerText = '✅ Concluído!';
                    document.getElementById('g-btn').disabled = false;
                };
            })();
        }
    });

})(window.CentralRobos);
