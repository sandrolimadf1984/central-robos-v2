/* ============================================================
 *  Medsenior / Unimed Seguros / GEAP
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
        chave: "MEDSENIOR/UN SEG",
        nome: "Medsenior / Unimed Seguros / GEAP",
        tipo: "padrao",
        ativo: true,
        portal: {
            seletores: ["input"],
            nota: "Campos de procedimento do autorizador"
        },
        origem: "central.js v2.1.0, linhas 866-1040",
        executar: () => {
            (function () {
                var P = document.getElementById('painel-v60-27');
                if (P) P.remove();
                var painel = document.createElement('div');
                painel.id = 'painel-v60-27';
                painel.style.cssText = 'position:fixed;top:10px;right:10px;width:310px;background:#2d3436;color:#fff;padding:15px;z-index:2147483647;border:4px solid #d63031;border-radius:8px;font-family:Arial;box-shadow:0 0 20px #000;font-size:12px;';
                painel.innerHTML = '<h3 style="color:#fab1a0;margin:0 0 5px;">🏥 V60.29 NOME CHECK</h3><div id="countMed" style="font-size:11px;color:#aaa;margin-bottom:10px;">Únicos: 0 | Total: 0</div><textarea id="txtInput" style="width:100%;height:80px;color:#000;border-radius:4px;padding:5px;" placeholder="Cole os códigos..."></textarea><button id="btnRun" style="width:100%;padding:10px;margin-top:5px;background:#e17055;color:#fff;font-weight:bold;border:none;border-radius:4px;cursor:pointer;">INICIAR ▶</button><div id="statusLog" style="margin-top:10px;color:#fab1a0;font-weight:bold;text-align:center;">Pronto.</div><button id="btnPanic" style="width:100%;margin-top:15px;background:#d63031;border:2px solid #fff;border-radius:4px;color:#fff;padding:5px;cursor:pointer;font-weight:bold;">💣 DESTROÇAR TRAVAMENTO</button><button onclick="this.parentElement.remove()" style="width:100%;margin-top:5px;cursor:pointer;background:#636e72;border-radius:4px;border:none;color:#fff;padding:5px;">Fechar</button>';
                document.body.appendChild(painel);
                var log = msg => document.getElementById('statusLog').innerText = msg;
                document.getElementById('txtInput').addEventListener('input', function() {
                    var raw = this.value.match(/\b\d{8}\b/g) || [];
                    var unicos = [...new Set(raw)];
                    document.getElementById('countMed').innerText = 'Únicos: ' + unicos.length + ' | Total: ' + raw.length;
                });
                var winAlvo = null;
                function unlock() {
                    try {
                        document.body.style.cursor = 'default';
                        document.body.style.pointerEvents = 'auto';
                        var wins = [window, window.top];
                        if (winAlvo) wins.push(winAlvo);
                        wins.forEach(w => {
                            if (w.document) {
                                w.document.body.style.cursor = 'default';
                                w.document.body.style.pointerEvents = 'auto';
                                var list = w.document.querySelectorAll('.ui-widget-overlay,.blockUI,.modal-backdrop,.ui-dialog-mask');
                                list.forEach(e => e.remove());
                            }
                        });
                    } catch (e) {}
                }
                document.getElementById('btnPanic').onclick = unlock;
                function findBtn(w) {
                    try {
                        var b = w.document.getElementById('button2');
                        if (b) return { btn: b, win: w };
                        if (w.frames) {
                            for (var i = 0; i < w.frames.length; i++) {
                                var r = findBtn(w.frames[i]);
                                if (r) return r;
                            }
                        }
                    } catch (e) {}
                    return null;
                }
                document.getElementById('btnRun').onclick = function () {
                    var txt = document.getElementById('txtInput').value;
                    var raw = txt.match(/\b\d{8}\b/g);
                    if (!raw) return alert('Sem códigos!');
                    var counts = {};
                    raw.forEach(x => counts[x] = (counts[x] || 0) + 1);
                    var unicos = [...new Set(raw)];
                    var order = unicos.filter(c => counts[c] === 1).concat(unicos.filter(c => counts[c] > 1));
                    var codigos = order.map(k => ({ cod: k, qtd: counts[k] }));
                    var res = findBtn(window.top);
                    if (!res) return alert('Botão button2 sumiu!');
                    winAlvo = res.win;
                    document.getElementById('btnRun').disabled = true;
                    document.getElementById('txtInput').disabled = true;
                    log('Iniciando...');
                    var idx = 0;
                    function aguardarResp(cb) {
                        let t = 0;
                        let c = setInterval(() => {
                            let bl = false;
                            try {
                                if (winAlvo && winAlvo.document.querySelector('.blockUI, .ui-widget-overlay, .ajax-status')) bl = true;
                            } catch (e) {}
                            if (!bl) {
                                clearInterval(c);
                                cb();
                            } else {
                                t++;
                                if (t > 40) {
                                    clearInterval(c);
                                    unlock();
                                    cb();
                                }
                            }
                        }, 250);
                    }
                    function loop() {
                        if (idx >= codigos.length) {
                            unlock();
                            log('✅ FIM!');
                            document.getElementById('btnRun').disabled = false;
                            document.getElementById('txtInput').disabled = false;
                            return;
                        }
                        aguardarResp(function () {
                            var item = codigos[idx];
                            var code = item.cod;
                            var q = item.qtd;
                            log('▶ [' + (idx + 1) + '/' + codigos.length + '] ' + code + (q > 1 ? ' (Qtd: ' + q + ')' : ''));
                            res.btn.click();
                            var idField = 'item_medico_' + (idx + 1);
                            var idQtd = 'qtd_solicitada_' + (idx + 1);
                            var idNome = 'nome_item_proc_' + (idx + 1);
                            var tries = 0;
                            var timer = setInterval(function () {
                                var field = winAlvo.document.getElementById(idField);
                                if (field) {
                                    clearInterval(timer);
                                    field.focus();
                                    field.value = code;
                                    field.dispatchEvent(new Event('input', { bubbles: true }));
                                    field.dispatchEvent(new Event('change', { bubbles: true }));
                                    field.blur();
                                    var nomeTries = 0;
                                    var nomeCheck = setInterval(function () {
                                        var nomeField = winAlvo.document.getElementById(idNome);
                                        var val = nomeField ? (nomeField.value || nomeField.innerText || "") : "";
                                        if (val.trim().length > 2) {
                                            clearInterval(nomeCheck);
                                            processarQtd();
                                        } else {
                                            nomeTries++;
                                            if (nomeTries > 60) {
                                                clearInterval(nomeCheck);
                                                log('⚠️ Timeout Nome. Tentando avançar...');
                                                processarQtd();
                                            }
                                        }
                                    }, 250);
                                    function processarQtd() {
                                        if (q > 1) {
                                            var qTries = 0;
                                            var qCheck = setInterval(function () {
                                                var qField = winAlvo.document.getElementById(idQtd);
                                                if (qField) {
                                                    clearInterval(qCheck);
                                                    qField.focus();
                                                    qField.value = q;
                                                    qField.dispatchEvent(new Event('input', { bubbles: true }));
                                                    qField.dispatchEvent(new Event('change', { bubbles: true }));
                                                    qField.blur();
                                                    idx++;
                                                    setTimeout(loop, 100);
                                                } else {
                                                    qTries++;
                                                    if (qTries > 20) {
                                                        clearInterval(qCheck);
                                                        log('⚠️ Qtd falhou na linha ' + (idx + 1));
                                                        idx++;
                                                        setTimeout(loop, 100);
                                                    }
                                                }
                                            }, 250);
                                        } else {
                                            idx++;
                                            setTimeout(loop, 100);
                                        }
                                    }
                                } else {
                                    tries++;
                                    if (tries > 50) {
                                        clearInterval(timer);
                                        if (confirm('Campo ' + idField + ' não abriu. Pular?')) {
                                            idx++;
                                            loop();
                                        } else {
                                            log('Parado.');
                                            document.getElementById('btnRun').disabled = false;
                                            document.getElementById('txtInput').disabled = false;
                                        }
                                    }
                                }
                            }, 100);
                        });
                    }
                    loop();
                };
            })();
        }
    });

})(window.CentralRobos);
