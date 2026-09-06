/* ============================================================
 *  Sul América
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
        chave: "SULAMERICA",
        nome: "Sul América",
        tipo: "padrao",
        ativo: true,
        portal: {
            seletores: ["#tabelaSolicitaProcedimento"],
            nota: "Tabela de procedimentos solicitados"
        },
        origem: "central.js v2.1.0, linhas 1281-1331",
        executar: () => {
            (function () {
                const TEMPO = 150;
                var texto = prompt("MODO SONIC: Cole os códigos aqui:");
                if (!texto) return;
                var raw = texto.match(/\b\d{8}\b/g);
                if (!raw || raw.length === 0) return;
                var counts = {};
                raw.forEach(x => counts[x] = (counts[x] || 0) + 1);
                var unicos = [...new Set(raw)];
                var order = unicos.filter(c => counts[c] === 1).concat(unicos.filter(c => counts[c] > 1));
                var codigos = order.map(k => ({ cod: k, qtd: counts[k] }));
                var selInput = "#formValidaProcedimento > fieldset > div > div > div:nth-child(1) > input";
                var selBtn = "#btn-incluir-procedimento > span";
                var selQtd = "#tabelaSolicitaProcedimento > tbody > tr > td:nth-child(5) > input";
                async function run() {
                    for (let i = 0; i < codigos.length; i++) {
                        let item = codigos[i];
                        let inpt = document.querySelector(selInput);
                        let btn = document.querySelector(selBtn);
                        if (inpt && btn) {
                            inpt.value = item.cod;
                            inpt.dispatchEvent(new Event('input', { bubbles: true }));
                            inpt.dispatchEvent(new Event('change', { bubbles: true }));
                            btn.click();
                            await new Promise(r => setTimeout(r, TEMPO));
                            if (item.qtd > 1) {
                                await new Promise(r => setTimeout(r, 150));
                                // Prefere a linha da tabela que contém ESTE código
                                let qInpt = null;
                                for (const tr of document.querySelectorAll('#tabelaSolicitaProcedimento > tbody > tr')) {
                                    if ((tr.innerText || tr.textContent || '').includes(item.cod)) {
                                        const qq = tr.querySelector('td:nth-child(5) > input');
                                        if (qq) { qInpt = qq; break; }
                                    }
                                }
                                let qInps = document.querySelectorAll(selQtd);
                                if (!qInpt) qInpt = qInps[i] || qInps[qInps.length - 1];
                                if (qInpt) {
                                    qInpt.value = item.qtd;
                                    qInpt.dispatchEvent(new Event('input', { bubbles: true }));
                                    qInpt.dispatchEvent(new Event('change', { bubbles: true }));
                                }
                            }
                        }
                    }
                    alert("Sonic finalizado!");
                }
                run();
            })();
        }
    });

})(window.CentralRobos);
