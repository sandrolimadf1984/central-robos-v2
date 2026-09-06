/* ============================================================
 *  Amil
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
        chave: "AMIL",
        nome: "Amil",
        tipo: "padrao",
        ativo: true,
        portal: {
            seletores: ["#inclusao-consulta-pedido", "#quantidade-procedimento"],
            nota: "Tela de inclusão de procedimento (Angular)"
        },
        origem: "central.js v2.1.0, linhas 1419-1516",
        executar: () => {
            (function () {
                var d = document.createElement('div');
                d.style.cssText = 'position:fixed;top:10px;right:10px;width:300px;background:#fff;border:3px solid #d63384;padding:10px;z-index:999999;font-family:Arial;box-shadow:0 0 15px rgba(0,0,0,0.5)';
                d.innerHTML = '<h3 style="margin:0;color:#d63384">Lançador Amil (Rápido)</h3><p style="font-size:12px;margin:5px 0">Cola > Checa rápido o nome > Salva.</p><textarea id="tc" style="width:100%;height:100px" placeholder="Cole os códigos de 8 dígitos..."></textarea><button id="bi" style="margin-top:5px;width:100%;padding:10px;background:#28a745;color:white;cursor:pointer;font-weight:bold;border:none">INICIAR</button><button onclick="this.parentElement.remove()" style="margin-top:5px;width:100%;cursor:pointer">FECHAR</button><div id="lg" style="font-size:11px;margin-top:5px;color:red;font-weight:bold"></div>';
                document.body.appendChild(d);

                document.getElementById('bi').onclick = async () => {
                    var t = document.getElementById('tc').value;
                    var raw = t.match(/\b\d{8}\b/g);
                    var log = document.getElementById('lg');

                    if (!raw || raw.length == 0) {
                        alert('Nenhum código de 8 dígitos encontrado!');
                        return;
                    }

                    document.getElementById('bi').disabled = true;
                    var counts = {};
                    raw.forEach(x => counts[x] = (counts[x] || 0) + 1);
                    var unicos = [...new Set(raw)];
                    var order = unicos.filter(c => counts[c] === 1).concat(unicos.filter(c => counts[c] > 1));
                    var l = order.map(k => ({ cod: k, qtd: counts[k] }));

                    for (var i = 0; i < l.length; i++) {
                        var item = l[i];
                        var c = item.cod;
                        var q = item.qtd;

                        var seletorInputAmil = '#inclusao-consulta-pedido > section > as-tipo-pedido-sadt > div.procedimentos-servicos.card-config > as-procedimento-servico > div > ul > li > as-procedimento-autocomplete > div > div > input';

                        let nomeEncontrado = false;
                        let tentativasDeReinsercao = 0;
                        while (!nomeEncontrado) {
                            var inp = document.querySelector(seletorInputAmil);
                            if (!inp) { inp = document.querySelector('#inclusao-consulta-pedido input[type="text"]'); }
                            if (!inp) { alert('ERRO: Campo INPUT não encontrado!'); break; }
                            log.innerText = 'Processando: ' + c + ' (' + (i + 1) + '/' + l.length + ')' + (q > 1 ? ' Qtd: ' + q : '') + (tentativasDeReinsercao > 0 ? ` [Re-tentativa: ${tentativasDeReinsercao}]` : '');
                            inp.focus();
                            inp.value = '';
                            inp.dispatchEvent(new Event('input', { bubbles: true }));
                            await new Promise(r => setTimeout(r, 100));
                            inp.value = c;
                            inp.dispatchEvent(new Event('input', { bubbles: true }));
                            inp.dispatchEvent(new Event('change', { bubbles: true }));
                            var enterEvent = { bubbles: true, cancelable: true, key: 'Enter', code: 'Enter', keyCode: 13, which: 13, charCode: 13, view: window };
                            inp.dispatchEvent(new KeyboardEvent('keydown', enterEvent));
                            inp.dispatchEvent(new KeyboardEvent('keypress', enterEvent));
                            inp.dispatchEvent(new KeyboardEvent('keyup', enterEvent));
                            log.innerText = 'Aguardando o sistema preencher o nome do exame...';
                            await new Promise(resolve => {
                                let tentativasEspera = 0;
                                let check = setInterval(() => {
                                    let campoAtual = document.querySelector(seletorInputAmil) || document.querySelector('#inclusao-consulta-pedido input[type="text"]');

                                    if (campoAtual && campoAtual.value && campoAtual.value !== c && campoAtual.value.length > c.length) {
                                        clearInterval(check);
                                        nomeEncontrado = true;
                                        resolve();
                                    } else {
                                        tentativasEspera++;
                                        if (tentativasEspera > 100) {
                                            clearInterval(check);
                                            resolve();
                                        }
                                    }
                                }, 50);
                            });
                            if (!nomeEncontrado) {
                                tentativasDeReinsercao++;
                                log.innerText = `Limpando e re-inserindo código ${c}...`;
                                await new Promise(r => setTimeout(r, 500));
                            }
                        }

                        log.innerText = 'Nome carregado! Processando: ' + c + ' (' + (i + 1) + '/' + l.length + ')' + (q > 1 ? ' Qtd: ' + q : '');

                        if (q > 1) {
                            var qInp = document.querySelector('#quantidade-procedimento');
                            if (qInp) {
                                qInp.focus();
                                qInp.value = q;
                                qInp.dispatchEvent(new Event('input', { bubbles: true }));
                                qInp.dispatchEvent(new Event('change', { bubbles: true }));
                                await new Promise(r => setTimeout(r, 100));
                            }
                        }

                        var btn = document.querySelector('#inclusao-consulta-pedido > section > as-tipo-pedido-sadt > div.procedimentos-servicos.card-config > as-procedimento-servico > div > div > button');
                        if (btn) { btn.click(); } else { log.innerText = 'Botão salvar não apareceu para ' + c; }
                        await new Promise(r => setTimeout(r, 400));
                    }

                    document.getElementById('bi').disabled = false;
                    alert('Finalizado!');
                };
            })();
        }
    });

})(window.CentralRobos);
