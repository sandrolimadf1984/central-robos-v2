/* ============================================================
 *  TRE
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
        chave: "TRE",
        nome: "TRE",
        tipo: "padrao",
        ativo: true,
        portal: {
            seletores: ["#HandleTermo"],
            nota: "Campo #HandleTermo (portal igual ao da PM desde ago/2026)"
        },
        origem: "central.js v2.1.0, linhas 739-805",
        executar: () => {
            (function () {
                if (window._b403tre) return;
                window._b403tre = 1;
                let t = prompt("Cole os códigos de 8 dígitos:");
                if (!t) { window._b403tre = 0; return; }
                let m = t.match(/\b\d{8}\b/g) || [];
                if (!m.length) { window._b403tre = 0; return; }
                let counts = {};
                m.forEach(x => counts[x] = (counts[x] || 0) + 1);
                let unicos = [...new Set(m)];
                let order = unicos.filter(c => counts[c] === 1).concat(unicos.filter(c => counts[c] > 1));
                let a = order.map(k => ({ cod: k, qtd: counts[k] }));
                let i = 0;
                const run = () => {
                    if (i >= a.length) {
                        alert("Finalizado");
                        window._b403tre = 0;
                        return;
                    }
                    let f = document.querySelector("#HandleTermo");
                    if (!f) { setTimeout(run, 50); return; }
                    let item = a[i], v = item.cod;
                    f.focus();
                    f.value = v;
                    f.dispatchEvent(new Event("input", { bubbles: true }));
                    f.dispatchEvent(new Event("change", { bubbles: true }));
                    f.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", keyCode: 13, which: 13, bubbles: true }));
                    let c = setInterval(() => {
                        if (f.value !== v) {
                            clearInterval(c);
                            if (item.qtd > 1) {
                                let tries = 0;
                                let qCheck = setInterval(() => {
                                    // Prefere o bloco que contém ESTE código; o índice do laço
                                    // erra a linha se o portal reordenar ou pular algum item.
                                    let inputQtd = null;
                                    for (const bloco of document.querySelectorAll("#stepDadosSolicitacaoForm > bc-guia-eventos-exibicao-termos-selecionados > div > div.ng-scope")) {
                                        if ((bloco.innerText || bloco.textContent || '').includes(v)) {
                                            const qq = bloco.querySelector('div.form-group > div.size-1.no-rpadding > input');
                                            if (qq) { inputQtd = qq; break; }
                                        }
                                    }
                                    let inputs = document.querySelectorAll("#stepDadosSolicitacaoForm > bc-guia-eventos-exibicao-termos-selecionados > div > div.ng-scope > div.form-group > div.size-1.no-rpadding > input");
                                    if (!inputQtd) inputQtd = inputs[i];
                                    if (inputQtd) {
                                        clearInterval(qCheck);
                                        inputQtd.value = item.qtd;
                                        inputQtd.dispatchEvent(new Event("input", { bubbles: true }));
                                        inputQtd.dispatchEvent(new Event("change", { bubbles: true }));
                                        i++;
                                        run();
                                    } else {
                                        tries++;
                                        if (tries > 20) { clearInterval(qCheck); i++; run(); }
                                    }
                                }, 250);
                            } else {
                                i++;
                                run();
                            }
                        }
                    }, 50);
                };
                run();
            })();
        }
    });

    CR.registrar({
        chave: "TRE_MODELO_ANTIGO_DESATIVADO",
        nome: "TRE",
        tipo: "padrao",
        ativo: false,
        origem: "central.js v2.1.0, linhas 806-865",
        executar: () => {
            (async function () {
                const inputStr = prompt("Cole os códigos de 8 dígitos:");
                if (!inputStr) return;
                const rawCodes = inputStr.match(/\b\d{8}\b/g);
                if (!rawCodes || rawCodes.length === 0) {
                    alert("Nenhum código válido encontrado.");
                    return;
                }
                const codeCounts = {};
                for (const c of rawCodes) {
                    codeCounts[c] = (codeCounts[c] || 0) + 1;
                }
                const uniqueCodes = Object.keys(codeCounts);
                const delay = ms => new Promise(res => setTimeout(res, ms));
                for (let i = 0; i < uniqueCodes.length; i++) {
                    const code = uniqueCodes[i];
                    const count = codeCounts[code];
                    const inputField = document.querySelector('#principal > form > table:nth-child(15) > tbody > tr:nth-child(2) > td:nth-child(2) > input[type=input]');
                    if (!inputField) {
                        alert("Campo não encontrado.");
                        return;
                    }
                    inputField.focus();
                    inputField.value = code;
                    inputField.dispatchEvent(new Event('input', { bubbles: true }));
                    inputField.dispatchEvent(new Event('change', { bubbles: true }));
                    inputField.blur();
                    inputField.dispatchEvent(new Event('focusout', { bubbles: true }));
                    document.body.click();
                    await delay(2000);
                    // Prefere a linha que realmente contém ESTE código. A linha fixa
                    // (nth-child(2)) pega sempre a primeira do resultado, que pode ser
                    // outro exame quando a busca devolve mais de um.
                    let radioBtn = null;
                    for (const tr of document.querySelectorAll('#procedimentosPesquisados > tbody > tr')) {
                        if ((tr.innerText || tr.textContent || '').includes(code)) {
                            const r = tr.querySelector('input[type=radio]');
                            if (r) { radioBtn = r; break; }
                        }
                    }
                    if (!radioBtn) radioBtn = document.querySelector('#procedimentosPesquisados > tbody > tr:nth-child(2) > td:nth-child(1) > input[type=radio]');
                    if (radioBtn) radioBtn.click();
                    await delay(500);
                    const qtdField = document.querySelector('#quantidadeProcedimento');
                    if (qtdField) {
                        qtdField.focus();
                        qtdField.value = count.toString();
                        qtdField.dispatchEvent(new Event('input', { bubbles: true }));
                        qtdField.dispatchEvent(new Event('change', { bubbles: true }));
                        qtdField.blur();
                    }
                    const addBtn = document.querySelector('#principal > form > table:nth-child(21) > tbody > tr:nth-child(7) > td > input:nth-child(1)');
                    if (addBtn) addBtn.click();
                    await delay(1500);
                    inputField.value = "";
                }
                alert("Concluído! Foram inseridos " + uniqueCodes.length + " códigos únicos (Total de itens contados: " + rawCodes.length + ").");
            })();
        }
    });

})(window.CentralRobos);
