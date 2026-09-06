/* ============================================================
 *  TJDF
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
        chave: "TJDF",
        nome: "TJDF",
        tipo: "padrao",
        ativo: true,
        portal: {
            seletores: ["input"],
            nota: "Campos de procedimento do autorizador"
        },
        origem: "central.js v2.1.0, linhas 1041-1213",
        executar: () => {
            (() => {
                if (document.getElementById('b403-painel-root')) return;
                let codigos = [];
                let idx = 0;
                let observer;
                let obsTabelaAtual = null;
                let executando = false;
                let pausado = false;
                let painel = null;
                let statusEl, contadorEl;
                const criarPainelEntrada = () => {
                    painel = document.createElement('div');
                    painel.id = 'b403-painel-root';
                    painel.style = 'position:fixed;bottom:20px;right:20px;z-index:999999;background:#1e1e1e;color:#f1f1f1;font-family:system-ui,Arial;padding:14px;border-radius:12px;box-shadow:0 8px 24px rgba(0,0,0,.4);width:260px;';
                    painel.innerHTML = '<div style="font-weight:600;margin-bottom:8px;">⚙️ Automação de Códigos</div><textarea id="b403-input" placeholder="Cole os códigos (8 dígitos) aqui..." style="width:100%;height:80px;border-radius:6px;border:none;padding:6px;margin-bottom:8px;"></textarea><button id="b403-iniciar" style="width:100%;padding:8px;border:none;border-radius:8px;background:#2d7dff;color:#fff;cursor:pointer;">▶️ Iniciar</button>';
                    document.body.appendChild(painel);
                    painel.querySelector('#b403-iniciar').onclick = iniciarAutomacao;
                };
                const iniciarAutomacao = () => {
                    const texto = painel.querySelector('#b403-input').value || '';
                    const matches = texto.match(/\b\d{8}\b/g) || [];
                    if (!matches.length) {
                        alert('Nenhum código válido.');
                        return;
                    }
                    const contagem = {};
                    matches.forEach(m => { contagem[m] = (contagem[m] || 0) + 1; });
                    const unicos = [...new Set(matches)];
                    const order = unicos.filter(c => contagem[c] === 1).concat(unicos.filter(c => contagem[c] > 1));
                    codigos = order.map(k => ({ cod: k, qtd: contagem[k] }));
                    painel.innerHTML = '<div style="font-weight:600;margin-bottom:10px;">⚙️ Automação de Códigos</div><div id="b403-status">Status: iniciado</div><div id="b403-contador">0 / ' + codigos.length + '</div><div style="margin-top:10px;display:grid;grid-template-columns:1fr 1fr;gap:6px;"><button id="b403-pausar">⏸ Pausar</button><button id="b403-pular">⏭ Pular</button><button id="b403-encerrar" style="grid-column:1/3;">❌ Encerrar</button></div>';
                    statusEl = painel.querySelector('#b403-status');
                    contadorEl = painel.querySelector('#b403-contador');
                    painel.querySelector('#b403-pausar').onclick = togglePause;
                    painel.querySelector('#b403-pular').onclick = () => { executando = false; avancarProximo(); };
                    painel.querySelector('#b403-encerrar').onclick = finalizar;
                    observer = new MutationObserver(() => !pausado && executarProximo());
                    observer.observe(document.body, { childList: true, subtree: true });
                    executarProximo();
                };
                const setStatus = t => statusEl.textContent = 'Status: ' + t;
                const setContador = () => contadorEl.textContent = idx + ' / ' + codigos.length;
                const togglePause = () => {
                    pausado = !pausado;
                    setStatus(pausado ? 'pausado' : 'retomado');
                    if (!pausado) executarProximo();
                };
                const adicionarEventoEnterAoInput = () => {
                    const input = document.querySelector('#HandleTermo');
                    if (!input || input.dataset.enterAdded) return;
                    input.addEventListener('paste', () => {
                        setTimeout(() => {
                            input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', keyCode: 13, which: 13, bubbles: true }));
                        }, 100);
                    });
                    input.dataset.enterAdded = '1';
                };
                const selecionarTabelaTJDF = () => {
                    setStatus('aguardando tabela');
                    obsTabelaAtual = new MutationObserver(() => {
                        // Prefere a linha que contém ESTE código. A classe kb-active é a
                        // linha destacada, que pode ser a da busca anterior.
                        const codTJ = (codigos[idx] || {}).cod;
                        let celula = null;
                        if (codTJ) {
                            for (const tr of document.querySelectorAll('#result-body-table > tr.dataGridRow')) {
                                if ((tr.innerText || tr.textContent || '').includes(codTJ)) {
                                    celula = tr.querySelector('td:nth-child(2)');
                                    if (celula) break;
                                }
                            }
                        }
                        if (!celula) celula = document.querySelector('#result-body-table > tr.dataGridRow.ng-scope.kb-active > td:nth-child(2)');
                        if (celula) {
                            celula.click();
                            obsTabelaAtual.disconnect();
                            obsTabelaAtual = null;
                            verificarEPreencherQuantidade();
                        }
                    });
                    obsTabelaAtual.observe(document.body, { childList: true, subtree: true });
                };
                const verificarEPreencherQuantidade = () => {
                    const itemAtual = codigos[idx];
                    if (itemAtual.qtd > 1) {
                        setStatus('preenchendo qtd (' + itemAtual.qtd + ')');
                        let tentativas = 0;
                        const checarInput = setInterval(() => {
                            const seletor = '#stepDadosSolicitacaoForm > bc-guia-eventos-exibicao-termos-selecionados > div > div:nth-child(' + (idx + 1) + ') > div.form-group > div.size-1.no-rpadding > input';
                            const inputQtd = document.querySelector(seletor);
                            if (inputQtd) {
                                clearInterval(checarInput);
                                inputQtd.value = itemAtual.qtd;
                                inputQtd.dispatchEvent(new Event('input', { bubbles: true }));
                                inputQtd.dispatchEvent(new Event('change', { bubbles: true }));
                                avancarProximo();
                            } else {
                                tentativas++;
                                if (tentativas > 20) {
                                    clearInterval(checarInput);
                                    console.warn('Campo de quantidade não apareceu a tempo.');
                                    avancarProximo();
                                }
                            }
                        }, 500);
                    } else {
                        avancarProximo();
                    }
                };
                const avancarProximo = () => {
                    executando = false;
                    idx++;
                    executarProximo();
                };
                const executarProximo = () => {
                    if (pausado || executando) return;
                    if (idx >= codigos.length) {
                        finalizar();
                        return;
                    }
                    const c = document.querySelector('#HandleTermo');
                    if (!c) return;
                    executando = true;
                    setStatus('processando');
                    setContador();
                    adicionarEventoEnterAoInput();
                    const codigoAtual = codigos[idx].cod;
                    if (codigoAtual !== '40325024') {
                        selecionarTabelaTJDF();
                    }
                    c.focus();
                    c.value = codigoAtual;
                    c.dispatchEvent(new Event('paste', { bubbles: true }));
                    c.dispatchEvent(new Event('input', { bubbles: true }));
                    c.dispatchEvent(new Event('change', { bubbles: true }));
                    if (codigoAtual === '40325024') {
                        setTimeout(() => {
                            verificarEPreencherQuantidade();
                        }, 600);
                    }
                };
                const finalizar = () => {
                    pausado = true;
                    executando = false;
                    if (observer) observer.disconnect();
                    if (obsTabelaAtual) obsTabelaAtual.disconnect();
                    setStatus('finalizado');
                    document.querySelectorAll('.modal-backdrop').forEach(b => b.remove());
                    document.querySelectorAll('.modal').forEach(m => {
                        m.style.display = 'none';
                        m.classList.remove('in', 'show');
                        m.removeAttribute('aria-hidden');
                        m.removeAttribute('inert');
                    });
                    document.body.classList.remove('modal-open');
                    document.body.style.pointerEvents = 'auto';
                    document.body.style.overflow = 'auto';
                    try { document.activeElement.blur(); } catch (e) {}
                    const btnFechar = document.createElement('button');
                    btnFechar.textContent = '🧹 Fechar painel';
                    btnFechar.style = 'margin-top:10px;width:100%;padding:8px;border:none;border-radius:8px;background:#444;color:#fff;cursor:pointer;';
                    btnFechar.onclick = () => {
                        painel.remove();
                        painel = null;
                        document.body.style.pointerEvents = 'auto';
                        document.body.style.overflow = 'auto';
                    };
                    painel.appendChild(btnFechar);
                };
                criarPainelEntrada();
            })();
        }
    });

})(window.CentralRobos);
