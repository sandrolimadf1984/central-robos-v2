/* ============================================================
 *  Inas GDF
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
        chave: "INAS",
        nome: "Inas GDF",
        tipo: "padrao",
        ativo: true,
        portal: {
            seletores: ["input"],
            nota: "Campos React Select do Inas GDF"
        },
        origem: "central.js v2.1.0, linhas 1517-1897",
        executar: () => {
            (async () => {
                if (document.getElementById('g-modal-inas')) return;
                const style = document.createElement('style');
                style.innerHTML = '.g-modal{position:fixed;top:20px;right:20px;width:300px;background:#fff;z-index:99999;box-shadow:0 10px 25px rgba(0,0,0,0.2);padding:15px;border-radius:8px;font-family:sans-serif;border-top:5px solid #2ecc71}.g-modal h3{margin:0 0 5px;font-size:16px;color:#333}.g-modal textarea{width:100%;height:100px;margin-bottom:5px;border:1px solid #ddd;border-radius:4px;padding:5px;box-sizing:border-box;font-size:12px;resize:none}.g-modal .count-tag{font-size:11px;color:#666;margin-bottom:10px;display:block}.g-modal button{width:100%;padding:10px;border:none;color:white;font-weight:700;border-radius:4px;cursor:pointer;margin-bottom:5px}.g-modal button:disabled{background:#ccc;cursor:not-allowed}';
                document.head.appendChild(style);
                
                const div = document.createElement('div');
                div.id = 'g-modal-inas';
                div.className = 'g-modal';
                div.innerHTML = `
                    <h3>🚀 Auto Preenchimento INAS</h3>
                    <span class="count-tag" id="g-count">Únicos: 0 | Total: 0</span>
                    <textarea id="g-codes" placeholder="Cole os códigos de 8 dígitos aqui..."></textarea>
                    <div style="display:flex; gap:5px;">
                        <button id="g-start" style="background:#2ecc71;">▶ Iniciar</button>
                        <button id="g-stop" style="background:#e74c3c; display:none;">⏹ Parar</button>
                    </div>
                    <button id="g-close" style="background:#7f8c8d;">❌ Fechar</button>
                    <div id="g-status" style="margin-top:10px;font-size:11px;color:#2ecc71;font-weight:bold"></div>
                `;
                document.body.appendChild(div);
                const btn = document.getElementById('g-start');
                const btnStop = document.getElementById('g-stop');
                const btnClose = document.getElementById('g-close');
                const status = document.getElementById('g-status');
                const txt = document.getElementById('g-codes');
                const countDisp = document.getElementById('g-count');
                let isRunning = false;
                
                btnClose.onclick = () => { isRunning = false; div.remove(); };
                btnStop.onclick = () => { 
                    isRunning = false; 
                    status.innerText = '🛑 Processo parado!'; 
                    btnStop.style.display = 'none'; 
                    btn.style.display = 'block'; 
                    btn.disabled = false; 
                    txt.disabled = false; 
                    setTimeout(() => div.remove(), 1500); 
                };
                
                const getCodes = () => {
                    const matches = [...txt.value.matchAll(/\b\d{8}\b/g)].map(m => m[0]);
                    const counts = {};
                    for (const code of matches) { counts[code] = (counts[code] || 0) + 1; }
                    const unicos = [...new Set(matches)];
                    const order = unicos.filter(c => counts[c] === 1).concat(unicos.filter(c => counts[c] > 1));
                    return order.map(code => ({ code, qty: counts[code] }));
                };
                
                txt.oninput = () => {
                    const codes = getCodes();
                    const total = codes.reduce((a, c) => a + c.qty, 0);
                    countDisp.innerText = `Únicos: ${codes.length} | Total: ${total}`;
                };
                
                btn.onclick = async () => {
                    let codes = getCodes();
                    if (!codes.length) return alert('Nenhum código encontrado!');
                    
                    isRunning = true;
                    btn.style.display = 'none';
                    btnStop.style.display = 'block';
                    txt.disabled = true;
                    const C = { ADD: 'Adicionar', TAB: '22 - Procedimentos e eventos em saúde' };
                    const wait = ms => new Promise(r => setTimeout(r, ms));
                    
                    const click = el => {
                        if (!el) return !1;
                        try {
                            el.scrollIntoView({ block: 'center' });
                            el.focus?.();
                            el.dispatchEvent(new MouseEvent('mousedown', { bubbles: !0 }));
                            el.dispatchEvent(new MouseEvent('mouseup', { bubbles: !0 }));
                            el.dispatchEvent(new MouseEvent('click', { bubbles: !0 }));
                            return !0;
                        } catch (e) { return !1; }
                    };
                    
                    const dom = r => {
                        let l = [];
                        r.querySelectorAll('*').forEach(x => {
                            l.push(x);
                            if (x.shadowRoot) l = l.concat(dom(x.shadowRoot));
                        });
                        return l;
                    };
                    
                    // Rede de segurança: se a caixa "Anexar arquivo" abrir por qualquer
                    // motivo, ela trava a tela inteira. Fecha e segue o lote.
                    const modalAnexoAberto = () => {
                        try {
                            return Array.from(document.querySelectorAll('div,p,span,h1,h2,h3,h4'))
                                .some(e => /selecione o tipo de documento/i.test(e.textContent || '')
                                        && e.getBoundingClientRect().width > 0);
                        } catch (e) { return !1; }
                    };
                    const fecharModalAnexo = async () => {
                        if (!modalAnexoAberto()) return !1;
                        const cancelar = Array.from(document.querySelectorAll('button'))
                            .find(b => /^cancelar$/i.test((b.textContent || '').trim())
                                    && b.getBoundingClientRect().width > 0);
                        if (cancelar) { cancelar.click(); }
                        else { document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: !0 })); }
                        await wait(400);
                        return !0;
                    };

                    const getInput = () => {
                        const i = document.querySelectorAll('input[id^="react-select-"][id$="-input"]');
                        const v = Array.from(i).filter(e => e.getBoundingClientRect().width > 0);
                        return v.length ? v[v.length - 1] : null;
                    };
                    
                    // Botões em que o robô NUNCA pode clicar por engano.
                    // Era isso que abria a caixa "Anexar arquivo" no meio do lote.
                    const PROIBIDO = /anexar|anexo|remover|excluir|deletar|apagar|lixeira|pr[oó]ximo|voltar|cancelar|concluir|salvar|finalizar|enviar|sair|fechar/i;
                    const botaoSeguro = b => {
                        if (!b) return !1;
                        const t = ((b.textContent || '') + ' ' +
                                   (b.getAttribute('aria-label') || '') + ' ' +
                                   (b.getAttribute('title') || '') + ' ' +
                                   (b.className || '')).toLowerCase();
                        return !PROIBIDO.test(t);
                    };

                    // Acha o campo "Quantidade" pela etiqueta dele, e não pelo
                    // "último ícone da página" — que na prática caía no anexo.
                    const getCaixaQtd = () => {
                        try {
                            const marcas = Array.from(document.querySelectorAll('label,span,div,p'))
                                .filter(e => /^quantidade\s*\*?$/i.test((e.textContent || '').trim())
                                          && e.getBoundingClientRect().width > 0);
                            for (const m of marcas) {
                                let caixa = m;
                                for (let k = 0; k < 5 && caixa; k++) {
                                    const inpQ = caixa.querySelector('input');
                                    const btns = Array.from(caixa.querySelectorAll('button')).filter(botaoSeguro);
                                    if (inpQ && btns.length) return { inp: inpQ, btns };
                                    caixa = caixa.parentElement;
                                }
                            }
                        } catch (e) { }
                        return null;
                    };

                    const getLupa = ref => {
                        if (!ref) return null;
                        let f = ref.closest('form');
                        if (f) {
                            let s = f.querySelector('button[type="submit"]');
                            if (s && botaoSeguro(s)) return s;
                            let bs = f.querySelectorAll('button');
                            for (let b of bs) if (b.querySelector('svg') && botaoSeguro(b)) return b;
                        }
                        return null;   // sem chutar pela página inteira
                    };
                    
                    const getAdd = () => {
                        const es = Array.from(document.querySelectorAll('button,div[role="button"],span'));
                        return es.find(e => e.textContent && e.textContent.toLowerCase().trim() === C.ADD.toLowerCase().trim() && e.getBoundingClientRect().width > 0);
                    };
                    
                    const getCombo = () => {
                        const c = dom(document).filter(e => e.getAttribute?.('role') === 'combobox' && e.offsetParent);
                        return c.length < 17 ? c[c.length - 1] : c[16];
                    };
                    
                    const getTab = () => dom(document).find(e => e.textContent?.trim() === C.TAB && e.getBoundingClientRect().height > 0);
                    
                    const ensureTab = async () => {
                        let c = getCombo();
                        if (c) click(c);
                        for (let k = 0; k < 20; k++) {
                            if (!isRunning) return !1;
                            let o = getTab();
                            if (o) { click(o); return !0; }
                            await wait(30);
                        }
                        c = getCombo();
                        if (c) click(c);
                        for (let k = 0; k < 20; k++) {
                            if (!isRunning) return !1;
                            let o = getTab();
                            if (o) { click(o); return !0; }
                            await wait(30);
                        }
                        return !1;
                    };
                    
                    // Clica numa opção da lista sem tirar o foco do campo.
                    // O mouseover vem antes de propósito: é ele que destaca a
                    // opção certa na lista (a mesma coisa que passar o mouse).
                    const clicarOpcao = el => {
                        if (!el) return !1;
                        try {
                            el.scrollIntoView({ block: 'center' });
                            el.dispatchEvent(new MouseEvent('mousemove', { bubbles: !0 }));
                            el.dispatchEvent(new MouseEvent('mouseover', { bubbles: !0 }));
                            el.dispatchEvent(new MouseEvent('mousedown', { bubbles: !0, button: 0 }));
                            el.dispatchEvent(new MouseEvent('mouseup', { bubbles: !0, button: 0 }));
                            el.dispatchEvent(new MouseEvent('click', { bubbles: !0, button: 0 }));
                            return !0;
                        } catch (e) { return !1; }
                    };

                    const opcoesNaTela = () =>
                        Array.from(document.querySelectorAll('[id^="react-select-"][id*="-option"]'));

                    const fill = async (cod, qty) => {
                        await fecharModalAnexo();
                        const inp = getInput();
                        if (!inp) return !1;
                        click(inp);
                        await wait(100);
                        const s = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set;

                        // Limpa o campo e espera a lista da busca ANTERIOR sumir.
                        // Sem isso, a lista velha ainda está na tela quando o código
                        // novo é digitado — e acabamos escolhendo o exame errado.
                        s.call(inp, '');
                        inp.dispatchEvent(new InputEvent('input', { bubbles: !0 }));
                        for (let w = 0; w < 15; w++) {
                            if (!isRunning) return !1;
                            if (opcoesNaTela().length === 0) break;
                            await wait(100);
                        }

                        s.call(inp, cod);
                        inp.dispatchEvent(new InputEvent('input', { bubbles: !0, inputType: 'insertFromPaste', data: cod }));

                        // Espera aparecer a opção QUE CONTÉM ESTE código
                        let alvo = null;
                        for (let w = 0; w < 50; w++) {
                            if (!isRunning) return !1;
                            alvo = opcoesNaTela().find(o => (o.innerText || '').includes(cod));
                            if (alvo) break;
                            await wait(200);
                        }

                        if (alvo) {
                            await wait(200);
                            // Relê a lista: entre a espera e o clique ela pode ter mudado
                            const certa = opcoesNaTela().find(o => (o.innerText || '').includes(cod)) || alvo;
                            clicarOpcao(certa);
                            await wait(200);
                            // Se ainda houver lista aberta, o clique não pegou: agora o
                            // Enter é seguro, porque o mouseover já destacou a opção certa.
                            if (opcoesNaTela().length > 0) {
                                inp.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: !0 }));
                            }
                        } else {
                            // Não achei a opção deste código: NÃO aperto Enter às cegas,
                            // senão entra o exame que estiver destacado (era isso que
                            // repetia um exame e pulava outro). Deixo para a conferência
                            // do final reinserir este código.
                            await wait(300);
                            s.call(inp, '');
                            inp.dispatchEvent(new InputEvent('input', { bubbles: !0 }));
                            return !1;
                        }
                        await wait(300);
                        // ── Quantidade ──
                        const cx = getCaixaQtd();
                        let qtdOk = !1;
                        if (cx) {
                            // 1º) tenta digitar direto no campo
                            if (!cx.inp.readOnly && !cx.inp.disabled) {
                                try {
                                    const setQ = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set;
                                    cx.inp.focus();
                                    setQ.call(cx.inp, String(qty));
                                    cx.inp.dispatchEvent(new InputEvent('input', { bubbles: !0 }));
                                    cx.inp.dispatchEvent(new Event('change', { bubbles: !0 }));
                                    await wait(200);
                                    if (String(cx.inp.value).replace(/\D/g, '') === String(qty)) qtdOk = !0;
                                } catch (e) { }
                            }
                            // 2º) senão, clica no "+" da própria caixa de quantidade
                            if (!qtdOk) {
                                const mais = cx.btns.find(b => (b.textContent || '').trim() === '+')
                                    || cx.btns.find(b => /mais|plus|add|increment|aumentar/i.test(
                                        (b.getAttribute('aria-label') || '') + ' ' + (b.className || '')))
                                    || cx.btns[cx.btns.length - 1];
                                if (mais) {
                                    const atual = parseInt(String(cx.inp.value || '0').replace(/\D/g, ''), 10) || 0;
                                    for (let q = atual; q < qty; q++) {
                                        if (!isRunning) return !1;
                                        click(mais);
                                        await wait(220);
                                    }
                                    qtdOk = !0;
                                }
                            }
                        }
                        // 3º) último recurso: botão do próprio formulário (nunca o de anexo)
                        if (!qtdOk) {
                            const lp = getLupa(inp);
                            if (lp) {
                                for (let q = 0; q < qty; q++) {
                                    if (!isRunning) return !1;
                                    click(lp);
                                    await wait(250);
                                }
                            }
                        }
                        await wait(100);
                        await fecharModalAnexo();
                        const ad = getAdd() || document.querySelector('[class="button-add"]');
                        if (ad) click(ad);
                        await wait(150);
                        await fecharModalAnexo();
                        return !0;
                    };
                    
                    const runProcess = async (list) => {
                        for (let i = 0; i < list.length; i++) {
                            if (!isRunning) return;
                            const item = list[i];
                            status.innerText = `⏳ Inserindo ${i + 1}/${list.length}: ${item.code} (Qtd: ${item.qty})`;
                            let ok = !1;
                            for (let t = 0; t < 3; t++) {
                                if (!isRunning) return;
                                if (await ensureTab()) { ok = !0; break; }
                                await wait(100);
                            }
                            if (ok) {
                                await wait(150);
                                await fill(item.code, item.qty);
                                await wait(1500);
                            }
                        }
                    };
                    await runProcess(codes);
                    
                    if (!isRunning) return;
                    status.innerText = '🔍 Conferindo tabela e quantidades...';
                    await wait(1000);
                    let allTables = Array.from(document.querySelectorAll('table'));
                    let table = allTables.find(t => (codes.length > 0 && t.innerText.includes(codes[0].code)) || t.offsetParent !== null);
                    let missing = [];
                    if (table) {
                        let rows = Array.from(table.querySelectorAll('tbody tr'));
                        for (let row of rows) {
                            if (!isRunning) return;
                            let txt = row.innerText;
                            let codeObj = codes.find(c => txt.includes(c.code));
                            
                            if (codeObj) {
                                let tds = Array.from(row.querySelectorAll('td'));
                                let nums = tds.map(td => td.innerText.trim()).filter(t => /^\d+$/.test(t) && t.length < 5);
                                let expectedQtyStr = codeObj.qty.toString();
                                if (nums.length > 0 && !nums.includes(expectedQtyStr)) {
                                    status.innerText = `🗑️ Qtd incorreta em ${codeObj.code}. Removendo para re-inserir...`;
                                    let trash = row.querySelector('td.last-column svg, td.last-column > div > div > div > svg, td:last-child svg');
                                    if (trash) {
                                        click(trash);
                                        await wait(1000); 
                                    }
                                }
                            }
                        }
                    }
                    if (!isRunning) return;
                    allTables = Array.from(document.querySelectorAll('table'));
                    table = allTables.find(t => (codes.length > 0 && t.innerText.includes(codes[0].code)) || t.offsetParent !== null);
                    let tableText = table ? table.innerText : '';
                    missing = codes.filter(c => !tableText.includes(c.code));
                    if (missing.length > 0) {
                        status.innerText = `⚠️ Inserindo ${missing.length} itens ausentes/corrigidos...`;
                        await wait(1000);
                        await runProcess(missing);
                    }
                    if (!isRunning) return;
                    status.innerText = '✅ Fim! Tudo conferido.';
                    await wait(2000);
                    
                    if (isRunning) div.remove();
                };
            })();
        }
    });

})(window.CentralRobos);
