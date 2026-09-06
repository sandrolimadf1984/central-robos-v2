/* ============================================================
 *  Affego
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
        chave: "AFFEGO",
        nome: "Affego",
        tipo: "padrao",
        ativo: true,
        portal: {
            seletores: ["#adicionaPROCEDIMENTO"],
            nota: "Botão \"Adicionar procedimento\" do portal Affego"
        },
        origem: "central.js v2.1.0, linhas 3681-3783",
        executar: () => {
            (async function () {
                var l = prompt("Cole os códigos de 8 dígitos aqui:");
                if (!l) return;
                var raw = l.match(/\b\d{8}\b/g);
                if (!raw) return alert("Sem códigos!");
                var counts = {};
                raw.forEach(x => counts[x] = (counts[x] || 0) + 1);
                var unicos = [...new Set(raw)];
                var order = unicos.filter(c => counts[c] === 1).concat(unicos.filter(c => counts[c] > 1));
                
                const wait = ms => new Promise(r => setTimeout(r, ms));
                let idTela = 0; 
                for (let i = 0; i < order.length; i++) {
                    if (idTela === 5) {
                        idTela++; // Pula o campo 5
                    }
                    let cod = order[i];
                    let qtd = counts[cod];
                    let idCod = "#procedimento" + idTela;
                    let idDesc = "#desc_procedimento" + idTela;
                    let idQtd = "#quantidade" + idTela;
                    let inpt = document.querySelector(idCod);
                    
                    if (!inpt) {
                        let btnAdd = document.querySelector("#adicionaPROCEDIMENTO");
                        if (!btnAdd) {
                            let tags = Array.from(document.querySelectorAll('a, button, span, div'));
                            btnAdd = tags.find(e => e.textContent && e.textContent.includes('Adicionar Procedimento'));
                        }
                        
                        if (btnAdd) {
                            btnAdd.scrollIntoView({ block: 'center' });
                            btnAdd.click();
                            
                            // Espera agressiva (rápida)
                            for(let w = 0; w < 40; w++) {
                                 await wait(100);
                                inpt = document.querySelector(idCod);
                                if (inpt) break;
                            }
                            await wait(200); // tempo mínimo pro JS da tela plugar os eventos
                        }
                    }
                    if (inpt) {
                        inpt.scrollIntoView({ block: 'center' });
                        inpt.focus();
                        inpt.value = cod;
                        inpt.dispatchEvent(new Event('input', { bubbles: true }));
                        inpt.dispatchEvent(new Event('change', { bubbles: true }));
                        
                        inpt.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', keyCode: 9, bubbles: true }));
                        inpt.blur();
                        inpt.dispatchEvent(new Event('focusout', { bubbles: true }));
                        await wait(300); // Reduzido
                        // PREENCHE A QUANTIDADE SE FOR MAIOR QUE 1
                        if (qtd > 1) {
                            let fQtd = document.querySelector(idQtd);
                            if (fQtd) {
                                fQtd.focus();
                                fQtd.value = qtd;
                                fQtd.dispatchEvent(new Event('input', { bubbles: true }));
                                fQtd.dispatchEvent(new Event('change', { bubbles: true }));
                                await wait(100);
                            }
                        }
                        let desc = document.querySelector(idDesc); 
                        if(desc) {
                            desc.focus();
                            desc.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
                            desc.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
                            desc.click();
                            
                            // Polling rápido para o auto-complete
                            for(let t = 0; t < 40; t++) {
                                let txt = desc.value || desc.innerText || desc.textContent || "";
                                if(txt.trim() !== "") break;
                                 await wait(100);
                            }
                        }
                        
                        await wait(200); // Reduzido
                        // Clique preventivo para a próxima linha
                        if (idTela >= 4 && i < order.length - 1) {
                            let btnAdd = document.querySelector("#adicionaPROCEDIMENTO");
                            if (!btnAdd) {
                                let tags = Array.from(document.querySelectorAll('a, button, span, div'));
                                btnAdd = tags.find(e => e.textContent && e.textContent.includes('Adicionar Procedimento'));
                            }
                            if (btnAdd) {
                                btnAdd.click();
                                await wait(300); 
                            }
                        }
                        idTela++; 
                    } else {
                         alert("Erro: O campo " + idCod + " não apareceu. Parei aqui.");
                         break;
                    }
                }
                alert("Finalizado! Foram inseridos " + order.length + " códigos únicos na AFFEGO.");
            })();
        }
    });

})(window.CentralRobos);
