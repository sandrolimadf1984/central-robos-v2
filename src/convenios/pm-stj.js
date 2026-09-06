/* ============================================================
 *  PM / STJ / Camed
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
        chave: "PM/STJ",
        nome: "PM / STJ / Camed",
        tipo: "padrao",
        ativo: true,
        portal: {
            seletores: ["#HandleTermo"],
            nota: "Campo #HandleTermo do autorizador"
        },
        origem: "central.js v2.1.0, linhas 1214-1280",
        executar: () => {
            (function () {
                if (window._b403) return;
                window._b403 = 1;
                let t = prompt("Cole os códigos de 8 dígitos:");
                if (!t) { window._b403 = 0; return; }
                let m = t.match(/\b\d{8}\b/g) || [];
                if (!m.length) { window._b403 = 0; return; }
                let counts = {};
                m.forEach(x => counts[x] = (counts[x] || 0) + 1);
                let unicos = [...new Set(m)];
                let order = unicos.filter(c => counts[c] === 1).concat(unicos.filter(c => counts[c] > 1));
                let a = order.map(k => ({ cod: k, qtd: counts[k] }));
                let i = 0;
                const run = () => {
                    if (i >= a.length) {
                        alert("Finalizado");
                        window._b403 = 0;
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

})(window.CentralRobos);
