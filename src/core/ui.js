/* ============================================================
 *  INTERFACE
 *
 *  Mesma cara de sempre — painel escuro, cards dos convênios,
 *  janela para colar os códigos — com o que o plano da V2 pediu:
 *
 *    ⭐ mais utilizados      🔍 busca (já existia, agora com apelidos)
 *    🟢 status do robô       📊 progresso de verdade, item a item
 *    📋 fila com resumo      ▶ continuar de onde parou
 *    🕘 histórico            📈 estatísticas       📄 logs
 *    🛠️ diagnóstico          ❌ erro que explica o que houve
 *
 *  A regra foi não inchar: o que é do dia a dia fica à vista, o
 *  resto mora atrás dos botõezinhos do rodapé.
 * ============================================================ */
(function (CR) {
    "use strict";

    var U = CR.utils;

    /* 1. Impede a abertura de múltiplos menus centrais */
    if (document.getElementById('menu-central-robos')) return;

    /* ── estilos globais do app ─────────────────────────────── */
    // ── estilos globais do app ────────────────────────────────────
    if (!document.getElementById('estilo-central-robos')) {
        const est = document.createElement('style');
        est.id = 'estilo-central-robos';
        est.textContent =
            '#cr-lista::-webkit-scrollbar{width:9px;}' +
            '#cr-lista::-webkit-scrollbar-track{background:#0a1020;border-radius:5px;}' +
            '#cr-lista::-webkit-scrollbar-thumb{background:linear-gradient(#4dc3ff,#2d7dff);border-radius:5px;}' +
            '#cr-txt-codigos::-webkit-scrollbar{width:8px;}' +
            '#cr-txt-codigos::-webkit-scrollbar-thumb{background:#2d7dff;border-radius:4px;}' +
            '#cr-txt-codigos::placeholder{color:#5b7ba6;text-align:center;padding-top:52px;font-size:13px;}' +
            '.cr-card:hover{border-color:#2d7dff !important;box-shadow:0 0 14px rgba(45,125,255,0.35);}' +
            '.cr-card:hover .cr-seta{background:#2d7dff;color:#fff;}' +
            '#cr-lista,#cr-home,#cr-janela{cursor:default;}' +
            '#cr-home,#cr-janela,#cr-lista{overflow-x:hidden;}' +
            '#cr-home > *{flex:0 0 auto;}' +
            '#cr-janela::-webkit-scrollbar{width:8px;}' +
            '#cr-janela::-webkit-scrollbar-track{background:#0a1020;}' +
            '#cr-janela::-webkit-scrollbar-thumb{background:#2d7dff;border-radius:4px;}' +
            '.cr-rz{position:absolute;z-index:20;}' +
            '.cr-rz-n{top:0;left:9px;right:9px;height:9px;cursor:ns-resize;}' +
            '.cr-rz-s{bottom:0;left:9px;right:9px;height:9px;cursor:ns-resize;}' +
            '.cr-rz-w{left:0;top:9px;bottom:9px;width:9px;cursor:ew-resize;}' +
            '.cr-rz-e{right:0;top:9px;bottom:9px;width:9px;cursor:ew-resize;}' +
            '.cr-rz-nw{top:0;left:0;width:14px;height:14px;cursor:nwse-resize;z-index:21;}' +
            '.cr-rz-se{bottom:0;right:0;width:14px;height:14px;cursor:nwse-resize;z-index:21;}' +
            '.cr-rz-ne{top:0;right:0;width:14px;height:14px;cursor:nesw-resize;z-index:21;}' +
            '.cr-rz-sw{bottom:0;left:0;width:14px;height:14px;cursor:nesw-resize;z-index:21;}' +
            '.cr-rz:hover{background:rgba(45,125,255,0.30);border-radius:4px;}' +
            '.cr-arrasta{cursor:move;}' +
            '.cr-ferramenta{background:#0e1a2e;border:1px solid #223a5e;border-radius:12px;padding:4px 10px;font-size:9.5px;font-weight:700;color:#9db4d8;cursor:pointer;letter-spacing:.4px;}' +
            '.cr-ferramenta:hover{border-color:#2d7dff;color:#cfe0ff;}' +
            '#cr-painel::-webkit-scrollbar{width:8px;}' +
            '#cr-painel::-webkit-scrollbar-track{background:#0a1020;}' +
            '#cr-painel::-webkit-scrollbar-thumb{background:#2d7dff;border-radius:4px;}' +
            '#cr-fila-itens::-webkit-scrollbar{width:7px;}' +
            '#cr-fila-itens::-webkit-scrollbar-thumb{background:#2d7dff;border-radius:4px;}';
        document.head.appendChild(est);
    }

    /* ── casca do app ───────────────────────────────────────── */
    const menu = document.createElement('div');
    menu.id = 'menu-central-robos';
    menu.style.cssText = `
        position: fixed;
        top: 16px;
        left: 16px;
        width: 400px;
        height: min(700px, calc(100vh - 28px));
        background: linear-gradient(180deg, #0c1322 0%, #0a0f1c 100%);
        border: 1px solid #1d3557;
        border-radius: 16px;
        box-shadow: 0 0 0 1px rgba(45,125,255,0.25), 0 0 30px rgba(45,125,255,0.28), 0 18px 50px rgba(0,0,0,0.7);
        z-index: 2147483647;
        font-family: 'Segoe UI', system-ui, Arial, sans-serif;
        color: #dbe7ff;
        cursor: move;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        padding: 7px;
        box-sizing: border-box;
    `;

    /* ── TELA 1: menu principal ────────────────────────────────── */
    const telaHome = document.createElement('div');
    telaHome.id = 'cr-home';
    telaHome.style.cssText = 'position:relative;padding:8px 9px 6px 10px;flex:1;min-height:0;display:flex;flex-direction:column;overflow:hidden;cursor:default;border-radius:10px;';
    telaHome.innerHTML = `
        <div style="position:absolute;top:8px;right:14px;font-size:7px;letter-spacing:0.6px;color:#f5c518;text-shadow:0 0 6px rgba(245,197,24,0.45);font-weight:700;">CRIADO POR SANDRO DE LIMA PEREIRA</div>

        <div class="cr-arrasta" style="display:flex;align-items:center;gap:12px;margin-top:10px;">
            <div style="font-size:36px;line-height:1;filter:drop-shadow(0 0 8px rgba(77,195,255,0.6));">🤖</div>
            <div style="flex:1;">
                <div style="font-size:15px;font-weight:700;color:#e8f1ff;letter-spacing:2px;line-height:1.1;">CENTRAL DE</div>
                <div style="font-size:26px;font-weight:800;color:#4dc3ff;letter-spacing:2px;line-height:1.1;text-shadow:0 0 12px rgba(77,195,255,0.55);">AUTOMAÇÃO</div>
            </div>
            <div style="display:flex;align-items:center;gap:6px;background:#0e1a2e;border:1px solid #223a5e;border-radius:16px;padding:5px 12px;font-size:10px;font-weight:700;color:#cfe0ff;letter-spacing:1px;">
                <span style="width:8px;height:8px;border-radius:50%;background:#2ecc71;box-shadow:0 0 6px #2ecc71;"></span>ONLINE
            </div>
        </div>

        <div class="cr-arrasta" style="text-align:center;margin:6px 0 12px;font-size:12px;letter-spacing:3px;color:#9db4d8;font-weight:600;">
            <span style="color:#3d5a85;">—</span>&nbsp; <b style="color:#cfe0ff;">CLT</b>zinho&nbsp;<span style="letter-spacing:4px;">DIGITAL</span> &nbsp;<span style="color:#3d5a85;">—</span>
        </div>

        <div id="cr-aviso-slot"></div>

        <div style="background:linear-gradient(135deg,#0d1f3a,#0b1830);border:1px solid #24559b;border-radius:12px;padding:14px 16px;margin-bottom:12px;background-image:repeating-linear-gradient(0deg,rgba(45,125,255,0.05) 0 1px,transparent 1px 22px),repeating-linear-gradient(90deg,rgba(45,125,255,0.05) 0 1px,transparent 1px 22px);">
            <div style="font-size:16px;font-weight:800;color:#eaf3ff;letter-spacing:1px;margin-bottom:4px;">BEM-VINDO!</div>
            <div style="font-size:11.5px;color:#8fa8cf;line-height:1.5;">Selecione o robô que deseja iniciar e automatize suas tarefas.</div>
            <div style="font-size:9.5px;color:#7f97bd;letter-spacing:1.4px;font-weight:700;margin:11px 0 5px;">PESQUISAR CONVENIO</div>
            <div style="position:relative;">
                <input id="cr-busca" type="text" autocomplete="off" spellcheck="false" placeholder="Digite o nome do convênio..."
                    style="width:100%;box-sizing:border-box;background:#0b1526;border:1px solid #24559b;border-radius:16px;
                           padding:8px 30px 8px 13px;color:#eaf3ff;font-size:12px;font-family:inherit;outline:none;">
                <div id="cr-busca-limpar" title="Limpar" style="display:none;position:absolute;right:9px;top:50%;transform:translateY(-50%);
                    width:17px;height:17px;border-radius:50%;background:#1b2c4a;color:#cfe0ff;font-size:11px;line-height:17px;
                    text-align:center;cursor:pointer;user-select:none;">×</div>
            </div>
        </div>

        <div id="cr-vazio" style="display:none;text-align:center;color:#8fa8cf;font-size:11.5px;padding:18px 10px;line-height:1.6;">
            Nenhum convênio encontrado.<br><span style="color:#5f7aa3;font-size:10.5px;">Apague a pesquisa para ver todos.</span>
        </div>

        <div id="cr-lista" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:10px;overflow-y:auto;padding-right:4px;flex:1 1 auto;min-height:70px;align-content:start;"></div>

        <div style="display:flex;align-items:flex-start;justify-content:center;gap:56px;margin:14px 0 4px;">
            <div id="cr-fechar-app" style="text-align:center;cursor:pointer;">
                <div style="width:52px;height:52px;margin:0 auto;border-radius:50%;border:2px solid #b91f16;background:radial-gradient(circle at 35% 30%, #1c0d12, #12060a);display:flex;align-items:center;justify-content:center;font-size:22px;color:#ff5040;box-shadow:0 0 12px rgba(226,59,46,0.5);">✖</div>
                <div style="margin-top:6px;font-size:9.5px;font-weight:700;letter-spacing:1px;color:#e8f1ff;">FECHAR APP</div>
            </div>
            <div id="cr-marcador" style="text-align:center;cursor:pointer;">
                <div id="cr-marcador-icone" style="width:52px;height:52px;margin:0 auto;border-radius:50%;border:2px solid #17a2b8;background:radial-gradient(circle at 35% 30%, #0a1b26, #06121c);display:flex;align-items:center;justify-content:center;font-size:24px;color:#4dc3ff;box-shadow:0 0 12px rgba(23,162,184,0.5);transition:all .25s ease;">☐</div>
                <div id="cr-marcador-label" style="margin-top:6px;font-size:9.5px;font-weight:700;letter-spacing:.5px;color:#4dc3ff;">marcador de checkboxes</div>
            </div>
        </div>

        <div style="display:flex;justify-content:center;gap:6px;margin:4px 0 5px;flex-wrap:wrap;">
            <span class="cr-ferramenta" data-painel="historico">🕘 Histórico</span>
            <span class="cr-ferramenta" data-painel="estatisticas">📈 Estatísticas</span>
            <span class="cr-ferramenta" data-painel="logs">📄 Logs</span>
            <span class="cr-ferramenta" data-painel="versao">⚙️ Versão</span>
        </div>

        <div id="cr-rodape" style="text-align:center;font-size:9.5px;color:#3d5a85;">Versão do Sistema ${CR.versao}</div>
    `;

    /* ── TELA 2: janela de códigos (uma para todos os robôs) ────── */
    const telaJanela = document.createElement('div');
    telaJanela.id = 'cr-janela';
    telaJanela.style.cssText = 'display:none;position:relative;padding:8px 9px 8px 10px;flex:1;min-height:0;overflow-y:auto;overflow-x:hidden;cursor:default;border-radius:10px;';
    telaJanela.innerHTML = `
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:12px;">
            <div id="cr-voltar" style="width:34px;height:34px;border-radius:50%;background:#0e1a2e;border:1px solid #223a5e;display:flex;align-items:center;justify-content:center;font-size:16px;color:#cfe0ff;cursor:pointer;flex-shrink:0;">←</div>
            <div id="cr-j-icone" style="width:44px;height:44px;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:22px;flex-shrink:0;background:linear-gradient(135deg,#2d7dff,#1a5bcc);box-shadow:0 0 12px rgba(45,125,255,0.5);">📝</div>
            <div style="flex:1;min-width:0;">
                <div id="cr-j-nome" style="font-size:16px;font-weight:800;color:#eaf3ff;letter-spacing:.5px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">CONVÊNIO</div>
                <div id="cr-j-desc" style="font-size:10.5px;color:#8fa8cf;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">Automação</div>
            </div>
            <div id="cr-j-fechar" style="display:flex;align-items:center;gap:6px;background:#2a0f14;border:1px solid #b91f16;border-radius:16px;padding:6px 12px;font-size:10px;font-weight:800;color:#ff6b5e;letter-spacing:1px;cursor:pointer;flex-shrink:0;">✖ FECHAR</div>
        </div>

        <div id="cr-j-status-robo" style="display:none;font-size:10.5px;border-radius:9px;padding:7px 10px;margin-bottom:10px;"></div>
        <div id="cr-j-aviso" style="display:none;"></div>
        <div id="cr-retomar" style="display:none;"></div>

        <div style="background:#0c1830;border:1px solid #1e3a66;border-radius:14px;padding:14px;">
            <div style="font-size:13.5px;font-weight:800;color:#eaf3ff;letter-spacing:.5px;margin-bottom:4px;">📋 INSERIR CÓDIGOS DO CONVÊNIO</div>
            <div style="font-size:11px;color:#8fa8cf;margin-bottom:12px;">Cole abaixo a lista de códigos do convênio para iniciar a automação.</div>

            <div style="font-size:10px;font-weight:800;color:#4dc3ff;letter-spacing:1px;margin-bottom:6px;">📋 ÁREA PARA COLAR OS CÓDIGOS</div>
            <textarea id="cr-txt-codigos" placeholder="Clique aqui e cole os códigos do convênio" style="display:block;width:100%;min-height:150px;box-sizing:border-box;background:#0a1526;border:2px dashed #2d7dff;border-radius:12px;padding:12px;color:#cfe4ff;font-size:12.5px;font-family:Consolas,monospace;resize:vertical;outline:none;"></textarea>

            <div id="cr-fila-caixa" style="display:none;background:#0a1424;border:1px solid #1b3157;border-radius:10px;padding:10px 12px;margin-top:10px;">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
                    <span style="font-size:10.5px;font-weight:800;color:#4dc3ff;letter-spacing:1px;">📋 FILA</span>
                    <span id="cr-fila-resumo" style="font-size:10px;color:#8fa8cf;"></span>
                </div>
                <div id="cr-fila-itens" style="max-height:118px;overflow-y:auto;font-family:Consolas,monospace;font-size:11px;line-height:1.75;"></div>
            </div>

            <div style="background:#0a1424;border:1px solid #1b3157;border-radius:10px;padding:10px 12px;margin-top:10px;">
                <div style="font-size:10.5px;font-weight:800;color:#4dc3ff;letter-spacing:1px;margin-bottom:5px;">💡 DICAS</div>
                <div style="font-size:10.5px;color:#9db4d8;line-height:1.7;">
                    <span style="color:#2ecc71;">✔</span> Você pode colar vários códigos de uma vez.<br>
                    <span style="color:#2ecc71;">✔</span> Código repetido vira quantidade — e a ordem da colagem é respeitada.
                </div>
            </div>
        </div>

        <button id="cr-iniciar" style="display:block;width:100%;margin-top:14px;padding:14px;background:linear-gradient(180deg,#2d7dff,#1a5bcc);color:#fff;border:1px solid #4dc3ff;border-radius:12px;cursor:pointer;font-weight:800;font-size:14px;letter-spacing:1.5px;box-shadow:0 0 16px rgba(45,125,255,0.5);font-family:inherit;">🚀 INICIAR AUTOMAÇÃO</button>

        <div style="display:flex;gap:8px;margin-top:8px;">
            <button id="cr-limpar" style="flex:1;padding:11px;background:#0e1a2e;color:#9db4d8;border:1px solid #223a5e;border-radius:12px;cursor:pointer;font-weight:700;font-size:12px;letter-spacing:1px;font-family:inherit;">🕐 LIMPAR</button>
            <button id="cr-diagnostico" style="flex:1;padding:11px;background:#0e1a2e;color:#9db4d8;border:1px solid #223a5e;border-radius:12px;cursor:pointer;font-weight:700;font-size:12px;letter-spacing:1px;font-family:inherit;">🛠️ DIAGNÓSTICO</button>
        </div>

        <div id="cr-progresso" style="display:none;"></div>
        <div id="cr-erro" style="display:none;"></div>
        <div id="cr-diag-saida" style="display:none;"></div>
        <div id="cr-exec-status" style="display:none;margin-top:10px;background:#0a1424;border:1px solid #1b3157;border-radius:10px;padding:10px 12px;font-size:11px;color:#9db4d8;line-height:1.5;text-align:center;min-height:16px;white-space:pre-line;"></div>
        <div id="cr-motor-info" style="margin-top:6px;font-size:9.5px;color:#3d5a85;text-align:center;"></div>
    `;

    /* ── TELA 3: painéis auxiliares (histórico, estatísticas, logs) ─ */
    const telaPainel = document.createElement('div');
    telaPainel.id = 'cr-painel';
    telaPainel.style.cssText = 'display:none;position:relative;padding:8px 9px 8px 10px;flex:1;min-height:0;overflow-y:auto;overflow-x:hidden;cursor:default;border-radius:10px;';
    telaPainel.innerHTML = `
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:12px;">
            <div id="cr-p-voltar" style="width:34px;height:34px;border-radius:50%;background:#0e1a2e;border:1px solid #223a5e;display:flex;align-items:center;justify-content:center;font-size:16px;color:#cfe0ff;cursor:pointer;flex-shrink:0;">←</div>
            <div id="cr-p-titulo" style="flex:1;font-size:15px;font-weight:800;color:#eaf3ff;letter-spacing:.5px;">PAINEL</div>
            <span id="cr-p-acao" class="cr-ferramenta" style="display:none;"></span>
        </div>
        <div id="cr-p-corpo" style="font-size:11.5px;color:#cfe0ff;line-height:1.6;"></div>
    `;

    menu.appendChild(telaHome);
    menu.appendChild(telaJanela);
    menu.appendChild(telaPainel);
    document.body.appendChild(menu);

    // ── ALÇAS DE REDIMENSIONAR (8 extremidades, igual janela do Chrome) ─
    const ALTURA_MIN = 430, LARGURA_MIN = 260;
    ['n','s','w','e','nw','ne','sw','se'].forEach(dir => {
        const alca = document.createElement('div');
        alca.className = 'cr-rz cr-rz-' + dir;
        alca.dataset.dir = dir;
        menu.appendChild(alca);
    });

    (() => {
        let dir = null, x0 = 0, y0 = 0, larg0 = 0, alt0 = 0, top0 = 0, esq0 = 0;

        const mover = ev => {
            if (!dir) return;
            const p = ev.touches ? ev.touches[0] : ev;
            const dx = p.clientX - x0, dy = p.clientY - y0;

            if (dir.includes('s')) {
                const h = Math.max(ALTURA_MIN, Math.min(alt0 + dy, window.innerHeight - top0 - 4));
                menu.style.height = h + 'px';
            }
            if (dir.includes('n')) {
                const h = Math.max(ALTURA_MIN, Math.min(alt0 - dy, top0 + alt0 - 4));
                menu.style.height = h + 'px';
                menu.style.top = (top0 + alt0 - h) + 'px';
            }
            if (dir.includes('e')) {
                const w = Math.max(LARGURA_MIN, Math.min(larg0 + dx, window.innerWidth - esq0 - 4));
                menu.style.width = w + 'px';
            }
            if (dir.includes('w')) {
                const w = Math.max(LARGURA_MIN, Math.min(larg0 - dx, esq0 + larg0 - 4));
                menu.style.width = w + 'px';
                menu.style.left = (esq0 + larg0 - w) + 'px';
            }
            ev.preventDefault();
        };

        const parar = () => {
            dir = null;
            document.body.style.userSelect = '';
            document.removeEventListener('mousemove', mover);
            document.removeEventListener('mouseup', parar);
            document.removeEventListener('touchmove', mover);
            document.removeEventListener('touchend', parar);
        };

        const iniciar = ev => {
            const alca = ev.target.closest('.cr-rz');
            if (!alca) return;
            const p = ev.touches ? ev.touches[0] : ev;
            const r = menu.getBoundingClientRect();
            menu.style.left = r.left + 'px';
            menu.style.top = r.top + 'px';
            menu.style.right = 'auto';
            menu.style.bottom = 'auto';
            dir = alca.dataset.dir;
            x0 = p.clientX; y0 = p.clientY;
            larg0 = r.width; alt0 = r.height; top0 = r.top; esq0 = r.left;
            document.body.style.userSelect = 'none';
            document.addEventListener('mousemove', mover);
            document.addEventListener('mouseup', parar);
            document.addEventListener('touchmove', mover, { passive: false });
            document.addEventListener('touchend', parar);
            ev.preventDefault();
            ev.stopPropagation();
        };

        menu.addEventListener('mousedown', iniciar, true);
        menu.addEventListener('touchstart', iniciar, { passive: false, capture: true });
    })();

    // ── ARRASTAR O PAINEL PELA TELA ───────────────────────────────
    (() => {
        let arrastando = false, dx = 0, dy = 0;
        const mover = ev => {
            if (!arrastando) return;
            const p = ev.touches ? ev.touches[0] : ev;
            const larg = menu.offsetWidth;
            let x = p.clientX - dx;
            let y = p.clientY - dy;
            x = Math.max(100 - larg, Math.min(x, window.innerWidth - 100));
            y = Math.max(0, Math.min(y, window.innerHeight - 50));
            menu.style.left = x + 'px';
            menu.style.top = y + 'px';
            ev.preventDefault();
        };
        const parar = () => {
            arrastando = false;
            document.body.style.userSelect = '';
            document.removeEventListener('mousemove', mover);
            document.removeEventListener('mouseup', parar);
            document.removeEventListener('touchmove', mover);
            document.removeEventListener('touchend', parar);
        };
        const iniciar = ev => {
            const alvo = ev.target;
            if (alvo.closest('button, textarea, input, select, a, .cr-card, .cr-rz, #cr-fechar-app, #cr-marcador, #cr-voltar, #cr-j-fechar, #cr-lista')) return;
            // clique em cima de barra de rolagem: deixa o navegador cuidar
            if (alvo.nodeType === 1 && (ev.offsetX > alvo.clientWidth || ev.offsetY > alvo.clientHeight)) return;
            const p = ev.touches ? ev.touches[0] : ev;
            const r = menu.getBoundingClientRect();
            menu.style.left = r.left + 'px';
            menu.style.top = r.top + 'px';
            menu.style.right = 'auto';
            menu.style.bottom = 'auto';
            dx = p.clientX - r.left;
            dy = p.clientY - r.top;
            arrastando = true;
            document.body.style.userSelect = 'none';
            document.addEventListener('mousemove', mover);
            document.addEventListener('mouseup', parar);
            document.addEventListener('touchmove', mover, { passive: false });
            document.addEventListener('touchend', parar);
            ev.preventDefault();
        };
        menu.addEventListener('mousedown', iniciar);
        menu.addEventListener('touchstart', iniciar, { passive: false });
    })();

    // ── MARCADOR DE CHECKBOXES ────────────────────────────────────
    document.getElementById('cr-marcador').onclick = () => {
        let marcados = 0;
        document.querySelectorAll('input[type=checkbox]').forEach(cb => {
            if (!cb.checked && !menu.contains(cb)) { cb.click(); marcados++; }
        });
        const ic = document.getElementById('cr-marcador-icone');
        const lb = document.getElementById('cr-marcador-label');
        ic.innerText = '☑';
        ic.style.color = '#2ecc71';
        ic.style.borderColor = '#2ecc71';
        ic.style.boxShadow = '0 0 16px rgba(46,204,113,0.7)';
        lb.innerText = marcados + ' marcados!';
        lb.style.color = '#2ecc71';
    };

    /* ── FECHAR APP ─────────────────────────────────────────────── */
    document.getElementById('cr-fechar-app').onclick = () => {
        CR.motor.limparPaineisDoRobo();   // não deixa painel escondido para trás
        menu.remove();
    };

    // Monta o quadradinho do convênio: logo quando existir, senão o ícone
    const marcaHtml = (rotulo, icone, cor, tam) => {
        const logo = CR.LOGOS[rotulo];
        if (!logo) {
            return '<div class="cr-marca" style="width:' + tam + 'px;height:' + tam + 'px;border-radius:10px;flex-shrink:0;' +
                'display:flex;align-items:center;justify-content:center;font-size:' + Math.round(tam / 2) + 'px;' +
                'background:linear-gradient(135deg,' + cor + 'cc,' + cor + '55);box-shadow:0 0 10px ' + cor + '55;">' + icone + '</div>';
        }
        return '<div class="cr-marca" style="width:' + tam + 'px;height:' + tam + 'px;border-radius:10px;flex-shrink:0;' +
            'overflow:hidden;background:#fff;box-shadow:0 0 10px ' + cor + '55;display:flex;align-items:center;justify-content:center;">' +
            '<img src="' + logo + '" alt="" style="width:100%;height:100%;object-fit:contain;display:block;">' +
            '</div>';
    };

    // Se o navegador não exibir a logo, volta para o ícone
    const reservaDaMarca = (raiz, icone, cor) => {
        const img = raiz.querySelector('.cr-marca img');
        if (!img) return;
        img.onerror = () => {
            const caixa = img.parentElement;
            caixa.innerHTML = icone;
            caixa.style.background = 'linear-gradient(135deg,' + cor + 'cc,' + cor + '55)';
            caixa.style.fontSize = Math.round(caixa.offsetWidth / 2) + 'px';
        };
    };

    /* ═══════════════════════════════════════════════════════════
     *  ESTADO DA TELA E ATALHOS
     * ═══════════════════════════════════════════════════════════ */
    const campoCodigos = document.getElementById('cr-txt-codigos');
    const btnIniciar = document.getElementById('cr-iniciar');
    const btnLimpar = document.getElementById('cr-limpar');
    const statusExec = document.getElementById('cr-exec-status');
    const caixaProgresso = document.getElementById('cr-progresso');
    const caixaErro = document.getElementById('cr-erro');
    const caixaDiag = document.getElementById('cr-diag-saida');
    const caixaRetomar = document.getElementById('cr-retomar');
    const caixaFila = document.getElementById('cr-fila-caixa');
    const listaFila = document.getElementById('cr-fila-itens');
    const resumoFila = document.getElementById('cr-fila-resumo');
    const container = document.getElementById('cr-lista');

    let textoParaRodar = null;   // usado no "continuar de onde parou"

    const mostrarStatus = (texto, cor) => {
        statusExec.style.display = 'block';
        statusExec.innerText = texto;
        statusExec.style.color = cor || '#9db4d8';
    };

    const modoIniciar = () => {
        btnIniciar.innerHTML = '🚀 INICIAR AUTOMAÇÃO';
        btnIniciar.style.background = 'linear-gradient(180deg,#2d7dff,#1a5bcc)';
        btnIniciar.style.borderColor = '#4dc3ff';
        btnIniciar.style.boxShadow = '0 0 16px rgba(45,125,255,0.5)';
        btnLimpar.style.display = 'block';
        campoCodigos.disabled = false;
    };

    const modoParar = () => {
        btnIniciar.innerHTML = '⏹ PARAR';
        btnIniciar.style.background = 'linear-gradient(180deg,#e23b2e,#b91f16)';
        btnIniciar.style.borderColor = '#ff6b5e';
        btnIniciar.style.boxShadow = '0 0 16px rgba(226,59,46,0.5)';
        btnLimpar.style.display = 'none';
        campoCodigos.disabled = true;
    };

    /* ═══════════════════════════════════════════════════════════
     *  FILA NA TELA
     * ═══════════════════════════════════════════════════════════ */
    const desenharFila = () => {
        const itens = U.montarFila(campoCodigos.value);
        if (!itens.length) { caixaFila.style.display = 'none'; return; }
        const r = U.resumoFila(itens);
        caixaFila.style.display = 'block';
        resumoFila.innerText = r.lancamentos + ' lançamento' + (r.lancamentos > 1 ? 's' : '') +
            ' · ' + r.unicos + ' código' + (r.unicos > 1 ? 's' : '') + ' único' + (r.unicos > 1 ? 's' : '');
        let html = '';
        for (let i = 0; i < itens.length; i++) {
            html += '<div style="display:flex;justify-content:space-between;align-items:center;">' +
                '<span style="color:#cfe4ff;">' + U.escapar(itens[i].cod) +
                (itens[i].qtd > 1 ? ' <span style="color:#f5c518;">×' + itens[i].qtd + '</span>' : '') + '</span>' +
                '<span data-tira="' + U.escapar(itens[i].cod) + '" title="Tirar da fila" ' +
                'style="color:#5f7aa3;cursor:pointer;padding:0 4px;">×</span></div>';
        }
        listaFila.innerHTML = html;
        listaFila.querySelectorAll('[data-tira]').forEach(el => {
            el.onclick = () => {
                if (CR.estado.rodando) return;
                const alvo = el.getAttribute('data-tira');
                const restante = U.montarFila(campoCodigos.value).filter(x => x.cod !== alvo);
                campoCodigos.value = U.filaParaTexto(restante);
                desenharFila();
            };
        });
    };

    /* ═══════════════════════════════════════════════════════════
     *  PAINEL DE PROGRESSO
     * ═══════════════════════════════════════════════════════════ */
    /* Enquanto roda: diz se o segundo plano está de pé, com o número medido.
       Quando o atendente volta de outra aba, é aqui que ele vê se o robô
       trabalhou ou se a aba foi congelada pelo navegador. */
    const rodapeSegundoPlano = () => {
        const b = CR.estado.batida;
        const pior = CR.estado.piorBatida;
        let linha = '🔽 Pode minimizar e trabalhar em outra aba — o robô continua daqui.';
        let cor = '#2ecc71';

        if (b && b.paradaHa > 4000) {
            cor = '#ff6b5e';
            linha = '⚠️ O navegador segurou esta aba por ' + Math.round(b.paradaHa / 1000) +
                's. Deixe-a à vista até terminar.';
        } else if (pior !== undefined && pior < 3) {
            cor = '#ffd633';
            linha = '⚠️ Em segundo plano o robô ficou lento (' + pior +
                ' batidas/s). Terminando, confira a lista no portal.';
        } else if (pior !== undefined) {
            linha = '🔽 Segundo plano funcionando (' + pior + ' batidas/s minimizado).';
        }

        return '<div style="margin-top:9px;padding-top:8px;border-top:1px solid #1b3157;' +
            'font-size:10.5px;color:' + cor + ';line-height:1.5;">' + linha + '</div>';
    };

    /* Ao terminar: se sobrou código, isso tem de aparecer em vermelho.
       "Concluída" com item faltando faz o atendente fechar a guia sem conferir. */
    const rodapeFinal = d => {
        const faltam = Math.max(0, d.total - d.feitos);
        if (!d.total || faltam === 0) return '';
        const fila = CR.estado.fila;
        const lista = fila ? CR.fila.pendentes(fila).map(i => i.cod).join(', ') : '';
        return '<div style="margin-top:9px;padding-top:8px;border-top:1px solid #b91f16;' +
            'font-size:10.5px;color:#ff8f83;line-height:1.6;">' +
            '<b>⚠️ FALTARAM ' + faltam + ' de ' + d.total + '</b><br>' +
            (lista ? '<span style="font-family:Consolas,monospace;">' + U.escapar(lista) + '</span><br>' : '') +
            'Confira no portal e lance à mão, ou clique em INICIAR para continuar de onde parou.</div>';
    };

    const desenharProgresso = d => {
        if (!d || (!d.total && !d.rodando)) { caixaProgresso.style.display = 'none'; return; }
        const pct = U.percentual(d.feitos, d.total);
        const pendentes = Math.max(0, d.total - d.feitos - d.erros);
        caixaProgresso.style.display = 'block';
        caixaProgresso.style.cssText = 'display:block;margin-top:10px;background:#0a1424;border:1px solid #1b3157;' +
            'border-radius:12px;padding:12px;text-align:left;';
        caixaProgresso.innerHTML =
            '<div style="font-size:11px;font-weight:800;color:#4dc3ff;letter-spacing:1.2px;margin-bottom:8px;">' +
            (d.rodando ? '⏳ AUTOMAÇÃO EM ANDAMENTO' : '⏹ AUTOMAÇÃO PARADA') + '</div>' +
            '<div style="font-size:11px;color:#9db4d8;margin-bottom:8px;">Convênio: <b style="color:#eaf3ff;">' +
            U.escapar(d.convenio) + '</b></div>' +
            '<div style="background:#0b1526;border-radius:8px;height:12px;overflow:hidden;border:1px solid #1b3157;">' +
            '<div style="height:100%;width:' + pct + '%;background:linear-gradient(90deg,#2d7dff,#4dc3ff);' +
            'transition:width .3s ease;"></div></div>' +
            '<div style="text-align:right;font-size:10.5px;color:#4dc3ff;font-weight:800;margin-top:3px;">' + pct + '%</div>' +
            (d.codigoAtual ? '<div style="font-size:11px;color:#9db4d8;margin-top:5px;">Código atual: ' +
                '<span style="font-family:Consolas,monospace;color:#eaf3ff;">' + U.escapar(d.codigoAtual) + '</span></div>' : '') +
            '<div style="font-size:11px;color:#9db4d8;">Item: ' + Math.min(d.feitos + 1, d.total) + ' de ' + d.total + '</div>' +
            '<div style="display:flex;gap:12px;margin-top:8px;font-size:11px;">' +
            '<span style="color:#2ecc71;">✓ ' + d.feitos + ' concluídos</span>' +
            '<span style="color:#4dc3ff;">⏳ ' + pendentes + ' pendentes</span>' +
            '<span style="color:' + (d.erros ? '#ff6b5e' : '#5f7aa3') + ';">⚠ ' + d.erros + ' erros</span>' +
            '</div>' +
            (d.rodando ? rodapeSegundoPlano() : rodapeFinal(d));
    };

    /* ═══════════════════════════════════════════════════════════
     *  CONTINUAR DE ONDE PAROU
     * ═══════════════════════════════════════════════════════════ */
    const oferecerRetomada = chave => {
        caixaRetomar.style.display = 'none';
        const pendente = CR.fila.temPendencia(chave);
        if (!pendente) return;
        const c = CR.fila.contagem(pendente);
        caixaRetomar.style.display = 'block';
        caixaRetomar.style.cssText = 'display:block;background:#0d2033;border:1px solid #2d7dff;border-radius:12px;' +
            'padding:12px;margin-bottom:12px;font-size:11.5px;color:#cfe0ff;line-height:1.6;';
        caixaRetomar.innerHTML =
            '<div style="font-weight:800;color:#4dc3ff;letter-spacing:.8px;margin-bottom:5px;">▶ AUTOMAÇÃO INTERROMPIDA</div>' +
            'A última tentativa neste convênio parou com <b>' + c.feitos + ' de ' + c.total +
            '</b> códigos já lançados (' + U.dataHora(pendente.criadaEm) + ').' +
            '<div style="display:flex;gap:6px;margin-top:10px;">' +
            '<span data-cr="retomar" style="flex:2;text-align:center;background:#0e1a2e;border:1px solid #2d7dff;color:#cfe0ff;' +
            'border-radius:9px;padding:7px;font-size:10px;font-weight:800;cursor:pointer;">CONTINUAR DE ONDE PAROU</span>' +
            '<span data-cr="descartar" style="flex:1;text-align:center;background:#0e1a2e;border:1px solid #223a5e;color:#9db4d8;' +
            'border-radius:9px;padding:7px;font-size:10px;font-weight:800;cursor:pointer;">COMEÇAR DO ZERO</span></div>';

        caixaRetomar.querySelector('[data-cr="retomar"]').onclick = () => {
            campoCodigos.value = CR.fila.pendentesComoTexto(pendente);
            desenharFila();
            caixaRetomar.style.display = 'none';
            mostrarStatus('▶ Fila carregada só com o que faltava (' +
                CR.fila.pendentes(pendente).length + ' códigos). Clique em INICIAR.', '#4dc3ff');
        };
        caixaRetomar.querySelector('[data-cr="descartar"]').onclick = () => {
            CR.fila.descartar(chave);
            caixaRetomar.style.display = 'none';
        };
    };

    /* ═══════════════════════════════════════════════════════════
     *  CARDS DOS CONVÊNIOS
     * ═══════════════════════════════════════════════════════════ */
    const cardsPorChave = [];

    /* ═══════════════════════════════════════════════════════════
     *  SITUAÇÃO DO CONVÊNIO NO CARD
     *
     *  Quando o status.json marca um convênio como fora do ar, em
     *  manutenção ou com o site inconsistente, o CARD INTEIRO muda de
     *  cor e ganha uma faixa com o recado. Assim dá para ver de longe,
     *  sem precisar abrir o convênio para descobrir.
     * ═══════════════════════════════════════════════════════════ */
    const pintarCard = (card, chave) => {
        /* limpa qualquer marca anterior */
        const faixaAntiga = card.querySelector('[data-cr-estado]');
        if (faixaAntiga) faixaAntiga.remove();
        card.style.borderColor = '#1e2a44';
        card.style.background = '#10182b';
        card.style.opacity = '1';

        const e = CR.avisos.estadoDe(chave);
        if (!e || e.chave === 'ok' || !e.borda) return;

        card.style.borderColor = e.borda;
        card.style.background = e.fundo;
        if (e.apagado) card.style.opacity = '0.72';

        const faixa = document.createElement('div');
        faixa.setAttribute('data-cr-estado', '1');
        faixa.style.cssText = 'margin-top:9px;padding-top:7px;border-top:1px solid ' + e.borda +
            ';font-size:9.5px;font-weight:700;line-height:1.4;color:' + e.cor + ';';
        faixa.innerHTML = e.icone + ' ' + U.escapar(e.texto);
        card.appendChild(faixa);
    };


    for (const item of CR.EXIBICAO) {
        const { rotulo, icone, cor, desc } = item;
        const card = document.createElement('div');
        card.className = 'cr-card';
        card.style.cssText = `
            position: relative;
            background: #10182b;
            border: 1px solid #1e2a44;
            border-radius: 12px;
            padding: 12px 12px 14px;
            cursor: pointer;
            transition: all .15s ease;
        `;
        card.innerHTML = `
            <div style="display:flex;align-items:flex-start;gap:9px;">
                ${marcaHtml(rotulo, icone, cor, 38)}
                <div style="flex:1;min-width:0;">
                    <div style="font-size:12px;font-weight:800;color:#eaf3ff;line-height:1.25;word-break:break-word;">${rotulo}</div>
                    <div style="font-size:9.5px;color:#8fa8cf;line-height:1.4;margin-top:3px;">${desc}</div>
                </div>
                <div class="cr-seta" style="width:22px;height:22px;border-radius:50%;flex-shrink:0;background:#0e1a2e;border:1px solid #223a5e;display:flex;align-items:center;justify-content:center;font-size:11px;color:#cfe0ff;transition:all .15s ease;align-self:center;">›</div>
            </div>
            <div style="position:absolute;bottom:8px;left:14px;width:26px;height:3px;border-radius:2px;background:${cor};"></div>
        `;
        reservaDaMarca(card, icone, cor);
        cardsPorChave.push({ el: card, chave: item.chave });
        U.seguro(() => pintarCard(card, item.chave), 'status-card');
        card.onclick = () => abrirJanelaCodigos(item);
        /* busca por nome, descrição, chave do robô e apelidos */
        card.dataset.busca = U.semAcento(rotulo + ' ' + desc + ' ' + item.chave);
        container.appendChild(card);
    }

    /* ── PESQUISA DE CONVÊNIO ──────────────────────────────────── */
    (function () {
        const campo = document.getElementById('cr-busca');
        const limpar = document.getElementById('cr-busca-limpar');
        const vazio = document.getElementById('cr-vazio');
        if (!campo) return;

        const filtrar = () => {
            const termo = U.semAcento(campo.value.trim());
            limpar.style.display = campo.value ? 'block' : 'none';
            let achou = 0;
            const cards = container.querySelectorAll('.cr-card');
            for (let i = 0; i < cards.length; i++) {
                const bate = !termo || (cards[i].dataset.busca || '').indexOf(termo) !== -1;
                cards[i].style.display = bate ? '' : 'none';
                if (bate) achou++;
            }
            vazio.style.display = achou ? 'none' : 'block';
        };

        campo.addEventListener('input', filtrar);
        campo.addEventListener('keydown', e => {
            if (e.key === 'Escape') { campo.value = ''; filtrar(); }
            if (e.key === 'Enter') {
                const visiveis = [...container.querySelectorAll('.cr-card')].filter(c => c.style.display !== 'none');
                if (visiveis.length === 1) visiveis[0].click();
            }
        });
        limpar.onclick = () => { campo.value = ''; filtrar(); campo.focus(); };
    })();

    /* ═══════════════════════════════════════════════════════════
     *  ABRIR A JANELA DE CÓDIGOS DE UM CONVÊNIO
     * ═══════════════════════════════════════════════════════════ */
    const abrirJanelaCodigos = item => {
        if (CR.estado.rodando) {
            alert('Há uma automação em andamento. Pare ela antes de escolher outro convênio.');
            return;
        }
        CR.estado.roboAtual = item.chave;
        document.getElementById('cr-j-nome').innerText = item.rotulo;
        document.getElementById('cr-j-desc').innerText = item.desc;

        const ic = document.getElementById('cr-j-icone');
        const logo = CR.LOGOS[item.rotulo];
        if (logo) {
            ic.innerHTML = '<img src="' + logo + '" alt="" style="width:100%;height:100%;object-fit:contain;display:block;">';
            ic.style.background = '#fff';
            ic.style.overflow = 'hidden';
        } else {
            ic.innerText = item.icone;
            ic.style.background = 'linear-gradient(135deg,' + item.cor + 'cc,' + item.cor + '66)';
        }
        ic.style.boxShadow = '0 0 12px ' + item.cor + '80';

        campoCodigos.value = '';
        CR.auto.zerarUnimed();
        statusExec.style.display = 'none';
        caixaProgresso.style.display = 'none';
        caixaErro.style.display = 'none';
        caixaDiag.style.display = 'none';
        caixaFila.style.display = 'none';
        const infoMotor = document.getElementById('cr-motor-info');
        if (infoMotor) infoMotor.innerText = '';

        /* situação do robô, se a equipe tiver informado no status.json */
        const estado = CR.avisos.estadoDe(item.chave);
        const barra = document.getElementById('cr-j-status-robo');
        if (estado) {
            barra.style.display = 'block';
            barra.style.cssText = 'display:block;font-size:10.5px;border-radius:9px;padding:7px 10px;margin-bottom:10px;' +
                'background:#0a1424;border:1px solid ' + estado.cor + '55;color:' + estado.cor + ';';
            barra.innerHTML = estado.icone + ' ' + U.escapar(estado.texto);
        } else {
            barra.style.display = 'none';
        }

        CR.avisos.desenharDoConvenio(document.getElementById('cr-j-aviso'), item.chave);
        oferecerRetomada(item.chave);

        modoIniciar();
        telaHome.style.display = 'none';
        telaPainel.style.display = 'none';
        telaJanela.style.display = 'block';
        CR.log.info('Convênio aberto: ' + item.rotulo + ' (robô ' + item.chave + ')');
    };

    /* ═══════════════════════════════════════════════════════════
     *  PAINÉIS: HISTÓRICO, ESTATÍSTICAS, LOGS, VERSÃO
     * ═══════════════════════════════════════════════════════════ */
    const abrirPainel = qual => {
        const titulo = document.getElementById('cr-p-titulo');
        const corpo = document.getElementById('cr-p-corpo');
        const acao = document.getElementById('cr-p-acao');
        acao.style.display = 'none';
        acao.onclick = null;

        if (qual === 'historico') {
            titulo.innerText = '🕘 HISTÓRICO';
            const lista = CR.historico.listar();
            if (!lista.length) {
                corpo.innerHTML = '<div style="color:#8fa8cf;text-align:center;padding:24px 8px;">Nenhuma automação registrada ainda.</div>';
            } else {
                let html = '';
                lista.forEach(h => {
                    const m = CR.historico.marca(h.situacao);
                    html += '<div style="background:#0a1424;border:1px solid #1b3157;border-radius:10px;padding:10px 12px;margin-bottom:8px;">' +
                        '<div style="display:flex;justify-content:space-between;">' +
                        '<b style="color:#eaf3ff;">' + U.escapar(h.convenio) + '</b>' +
                        '<span style="color:#7f97bd;font-size:10px;">' + U.dataHora(h.em) + '</span></div>' +
                        '<div style="color:#9db4d8;font-size:10.5px;margin-top:3px;">' +
                        h.total + ' códigos · <span style="color:' + m.cor + ';">' + m.icone + ' ' + h.feitos + ' processados</span>' +
                        (h.erros ? ' · <span style="color:#ff6b5e;">⚠ ' + h.erros + ' erro(s)</span>' : '') +
                        ' · ' + U.formatarDuracao(h.duracao) + '</div>' +
                        (h.mensagem ? '<div style="color:#7f97bd;font-size:10px;margin-top:4px;white-space:pre-line;">' +
                            U.escapar(h.mensagem) + '</div>' : '') + '</div>';
                });
                corpo.innerHTML = html;
                acao.style.display = 'inline-block';
                acao.innerText = '📋 Copiar';
                acao.onclick = () => {
                    acao.innerText = U.copiar(CR.historico.texto()) ? '✔ Copiado' : '✖ Não deu';
                    setTimeout(() => { acao.innerText = '📋 Copiar'; }, 1800);
                };
            }
        }

        if (qual === 'estatisticas') {
            titulo.innerText = '📈 ESTATÍSTICAS';
            const e = CR.stats.paraTela();
            const bloco = (rot, val, cor) =>
                '<div style="background:#0a1424;border:1px solid #1b3157;border-radius:10px;padding:11px 13px;margin-bottom:8px;">' +
                '<div style="font-size:9.5px;color:#7f97bd;letter-spacing:1.2px;font-weight:700;">' + rot + '</div>' +
                '<div style="font-size:19px;font-weight:800;color:' + (cor || '#eaf3ff') + ';margin-top:2px;">' + val + '</div></div>';
            corpo.innerHTML =
                bloco('AUTOMAÇÕES REALIZADAS', e.automacoes) +
                bloco('CÓDIGOS PROCESSADOS', e.codigos, '#4dc3ff') +
                bloco('TEMPO ESTIMADO ECONOMIZADO', e.economia, '#2ecc71') +
                bloco('CONVÊNIO MAIS UTILIZADO', U.escapar(e.convenioMaisUsado)) +
                bloco('ROBÔ MAIS RÁPIDO', U.escapar(e.roboMaisRapido)) +
                '<div style="font-size:10px;color:#5f7aa3;line-height:1.6;margin-top:4px;">' +
                'O tempo economizado é uma <b>estimativa</b>: considera ' + CR.stats.SEGUNDOS_POR_CODIGO_NA_MAO +
                's para digitar cada código à mão, menos o tempo que o robô levou. ' +
                'Os números saem do histórico deste navegador.</div>';
        }

        if (qual === 'logs') {
            titulo.innerText = '📄 LOGS';
            const linhas = CR.log.tudo();
            let html = '<div style="background:#050b16;border:1px solid #1b3157;border-radius:10px;padding:10px;' +
                'font-family:Consolas,monospace;font-size:10.5px;line-height:1.6;max-height:none;">';
            if (!linhas.length) html += '<span style="color:#5f7aa3;">Nada registrado ainda nesta sessão.</span>';
            linhas.slice().reverse().forEach(l => {
                html += '<div><span style="color:#3d5a85;">[' + U.hora(l.t) + ']</span> ' +
                    '<span style="color:' + (CR.log.cores[l.nivel] || '#9db4d8') + ';">[' + l.nivel + ']</span> ' +
                    '<span style="color:#cfe0ff;">' + U.escapar(l.msg) + '</span></div>';
            });
            html += '</div>';
            corpo.innerHTML = html;
            acao.style.display = 'inline-block';
            acao.innerText = '📋 Copiar';
            acao.onclick = () => {
                acao.innerText = U.copiar(CR.log.texto()) ? '✔ Copiado' : '✖ Não deu';
                setTimeout(() => { acao.innerText = '📋 Copiar'; }, 1800);
            };
        }

        if (qual === 'versao') {
            titulo.innerText = '⚙️ VERSÃO';
            corpo.innerHTML =
                '<div style="background:#0a1424;border:1px solid #1b3157;border-radius:10px;padding:12px;margin-bottom:9px;">' +
                '<div style="font-size:9.5px;color:#7f97bd;letter-spacing:1.2px;font-weight:700;">VERSÃO ATUAL</div>' +
                '<div style="font-size:22px;font-weight:800;color:#4dc3ff;">' + U.escapar(CR.versao) + '</div>' +
                '<div style="color:#2ecc71;font-size:11px;margin-top:3px;">✓ Você está com a versão que está no repositório</div>' +
                '<div style="color:#7f97bd;font-size:10px;margin-top:6px;line-height:1.6;">' +
                'O favorito busca sempre o arquivo mais recente. Se você acabou de atualizar o repositório, ' +
                'basta fechar e clicar no favorito de novo.</div></div>' +
                '<div style="background:#0a1424;border:1px solid #1b3157;border-radius:10px;padding:12px;margin-bottom:9px;">' +
                '<div style="font-size:9.5px;color:#7f97bd;letter-spacing:1.2px;font-weight:700;">MÓDULOS CARREGADOS</div>' +
                '<div style="color:#cfe0ff;font-size:11px;margin-top:4px;line-height:1.7;">' +
                Object.keys(CR.fichas).length + ' robôs · ' + CR.EXIBICAO.length + ' cards de convênio<br>' +
                (CR.modulosCarregados || 0) + ' arquivos carregados em ' + (CR.tempoCarga || '?') + 'ms</div></div>' +
                '<div style="background:#0a1424;border:1px solid #1b3157;border-radius:10px;padding:12px;margin-bottom:9px;">' +
                '<div style="font-size:9.5px;color:#7f97bd;letter-spacing:1.2px;font-weight:700;">GUARDADO NESTE NAVEGADOR</div>' +
                '<div style="font-size:19px;font-weight:800;color:#eaf3ff;margin-top:2px;">' +
                (U.tamanhoGuardado() / 1024).toFixed(1) + ' KB</div>' +
                '<div style="color:#7f97bd;font-size:10px;margin-top:5px;line-height:1.6;">' +
                'Histórico (teto de 60 execuções), avisos já lidos e filas de automação ' +
                'interrompida. Não cresce sem parar e nunca sai deste computador.</div>' +
                '<div style="text-align:right;margin-top:8px;">' +
                '<span data-cr="limpar-dados" style="display:inline-block;background:#2a0f14;border:1px solid #b91f16;' +
                'color:#ff9d93;border-radius:9px;padding:5px 12px;font-size:10px;font-weight:800;cursor:pointer;">' +
                '🗑 APAGAR TUDO</span></div></div>' +

                '<div style="background:#0a1424;border:1px solid #1b3157;border-radius:10px;padding:12px;margin-bottom:9px;">' +
                '<div style="font-size:9.5px;color:#7f97bd;letter-spacing:1.2px;font-weight:700;">SEGUNDO PLANO</div>' +
                '<div style="color:#cfe0ff;font-size:10.5px;margin-top:4px;line-height:1.6;">' +
                'Mede, neste portal, se a automação continua andando com a janela minimizada. ' +
                'Portal com regra de segurança apertada pode barrar a batida — este teste diz ' +
                'se é o caso <b>aqui</b>, em vez de a gente ficar adivinhando.</div>' +
                '<div id="cr-sp-saida" style="display:none;margin-top:9px;"></div>' +
                '<div style="text-align:right;margin-top:8px;">' +
                '<span data-cr="testar-sp" style="display:inline-block;background:#0e1a2e;border:1px solid #2d7dff;' +
                'color:#cfe0ff;border-radius:9px;padding:5px 12px;font-size:10px;font-weight:800;cursor:pointer;">' +
                '🔽 TESTAR SEGUNDO PLANO</span></div></div>' +

                '<div style="background:#0a1424;border:1px solid #1b3157;border-radius:10px;padding:12px;">' +
                '<div style="font-size:9.5px;color:#7f97bd;letter-spacing:1.2px;font-weight:700;">VOLTAR PARA UMA VERSÃO ANTERIOR</div>' +
                '<div style="color:#cfe0ff;font-size:10.5px;margin-top:4px;line-height:1.7;">' +
                'As versões ficam guardadas na pasta <b>releases/</b> do repositório. ' +
                'Para voltar, troque o endereço do favorito pelo arquivo da versão desejada — ' +
                'está explicado no <b>README</b>.</div></div>';

            const bTeste = corpo.querySelector('[data-cr="testar-sp"]');
            if (bTeste) bTeste.onclick = () => iniciarTesteSegundoPlano(bTeste);

            const bLimpar = corpo.querySelector('[data-cr="limpar-dados"]');
            if (bLimpar) bLimpar.onclick = () => {
                if (!confirm('Apagar o histórico, as estatísticas, os avisos já lidos e as ' +
                    'filas guardadas deste navegador?\n\nOs robôs e os convênios não são afetados.')) return;
                U.apagarTudo();
                CR.log.info('Dados guardados apagados pelo usuário');
                abrirPainel('versao');
            };
        }

        telaHome.style.display = 'none';
        telaJanela.style.display = 'none';
        telaPainel.style.display = 'block';
    };

    telaHome.querySelectorAll('.cr-ferramenta').forEach(b => {
        b.onclick = () => abrirPainel(b.getAttribute('data-painel'));
    });

    /* ═══════════════════════════════════════════════════════════
     *  TESTE DE SEGUNDO PLANO
     *
     *  Mede de verdade, NESTE portal, quantas batidas chegam enquanto
     *  a janela está minimizada. É a diferença entre saber e achar:
     *  se o portal barrar a batida boa, o teste mostra na hora, com o
     *  motivo, em vez de a automação simplesmente congelar no meio.
     * ═══════════════════════════════════════════════════════════ */
    let testeSP = null;

    const iniciarTesteSegundoPlano = (botao) => {
        if (CR.estado.rodando) {
            alert('Há uma automação em andamento. Espere ela terminar para fazer o teste.');
            return;
        }
        const saida = document.getElementById('cr-sp-saida');
        if (!saida) return;

        if (testeSP) { encerrarTesteSegundoPlano(); return; }

        CR.motor.ligar(false);

        testeSP = {
            inicio: Date.now(), batidas: 0, escondidas: 0, maiorVao: 0,
            ultimo: Date.now(), tempoEscondido: 0, viuEscondido: false
        };

        testeSP.iv = setInterval(() => {
            const agora = Date.now();
            const vao = agora - testeSP.ultimo;
            if (vao > testeSP.maiorVao) testeSP.maiorVao = vao;
            if (CR.motor.escondidoDeVerdade()) {
                testeSP.escondidas++;
                testeSP.tempoEscondido += vao;
                testeSP.viuEscondido = true;
            }
            testeSP.ultimo = agora;
            testeSP.batidas++;
            desenharTesteSP(saida);
        }, 100);

        botao.innerText = '⏹ VER RESULTADO';
        desenharTesteSP(saida);
    };

    const desenharTesteSP = (saida) => {
        if (!testeSP) return;
        const seg = Math.round((Date.now() - testeSP.inicio) / 1000);
        saida.style.display = 'block';
        saida.style.cssText = 'display:block;margin-top:9px;background:#0d2033;border:1px solid #2d7dff;' +
            'border-radius:10px;padding:11px;font-size:10.5px;color:#cfe0ff;line-height:1.6;';
        saida.innerHTML =
            '<b style="color:#4dc3ff;">MEDINDO...</b><br>' +
            'Agora <b>minimize esta janela</b> (ou vá para outra aba) e volte depois de uns ' +
            '<b>30 segundos</b>. Depois clique em <b>VER RESULTADO</b>.<br><br>' +
            'Tempo: ' + seg + 's · batidas: ' + testeSP.batidas +
            ' · escondida: ' + Math.round(testeSP.tempoEscondido / 1000) + 's';
    };

    const encerrarTesteSegundoPlano = () => {
        if (!testeSP) return;
        clearInterval(testeSP.iv);

        const esperadas = Math.round(testeSP.tempoEscondido / 100);
        const obtidas = testeSP.escondidas;
        const aproveitamento = esperadas > 0 ? Math.round((obtidas / esperadas) * 100) : 0;
        const batida = CR.motor.batidaAtiva();
        const porque = CR.motor.porqueSemOperario();

        let veredito, cor;
        if (!testeSP.viuEscondido) {
            veredito = 'Você não chegou a minimizar a janela — o teste não mediu nada. ' +
                'Clique de novo e minimize por uns 30 segundos.';
            cor = '#ffd633';
        } else if (aproveitamento >= 80) {
            veredito = 'FUNCIONANDO. A automação continua no mesmo ritmo com a janela minimizada.';
            cor = '#2ecc71';
        } else if (aproveitamento >= 30) {
            veredito = 'PARCIAL. Continua andando, mas mais devagar do que deveria.';
            cor = '#ffd633';
        } else {
            veredito = 'NÃO ESTÁ FUNCIONANDO neste portal. Ele barrou a batida e o Chrome freou ' +
                'a página. Evite minimizar durante a automação aqui.';
            cor = '#ff6b5e';
        }

        const linhas = [
            'Tempo minimizada: ' + Math.round(testeSP.tempoEscondido / 1000) + 's',
            'Batidas esperadas: ' + esperadas + ' · recebidas: ' + obtidas + ' (' + aproveitamento + '%)',
            'Maior parada: ' + testeSP.maiorVao + 'ms',
            'Batida em uso: ' + batida,
            porque ? 'Operário recusado: ' + porque : 'Operário: criado normalmente',
            'Trocas de batida durante o teste: ' + CR.motor.escalonamentos()
        ];

        const saida = document.getElementById('cr-sp-saida');
        if (saida) {
            saida.innerHTML =
                '<div style="font-weight:800;color:' + cor + ';margin-bottom:6px;">' + U.escapar(veredito) + '</div>' +
                linhas.map(l => '<div style="color:#9db4d8;">' + U.escapar(l) + '</div>').join('') +
                '<div style="text-align:right;margin-top:8px;">' +
                '<span data-cr="copiar-sp" style="display:inline-block;background:#0e1a2e;border:1px solid #223a5e;' +
                'color:#cfe0ff;border-radius:9px;padding:5px 12px;font-size:10px;font-weight:800;cursor:pointer;">' +
                '📋 COPIAR</span></div>';
            const b = saida.querySelector('[data-cr="copiar-sp"]');
            if (b) b.onclick = () => {
                const rel = ['TESTE DE SEGUNDO PLANO — Central ' + CR.versao,
                             'Página: ' + location.href, 'Quando: ' + U.dataHora(), '',
                             veredito, ''].concat(linhas).join('\n');
                b.innerText = U.copiar(rel) ? '✔ COPIADO' : '✖ NÃO DEU';
            };
        }

        CR.log.info('Teste de segundo plano: ' + aproveitamento + '% · ' + batida);
        if (!CR.estado.rodando) CR.motor.desligar();
        testeSP = null;

        const botao = document.querySelector('[data-cr="testar-sp"]');
        if (botao) botao.innerText = '🔽 TESTAR DE NOVO';
    };

    /* ═══════════════════════════════════════════════════════════
     *  BOTÕES
     * ═══════════════════════════════════════════════════════════ */
    const voltarParaHome = () => {
        telaJanela.style.display = 'none';
        telaPainel.style.display = 'none';
        telaHome.style.display = 'flex';
    };

    document.getElementById('cr-voltar').onclick = voltarParaHome;
    document.getElementById('cr-p-voltar').onclick = voltarParaHome;

    document.getElementById('cr-j-fechar').onclick = () => {
        CR.motor.encerrarModoAutomacao();
        menu.remove();
    };

    btnLimpar.onclick = () => {
        campoCodigos.value = '';
        desenharFila();
        campoCodigos.focus();
    };

    campoCodigos.addEventListener('input', desenharFila);
    campoCodigos.addEventListener('paste', () => setTimeout(desenharFila, 30));

    document.getElementById('cr-diagnostico').onclick = () => {
        caixaDiag.style.display = 'block';
        CR.diag.desenhar(caixaDiag, CR.estado.roboAtual);
    };

    btnIniciar.onclick = () => {
        if (CR.estado.rodando) { CR.auto.parar(); return; }
        const texto = campoCodigos.value;
        if (!texto.trim()) {
            alert('Cole os códigos do convênio antes de iniciar!');
            return;
        }

        /* Convênio marcado no status.json como fora do ar ou em manutenção:
           avisa antes, mas deixa seguir se a pessoa quiser mesmo. */
        const estado = CR.avisos.estadoDe(CR.estado.roboAtual);
        if (estado && estado.travar) {
            const seguir = confirm('⚠️ ' + (estado.titulo || 'ATENÇÃO') + '\n\n' +
                estado.texto + '\n\n' +
                'Este convênio está marcado pela equipe. Iniciar assim mesmo?');
            if (!seguir) return;
            CR.log.aviso('Iniciado mesmo com o convênio marcado como: ' + estado.texto);
        }
        caixaErro.style.display = 'none';
        caixaDiag.style.display = 'none';
        caixaRetomar.style.display = 'none';
        textoParaRodar = texto;
        CR.auto.iniciar(CR.estado.roboAtual, texto);
    };

    /* ═══════════════════════════════════════════════════════════
     *  O QUE O RESTO DA CENTRAL USA DAQUI
     * ═══════════════════════════════════════════════════════════ */
    /* Chamado quando avisos.json e status.json terminam de chegar:
       redesenha o recado do topo e a situação de cada card. */
    const atualizarAvisos = () => {
        U.seguro(() => CR.avisos.desenharGeral(document.getElementById('cr-aviso-slot')), 'aviso');
        cardsPorChave.forEach(c => U.seguro(() => pintarCard(c.el, c.chave), 'status-card'));
    };

    CR.ui = {
        menu: menu,
        atualizarAvisos: atualizarAvisos,
        status: mostrarStatus,
        modoIniciar: modoIniciar,
        modoParar: modoParar,
        progresso: desenharProgresso,
        abrirPainel: abrirPainel,
        erroDetalhado: dados => CR.erros.montar(caixaErro, dados, {
            repetir: textoParaRodar ? () => CR.auto.iniciar(CR.estado.roboAtual, textoParaRodar) : null,
            encerrar: () => { CR.estado.rodando = false; modoIniciar(); }
        })
    };

    /* avisos gerais e favoritos assim que a tela existe */
    CR.avisos.desenharGeral(document.getElementById('cr-aviso-slot'));

    /* Faxina: joga fora as filas de automações interrompidas que já
       venceram, de todos os convênios de uma vez. */
    U.seguro(() => {
        const jogadas = CR.fila.limparAntigas();
        if (jogadas) CR.log.info(jogadas + ' fila(s) vencida(s) descartada(s)');
    }, 'faxina');

    CR.log.ok('Central de Automação ' + CR.versao + ' pronta · ' + CR.EXIBICAO.length + ' convênios');

})(window.CentralRobos);
