(() => {
    // 1. Impede a abertura de múltiplos menus centrais
    if (document.getElementById('menu-central-robos')) return;

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
            '.cr-arrasta{cursor:move;}';
        document.head.appendChild(est);
    }

    // ── casca do app ──────────────────────────────────────────────
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

    // ── TELA 1: menu principal ────────────────────────────────────
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

        <div style="background:linear-gradient(135deg,#0d1f3a,#0b1830);border:1px solid #24559b;border-radius:12px;padding:14px 16px;margin-bottom:14px;background-image:repeating-linear-gradient(0deg,rgba(45,125,255,0.05) 0 1px,transparent 1px 22px),repeating-linear-gradient(90deg,rgba(45,125,255,0.05) 0 1px,transparent 1px 22px);">
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

        <div style="display:flex;align-items:flex-start;justify-content:center;gap:56px;margin:16px 0 6px;">
            <div id="cr-fechar-app" style="text-align:center;cursor:pointer;">
                <div style="width:52px;height:52px;margin:0 auto;border-radius:50%;border:2px solid #b91f16;background:radial-gradient(circle at 35% 30%, #1c0d12, #12060a);display:flex;align-items:center;justify-content:center;font-size:22px;color:#ff5040;box-shadow:0 0 12px rgba(226,59,46,0.5);">✖</div>
                <div style="margin-top:6px;font-size:9.5px;font-weight:700;letter-spacing:1px;color:#e8f1ff;">FECHAR APP</div>
            </div>
            <div id="cr-marcador" style="text-align:center;cursor:pointer;">
                <div id="cr-marcador-icone" style="width:52px;height:52px;margin:0 auto;border-radius:50%;border:2px solid #17a2b8;background:radial-gradient(circle at 35% 30%, #0a1b26, #06121c);display:flex;align-items:center;justify-content:center;font-size:24px;color:#4dc3ff;box-shadow:0 0 12px rgba(23,162,184,0.5);transition:all .25s ease;">☐</div>
                <div id="cr-marcador-label" style="margin-top:6px;font-size:9.5px;font-weight:700;letter-spacing:.5px;color:#4dc3ff;">marcador de checkboxes</div>
            </div>
        </div>

        <div style="text-align:center;font-size:9.5px;color:#3d5a85;">Versão do Sistema 2.1.0</div>
    `;

    // ── TELA 2: janela de códigos (uma para todos os robôs) ───────
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

        <div style="background:#0c1830;border:1px solid #1e3a66;border-radius:14px;padding:14px;">
            <div style="font-size:13.5px;font-weight:800;color:#eaf3ff;letter-spacing:.5px;margin-bottom:4px;">📋 INSERIR CÓDIGOS DO CONVÊNIO</div>
            <div style="font-size:11px;color:#8fa8cf;margin-bottom:12px;">Cole abaixo a lista de códigos do convênio para iniciar a automação.</div>

            <div style="font-size:10px;font-weight:800;color:#4dc3ff;letter-spacing:1px;margin-bottom:6px;">📋 ÁREA PARA COLAR OS CÓDIGOS</div>
            <textarea id="cr-txt-codigos" placeholder="Clique aqui e cole os códigos do convênio" style="display:block;width:100%;min-height:150px;box-sizing:border-box;background:#0a1526;border:2px dashed #2d7dff;border-radius:12px;padding:12px;color:#cfe4ff;font-size:12.5px;font-family:Consolas,monospace;resize:vertical;outline:none;"></textarea>

            <div style="background:#0a1424;border:1px solid #1b3157;border-radius:10px;padding:10px 12px;margin-top:12px;">
                <div style="font-size:10.5px;font-weight:800;color:#4dc3ff;letter-spacing:1px;margin-bottom:5px;">💡 DICAS</div>
                <div style="font-size:10.5px;color:#9db4d8;line-height:1.7;">
                    <span style="color:#2ecc71;">✔</span> Você pode colar vários códigos de uma vez.<br>
                    <span style="color:#2ecc71;">✔</span> Certifique-se de que os códigos estejam corretos antes de iniciar.
                </div>
            </div>
        </div>

        <button id="cr-iniciar" style="display:block;width:100%;margin-top:14px;padding:14px;background:linear-gradient(180deg,#2d7dff,#1a5bcc);color:#fff;border:1px solid #4dc3ff;border-radius:12px;cursor:pointer;font-weight:800;font-size:14px;letter-spacing:1.5px;box-shadow:0 0 16px rgba(45,125,255,0.5);font-family:inherit;">🚀 INICIAR AUTOMAÇÃO</button>
        <button id="cr-limpar" style="display:block;width:100%;margin-top:8px;padding:11px;background:#0e1a2e;color:#9db4d8;border:1px solid #223a5e;border-radius:12px;cursor:pointer;font-weight:700;font-size:12px;letter-spacing:1.5px;font-family:inherit;">🕐 LIMPAR</button>
        <div id="cr-exec-status" style="display:none;margin-top:10px;background:#0a1424;border:1px solid #1b3157;border-radius:10px;padding:10px 12px;font-size:11px;color:#9db4d8;line-height:1.5;text-align:center;min-height:16px;white-space:pre-line;"></div>
        <div id="cr-motor-info" style="margin-top:6px;font-size:9.5px;color:#3d5a85;text-align:center;"></div>
    `;

    menu.appendChild(telaHome);
    menu.appendChild(telaJanela);
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

    // ── FECHAR APP ────────────────────────────────────────────────
    document.getElementById('cr-fechar-app').onclick = () => {
        limparPaineisDoRobo();   // não deixa painel escondido para trás na página
        menu.remove();
    };

    // ── SISTEMA DE AVISOS DINÂMICOS ───────────────────────────────
    const linkDoAviso = "https://raw.githubusercontent.com/sandrolimadf1984/central-robos/main/aviso.txt";
    fetch(linkDoAviso + "?t=" + new Date().getTime())
        .then(response => { if (!response.ok) throw new Error('sem aviso'); return response.text(); })
        .then(texto => {
            if (texto.trim() !== "") {
                const avisoDiv = document.createElement('div');
                avisoDiv.style.cssText = `background:#2a2208;color:#ffd633;padding:10px 26px 10px 12px;border-radius:8px;margin-bottom:12px;font-size:11.5px;position:relative;border:1px solid #8a6d00;`;
                avisoDiv.innerHTML = `
                    <strong>⚠️ ATENÇÃO:</strong><br>
                    ${texto}
                    <button onclick="this.parentElement.remove()" style="position:absolute;top:4px;right:6px;background:transparent;border:none;color:#ffd633;font-weight:bold;cursor:pointer;font-size:14px;">✖</button>
                `;
                document.getElementById('cr-aviso-slot').appendChild(avisoDiv);
            }
        })
        .catch(erro => console.log("Sem avisos no momento."));

    // ═══════════════════════════════════════════════════════════════
    //  CNU UNIMED — a tela de autorização abre numa janela separada
    //  sem barra de favoritos, então o app não pode ser aberto nela.
    //  Solução: o app fica nesta aba e pilota aquela janela de fora.
    // ═══════════════════════════════════════════════════════════════
    let janelaUnimed = null;
    const MARCA_SADT = /SolicitacaoDeSPSADT/i;

    // Fica de olho em toda janela que o portal abrir, para poder achá-la depois
    (() => {
        try {
            window.__crJanelas = window.__crJanelas || [];
            if (window.__crHookOpen) return;
            const abrirOriginal = window.open;
            window.open = function () {
                const w = abrirOriginal.apply(window, arguments);
                try { if (w) window.__crJanelas.push(w); } catch (e) { }
                return w;
            };
            window.__crHookOpen = true;
        } catch (e) { }
    })();

    // Reconhece a tela de autorização pelos campos dela (linha com tabela TUSS)
    const selectsTuss = d => {
        try {
            return Array.from(d.querySelectorAll('select')).filter(sel =>
                Array.from(sel.options || []).some(o => /procedimentos?\s+e\s+eventos/i.test(o.textContent || '')));
        } catch (e) { return []; }
    };

    // Campos que o portal exige preenchidos ANTES de aceitar os códigos.
    // Achados pelo número do rótulo da própria tela (8-, 10-, 15-, ...).
    const CAMPOS_GUIA = [
        { rot: '8-',  nome: '8-Número da Carteira' },
        { rot: '9-',  nome: '9-Validade da Carteira' },
        { rot: '10-', nome: '10-Nome do Beneficiário' },
        { rot: '13-', nome: '13-Código na Operadora' },
        { rot: '14-', nome: '14-Nome do Contratado' },
        { rot: '15-', nome: '15-Nome do Profissional Solicitante' },
        { rot: '16-', nome: '16-Conselho Profissional' },
        { rot: '17-', nome: '17-Número no Conselho' },
        { rot: '18-', nome: '18-UF' },
        { rot: '19-', nome: '19-Código CBO-s' },
        { rot: '21-', nome: '21-Caráter do Atendimento' },
        { rot: '22-', nome: '22-Data da Solicitação' },
        { rot: '23-', nome: '23-Indicação Clínica' },
        { rot: '29-', nome: '29-Cód. na Operadora (executante)' },
        { rot: '30-', nome: '30-Nome do Contratado (executante)' }
    ];

    // Localiza o campo pelo rótulo numerado que aparece na tela
    const acharCampoPorRotulo = (d, rotulo) => {
        try {
            const cand = Array.from(d.querySelectorAll('td,div,span,label,th,p,b,font,legend'));
            let melhor = null, menorTam = Infinity;
            for (const el of cand) {
                const t = (el.textContent || '').replace(/\s+/g, ' ').trim();
                if (!t.startsWith(rotulo)) continue;
                if (t.length > rotulo.length + 70) continue;      // texto grande = contêiner errado
                if (t.length < menorTam) { menorTam = t.length; melhor = el; }
            }
            if (!melhor) return null;
            const pegar = raiz => {
                if (!raiz || !raiz.querySelector) return null;
                return raiz.querySelector('input:not([type=hidden]):not([type=button]):not([type=submit]):not([type=radio]):not([type=checkbox]),select,textarea');
            };
            let campo = pegar(melhor), sobe = melhor;
            for (let i = 0; i < 3 && !campo && sobe; i++) { sobe = sobe.parentElement; campo = pegar(sobe); }
            return campo;
        } catch (e) { return null; }
    };

    const campoVazio = el => {
        if (!el) return false;                    // não achou: não acusa
        const v = (el.value || '').trim();
        if (!v) return true;
        if (el.tagName === 'SELECT') {
            const txt = ((el.options[el.selectedIndex] || {}).textContent || '').trim().toLowerCase();
            if (!txt || txt === 'escolha' || txt === 'selecione' || txt === '--') return true;
        }
        return false;
    };

    const conferirCabecalho = d => {
        const faltando = [];
        CAMPOS_GUIA.forEach(c => {
            const el = acharCampoPorRotulo(d, c.rot);
            if (campoVazio(el)) faltando.push(c.nome);
        });
        return faltando;
    };

    let unimedForcar = false;

    const URL_SADT = 'https://saw.trixti.com.br/saw/tiss/SolicitacaoDeSPSADT40.do?method=abrirTelaDeSolicitacaoDeSPSADT';
    let unimedTentouAbrir = false;

    // A janela pode ter sido aberta por um link com target="nome" — nesse caso
    // o window.open não foi chamado e não capturamos nada. Mas se descobrirmos
    // o NOME dela, conseguimos pegá-la de volta.
    const nomesDeJanela = () => {
        const achados = [];
        const guardar = n => {
            n = (n || '').trim();
            if (!n || /^_(blank|self|top|parent)$/i.test(n)) return;
            if (achados.indexOf(n) === -1) achados.push(n);
        };
        try {
            Array.from(document.querySelectorAll('[target]')).forEach(el => guardar(el.getAttribute('target')));
            const fontes = [];
            Array.from(document.querySelectorAll('script')).forEach(sc => { if (!sc.src) fontes.push(sc.textContent || ''); });
            Array.from(document.querySelectorAll('[onclick],[onchange],[href]')).forEach(el => {
                fontes.push(el.getAttribute('onclick') || '');
                fontes.push(el.getAttribute('onchange') || '');
                const h = el.getAttribute('href') || '';
                if (h.indexOf('javascript:') === 0) fontes.push(h);
            });
            const texto = fontes.join('\n');
            let m;
            const reOpen = /open\s*\(\s*[^,()]*,\s*['"]([^'"]+)['"]/g;
            while ((m = reOpen.exec(texto))) guardar(m[1]);
            const reTarget = /\.target\s*=\s*['"]([^'"]+)['"]/g;
            while ((m = reTarget.exec(texto))) guardar(m[1]);
        } catch (e) { }
        return achados;   // só nomes que existem mesmo na página — nada de chute
    };

    const serveComoSADT = w => {
        try {
            if (!w || w.closed || !w.document) return false;
            if (MARCA_SADT.test(w.location.href)) return true;
            return selectsTuss(w.document).length > 0;
        } catch (e) { return false; }
    };

    // ATENÇÃO: procurar pelo nome pode fazer o navegador ABRIR uma janela quando
    // o nome não existe. Por isso isto roda UMA VEZ por acionamento, com teto de
    // tentativas, e fecha sem dó qualquer janela que tenha nascido aqui.
    let jaProcureiPorNome = false;
    const tentarPorNome = () => {
        if (jaProcureiPorNome) return null;
        jaProcureiPorNome = true;
        const nomes = nomesDeJanela().slice(0, 4);
        for (const n of nomes) {
            let w = null;
            try { w = window.open('', n); } catch (e) { continue; }
            if (!w || w === window) continue;
            if (serveComoSADT(w)) return w;
            // não era ela: fecha (o navegador só deixa fechar o que foi aberto por script)
            try {
                const href = (w.location && w.location.href) || '';
                if (!href || href === 'about:blank') { w.close(); continue; }
            } catch (e) {
                try { w.close(); } catch (e2) { }   // página nova do navegador: fecha
                continue;
            }
            try { w.close(); } catch (e) { }
        }
        return null;
    };

    const acharJanelaSADT = () => {
        if (serveComoSADT(janelaUnimed)) return janelaUnimed;
        try { if (MARCA_SADT.test(location.href) && selectsTuss(document).length) return window; } catch (e) { }
        const lista = (window.__crJanelas || []).slice().reverse();
        for (const w of lista) {
            try {
                if (!w || w.closed || !w.document) continue;
                if (MARCA_SADT.test(w.location.href)) return w;
                if (selectsTuss(w.document).length) return w;
            } catch (e) { }
        }
        try { if (selectsTuss(document).length) return window; } catch (e) { }
        const porNome = tentarPorNome();
        if (porNome) return porNome;
        return null;
    };

    const robos = {
        "PLANASSISTE MPU": () => {
            (function(){
                if(window.__rob)return;
                window.__rob=true;
                var u=window.location.href;
                document.body.innerHTML='';
                document.head.innerHTML='';
                var ui=document.createElement('div');
                ui.style='height:120px;background:#e9ecef;padding:10px;font-family:Arial;box-sizing:border-box;overflow:hidden;border-bottom:3px solid #0056b3;';
                ui.innerHTML='<h3 style="margin:0 0 5px 0;color:#333;">🤖 Robô Automático (Agrupamento Ativo)</h3><textarea id="rc" placeholder="Cole os códigos (8 dígitos...)" style="width:300px;height:70px;vertical-align:top;border:1px solid #ccc;padding:5px;"></textarea><button id="rb" style="height:70px;padding:0 20px;margin-left:10px;background:#28a745;color:white;font-weight:bold;border:none;border-radius:5px;cursor:pointer;vertical-align:top;font-size:14px;">INICIAR MÁQUINA</button><button id="rx" style="height:70px;padding:0 20px;margin-left:10px;background:#dc3545;color:white;font-weight:bold;border:none;border-radius:5px;cursor:pointer;vertical-align:top;font-size:14px;">PARAR E FECHAR</button><span id="rs" style="margin-left:15px;font-weight:bold;color:#333;font-size:16px;">Aguardando...</span>';
                document.body.appendChild(ui);
                var frm=document.createElement('iframe');
                frm.id='sf';frm.src=u;frm.style='width:100%;height:calc(100vh - 120px);border:none;';
                document.body.appendChild(frm);
                document.body.style.margin='0';
                document.body.style.overflow='hidden';
                var q=[],id=0,st='tabela',lp=null;
                
                document.getElementById('rx').onclick=function(){
                    clearInterval(lp);window.__rob=false;ui.remove();frm.style.height='100vh';
                };
                
                document.getElementById('rb').onclick=function(){
                    var v=document.getElementById('rc').value.match(/\b\d{8}\b/g);
                    if(!v)return alert('Nenhum código válido.');
                    var cts={};
                    for(var i=0;i<v.length;i++){cts[v[i]]=(cts[v[i]]||0)+1;}
                    q=[];
                    for(var k in cts){q.push({c:k,qty:cts[k]});}
                    id=0;st='tabela';
                    document.getElementById('rs').innerText='Processando '+q.length+' códigos únicos...';
                    this.disabled=true;document.getElementById('rc').disabled=true;
                    lp=setInterval(rl,1500);
                };
                
                function rl(){
                    var d,cw;
                    try{cw=document.getElementById('sf').contentWindow;d=cw.document;}catch(e){return;}
                    if(d.readyState!=='complete')return;
                    
                    if(id>=q.length){
                        clearInterval(lp);
                        document.getElementById('rs').innerText='✅ Concluído! O último código foi salvo e a tela finalizada.';
                        document.getElementById('rs').style.color='#28a745';
                        return;
                    }
                    
                    if(st==='tabela'){
                        var b=d.querySelector('#CODIGOTABELA_btn');
                        if(b){
                            if(!cw._hk){
                                var o=cw.window.open;
                                cw.window.open=function(a,x,c){
                                    var w=o.call(cw,a,x,c);
                                    var t=setInterval(function(){
                                        try{
                                            var l=null;
                                            var es=w.document.querySelectorAll('a');
                                            
                                            for(var i=0;i<es.length;i++){
                                                var txt=(es[i].innerText||'').toUpperCase();
                                                if(txt.includes('22 - PROCEDIMENTO') || txt === '22' || txt === '16' || txt.includes('PROCEDIMENTO')){
                                                    l=es[i];
                                                    break;
                                                }
                                            }
                                            
                                            if(!l){
                                                l=w.document.querySelector('#FormMain > div > div > div > div > div > div > div > div > div.div_grid > table > tbody > tr:nth-child(6) > td:nth-child(1) > a');
                                            }
                                            
                                            if(!l){
                                                for(var i=0;i<es.length;i++){
                                                    if((es[i].innerText||'').includes('TUSS')){
                                                        l=es[i];
                                                        break;
                                                    }
                                                }
                                            }
                                            
                                            if(l){
                                                l.click();
                                                clearInterval(t);
                                                st='preencher';
                                            }
                                        }catch(e){}},500);
                                    return w;
                                };
                                cw._hk=true;
                                b.click();
                                document.getElementById('rs').innerText='Aguardando a tabela TUSS...';
                            }
                        }else{
                            st='preencher';
                        }
                    }else if(st==='preencher'){
                        var f1=d.querySelector('#FormMain > table > tbody > tr:nth-child(1) > td:nth-child(4) > table > tbody > tr > td:nth-child(1) > input.frm_field_lkp');
                        var f2=d.querySelector('#FormMain > table > tbody > tr:nth-child(3) > td:nth-child(2) > table > tbody > tr > td:nth-child(1) > input.frm_field_lkp');
                        var fq=d.querySelector('#FormMain > table > tbody > tr:nth-child(2) > td:nth-child(2) > input');
                        var ult=(id===q.length-1);
                        var sb=ult?'body > table > tbody > tr:nth-child(1) > td > div > table > tbody > tr:nth-child(2) > td > table > tbody > tr > td.StmMain > table > tbody > tr > td > table > tbody > tr > td > table > tbody > tr:nth-child(1) > td > div > div.act_box > div > div > div > div:nth-child(3) > a':'body > table > tbody > tr:nth-child(1) > td > div > table > tbody > tr:nth-child(2) > td > table > tbody > tr > td.StmMain > table > tbody > tr > td > table > tbody > tr > td > table > tbody > tr:nth-child(1) > td > div > div.act_box > div > div > div > div:nth-child(2) > a > nobr';
                        var bt=d.querySelector(sb);
                        if(f1&&f2&&bt){
                            if(cw._wt)return;
                            document.getElementById('rs').innerText=ult?('⏳ Finalizando com: '+q[id].c+' (Qtd: '+q[id].qty+') - Último!'):('⏳ Inserindo: '+q[id].c+' (Qtd: '+q[id].qty+') - '+(id+1)+'/'+q.length);
                            f1.value='';f1.value=q[id].c;
                            f1.dispatchEvent(new Event('input',{bubbles:true}));f1.dispatchEvent(new Event('change',{bubbles:true}));
                            f2.value='';f2.value='Exames-Patologia Clínica';
                            f2.dispatchEvent(new Event('input',{bubbles:true}));f2.dispatchEvent(new Event('change',{bubbles:true}));
                            if(fq&&q[id].qty>1){
                                fq.value='';fq.value=q[id].qty;
                                fq.dispatchEvent(new Event('input',{bubbles:true}));fq.dispatchEvent(new Event('change',{bubbles:true}));
                            }
                            cw._wt=true;
                            setTimeout(function(){bt.click();id++;},800);
                        }else{
                            cw._wt=false;
                        }
                    }
                }
            })();
        },
        "PLENUM": () => {
            (function () {
                if (document.getElementById('painel-plenum')) return;
                const painel = document.createElement('div');
                painel.id = 'painel-plenum';
                painel.style.cssText = `
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    width: 300px;
                    background: #2c3e50;
                    color: #ecf0f1;
                    padding: 15px;
                    border-radius: 8px;
                    z-index: 2147483647;
                    font-family: Arial, sans-serif;
                    box-shadow: 0 4px 15px rgba(0,0,0,0.5);
                    border: 2px solid #9b59b6;
                `;
                painel.innerHTML = `
                    <h3 style="margin: 0 0 10px 0; color: #9b59b6; text-align: center;">🤖 Lançador PLENUM</h3>
                    <textarea id="plenum-txt" style="width: 100%; height: 80px; margin-bottom: 10px; border-radius: 4px; padding: 5px; color: #000; box-sizing: border-box;" placeholder="Cole os códigos aqui..."></textarea>
                    <button id="plenum-btn" style="width: 100%; padding: 10px; background: #27ae60; color: white; border: none; border-radius: 4px; font-weight: bold; cursor: pointer; margin-bottom: 5px;">▶ INICIAR (TURBO)</button>
                    <div id="plenum-status" style="font-size: 12px; color: #bdc3c7; text-align: center; margin-bottom: 5px;">Aguardando...</div>
                    <button id="plenum-fechar" style="width: 100%; padding: 8px; background: #c0392b; color: white; border: none; border-radius: 4px; font-weight: bold; cursor: pointer;">❌ FECHAR</button>
                `;
                document.body.appendChild(painel);

                const wait = ms => new Promise(r => setTimeout(r, ms));

                document.getElementById('plenum-fechar').onclick = () => painel.remove();

                document.getElementById('plenum-btn').onclick = async () => {
                    const txt = document.getElementById('plenum-txt').value;
                    let raw = txt.match(/\b\d{8}\b/g);
                    
                    if (!raw || raw.length === 0) {
                        alert("Nenhum código válido encontrado!");
                        return;
                    }

                    if (raw.length > 50) {
                        alert("⚠️ Limite de segurança ativado! Como você colou mais de 50 códigos, o sistema processará apenas os primeiros 50 itens para evitar travamentos.");
                        raw = raw.slice(0, 50);
                    }

                    document.getElementById('plenum-btn').disabled = true;
                    const status = document.getElementById('plenum-status');

                    const counts = {};
                    raw.forEach(x => counts[x] = (counts[x] || 0) + 1);
                    const unicos = [...new Set(raw)];
                    const order = unicos.filter(c => counts[c] === 1).concat(unicos.filter(c => counts[c] > 1));
                    const codigos = order.map(k => ({ cod: k, qtd: counts[k] }));

                    const setVal = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')?.set;

                    for (let i = 0; i < codigos.length; i++) {
                        let item = codigos[i];
                        status.innerText = `⚡ Processando ${i + 1}/${codigos.length}: ${item.cod} (Qtd: ${item.qtd})`;

                        let inptCod = document.querySelector('#codProc');
                        if (inptCod) {
                            inptCod.focus();
                            if (setVal) setVal.call(inptCod, item.cod);
                            else inptCod.value = item.cod;
                            
                            inptCod.dispatchEvent(new Event('input', { bubbles: true }));
                            inptCod.dispatchEvent(new Event('change', { bubbles: true }));
                            await wait(50); 
                        }

                        let btnAlteraQtd = document.querySelector('#formContainer > div:nth-child(2) > div:nth-child(2) > div.col-xs-2.col-md-2 > div > div > input.btn.btn-primary');
                        if (btnAlteraQtd) {
                            btnAlteraQtd.focus();
                            btnAlteraQtd.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
                            btnAlteraQtd.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
                            btnAlteraQtd.click();
                            await wait(300); 
                        }

                        let inptQtd = document.querySelector('#qtde');
                        if (inptQtd) {
                            inptQtd.focus();
                            if (setVal) setVal.call(inptQtd, item.qtd);
                            else inptQtd.value = item.qtd;
                            
                            inptQtd.dispatchEvent(new Event('input', { bubbles: true }));
                            inptQtd.dispatchEvent(new Event('change', { bubbles: true }));
                            await wait(50); 
                        }

                        let inptDesc = document.querySelector('#descProc');
                        if (inptDesc) {
                            inptDesc.focus();
                            inptDesc.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
                            inptDesc.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
                            inptDesc.click();
                            await wait(350); 
                        }

                        let btnIncluir = document.querySelector('#btnIncluiProc');
                        if (btnIncluir) {
                            btnIncluir.click();
                            await wait(400); 
                        }
                    }

                    status.innerText = "✅ Finalizado!";
                    document.getElementById('plenum-btn').disabled = false;
                    alert("Todos os códigos foram processados com sucesso no modo Turbo!");
                };
            })();
        },
        // O portal do TRE mudou e ficou igual ao da Polícia Militar.
        // O robô antigo está logo abaixo, desativado, caso um dia precise voltar.
        "TRE": () => {
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
        },
        "TRE_MODELO_ANTIGO_DESATIVADO": () => {
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
        },
        "MEDSENIOR/UN SEG": () => {
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
        },
        "TJDF": () => {
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
        },
        "PM/STJ": () => {
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
        },
        "SULAMERICA": () => {
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
        },
        "TST": () => {
            (function () {
                var b = document.createElement("button");
                b.innerText = "⚖️ ROBÔ EQUILIBRADO (TUSS 16)";
                b.style = "position:fixed;top:10px;left:50%;transform:translateX(-50%);padding:15px;background:#008b8b;color:white;font-weight:bold;border:3px solid white;z-index:9999999;box-shadow:0 0 20px #000;cursor:pointer;border-radius:8px;font-family:monospace;font-size:14px;";
                b.onclick = function () {
                    var w = window.open("", "RoboSafe", "width=400,height=600");
                    if (!w) { alert('O navegador bloqueou a janelinha de controle.\nPermita pop-ups para este site e clique de novo.'); return; }
                    var h = `<html><head><title>Robô Equilibrado</title><style>body{background:#111;color:#fff;font-family:sans-serif;padding:10px}textarea{width:100%;height:150px;background:#222;color:#0f0;border:1px solid #555;font-family:monospace}button{width:100%;padding:10px;margin-top:10px;cursor:pointer;font-weight:bold}.g{background:#0d0;color:#000}.r{background:#f33;color:#fff}#l{margin-top:10px;height:300px;overflow-y:auto;background:#000;border:1px solid #444;font-family:monospace;font-size:11px;padding:5px}</style></head><body><h3>⚖️ Robô TUSS (Estável)</h3><p>Cole a lista:</p><textarea id="t"></textarea><button id="bIni" class="g" onclick="go()">▶ INICIAR</button><button id="bPar" class="r" style="display:none" onclick="stop()">⏹ PARAR</button><div id="l"></div> <script> var r=false,idx=0,lst=[],win=window.opener; function log(m){ var d=document.createElement("div"); d.innerText="["+new Date().toLocaleTimeString()+"] "+m; document.getElementById("l").prepend(d) } function modo(rodando){var i=document.getElementById("bIni"),p=document.getElementById("bPar"),t=document.getElementById("t");if(i)i.style.display=rodando?"none":"block";if(p)p.style.display=rodando?"block":"none";if(t)t.disabled=rodando;}function stop(){r=false;modo(false);log("PARADO.")} function go(){ var v=document.getElementById("t").value; var raw=v.match(/\\b\\d{8}\\b/g); if(!raw)return alert("Sem códigos!"); var counts={}; raw.forEach(x=>counts[x]=(counts[x]||0)+1); var unicos=[...new Set(raw)]; var order=unicos.filter(c=>counts[c]===1).concat(unicos.filter(c=>counts[c]>1)); lst=order.map(k=>({cod:k,qtd:counts[k]})); if(!win||win.closed)return alert("Janela principal fechada!"); r=true;idx=0;modo(true);log("Iniciando "+lst.length+" itens...");loop() } async function waitEl(sel,timeout=5000){ var t=0; while(t<timeout){ if(!r)throw new Error("Parado"); var el=win.document.querySelector(sel); if(el&&el.offsetParent!==null)return el; await new Promise(x=>setTimeout(x,200)); t+=200 } throw new Error("Timeout: "+sel) } async function pause(ms){await new Promise(x=>setTimeout(x,ms))} async function loop(){ if(!r)return; if(idx>=lst.length){r=false;modo(false);log("✅ FIM! "+lst.length+" itens lançados.");return alert("FIM!")} var item=lst[idx],c=item.cod,q=item.qtd; log("Item "+(idx+1)+": "+c+(q>1?" (Qtd: "+q+")":"")); try{ log("Aguardando botão..."); await waitEl("input[value='Adicionar Procedimento']",10000); await pause(500); var b1=win.document.querySelector("input[value='Adicionar Procedimento']")||win.document.querySelector("input[name='adicionarProcedimento']"); b1.click(); var fixo=await waitEl("#noreset_txCodTabela"); await pause(500); fixo.value="16"; fixo.dispatchEvent(new win.Event('change',{bubbles:true})); fixo.dispatchEvent(new win.Event('blur',{bubbles:true})); try{win.$(fixo).trigger('change')}catch(e){} var inp=await waitEl("#codItemProcedimento"); await pause(300); inp.value=c; inp.dispatchEvent(new win.Event('change',{bubbles:true})); inp.dispatchEvent(new win.Event('blur',{bubbles:true})); var qtd=win.document.getElementById("procedimento.numQtdSolicitada"); if(qtd){ qtd.value=q; qtd.dispatchEvent(new win.Event('input',{bubbles:true})); qtd.dispatchEvent(new win.Event('change',{bubbles:true})); } await pause(500); var b2=await waitEl(".ui-dialog-buttonpane button:nth-child(2)"); if(!b2.innerText.includes("Salvar")&&!b2.innerText.includes("Confirmar")){ var bs=win.document.querySelectorAll("button"); for(var b of bs)if(b.innerText.includes("Salvar"))b2=b } b2.click(); log("Salvo! Aguardando..."); idx++; await pause(1500); loop() }catch(e){ log("ERRO: "+e.message); r=false; modo(false); alert("Erro: "+e.message) } } <\/script></body></html>`;
                    w.document.write(h);
                    this.remove()
                };
                document.body.appendChild(b);
            })();
        },
        "POSTAL": () => {
            (function () {
                var l = prompt("Cole os códigos de 8 dígitos:");
                if (!l) return;
                var raw = l.match(/\b\d{8}\b/g);
                if (!raw) return alert("Sem códigos!");
                var counts = {};
                raw.forEach(x => counts[x] = (counts[x] || 0) + 1);
                var unicos = [...new Set(raw)];
                var order = unicos.filter(c => counts[c] === 1).concat(unicos.filter(c => counts[c] > 1));
                var cods = order.map(k => ({ cod: k, qtd: counts[k] }));
                var W = window.open("", "RoboCtrl", "width=350,height=200,top=0,left=0");
                if (!W) return alert("ERRO: POPUP BLOQUEADO! Permita popups no navegador.");
                W.document.write("<body style='font-family:Arial;text-align:center;background:#eee'><h3>🤖 Robô Automático</h3><div id='msg' style='font-size:14px;margin:10px'>Iniciando...</div><button onclick='window.close()' style='padding:10px;background:red;color:white;border:none'>PARAR</button></body>");
                var s = W.document.createElement('script');
                s.textContent = `
                    var idx=0;
                    var lista=${JSON.stringify(cods)};
                    var mainWin=window.opener;
                    var selInp="#FormMain > table > tbody > tr:nth-child(1) > td.frm_cell_field > table > tbody > tr > td:nth-child(1) > input.frm_field_lkp_big";
                    var selQtd="#FormMain > table > tbody > tr:nth-child(3) > td:nth-child(4) > input";
                    var selBtn="body > table > tbody > tr:nth-child(1) > td > div > table > tbody > tr:nth-child(2) > td > table > tbody > tr > td:nth-child(2) > table > tbody > tr > td > table > tbody > tr > td > table > tbody > tr:nth-child(1) > td > div > div.act_box > div > div > div > div:nth-child(2) > a > nobr";
                    // NO BOTÃO DE FINALIZAR ADICIONADO AQUI
                    var selBtnFinalizar="body > table > tbody > tr:nth-child(1) > td > div > table > tbody > tr:nth-child(2) > td > table > tbody > tr > td:nth-child(2) > table > tbody > tr > td > table > tbody > tr > td > table > tbody > tr:nth-child(1) > td > div > div.act_box > div > div > div > div:nth-child(3) > a";
                    
                    setInterval(function(){
                        if(idx>=lista.length){
                            document.getElementById('msg').innerHTML="<b style='color:green'>FIM DO LOTE!</b>";
                            return;
                        }
                        try{
                            var doc=mainWin.document;
                            var inp=doc.querySelector(selInp);
                            if(inp&&inp.value==""){
                                var item=lista[idx];
                                var c=item.cod;
                                var q=item.qtd;
                                var ehUltimo = (idx === lista.length - 1); // VERIFICA SE É O ÚLTIMO
                                
                                document.getElementById('msg').innerText="Lançando: "+c+" ("+(idx+1)+"/"+lista.length+")"+(q>1?" Qtd: "+q:"");
                                inp.focus();
                                inp.value=c;
                                inp.dispatchEvent(new Event('input',{bubbles:true}));
                                inp.dispatchEvent(new Event('change',{bubbles:true}));
                                if(q>1){
                                    var qInp=doc.querySelector(selQtd);
                                    if(qInp){
                                        qInp.value=q;
                                        qInp.dispatchEvent(new Event('input',{bubbles:true}));
                                        qInp.dispatchEvent(new Event('change',{bubbles:true}));
                                    }
                                }
                                setTimeout(function(){
                                    // SE FOR O ÚLTIMO, PEGA O BOTÃO DE FINALIZAR. SE NÃO, PEGA O NORMAL.
                                    var btn = ehUltimo ? doc.querySelector(selBtnFinalizar) : doc.querySelector(selBtn);
                                    if(btn){
                                        btn.click();
                                        idx++;
                                        document.getElementById('msg').innerText = ehUltimo ? "Finalizando lote..." : "Salvando... aguarde.";
                                    }else{
                                        document.getElementById('msg').innerText="ERRO: Botão sumiu!";
                                    }
                                },800);
                            }
                        }catch(e){
                            document.getElementById('msg').innerText="Aguardando página...";
                        }
                    },1500);
                `;
                W.document.body.appendChild(s);
            })();
        },
        "AMIL": () => {
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
        },
        "INAS": () => {
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
        },
        "TRF": () => {
            (function () {
                var l = prompt("Cole os códigos de 8 dígitos:");
                if (!l) return;
                var cods = l.match(/\b\d{8}\b/g);
                if (!cods) return alert("Nenhum código!");
                var counts = {};
                cods.forEach(function (c) {
                    counts[c] = (counts[c] || 0) + 1;
                });
                var unicos = [...new Set(cods)];
                var uniqueCods = unicos.filter(function (c) {
                    return counts[c] === 1;
                }).concat(unicos.filter(function (c) {
                    return counts[c] > 1;
                }));
                
                var W = window.open("", "RoboExames", "width=350,height=280");
                if (!W) return alert("ERRO: POPUP BLOQUEADO! Permita popups no navegador.");
                
                W.document.write("<body style='font-family:sans-serif;text-align:center;background:#f0f7ff;padding:20px'><h3>🤖 Robô TRF (Sincronizado)</h3><div id='msg' style='font-size:14px;color:#0056b3;font-weight:bold;'>Iniciando...</div><div id='status' style='font-size:12px;color:#666;margin-top:5px'></div><button onclick='window.close()' style='margin-top:15px;padding:8px;cursor:pointer;background:#ff4757;color:white;border:none;border-radius:5px;font-weight:bold;'>PARAR</button></body>");
                
                var s = W.document.createElement('script');
                s.textContent = `
                    var idx = 0;
                    var lista = ${JSON.stringify(uniqueCods)};
                    var qtds = ${JSON.stringify(counts)};
                    var msg = document.getElementById('msg');
                    var st = document.getElementById('status');
                    var selCod = "#FormMain > table > tbody > tr:nth-child(2) > td:nth-child(2) > table > tbody > tr > td:nth-child(1) > input.frm_field_lkp";
                    var sel22 = "#FormMain > table > tbody > tr:nth-child(1) > td:nth-child(4) > table > tbody > tr > td:nth-child(1) > input.frm_field_lkp";
                    var selFrase = "#FormMain > table > tbody > tr:nth-child(2) > td:nth-child(4) > table > tbody > tr > td:nth-child(1) > input.frm_field_lkp";
                    var selQtd = "#FormMain > table > tbody > tr:nth-child(3) > td:nth-child(2) > input";
                    var selBtnSalvar = "body > table > tbody > tr:nth-child(1) > td > div > table > tbody > tr:nth-child(2) > td > table > tbody > tr > td:nth-child(2) > table > tbody > tr > td > table > tbody > tr > td > table > tbody > tr:nth-child(1) > td > div > div.act_box > div > div > div > div:nth-child(2) > a";
                    var selBtnFinalizar = "body > table > tbody > tr:nth-child(1) > td > div > table > tbody > tr:nth-child(2) > td > table > tbody > tr > td:nth-child(2) > table > tbody > tr > td > table > tbody > tr > td > table > tbody > tr:nth-child(1) > td > div > div.act_box > div > div > div > div:nth-child(3) > a";
                    var selErro = "#tsk_toolbar";
                    function proximoPasso() {
                        if(idx >= lista.length) {
                            msg.innerHTML = "<b style='color:green'>✅ TUDO FINALIZADO!</b>";
                            st.innerText = "";
                            return;
                        }
                        
                        try {
                            var doc = window.opener.document;
                            var inp = doc.querySelector(selCod);
                            var erro = doc.querySelector(selErro);
                            var ehUltimo = (idx === lista.length - 1);
                            
                            if (erro && erro.innerText.includes("Verifique")) {
                                msg.innerText = "⚠️ Corrigindo erro no " + lista[idx];
                                var f = doc.querySelector(selFrase);
                                if(f) {
                                    f.value = "Exame";
                                    f.dispatchEvent(new Event('input', {bubbles:true}));
                                    f.dispatchEvent(new Event('change', {bubbles:true}));
                                    
                                    erro.innerText = "AGUARDANDO SISTEMA...";
                                     
                                    setTimeout(function(){
                                        var btn = ehUltimo ? doc.querySelector(selBtnFinalizar) : doc.querySelector(selBtnSalvar);
                                        if(btn) btn.click();
                                        
                                        var checarVazio = setInterval(function() {
                                            try {
                                                var docAtual = window.opener.document;
                                                var inpAtual = docAtual.querySelector(selCod);
                                                
                                                if (ehUltimo || (inpAtual && inpAtual.value === "")) {
                                                    clearInterval(checarVazio);
                                                    idx++;
                                                    setTimeout(proximoPasso, 300); 
                                                }
                                            } catch(e) {}
                                        }, 250);
                                    }, 500);
                                }
                                return; 
                            }
                            
                            var codAtual = lista[idx];
                            var qtdAtual = qtds[codAtual];
                            
                            if (!inp || inp.value !== "") {
                                setTimeout(proximoPasso, 500);
                                return;
                            }
                            
                            msg.innerText = "🚀 Lançando: " + codAtual + " (" + qtdAtual + "x)";
                            st.innerText = (idx + 1) + " / " + lista.length;
                            inp.value = codAtual;
                            inp.dispatchEvent(new Event('input', {bubbles:true}));
                            inp.dispatchEvent(new Event('change', {bubbles:true}));
                            
                            var f22 = doc.querySelector(sel22);
                            if(f22) {
                                f22.value = "22";
                                f22.dispatchEvent(new Event('input', {bubbles:true}));
                                f22.dispatchEvent(new Event('change', {bubbles:true}));
                            }
                            
                            var fFrase = doc.querySelector(selFrase);
                            if(fFrase) {
                                fFrase.value = "Exames-Patologia Clínica";
                                fFrase.dispatchEvent(new Event('input', {bubbles:true}));
                                fFrase.dispatchEvent(new Event('change', {bubbles:true}));
                            }
                            
                            var inpQtd = doc.querySelector(selQtd);
                            if(inpQtd) {
                                inpQtd.value = qtdAtual;
                                inpQtd.dispatchEvent(new Event('input', {bubbles:true}));
                                inpQtd.dispatchEvent(new Event('change', {bubbles:true}));
                            }
                            
                            setTimeout(function(){
                                var btn = ehUltimo ? doc.querySelector(selBtnFinalizar) : doc.querySelector(selBtnSalvar);
                                if(btn) btn.click();
                                
                                var checarVazio = setInterval(function() {
                                    try {
                                        var docAtual = window.opener.document;
                                        var erroAtual = docAtual.querySelector(selErro);
                                        
                                        if (erroAtual && erroAtual.innerText.includes("Verifique")) {
                                            clearInterval(checarVazio);
                                            setTimeout(proximoPasso, 300);
                                            return;
                                        }
                                        
                                        var inpAtual = docAtual.querySelector(selCod);
                                        if (ehUltimo || (inpAtual && inpAtual.value === "")) {
                                            clearInterval(checarVazio);
                                            idx++;
                                            setTimeout(proximoPasso, 300); 
                                        }
                                    } catch(erroInterno) {}
                                }, 250);
                            }, 500);
                        } catch(e) {
                            setTimeout(proximoPasso, 1000);
                        }
                    }
                    
                    setTimeout(proximoPasso, 1000);
                `;
                W.document.body.appendChild(s);
            })();
        },
        "TRT": () => {
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
        },
        "ASSEDF": () => {
            (function () {
                var txt = prompt("Cole os códigos do ASSEDF / Vida Card:");
                if (!txt) return;
                var brutos = txt.match(/\b\d{8}\b/g);
                if (!brutos) { alert("Nenhum código de 8 dígitos encontrado!"); return; }

                // Repetidos viram quantidade; a ordem é a da colagem
                var conta = {};
                brutos.forEach(function (c) { conta[c] = (conta[c] || 0) + 1; });
                var unicos = [];
                brutos.forEach(function (c) { if (unicos.indexOf(c) === -1) unicos.push(c); });
                var itens = unicos.map(function (c) { return { cod: c, qtd: conta[c] }; });

                // Guarda os códigos para a janela de procedimentos pegar depois
                try {
                    localStorage.setItem('_assedfCodigos', JSON.stringify(itens));
                    localStorage.removeItem('_assedfFeitos');   // lote novo, contagem nova
                } catch (e) { }
                window._assedfCodigos = itens;

                var antigo = document.getElementById('painel-assedf');
                if (antigo) antigo.remove();
                var p = document.createElement('div');
                p.id = 'painel-assedf';
                p.style.cssText = 'position:fixed;top:10px;right:10px;width:320px;background:#1b3a6b;color:#fff;' +
                    'padding:14px;z-index:2147483647;border-radius:8px;font-family:Arial,sans-serif;' +
                    'box-shadow:0 4px 15px rgba(0,0,0,0.6);border:3px solid #4a90d9;font-size:12px;';
                p.innerHTML = '<h3 style="margin:0 0 8px;color:#9ecbff;text-align:center;">💳 ASSEDF / Vida Card</h3>' +
                    '<div id="assedf-status" style="font-size:12px;line-height:1.5;white-space:pre-line;background:#12294c;border-radius:5px;padding:8px;min-height:16px;">Guardando os códigos...</div>' +
                    '<button onclick="this.parentElement.remove()" style="width:100%;padding:6px;margin-top:8px;background:#636e72;color:#fff;border:none;border-radius:4px;cursor:pointer;">❌ Fechar</button>';
                document.body.appendChild(p);
                var diz = function (t) { document.getElementById('assedf-status').innerText = t; };

                // ══════════════════════════════════════════════════════════════
                //  AGENTE — este trecho é colocado DENTRO da janela de
                //  procedimentos e roda lá, como se fosse parte da página.
                //  É isso que faz o clique em "Inserir" valer de verdade.
                // ══════════════════════════════════════════════════════════════
                var agente = function () {
                    if (document.getElementById('painel-assedf-agente')) return;
                    try { if (window.__assedfFechado) return; } catch (e) { }

                    var lerCodigos = function () {
                        // 1) entregues direto pelo robô nesta janela
                        try { if (window.__assedfLista && window.__assedfLista.length) return window.__assedfLista; } catch (e) { }
                        // 2) guardados no navegador
                        try {
                            var g = localStorage.getItem('_assedfCodigos');
                            if (g) return JSON.parse(g);
                        } catch (e) { }
                        // 3) pela janela que abriu esta
                        try { return (window.opener && window.opener._assedfCodigos) || []; } catch (e) { }
                        return [];
                    };
                    var itens = lerCodigos();
                    if (!itens.length) return;

                    var caixa = document.createElement('div');
                    caixa.id = 'painel-assedf-agente';
                    caixa.style.cssText = 'position:fixed;bottom:12px;left:12px;z-index:2147483647;width:270px;' +
                        'background:#1b3a6b;color:#fff;padding:12px;border-radius:8px;font-family:Arial,sans-serif;' +
                        'font-size:12px;box-shadow:0 6px 20px rgba(0,0,0,.55);border:3px solid #e67e22;';
                    caixa.innerHTML =
                        '<div style="font-weight:bold;text-align:center;margin-bottom:8px;color:#ffd9a8;">💳 ASSEDF / Vida Card</div>' +
                        '<button id="ass-go" style="width:100%;padding:12px;background:#e67e22;color:#fff;border:none;' +
                        'border-radius:6px;font-weight:bold;cursor:pointer;font-size:14px;">🚀 LIBERAR CÓDIGOS (' + itens.length + ')</button>' +
                        '<div id="ass-log" style="margin-top:8px;background:#12294c;border-radius:5px;padding:8px;' +
                        'line-height:1.5;white-space:pre-line;min-height:16px;">Pronto para lançar.</div>' +
                        '<button id="ass-fechar" style="width:100%;padding:5px;margin-top:6px;background:#636e72;color:#fff;' +
                        'border:none;border-radius:4px;cursor:pointer;">❌ Fechar</button>';
                    document.body.appendChild(caixa);
                    document.getElementById('ass-fechar').onclick = function () {
                        // marca que o atendente fechou, senão a vigia reabre a caixinha
                        try { window.__assedfFechado = true; } catch (e) { }
                        caixa.remove();
                    };

                    var log = function (t) { document.getElementById('ass-log').innerText = t; };

                    // Se a função do portal recarregar a tela, o ajudante morre junto.
                    // Por isso anotamos o que já entrou: ao voltar, ele pula esses.
                    var jaFeitos = function () {
                        try { return JSON.parse(localStorage.getItem('_assedfFeitos') || '[]'); }
                        catch (e) { return []; }
                    };
                    var anotarFeito = function (cod) {
                        try {
                            var l = jaFeitos();
                            if (l.indexOf(cod) === -1) l.push(cod);
                            localStorage.setItem('_assedfFeitos', JSON.stringify(l));
                        } catch (e) { }
                    };
                    var desanotar = function (cod) {
                        try {
                            var l = jaFeitos().filter(function (c) { return c !== cod; });
                            localStorage.setItem('_assedfFeitos', JSON.stringify(l));
                        } catch (e) { }
                    };
                    var zerarFeitos = function () {
                        try { localStorage.removeItem('_assedfFeitos'); } catch (e) { }
                    };


                    var espera = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };
                    var rot = function (e) {
                        return ((e.value || '') + ' ' + (e.textContent || '')).replace(/\s+/g, ' ').trim().toLowerCase();
                    };
                    var digitaveis = function (raiz) {
                        return Array.prototype.slice.call(raiz.querySelectorAll('input')).filter(function (e) {
                            var t = (e.getAttribute('type') || 'text').toLowerCase();
                            return (t === 'text' || t === '') && !e.disabled && !e.readOnly;
                        });
                    };
                    // O portal pode montar o "Inserir" de vários jeitos e a tabela
                    // pode estar dentro de um quadro — procuramos em todos.
                    var docs = function () {
                        var l = [document];
                        try {
                            var q = document.querySelectorAll('iframe,frame');
                            for (var i = 0; i < q.length; i++) {
                                try { if (q[i].contentDocument) l.push(q[i].contentDocument); } catch (e) { }
                            }
                        } catch (e) { }
                        return l;
                    };
                    // A função inserir() do portal pode parar por dois motivos que
                    // não aparecem na tela: uma caixa de aviso que ninguém fecha, ou
                    // um pop-up bloqueado pelo navegador. Aqui desarmamos os dois e
                    // guardamos a mensagem, que é o que faltava para entender a falha.
                    var avisos = [], errosJS = [], acoes = [];
                    var instalarEscudo = function () {
                        docs().forEach(function (d) {
                            var v = d.defaultView;
                            if (!v) return;
                            try {
                                if (v.__assedfEscudo) return;
                                var abrirOrig = v.open;
                                v.alert = function (m) { avisos.push(String(m)); };
                                v.confirm = function (m) { avisos.push(String(m)); return true; };
                                v.open = function () {
                                    try { var w = abrirOrig.apply(v, arguments); if (w) return w; } catch (e) { }
                                    // pop-up bloqueado: devolvemos algo inofensivo para
                                    // o portal não quebrar no meio do lançamento
                                    return { closed: false, focus: function () { }, close: function () { },
                                             document: { write: function () { }, close: function () { } },
                                             location: { href: '' } };
                                };
                                v.addEventListener('error', function (e) {
                                    errosJS.push((e && e.message) || 'erro');
                                });

                                // Registra o que a função do portal faz por dentro.
                                // Se ela nem chega a enviar nada, é porque está
                                // desistindo no meio — e isso muda o tratamento.
                                try {
                                    var protoF = v.HTMLFormElement && v.HTMLFormElement.prototype;
                                    if (protoF && !protoF.__assedfEspiao) {
                                        var envOrig = protoF.submit;
                                        protoF.submit = function () {
                                            acoes.push('enviou o formulário' + (this.name ? ' ' + this.name : ''));
                                            return envOrig.apply(this, arguments);
                                        };
                                        protoF.__assedfEspiao = true;
                                    }
                                } catch (e) { }
                                try {
                                    var protoX = v.XMLHttpRequest && v.XMLHttpRequest.prototype;
                                    if (protoX && !protoX.__assedfEspiao) {
                                        var abrirX = protoX.open;
                                        protoX.open = function (m2, u2) {
                                            acoes.push('chamou o servidor: ' + String(u2).slice(0, 70));
                                            return abrirX.apply(this, arguments);
                                        };
                                        protoX.__assedfEspiao = true;
                                    }
                                } catch (e) { }

                                v.__assedfEscudo = true;
                            } catch (e) { }
                        });
                    };

                    var botoesInserir = function () {
                        var out = [];
                        docs().forEach(function (d) {
                            try {
                                var els = d.querySelectorAll('a,button,input,td,span,div,img');
                                for (var i = 0; i < els.length; i++) {
                                    var e = els[i];
                                    if (e.children && e.children.length > 2) continue;
                                    var t = ((e.value || '') + ' ' + (e.textContent || '') + ' ' +
                                             ((e.getAttribute && e.getAttribute('alt')) || ''))
                                            .replace(/\s+/g, ' ').trim().toLowerCase();
                                    if (t !== 'inserir') continue;
                                    // A célula que ENVOLVE o botão também casa com a
                                    // busca. Clicar nela não faz nada, então ficamos
                                    // sempre com o elemento mais interno.
                                    var interno = e;
                                    try {
                                        var filhos = e.querySelectorAll('a,button,input,span,img');
                                        for (var k = 0; k < filhos.length; k++) {
                                            var tf = ((filhos[k].value || '') + ' ' + (filhos[k].textContent || '') + ' ' +
                                                      ((filhos[k].getAttribute && filhos[k].getAttribute('alt')) || ''))
                                                     .replace(/\s+/g, ' ').trim().toLowerCase();
                                            if (tf === 'inserir') { interno = filhos[k]; break; }
                                        }
                                    } catch (e2) { }
                                    if (out.indexOf(interno) === -1) out.push(interno);
                                }
                            } catch (e) { }
                        });
                        // Botões e links primeiro; células por último
                        out.sort(function (a, b) {
                            var p = function (e) { return /^(A|BUTTON|INPUT|IMG)$/.test(e.tagName) ? 0 : (e.tagName === 'TD' ? 2 : 1); };
                            return p(a) - p(b);
                        });
                        return out;
                    };
                    var linhaLivre = function (podeLimpar) {
                        var bts = botoesInserir();
                        // Pode haver mais de um "Inserir" na tela (um deles pode ser
                        // só o título da coluna). Vale o que estiver na MESMA linha
                        // dos campos de digitação.
                        for (var i = 0; i < bts.length; i++) {
                            var tr = bts[i].closest ? bts[i].closest('tr') : null;
                            if (!tr) continue;
                            var ins = digitaveis(tr);
                            if (!ins.length) continue;
                            var ocupada = (ins[0].value || '').trim();
                            if (ocupada && !podeLimpar) continue;
                            if (ocupada && podeLimpar) {
                                ins[0].value = '';
                                if (ins.length >= 3) ins[1].value = '';
                            }
                            return {
                                tr: tr, inserir: bts[i], cod: ins[0],
                                desc: ins.length >= 3 ? ins[1] : null,
                                qtd: ins.length >= 3 ? ins[2] : (ins.length === 2 ? ins[1] : null)
                            };
                        }
                        return null;
                    };
                    var escrever = function (el, v) {
                        if (!el) return;
                        try { el.focus(); } catch (e) { }
                        el.value = v;
                        try { el.dispatchEvent(new Event('input', { bubbles: true })); } catch (e) { }
                        try { el.dispatchEvent(new Event('change', { bubbles: true })); } catch (e) { }
                        try { el.dispatchEvent(new KeyboardEvent('keyup', { bubbles: true })); } catch (e) { }
                        if (window.jQuery) {
                            try { window.jQuery(el).val(v).trigger('input').trigger('change').trigger('keyup'); } catch (e) { }
                        }
                    };
                    var sair = function (el) {
                        if (!el) return;
                        try { el.blur(); } catch (e) { }
                        ['blur', 'focusout', 'change'].forEach(function (t) {
                            try { el.dispatchEvent(new Event(t, { bubbles: true })); } catch (e) { }
                        });
                        if (window.jQuery) { try { window.jQuery(el).trigger('blur').trigger('change'); } catch (e) { } }
                    };
                    var recusou = function () {
                        var achou = false;
                        docs().forEach(function (d) {
                            try {
                                var t = d.body ? (d.body.innerText || d.body.textContent || '') : '';
                                if (/procedimento\s+n[ãa]o\s+autorizado/i.test(t)) achou = true;
                            } catch (e) { }
                        });
                        return achou;
                    };
                    var limparAviso = function () {
                        docs().forEach(function (d) {
                            try {
                                var todos = d.querySelectorAll('*');
                                for (var i = 0; i < todos.length; i++) {
                                    if (todos[i].children.length === 0 &&
                                        /procedimento\s+n[ãa]o\s+autorizado/i.test(todos[i].textContent || '')) {
                                        todos[i].textContent = '';
                                    }
                                }
                            } catch (e) { }
                        });
                    };
                    // Aciona o "Inserir" e confere se entrou antes de tentar outro
                    // jeito — assim nunca lança o mesmo exame duas vezes.
                    // Como saber que o exame ENTROU: depois de inserido, o código
                    // passa a aparecer como TEXTO na tela (antes ele só existia
                    // dentro do campo de digitação). Esse sinal é o mais confiável.
                    var textoDaTela = function () {
                        var t = '';
                        docs().forEach(function (d) {
                            try {
                                if (!d.body) return;
                                // Ignora o nosso próprio painel: ele mostra o código
                                // em andamento e faria o robô achar que já entrou.
                                var f = d.body.children;
                                for (var i = 0; i < f.length; i++) {
                                    if (f[i].id === 'painel-assedf-agente') continue;
                                    // textContent em vez de innerText: mesmo resultado
                                    // para o que precisamos, sem obrigar o navegador
                                    // a refazer o desenho da página a cada leitura.
                                    t += ' ' + (f[i].textContent || '');
                                }
                            } catch (e) { }
                        });
                        return t;
                    };
                    var entrou = function (linha, cod, jaEstava) {
                        try {
                            if (!jaEstava && textoDaTela().indexOf(cod) !== -1) return true;
                            if (linha.cod && linha.cod.isConnected === false) return true;
                            if (linha.cod && !(linha.cod.value || '').trim()) return true;
                            var nova = linhaLivre(false);
                            if (nova && nova.cod !== linha.cod) return true;
                        } catch (e) { }
                        return false;
                    };

                    // Descreve o botão — se nada funcionar, isso aparece no aviso e
                    // diz exatamente com o que estamos lidando.
                    // Lê o código-fonte da função que o portal chama. É a
                    // informação que permite reproduzir exatamente o que ela faz.
                    var fonteDaFuncao = function (el) {
                        try {
                            var a3 = acharFuncao(el);
                            if (!a3) return '';
                            if (!a3.fn) return a3.nome + '() NÃO EXISTE em nenhuma janela alcançável';
                            return String(a3.fn).replace(/\s+/g, ' ').slice(0, 500);
                        } catch (e) { return ''; }
                    };

                    var descrever = function (el) {
                        try {
                            var a = [];
                            ['href', 'onclick', 'name', 'id', 'class', 'type', 'value'].forEach(function (n) {
                                var v = el.getAttribute && el.getAttribute(n);
                                if (v) a.push(n + '="' + String(v).slice(0, 60) + '"');
                            });
                            return el.tagName + (a.length ? ' ' + a.join(' ') : '');
                        } catch (e) { return '?'; }
                    };

                    // Clique o mais parecido possível com o de uma pessoa:
                    // sequência completa de eventos, nas coordenadas reais do botão.
                    var cliqueRealista = function (el, vista) {
                        try { el.scrollIntoView({ block: 'center' }); } catch (e) { }
                        var r = { left: 0, top: 0, width: 10, height: 10 };
                        try { r = el.getBoundingClientRect(); } catch (e) { }
                        var x = Math.round(r.left + r.width / 2);
                        var y = Math.round(r.top + r.height / 2);
                        var base = {
                            bubbles: true, cancelable: true, composed: true, view: vista,
                            clientX: x, clientY: y, screenX: x, screenY: y,
                            button: 0, buttons: 1, detail: 1
                        };
                        var P = vista.PointerEvent, M = vista.MouseEvent || MouseEvent;
                        var disp = function (Ctor, tipo, extra) {
                            if (!Ctor) return;
                            var o = {};
                            for (var k in base) o[k] = base[k];
                            if (extra) for (var k2 in extra) o[k2] = extra[k2];
                            try { el.dispatchEvent(new Ctor(tipo, o)); } catch (e) { }
                        };
                        if (P) { disp(P, 'pointerover'); disp(P, 'pointerenter'); disp(P, 'pointermove'); disp(P, 'pointerdown'); }
                        disp(M, 'mouseover'); disp(M, 'mouseenter'); disp(M, 'mousemove'); disp(M, 'mousedown');
                        try { el.focus(); } catch (e) { }
                        if (P) disp(P, 'pointerup', { buttons: 0 });
                        disp(M, 'mouseup', { buttons: 0 });
                        disp(M, 'click', { buttons: 0 });
                    };

                    // A função do portal pode estar em OUTRA janela (a página usa
                    // quadros). Procuramos em todas as alcançáveis: a do próprio
                    // botão, a da tela, o pai, o topo, os quadros e a janela de origem.
                    var todasAsJanelas = function (el) {
                        var lista = [];
                        var por = function (w) {
                            try {
                                if (!w || lista.indexOf(w) !== -1) return;
                                void w.document;
                                lista.push(w);
                                for (var i = 0; i < w.frames.length; i++) por(w.frames[i]);
                            } catch (e) { }
                        };
                        try { por(el && el.ownerDocument && el.ownerDocument.defaultView); } catch (e) { }
                        por(window);
                        try { por(window.parent); } catch (e) { }
                        try { por(window.top); } catch (e) { }
                        try { por(window.opener); } catch (e) { }
                        return lista;
                    };

                    var nomeNoOnclick = function (el) {
                        try {
                            var oc = el.getAttribute && el.getAttribute('onclick');
                            if (!oc) return null;
                            var m = oc.match(/([A-Za-z_$][\w$]*)\s*\(/);
                            return m ? m[1] : null;
                        } catch (e) { return null; }
                    };

                    var acharFuncao = function (el) {
                        var nome = nomeNoOnclick(el);
                        if (!nome) return null;
                        var js = todasAsJanelas(el);
                        for (var i = 0; i < js.length; i++) {
                            try {
                                if (typeof js[i][nome] === 'function') return { nome: nome, fn: js[i][nome], win: js[i] };
                            } catch (e) { }
                        }
                        return { nome: nome, fn: null, win: null };
                    };

                    var chamarFuncao = function (el) {
                        var achado = acharFuncao(el);
                        if (!achado || !achado.fn) return false;
                        var v = achado.win;
                        var ev = null;
                        try {
                            ev = new (v.MouseEvent || MouseEvent)('click', { bubbles: true, view: v });
                            try { Object.defineProperty(ev, 'target', { value: el, configurable: true }); } catch (e) { }
                            try { Object.defineProperty(ev, 'srcElement', { value: el, configurable: true }); } catch (e) { }
                        } catch (e) { }
                        var antes = null;
                        try { antes = Object.getOwnPropertyDescriptor(v, 'event'); } catch (e) { }
                        try { Object.defineProperty(v, 'event', { value: ev, configurable: true, writable: true }); } catch (e) { }
                        try { achado.fn.call(el); return true; }
                        catch (e) { errosJS.push(achado.nome + ': ' + (e.message || 'erro')); return false; }
                        finally {
                            try {
                                if (antes) Object.defineProperty(v, 'event', antes);
                                else delete v.event;
                            } catch (e) { }
                        }
                    };

                    // Fica escutando a tela: assim que ela muda, confere na hora.
                    // Antes ele olhava a cada 120ms e perdia até 120ms por exame —
                    // com 40 exames isso vira segundos jogados fora.
                    var esperarAte = function (cond, teto) {
                        return new Promise(function (resolve) {
                            var pronto = false, ultimo = 0;
                            var obs = [], iv = null, to = null;
                            var fim = function (v) {
                                if (pronto) return;
                                pronto = true;
                                obs.forEach(function (o) { try { o.disconnect(); } catch (e) { } });
                                if (iv) clearInterval(iv);
                                if (to) clearTimeout(to);
                                resolve(v);
                            };
                            var testar = function () {
                                if (pronto) return;
                                var agora = Date.now();
                                if (agora - ultimo < 30) return;    // não conferir sem parar
                                ultimo = agora;
                                try { if (cond()) fim(true); } catch (e) { }
                            };
                            try { if (cond()) return resolve(true); } catch (e) { }
                            docs().forEach(function (d) {
                                try {
                                    var M = (d.defaultView && d.defaultView.MutationObserver) || MutationObserver;
                                    var o = new M(testar);
                                    o.observe(d.body || d.documentElement, {
                                        childList: true, subtree: true, characterData: true,
                                        attributes: true, attributeFilter: ['value']
                                    });
                                    obs.push(o);
                                } catch (e) { }
                            });
                            iv = setInterval(testar, 200);          // rede de segurança
                            to = setTimeout(function () { fim(false); }, teto);
                        });
                    };

                    var jeitoQueFunciona = -1;

                    var acionar = async function (linha, cod) {
                        limparAviso();          // aviso antigo não pode contaminar este exame
                        var base = linha.inserir;
                        try {
                            var p2 = base.closest && base.closest('a,button,input[type=button],input[type=submit]');
                            if (p2 && p2 !== base) base = p2;
                        } catch (e) { }
                        var dono = base.ownerDocument || document;
                        var vista = dono.defaultView || window;
                        var jaEstava = textoDaTela().indexOf(cod) !== -1;

                        // O tratador do clique pode estar no próprio elemento, na
                        // célula ou na linha — acionamos todos os níveis.
                        var niveis = [], p3 = base;
                        for (var n = 0; n < 5 && p3; n++) {
                            niveis.push(p3);
                            if (p3.tagName === 'TR') break;
                            p3 = p3.parentElement;
                        }

                        var disparar = function (el) {
                            var M = vista.MouseEvent || MouseEvent;
                            ['mouseover', 'mousedown', 'mouseup', 'click'].forEach(function (t) {
                                try { el.dispatchEvent(new M(t, { bubbles: true, cancelable: true, view: vista })); } catch (e) { }
                            });
                        };
                        var rodarScript = function (el) {
                            try {
                                var h = el.getAttribute && el.getAttribute('href');
                                if (h && /^javascript:/i.test(h)) { vista.eval(h.replace(/^javascript:/i, '')); return; }
                            } catch (e) { }
                            try {
                                var oc = el.getAttribute && el.getAttribute('onclick');
                                if (oc) vista.eval(oc);
                            } catch (e) { }
                        };

                        var jeitos = [
                            // 1º: chamar a função do portal NA JANELA ONDE ELA VIVE
                            function () { chamarFuncao(base); },
                            // 2º: executar o comando do botão nessa mesma janela
                            function () {
                                var a2 = acharFuncao(base);
                                if (!a2 || !a2.win) return;
                                var oc = base.getAttribute && base.getAttribute('onclick');
                                if (oc) a2.win.eval(oc);
                            },
                            // 3º: clique o mais fiel possível
                            function () { cliqueRealista(base, vista); }
                        ];

                        niveis.forEach(function (el) {
                            jeitos.push(function () { if (typeof el.click === 'function') el.click(); });
                            jeitos.push(function () { disparar(el); });
                            jeitos.push(function () { if (typeof el.onclick === 'function') el.onclick.call(el); });
                            jeitos.push(function () { rodarScript(el); });
                        });
                        jeitos.push(function () {
                            // Executa o comando do botão como o navegador executaria,
                            // com o próprio botão no lugar do "this"
                            var oc = base.getAttribute && base.getAttribute('onclick');
                            if (!oc) return;
                            var F = vista.Function || Function;
                            (new F('event', oc)).call(base, null);
                        });
                        jeitos.push(function () { if (vista.jQuery) vista.jQuery(base).trigger('click'); });
                        jeitos.push(function () {                       // Enter no campo
                            var alvo = linha.qtd || linha.cod;
                            if (!alvo) return;
                            var K = vista.KeyboardEvent || KeyboardEvent;
                            ['keydown', 'keypress', 'keyup'].forEach(function (t) {
                                try { alvo.dispatchEvent(new K(t, { key: 'Enter', keyCode: 13, which: 13, bubbles: true })); } catch (e) { }
                            });
                        });
                        // Último recurso: enviar o formulário. Fica no fim porque,
                        // sozinho, ele recarrega a tela sem inserir nada.
                        jeitos.push(function () {
                            var f = base.form || (base.closest && base.closest('form'));
                            if (f && f.requestSubmit) f.requestSubmit();
                        });
                        jeitos.push(function () {
                            var f = base.form || (base.closest && base.closest('form'));
                            if (!f) return;
                            try {
                                if (base.name) {
                                    var extra = (f.ownerDocument || document).createElement('input');
                                    extra.type = 'hidden';
                                    extra.name = base.name;
                                    extra.value = base.value || 'Inserir';
                                    f.appendChild(extra);
                                }
                                var envio = (vista.HTMLFormElement && vista.HTMLFormElement.prototype.submit) || f.submit;
                                envio.call(f);
                            } catch (e) { try { f.submit(); } catch (e2) { } }
                        });

                        // Espera o portal responder. A ordem aqui importa muito:
                        // primeiro olhamos se o exame ENTROU, e só depois o aviso.
                        // Se o aviso aparecer mas o exame estiver na lista, é aviso
                        // de repetição (nós acionamos duas vezes) — não é recusa.
                        var esperarResposta = async function (teto) {
                            var resultado = null;
                            await esperarAte(function () {
                                var tela = textoDaTela();
                                if (!jaEstava && tela.indexOf(cod) !== -1) { resultado = 'ok'; return true; }
                                if (/procedimento\s+n[ãa]o\s+autorizado/i.test(tela)) {
                                    if (tela.indexOf(cod) !== -1) { limparAviso(); resultado = 'ok'; return true; }
                                    resultado = 'recusado'; return true;
                                }
                                if (entrou(linha, cod, jaEstava)) { resultado = 'ok'; return true; }
                                return false;
                            }, teto);
                            return resultado;
                        };

                        // Se já descobrimos qual jeito funciona neste portal, usamos
                        // só ele — assim nunca acionamos duas vezes o mesmo exame.
                        if (jeitoQueFunciona >= 0 && jeitos[jeitoQueFunciona]) {
                            instalarEscudo();
                            try { jeitos[jeitoQueFunciona](); } catch (e) { errosJS.push(e.message || 'erro'); }
                            var rc = await esperarResposta(7000);    // mesmo teto de antes
                            if (rc) return rc;
                        }

                        for (var j = 0; j < jeitos.length; j++) {
                            if (j === jeitoQueFunciona) continue;
                            instalarEscudo();
                            try { jeitos[j](); } catch (e) { errosJS.push(e.message || 'erro'); }
                            // O primeiro jeito ganha uma espera bem maior: é o mais
                            // provável, e insistir cedo demais causava a duplicidade.
                            var r = await esperarResposta(j === 0 ? 7000 : 2500);
                            if (r) {
                                if (r === 'ok') jeitoQueFunciona = j;
                                return r;
                            }
                        }
                        return 'falhou';
                    };

                    // Prepara a linha: código → espera o nome → quantidade.
                    // Devolve tudo que o passo seguinte precisa.
                    var prepararLinha = async function (cod, qtd) {
                        var linha = null, voltasLinha = 0;
                        await esperarAte(function () {
                            linha = linhaLivre(++voltasLinha > 20);
                            return !!linha;
                        }, 12000);
                        if (!linha) return null;

                        var jaEstava = textoDaTela().indexOf(cod) !== -1;
                        escrever(linha.cod, cod);
                        sair(linha.cod);

                        var nome = '';
                        await esperarAte(function () {
                            if (linha.desc && (linha.desc.value || '').trim().length > 2) {
                                nome = linha.desc.value.trim(); return true;
                            }
                            var bruto = (linha.tr.textContent || '').replace(/\s+/g, ' ').trim();
                            var limpo = bruto.split(cod).join(' ')
                                .replace(/\b(inserir|zerar|inclui[r]?|excluir)\b/gi, ' ')
                                .replace(/(^|\s)P(\s|$)/g, ' ')
                                .replace(/\s+/g, ' ').trim();
                            if (limpo.length > 4) { nome = limpo; return true; }
                            return false;
                        }, 10000);

                        if (linha.qtd) { escrever(linha.qtd, qtd); sair(linha.qtd); await espera(50); }
                        return { linha: linha, nome: nome, jaEstava: jaEstava };
                    };

                    var finalizar = function (lancados, recusados, parou, b) {
                        var fim = (parou ? '⚠️ Parei: ' + parou + '\n' : '✅ Concluído! ') +
                                  lancados + ' de ' + itens.length + ' exame(s) lançado(s).';
                        if (recusados.length) {
                            fim += '\n⚠️ ' + recusados.join(', ') +
                                   (recusados.length > 1 ? ' não entraram' : ' não entrou') +
                                   ' devido paciente ter realizado recente';
                        }
                        fim += '\nConfira e clique em Gravar.';
                        if (!parou) zerarFeitos();
                        log(fim);
                        b.disabled = false;
                        b.style.background = parou ? '#e67e22' : '#27ae60';
                        b.innerText = parou ? '🔁 Tentar de novo' : '✅ Concluído';
                    };

                    // ── MODO ASSISTIDO ──
                    // Se o portal só aceitar o clique de uma pessoa de verdade, o
                    // ajudante preenche a linha e espera VOCÊ clicar em INSERIR —
                    // e assim que o exame entra, ele já prepara o próximo sozinho.
                    var modoAssistido = async function (inicio, lancados, recusados, b) {
                        b.style.background = '#2980b9';
                        b.innerText = '👆 Modo assistido';
                        for (var i = inicio; i < itens.length; i++) {
                            var cod = itens[i].cod, qtd = itens[i].qtd;
                            if (textoDaTela().indexOf(cod) !== -1) { lancados++; continue; }

                            var pre = await prepararLinha(cod, qtd);
                            if (!pre) { finalizar(lancados, recusados, 'não apareceu linha para o código ' + cod, b); return; }

                            log('👆 ' + (i + 1) + '/' + itens.length + ' — ' + cod +
                                (pre.nome ? '\n' + pre.nome.slice(0, 42) : '') +
                                '\n\nAgora CLIQUE EM "INSERIR" na tela.\nAssim que entrar eu preparo o próximo.');

                            var entregue = false;
                            for (var k = 0; k < 2400; k++) {          // espera até 10 minutos
                                await espera(250);
                                if (recusou()) {
                                    recusados.push(pre.nome || cod);
                                    desanotar(cod);
                                    limparAviso();
                                    try {
                                        var at = linhaLivre(true);
                                        if (at) { escrever(at.cod, ''); if (at.desc) escrever(at.desc, ''); }
                                    } catch (e) { }
                                    entregue = true;
                                    break;
                                }
                                if (entrou(pre.linha, cod, pre.jaEstava)) {
                                    lancados++; anotarFeito(cod); entregue = true; break;
                                }
                            }
                            if (!entregue) { finalizar(lancados, recusados, 'esperei demais pelo clique em Inserir', b); return; }
                        }
                        finalizar(lancados, recusados, null, b);
                    };

                    document.getElementById('ass-go').onclick = async function () {
                        instalarEscudo();
                        var b = document.getElementById('ass-go');
                        itens = lerCodigos();
                        b.disabled = true;
                        b.style.background = '#c0392b';
                        b.innerText = '⏳ Lançando...';

                        var lancados = 0, recusados = [], parou = null;
                        var feitos = jaFeitos();

                        for (var i = 0; i < itens.length; i++) {
                            var cod = itens[i].cod, qtd = itens[i].qtd;

                            if (feitos.indexOf(cod) !== -1 || textoDaTela().indexOf(cod) !== -1) {
                                lancados++;
                                log('↷ ' + (i + 1) + '/' + itens.length + ' — ' + cod + ' já estava lançado');
                                await espera(120);
                                continue;
                            }

                            log('⏳ ' + (i + 1) + '/' + itens.length + ' — ' + cod + (qtd > 1 ? ' (qtd ' + qtd + ')' : ''));
                            var pre = await prepararLinha(cod, qtd);
                            if (!pre) {
                                parou = (i === 0) ? 'não encontrei a tabela de procedimentos nesta tela'
                                                  : 'não apareceu linha para o código ' + cod;
                                break;
                            }

                            limparAviso();
                            anotarFeito(cod);
                            var res = await acionar(pre.linha, cod);

                            if (res === 'recusado') {
                                desanotar(cod);
                                recusados.push(pre.nome || cod);
                                limparAviso();
                                try {
                                    var atual = linhaLivre(true);
                                    if (atual) { escrever(atual.cod, ''); if (atual.desc) escrever(atual.desc, ''); }
                                } catch (e) { }
                                log('⚠️ ' + (pre.nome || cod) + ' não entrou — seguindo para o próximo');
                                await espera(500);
                            } else if (res === 'falhou') {
                                desanotar(cod);
                                b.disabled = false;

                                // Guarda tudo que descobrimos sobre a função do portal,
                                // num quadro que dá para selecionar e copiar.
                                var relato = 'BOTÃO: ' + descrever(pre.linha.inserir) +
                                    '\n\nO QUE A FUNÇÃO FEZ: ' + (acoes.length ? acoes.join(' | ') : 'NADA (desistiu calada)') +
                                    (avisos.length ? '\n\nAVISOS DO PORTAL: ' + avisos.join(' | ') : '') +
                                    (errosJS.length ? '\n\nERROS: ' + errosJS.join(' | ') : '') +
                                    '\n\nCÓDIGO DA FUNÇÃO:\n' + (fonteDaFuncao(pre.linha.inserir) || '(não consegui ler)');
                                try {
                                    var cx = document.createElement('textarea');
                                    cx.id = 'ass-diag';
                                    cx.readOnly = true;
                                    cx.value = relato;
                                    cx.style.cssText = 'width:100%;height:110px;margin-top:8px;font-size:10px;' +
                                        'font-family:Consolas,monospace;background:#0a1c33;color:#9ecbff;' +
                                        'border:1px solid #4a90d9;border-radius:4px;padding:6px;box-sizing:border-box;';
                                    var velho = document.getElementById('ass-diag');
                                    if (velho) velho.remove();
                                    document.getElementById('ass-log').insertAdjacentElement('afterend', cx);
                                    cx.select();
                                    try { document.execCommand('copy'); } catch (e) { }
                                } catch (e) { }

                                log('ℹ️ O clique automático não passou neste portal.\n' +
                                    'Copiei o diagnóstico abaixo (já está na área de transferência) —\n' +
                                    'mande para eu deixar 100% automático.\n\n' +
                                    'Enquanto isso, sigo no modo assistido: eu preencho, você só clica em INSERIR.');
                                await espera(1500);
                                await modoAssistido(i, lancados, recusados, b);
                                return;
                            } else {
                                lancados++;
                                limparAviso();   // deixa a tela limpa para o próximo
                            }
                        }

                        finalizar(lancados, recusados, parou, b);
                    };
                };

                // ── Colocar o agente dentro da janela de procedimentos ──
                // Antes eu só injetava se achasse o botão "Inserir" — se ele fosse
                // de outro tipo ou estivesse num quadro, nada aparecia. Agora basta
                // ser a janela do convênio; quem procura a tabela é o agente, lá
                // dentro, e ele avisa na própria tela se não encontrar.
                var ehJanelaDoConvenio = function (w) {
                    try {
                        if (w === window || w === window.top || w === window.parent) return false;
                        var d = w.document;
                        if (!d || !d.body) return false;
                        var url = '';
                        try { url = w.location.href || ''; } catch (e) { }
                        if (/GPSC0005b|incluir=S/i.test(url)) return true;
                        var t = (d.body.innerText || d.body.textContent || '');
                        return /guia\s+de\s+autoriza/i.test(t) || /inserir/i.test(t);
                    } catch (e) { return false; }
                };

                var injetar = function (w) {
                    try {
                        if (!w || w.closed || !w.document || !w.document.body) return false;
                        var d = w.document;
                        if (d.getElementById('painel-assedf-agente')) return true;
                        try { if (w.__assedfFechado) return true; } catch (e) { }
                        if (!ehJanelaDoConvenio(w)) return false;
                        // Entrega a lista dentro da janela (nem sempre dá para ler
                        // o armazenamento do navegador ou a janela de origem)
                        try { w.__assedfLista = JSON.parse(JSON.stringify(itens)); } catch (e) { }
                        try { w.eval('window.__assedfLista = ' + JSON.stringify(itens) + ';'); } catch (e) { }
                        var sc = d.createElement('script');
                        sc.textContent = '(' + agente.toString() + ')();';
                        d.body.appendChild(sc);
                        return !!d.getElementById('painel-assedf-agente');
                    } catch (e) { return false; }
                };

                // Relógio próprio: o app troca os relógios da página durante a
                // automação, e este vigia precisa sobreviver a isso.
                var relogioProprio = (function () {
                    try {
                        var f = document.createElement('iframe');
                        f.style.cssText = 'position:fixed;left:-9999px;width:1px;height:1px;border:0;';
                        document.body.appendChild(f);
                        var jan = f.contentWindow;
                        return function (fn, ms) { return jan.setInterval(fn, ms); };
                    } catch (e) {
                        return function (fn, ms) { return setInterval(fn, ms); };
                    }
                })();

                // Todas as janelas desta aba, inclusive os quadros (frames).
                // A página do convênio é antiga e pode usar quadros: se o botão
                // estiver dentro de um, é o window.open DELE que abre a janela.
                var janelasLocais = function () {
                    var lista = [];
                    var visitar = function (w) {
                        try {
                            if (!w || lista.indexOf(w) !== -1) return;
                            void w.document;              // testa se dá para acessar
                            lista.push(w);
                            for (var i = 0; i < w.frames.length; i++) visitar(w.frames[i]);
                        } catch (e) { }
                    };
                    visitar(window);
                    try { visitar(window.top); } catch (e) { }
                    try { visitar(window.parent); } catch (e) { }
                    return lista;
                };

                // A lista de janelas capturadas é global: assim uma vigia instalada
                // numa execução anterior continua alimentando a execução de agora.
                try { window.__assedfAlvos = window.__assedfAlvos || []; } catch (e) { }
                var alvos = window.__assedfAlvos || [];
                var lembrar = function (w) {
                    try { if (w && window.__assedfAlvos.indexOf(w) === -1) window.__assedfAlvos.push(w); } catch (e) { }
                };
                janelasLocais().forEach(function (alvo) {
                    try {
                        if (alvo.__assedfHook) return;
                        var orig = alvo.open;
                        alvo.open = function () {
                            var w = orig.apply(alvo, arguments);
                            try { if (w && window.__assedfAlvos.indexOf(w) === -1) window.__assedfAlvos.push(w); } catch (e) { }
                            return w;
                        };
                        alvo.__assedfHook = true;
                    } catch (e) { }
                });

                var marcouNome = false, tentativasNome = 0;
                janelasLocais().forEach(function (jw) {
                try {
                    jw.document.addEventListener('click', function (e) {
                        try {
                            var el = e.target && e.target.closest ? e.target.closest('a,input,button') : null;
                            if (!el) return;
                            var t = ((el.value || '') + ' ' + (el.textContent || '')).replace(/\s+/g, ' ').trim();
                            if (!/cadastrar\s+procedimentos/i.test(t)) return;
                            if (el.tagName === 'A' && el.getAttribute('target')) {
                                el.setAttribute('target', 'crAssedfProc'); marcouNome = true;
                            }
                            var f = el.form || (el.closest && el.closest('form'));
                            if (f && f.target) { f.target = 'crAssedfProc'; marcouNome = true; }
                        } catch (e2) { }
                    }, true);
                } catch (e) { }
                });

                var voltas = 0;
                var vigia = relogioProprio(function () {
                    voltas++;
                    if (voltas > 2400) { try { clearInterval(vigia); } catch (e) { } return; }   // ~36 min
                    var lista = alvos.slice();
                    try { (window.__crJanelas || []).forEach(function (w) { lista.push(w); }); } catch (e) { }
                    // Recuperar pela janela nomeada — só quando o atendente
                    // realmente clicou em "Cadastrar Procedimentos", e no máximo
                    // três vezes. Antes isso rodava sem parar e fazia a tela tremer.
                    if (marcouNome && tentativasNome < 3) {
                        tentativasNome++;
                        try {
                            var w2 = window.open('', 'crAssedfProc');
                            if (w2 && w2 !== window) lista.push(w2);
                        } catch (e) { }
                    }

                    for (var i = 0; i < lista.length; i++) {
                        if (injetar(lista[i])) {
                            // conseguiu: não precisa mais ficar varrendo
                            try { clearInterval(vigia); } catch (e) { }
                            return;
                        }
                    }
                }, 1500);

                diz('✅ ' + itens.length + ' código(s) guardado(s) na memória.\n\n' +
                    '➡️ Agora clique em "Cadastrar Procedimentos".\n' +
                    'Na janela que abrir vai aparecer o botão laranja\n' +
                    '"LIBERAR CÓDIGOS" — clique nele para lançar.');
            })();
        },
        "ASSEFAZ": () => {
            (async function(){
                var origAlert=window.alert;
                window.alert=function(){console.log("Alert bloqueado");};
                var l=prompt("Cole os códigos de 8 dígitos para ASSEFAZ:");
                if(!l){window.alert=origAlert;return;}
                var raw=l.match(/\b\d{8}\b/g);
                if(!raw){window.alert=origAlert;origAlert("Sem códigos válidos!");return;}
                var counts={};
                raw.forEach(x=>counts[x]=(counts[x]||0)+1);
                var unicos=[...new Set(raw)];
                var codigos=unicos.map(k=>({cod:k,qtd:counts[k]}));
                const wait=ms=>new Promise(r=>setTimeout(r,ms));
                const painel=document.createElement('div');
                painel.style.cssText='position:fixed;top:10px;right:10px;background:#c0392b;color:#fff;padding:15px;z-index:999999;border-radius:8px;border:3px solid #922b21;font-family:Arial;box-shadow:0 4px 10px rgba(0,0,0,0.5);';
                painel.innerHTML='<h3 style="margin:0 0 10px;color:#fff;">🔥 Robô ASSEFAZ (V4 - Estabilizador)</h3><div id="assefaz-status" style="font-size:13px;">Acelerando...</div>';
                document.body.appendChild(painel);
                const status=document.getElementById('assefaz-status');
                const checkModal=async()=>{
                    let modalHandled=false;
                    while(true){
                        let mBtn=document.querySelector('#msn-procedimento-modal > div > div > div.modal-footer > button');
                        let modal=document.getElementById('msn-procedimento-modal');
                        if(mBtn&&mBtn.offsetParent!==null){
                            status.innerText='⚠️ Destruindo Modal...';
                            mBtn.click();
                            if(typeof window.$!=='undefined'){
                                try{window.$('#msn-procedimento-modal').modal('hide');}catch(e){}
                            }
                            await wait(100);
                            if(modal)modal.style.display='none';
                            document.querySelectorAll('.modal-backdrop').forEach(el=>el.remove());
                            document.body.classList.remove('modal-open');
                            await wait(400);
                            modalHandled=true;
                        }else{
                            break;
                        }
                    }
                    if(modalHandled){
                        status.innerText='⏳ Estabilizando sistema...';
                        await wait(800);
                    }
                    return modalHandled;
                };
                for(let i=0;i<codigos.length;i++){
                    let item=codigos[i];
                    let c=item.cod;
                    let q=item.qtd;
                    status.innerText=`Processando ${c} (${i+1}/${codigos.length})`;
                    await checkModal();
                    let inpCod=null;
                    let inps=Array.from(document.querySelectorAll('#registroProcedimentoCodigo input, input#registroProcedimentoCodigo'));
                    inpCod=inps.find(el=>el.offsetParent!==null&&!el.disabled);
                    if(!inpCod){
                        let btnIncluir=null;
                        for(let k=0;k<100;k++){
                            await checkModal();
                            let btns=Array.from(document.querySelectorAll('#incluirProcedimento'));
                            btnIncluir=btns.find(b=>b.offsetParent!==null);
                            if(btnIncluir)break;
                            await wait(5);
                        }
                        if(btnIncluir){
                            btnIncluir.click();
                            for(let k=0;k<100;k++){
                                inps=Array.from(document.querySelectorAll('#registroProcedimentoCodigo input, input#registroProcedimentoCodigo'));
                                inpCod=inps.find(el=>el.offsetParent!==null&&!el.disabled);
                                if(inpCod)break;
                                await wait(5);
                            }
                        }
                    }
                    if(!inpCod){
                        status.innerText=`⚠️ Campo ausente ${c}`;
                        await wait(500);
                        continue;
                    }
                    inpCod.blur();
                    await wait(50);
                    inpCod.focus();
                    let setVal=Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype,'value');
                    if(setVal&&setVal.set)setVal.set.call(inpCod,"");else inpCod.value="";
                    inpCod.dispatchEvent(new Event('input',{bubbles:true}));
                    inpCod.dispatchEvent(new Event('change',{bubbles:true}));
                    if(typeof window.$!=='undefined'){
                        try{window.$(inpCod).val('').trigger('input').trigger('change');}catch(e){}
                    }
                    await wait(200);
                    if(setVal&&setVal.set)setVal.set.call(inpCod,c);else inpCod.value=c;
                    inpCod.dispatchEvent(new Event('input',{bubbles:true}));
                    inpCod.dispatchEvent(new Event('change',{bubbles:true}));
                    inpCod.dispatchEvent(new KeyboardEvent('keyup',{key:c.charAt(c.length-1),bubbles:true}));
                    if(typeof window.$!=='undefined'){
                        try{window.$(inpCod).val(c).trigger('input').trigger('change').trigger('keyup');}catch(e){}
                    }
                    let dropItem=null;
                    for(let k=0;k<1500;k++){
                        if(await checkModal())break;
                        let drops=Array.from(document.querySelectorAll('ul[id^="ui-id-"]'));
                        // Espera a lista aparecer JÁ COM OPÇÕES. Só checar se ela
                        // existe não basta: entre uma busca e outra ela fica na
                        // página vazia, e o robô escolhia antes das opções chegarem.
                        let menuVisivel=drops.find(el=>el.offsetParent!==null&&el.querySelector('li'));
                        if(menuVisivel){dropItem=menuVisivel;break;}
                        await wait(1);
                    }
                    // Prefere clicar no item da lista que contém ESTE código.
                    // O Enter escolhe o item destacado, que pode ser de outro exame.
                    let itemCerto=null;
                    if(dropItem){
                        itemCerto=Array.from(dropItem.querySelectorAll('li,a,div'))
                            .find(el=>(el.innerText||el.textContent||'').includes(c));
                    }
                    if(itemCerto){
                        try{itemCerto.scrollIntoView({block:'center'});}catch(e){}
                        itemCerto.dispatchEvent(new MouseEvent('mouseover',{bubbles:true}));
                        itemCerto.dispatchEvent(new MouseEvent('mousedown',{bubbles:true}));
                        itemCerto.dispatchEvent(new MouseEvent('mouseup',{bubbles:true}));
                        itemCerto.dispatchEvent(new MouseEvent('click',{bubbles:true}));
                    }else{
                    inpCod.dispatchEvent(new KeyboardEvent('keydown',{key:'Enter',keyCode:13,bubbles:true}));
                    inpCod.dispatchEvent(new KeyboardEvent('keypress',{key:'Enter',keyCode:13,bubbles:true}));
                    inpCod.dispatchEvent(new KeyboardEvent('keyup',{key:'Enter',keyCode:13,bubbles:true}));
                    }
                    if(typeof window.$!=='undefined'){
                        try{window.$(inpCod).trigger(window.$.Event('keydown',{keyCode:13})).trigger(window.$.Event('keypress',{keyCode:13})).trigger(window.$.Event('keyup',{keyCode:13}));}catch(e){}
                    }
                    await wait(20);
                    await checkModal();
                    let inpQtd=null;
                    for(let k=0;k<200;k++){
                        let qtds=Array.from(document.querySelectorAll('#registroProcedimentoQuantidade input, input#registroProcedimentoQuantidade, #registroProcedimentoQuantidade > input'));
                        inpQtd=qtds.find(el=>el.offsetParent!==null&&!el.disabled);
                        if(inpQtd)break;
                        await wait(5);
                    }
                    if(inpQtd){
                        inpQtd.blur();
                        await wait(20);
                        inpQtd.focus();
                        if(setVal&&setVal.set)setVal.set.call(inpQtd,"");else inpQtd.value="";
                        inpQtd.dispatchEvent(new Event('input',{bubbles:true}));
                        await wait(50);
                        if(setVal&&setVal.set)setVal.set.call(inpQtd,q);else inpQtd.value=q;
                        inpQtd.dispatchEvent(new Event('input',{bubbles:true}));
                        inpQtd.dispatchEvent(new Event('change',{bubbles:true}));
                        inpQtd.dispatchEvent(new KeyboardEvent('keyup',{key:q.toString().slice(-1),bubbles:true}));
                        if(typeof window.$!=='undefined'){
                            try{window.$(inpQtd).val(q).trigger('input').trigger('change').trigger('keyup');}catch(e){}
                        }
                        await wait(50);
                    }
                    let btnConfirmar=null;
                    for(let k=0;k<100;k++){
                        let confirms=Array.from(document.querySelectorAll('#confirmarEdicaoDeProcedimento'));
                        btnConfirmar=confirms.find(b=>b.offsetParent!==null);
                        if(btnConfirmar)break;
                        await wait(1);
                    }
                    if(btnConfirmar){
                        btnConfirmar.click();
                        for(let k=0;k<300;k++){
                            if(await checkModal())break;
                            if(btnConfirmar.offsetParent===null)break;
                            await wait(5);
                        }
                    }
                    await checkModal();
                }
                status.innerText='✅ Finalizado!';
                window.alert=origAlert;
                setTimeout(()=>painel.remove(),3000);
            })();
        },
        // DESATIVADO a pedido: voltamos ao robô de janela, em que o próprio
        // app abre a tela de autorização e preenche nela.
        // DESATIVADO: esta versão abria uma janelinha de controle à parte.
        // Agora a Câmara roda dentro do próprio painel do app, como os demais.
        "CAMARA_JANELINHA_DESATIVADA": () => {
            (function () {
                var l = prompt("Cole os códigos de 8 dígitos:");
                if (!l) return;
                var raw = l.match(/\b\d{8}\b/g);
                if (!raw) return alert("Nenhum código!");

                // Repetidos viram quantidade; a ordem é a da colagem
                var counts = {};
                raw.forEach(function (c) { counts[c] = (counts[c] || 0) + 1; });
                var unicos = [];
                raw.forEach(function (c) { if (unicos.indexOf(c) === -1) unicos.push(c); });
                var cods = unicos.map(function (k) { return { cod: k, qtd: counts[k] }; });

                // Janela de controle: a tela da Câmara recarrega a cada "Salvar / Novo",
                // então o robô precisa ficar FORA dela para sobreviver.
                var W = window.open("", "RoboCamara", "width=380,height=260,top=0,left=0");
                if (!W) return alert("ERRO: POPUP BLOQUEADO! Permita popups no navegador.");

                W.document.write("<body style='font-family:sans-serif;text-align:center;background:#eef6ee;padding:18px'>" +
                    "<h3 style='margin:0 0 8px;color:#1e7a3c;'>🏛️ Robô Câmara dos Deputados</h3>" +
                    "<div id='msg' style='font-size:14px;color:#1e7a3c;font-weight:bold;'>Iniciando...</div>" +
                    "<div id='status' style='font-size:12px;color:#666;margin-top:5px'></div>" +
                    "<button onclick='window.close()' style='margin-top:14px;padding:8px 16px;cursor:pointer;" +
                    "background:#c0392b;color:#fff;border:none;border-radius:5px;font-weight:bold;'>PARAR</button></body>");

                var s = W.document.createElement('script');
                s.textContent = `
                    var idx = 0;
                    var lista = ${JSON.stringify(cods)};
                    var msg = document.getElementById('msg');
                    var st  = document.getElementById('status');

                    var rotulo = function (e) {
                        return ((e.innerText || e.textContent || e.value || '') + '')
                            .replace(/\\s+/g, ' ').trim();
                    };
                    var digitavel = function (e) {
                        var t = (e.getAttribute('type') || 'text').toLowerCase();
                        return (t === 'text' || t === '') && !e.disabled && !e.readOnly;
                    };

                    // Os campos são achados pelo RÓTULO da linha, não por posição —
                    // assim continuam funcionando se a tela mudar de lugar.
                    var campoProcedimento = function (doc) {
                        var linhas = doc.querySelectorAll('tr');
                        for (var i = 0; i < linhas.length; i++) {
                            var t = (linhas[i].textContent || '').replace(/\\s+/g, ' ').trim();
                            if (!/procedimento/i.test(t) || t.length > 140) continue;
                            if (/observa|cód\\.?\\s*proced/i.test(t)) continue;
                            var ins = Array.prototype.slice.call(linhas[i].querySelectorAll('input')).filter(digitavel);
                            if (ins.length) return ins[0];
                        }
                        var todos = Array.prototype.slice.call(doc.querySelectorAll('input')).filter(digitavel);
                        return todos.length ? todos[0] : null;
                    };

                    var campoQuantidade = function (doc) {
                        var linhas = doc.querySelectorAll('tr');
                        for (var i = 0; i < linhas.length; i++) {
                            var cel = linhas[i].cells;
                            if (!cel) continue;
                            for (var c = 0; c < cel.length; c++) {
                                var t = (cel[c].textContent || '').replace(/\\s+/g, ' ').trim();
                                if (!/qtd\\.?\\s*solic|quantidade/i.test(t) || t.length > 40) continue;
                                for (var k = c; k < cel.length; k++) {
                                    var ins = Array.prototype.slice.call(cel[k].querySelectorAll('input')).filter(digitavel);
                                    if (ins.length) return ins[0];
                                }
                            }
                        }
                        return null;
                    };

                    // "Salvar / Novo" nos intermediários e "Salvar" no último
                    var botao = function (doc, qual) {
                        var cand = Array.prototype.slice.call(
                            doc.querySelectorAll('a,button,input[type=button],input[type=submit],nobr'));
                        var achou = null;
                        for (var i = 0; i < cand.length; i++) {
                            var t = rotulo(cand[i]).toLowerCase();
                            if (qual === 'novo') {
                                if (/^salvar\\s*\\/\\s*novo$/.test(t)) { achou = cand[i]; break; }
                            } else {
                                if (t === 'salvar') { achou = cand[i]; break; }
                            }
                        }
                        if (!achou) return null;
                        // se o texto estiver dentro de um link, quem responde é o link
                        if (achou.tagName === 'NOBR' && achou.closest && achou.closest('a')) return achou.closest('a');
                        return achou;
                    };

                    var escrever = function (el, v) {
                        if (!el) return;
                        try { el.focus(); } catch (e) { }
                        el.value = v;
                        try { el.dispatchEvent(new Event('input',  { bubbles: true })); } catch (e) { }
                        try { el.dispatchEvent(new Event('change', { bubbles: true })); } catch (e) { }
                    };

                    var esperandoSalvar = false;

                    function passo() {
                        if (idx >= lista.length) {
                            msg.innerHTML = "<b style='color:#1e7a3c'>✅ TUDO FINALIZADO!</b>";
                            st.innerText = lista.length + " código(s) lançado(s)";
                            return;
                        }
                        var doc;
                        try { doc = window.opener.document; }
                        catch (e) { setTimeout(passo, 800); return; }

                        var inp = campoProcedimento(doc);
                        if (!inp) { st.innerText = 'aguardando a tela...'; setTimeout(passo, 600); return; }

                        // enquanto o portal ainda mostra o código anterior, esperamos
                        if (esperandoSalvar) {
                            if ((inp.value || '').trim() !== '') { setTimeout(passo, 300); return; }
                            esperandoSalvar = false;
                        }
                        if ((inp.value || '').trim() !== '') { setTimeout(passo, 400); return; }

                        var item = lista[idx];
                        var ehUltimo = (idx === lista.length - 1);
                        msg.innerText = "🚀 Lançando: " + item.cod + (item.qtd > 1 ? " (" + item.qtd + "x)" : "");
                        st.innerText  = (idx + 1) + " / " + lista.length + (ehUltimo ? "  — último, vai em SALVAR" : "");

                        escrever(inp, item.cod);
                        var q = campoQuantidade(doc);
                        if (q) escrever(q, item.qtd);

                        setTimeout(function () {
                            var d2;
                            try { d2 = window.opener.document; } catch (e) { setTimeout(passo, 800); return; }
                            var bt = ehUltimo ? botao(d2, 'salvar') : botao(d2, 'novo');
                            if (!bt) { st.innerText = '⚠️ não achei o botão Salvar'; setTimeout(passo, 900); return; }
                            try { bt.click(); } catch (e) { }
                            idx++;
                            esperandoSalvar = true;
                            setTimeout(passo, 700);
                        }, 700);
                    }

                    setTimeout(passo, 900);
                `;
                W.document.body.appendChild(s);
            })();
        },
        "PROASA_CNU_DESATIVADO": () => {
            (function () {
                if (window._sawGatilho) {
                    alert("O robô já está armado, na posição " + (window._sawState.index + 1) +
                          " de " + window._sawState.codigos.length + ". Abra a janela de autorização.");
                    return;
                }
                var txt = prompt("Cole os códigos:");
                if (!txt) return;
                var m = txt.match(/\b\d{8}\b/g);
                if (!m) return alert("Nenhum código válido!");
                var counts = {};
                m.forEach(x => counts[x] = (counts[x] || 0) + 1);
                var codigos = [...new Set(m)];
                window._sawState = { codigos: codigos, counts: counts, index: 0 };
                window._sawGatilho = true;

                // Põe o botão "COLAR CÓDIGOS" dentro da janela de autorização
                var armarBotao = function (winAlvo) {
                    if (!winAlvo) return;
                    var checkLoad = setInterval(function () {
                        try {
                            var doc = winAlvo.document;
                            if (!doc || doc.readyState !== 'complete') return;
                            if (doc.getElementById('btn-robo-saw')) { clearInterval(checkLoad); return; }
                            // A tela serve se tiver os campos do formulário OU a lista de tabelas TUSS
                            var temCampos = doc.querySelector("[id*='procedimentosSolicitados']");
                            var temTuss = Array.from(doc.querySelectorAll('select')).some(function (s) {
                                return Array.from(s.options || []).some(function (o) {
                                    return /procedimentos?\s+e\s+eventos/i.test(o.textContent || '');
                                });
                            });
                            if (!temCampos && !temTuss) return;
                            clearInterval(checkLoad);

                            var b = doc.createElement('button');
                            b.id = 'btn-robo-saw';
                            var teto = Math.min(window._sawState.index + 30, window._sawState.codigos.length);
                            b.innerText = '🤖 COLAR CÓDIGOS (' + (window._sawState.index + 1) + ' a ' + teto + ')';
                            b.style.cssText = 'position:fixed;top:20px;right:20px;z-index:9999999;padding:15px 20px;background:#e67e22;color:#fff;border:3px solid #d35400;border-radius:8px;font-weight:bold;cursor:pointer;box-shadow:0 5px 15px rgba(0,0,0,0.5);font-family:Arial;font-size:14px;';
                            doc.body.appendChild(b);

                            var wait = ms => new Promise(r => setTimeout(r, ms));
                            var visivel = function (e) {
                                try { var r = e.getBoundingClientRect(); return r.width > 0; } catch (x) { return false; }
                            };

                            // ── Jeito 1: campos com nome procedimentosSolicitados[N].algo ──
                            // Descobrimos o sufixo real de cada campo em vez de supor
                            // ".tipo/.codigo/.quantidade" — cada portal usa um nome.
                            var linhasPorId = function () {
                                var grupos = {};
                                Array.from(doc.querySelectorAll("[id*='procedimentosSolicitados']")).forEach(function (e) {
                                    var mm = (e.id || '').match(/procedimentosSolicitados\[(\d+)\]\.?(.*)$/);
                                    if (!mm) return;
                                    var i = parseInt(mm[1], 10);
                                    grupos[i] = grupos[i] || {};
                                    grupos[i][mm[2] || 'raiz'] = e;
                                });
                                var achar = function (g, re, tag) {
                                    for (var k in g) if (re.test(k) && (!tag || g[k].tagName === tag)) return g[k];
                                    return null;
                                };
                                return Object.keys(grupos).sort(function (a, c) { return a - c; }).map(function (i) {
                                    var g = grupos[i];
                                    var tab = achar(g, /tipo|tabela/i, 'SELECT') || achar(g, /tipo|tabela/i);
                                    var cod = achar(g, /^codigo$|^cod$|codigoproc/i, 'INPUT') || achar(g, /codigo/i, 'INPUT');
                                    var qt = achar(g, /quant|qtd/i, 'INPUT');
                                    var de = achar(g, /desc/i, 'INPUT') || achar(g, /desc/i);
                                    return (cod && qt) ? { tabela: tab, codigo: cod, desc: de, qtd: qt } : null;
                                }).filter(Boolean);
                            };

                            // ── Jeito 2: pelos rótulos das colunas (25-Código, 26-Descrição, 27-Qt.) ──
                            var linhasPorColuna = function () {
                                try {
                                    var selects = Array.from(doc.querySelectorAll('select')).filter(function (s) {
                                        return Array.from(s.options || []).some(function (o) {
                                            return /procedimentos?\s+e\s+eventos/i.test(o.textContent || '');
                                        });
                                    });
                                    if (!selects.length) return [];
                                    var tb = selects[0].closest && selects[0].closest('table');
                                    var mapa = null;
                                    if (tb) {
                                        Array.from(tb.rows || []).forEach(function (tr) {
                                            if (mapa) return;
                                            var t = Array.from(tr.cells || []).map(function (c) {
                                                return (c.textContent || '').replace(/\s+/g, ' ').trim();
                                            });
                                            var onde = function (p) { return t.findIndex(function (x) { return x.indexOf(p) === 0; }); };
                                            var a = onde('25-'), d2 = onde('26-'), q = onde('27-');
                                            if (a >= 0 && q >= 0) mapa = { cod: a, desc: d2, qtd: q };
                                        });
                                    }
                                    if (!mapa) return [];
                                    return selects.map(function (sel) {
                                        var tr = sel.closest('tr');
                                        if (!tr || !tr.cells) return null;
                                        var pega = function (i) {
                                            var cel = tr.cells[i];
                                            return cel ? cel.querySelector('input:not([type=hidden]):not([type=button]):not([type=submit]):not([type=checkbox]):not([type=radio])') : null;
                                        };
                                        var cod = pega(mapa.cod), qt = pega(mapa.qtd);
                                        var de = mapa.desc >= 0 ? pega(mapa.desc) : null;
                                        return (cod && qt && cod !== qt) ? { tabela: sel, codigo: cod, desc: de, qtd: qt } : null;
                                    }).filter(Boolean);
                                } catch (e) { return []; }
                            };

                            var linhas = function () {
                                var a = linhasPorId();
                                return a.length ? a : linhasPorColuna();
                            };

                            var botaoAdicionar = function () {
                                var x = doc.querySelector('#qata-adicionar');
                                if (x && visivel(x)) return x;
                                return Array.from(doc.querySelectorAll('input[type=button],input[type=submit],button,a'))
                                    .find(function (e) {
                                        var t = ((e.value || '') + ' ' + (e.textContent || '')).trim().toLowerCase();
                                        return (t === 'adicionar' || /(^|\s)adicionar(\s|$)/.test(t)) && visivel(e);
                                    });
                            };

                            var escolherTuss = function (sel) {
                                if (!sel) return;
                                if (sel.tagName === 'SELECT') {
                                    var op = Array.from(sel.options).find(function (o) {
                                        return /procedimentos?\s+e\s+eventos/i.test(o.textContent || '')
                                            || /^22\b/.test((o.textContent || '').trim());
                                    });
                                    if (op) {
                                        sel.value = op.value;
                                        sel.dispatchEvent(new Event('input', { bubbles: true }));
                                        sel.dispatchEvent(new Event('change', { bubbles: true }));
                                        try { if (typeof sel.onchange === 'function') sel.onchange(); } catch (e) { }
                                    }
                                } else {
                                    try { sel.click(); } catch (e) { }
                                }
                            };

                            var escrever = function (el, v) {
                                if (!el) return;
                                try { el.focus(); } catch (e) { }
                                try {
                                    var dsc = Object.getOwnPropertyDescriptor(winAlvo.HTMLInputElement.prototype, 'value');
                                    if (dsc && dsc.set) dsc.set.call(el, String(v)); else el.value = v;
                                } catch (e) { el.value = v; }
                                el.dispatchEvent(new Event('input', { bubbles: true }));
                                el.dispatchEvent(new Event('change', { bubbles: true }));
                            };

                            b.onclick = async function () {
                                b.style.background = '#c0392b';
                                b.disabled = true;
                                var feitos = 0;

                                if (!linhas().length) {
                                    b.innerText = '⚠️ Não achei a tabela de procedimentos nesta tela.';
                                    b.style.background = '#f39c12';
                                    b.disabled = false;
                                    return;
                                }

                                while (feitos < 30 && window._sawState.index < window._sawState.codigos.length) {
                                    var cod = window._sawState.codigos[window._sawState.index];
                                    var qtd = window._sawState.counts[cod];
                                    b.innerText = '⏳ ' + (window._sawState.index + 1) + '/' +
                                                  window._sawState.codigos.length + ' — ' + cod;

                                    // Garante uma linha vazia; se acabarem, clica em "Adicionar"
                                    var linha = null, pediu = false;
                                    for (var t = 0; t < 50; t++) {
                                        var todas = linhas();
                                        linha = todas.find(function (l) { return !(l.codigo.value || '').trim(); });
                                        if (linha) break;
                                        if (!pediu) {
                                            var add = botaoAdicionar();
                                            if (!add) break;
                                            b.innerText = '➕ Abrindo mais linhas...';
                                            add.click();
                                            pediu = true;
                                        }
                                        await wait(300);
                                    }
                                    if (!linha) {
                                        b.innerText = '⚠️ Sem linha livre no ' + cod + '. Salve e clique de novo.';
                                        b.style.background = '#f39c12';
                                        b.disabled = false;
                                        return;
                                    }

                                    escolherTuss(linha.tabela);
                                    await wait(250);

                                    escrever(linha.codigo, cod);
                                    try { linha.codigo.blur(); } catch (e) { }
                                    linha.codigo.dispatchEvent(new Event('blur', { bubbles: true }));
                                    linha.codigo.dispatchEvent(new Event('focusout', { bubbles: true }));

                                    // Espera o portal trazer o nome do exame
                                    for (var w2 = 0; w2 < 40; w2++) {
                                        var at = linhas().find(function (l) { return (l.codigo.value || '').trim() === cod; });
                                        if (at) {
                                            linha = at;
                                            if (at.desc && (at.desc.value || '').trim().length > 1) break;
                                        }
                                        await wait(250);
                                    }

                                    escrever(linha.qtd, qtd);
                                    try { linha.qtd.blur(); } catch (e) { }
                                    linha.qtd.dispatchEvent(new Event('blur', { bubbles: true }));

                                    await wait(250);
                                    feitos++;
                                    window._sawState.index++;
                                }

                                if (window._sawState.index < window._sawState.codigos.length) {
                                    b.innerText = '✅ 30 inseridos! Salve e abra uma guia nova.';
                                    b.style.background = '#8e44ad';
                                } else {
                                    b.innerText = '✅ TUDO FINALIZADO! (' + feitos + ' exames)';
                                    b.style.background = '#27ae60';
                                    window._sawGatilho = false;
                                }
                                setTimeout(function () { try { b.remove(); } catch (e) { } }, 9000);
                            };
                        } catch (err) { }
                    }, 1000);
                };

                if (!window._sawOpenHooked) {
                    var origOpen = window.open;
                    window.open = function () {
                        var w = origOpen.apply(this, arguments);
                        if (w && window._sawGatilho) armarBotao(w);
                        return w;
                    };
                    window._sawOpenHooked = true;
                }
                window._sawArmar = armarBotao;

                if (!window._sawListenerAdded) {
                    document.addEventListener('click', function (e) {
                        var a = e.target.closest && e.target.closest('a');
                        if (a && a.target === '_blank' && window._sawGatilho) {
                            e.preventDefault();
                            window.open(a.href);
                        }
                    }, true);
                    window._sawListenerAdded = true;
                }

                // Se a tela de autorização já é ESTA janela, arma nela mesma
                try { armarBotao(window); } catch (e) { }
                try {
                    (window.__crJanelas || []).forEach(function (w) {
                        try { if (w && !w.closed) armarBotao(w); } catch (e) { }
                    });
                } catch (e) { }

                alert("Robô armado! Abra (ou volte para) a janela de autorização e clique no botão laranja \"COLAR CÓDIGOS\".");
            })();
        },
        "AFFEGO": () => {
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
        },
    };
    // ── FICHA DE CADA CONVÊNIO (ícone, cor, descrição, modo de entrega) ──
    const infoRobos = {
        "CNU UNIMED":       { icone: "🧬", cor: "#00995d", desc: "Automação para Autorizações CNU Unimed",     modo: "janela" },
        "AFFEGO":           { icone: "🛠️", cor: "#378ADD", desc: "Automação para Fisco e Convênios Affego",        modo: "prompt" },
        "CAMARA":           { icone: "🏛️", cor: "#1e7a3c", desc: "Automação para Câmara dos Deputados",         modo: "inline" },
        "ASSEDF":           { icone: "💳", cor: "#1b3a6b", desc: "Automação para Convênios ASSEDF / Vida Card",  modo: "prompt", semContagem: true },
        "ASSEFAZ":          { icone: "🏛️", cor: "#1a4f8a", desc: "Automação para Convênios Assefaz",              modo: "prompt" },
        "PROASA/CNU":       { icone: "🧬", cor: "#00995d", desc: "Automação para Autorizações CNU Unimed",       modo: "prompt" },
        "AMIL":             { icone: "🩺", cor: "#2ecc71", desc: "Automação para Rede Credenciada Amil",           modo: "painel", txt: "tc",            btn: "bi", semMotor: true, mostrarPainel: true },
        "INAS":             { icone: "🤝", cor: "#d9a520", desc: "Automação para Convênios Inas GDF",              modo: "painel", txt: "g-codes",       btn: "g-start" },
        "MEDSENIOR/UN SEG": { icone: "🏥", cor: "#27ae60", desc: "Automação para Planos de Saúde",                 modo: "painel", txt: "txtInput",      btn: "btnRun" },
        "PLANASSISTE MPU":  { icone: "📝", cor: "#2d7dff", desc: "Automação para Planilhas do MPU",                modo: "painel", txt: "rc",            btn: "rb" },
        "PLENUM":           { icone: "⚖️", cor: "#8e44ad", desc: "Automação para Convênios de Advocacia e Justiça",modo: "painel", txt: "plenum-txt",    btn: "plenum-btn" },
        "PM/STJ":           { icone: "🛡️", cor: "#5dade2", desc: "Automação para Segurança e Justiça Superior",    modo: "prompt" },
        "POSTAL":           { icone: "✉️", cor: "#d4ac0d", desc: "Automação para Logística Postal",                modo: "prompt" },
        "SULAMERICA":       { icone: "🌎", cor: "#e74c3c", desc: "Automação para Convênios Sulamerica",            modo: "prompt" },
        "TJDF":             { icone: "🏛️", cor: "#e67e22", desc: "Automação para Tribunal de Justiça do DF",       modo: "painel", txt: "b403-input",    btn: "b403-iniciar" },
        "TRE":              { icone: "🗳️", cor: "#7f9fc4", desc: "Automação para Tribunal Regional Eleitoral",     modo: "prompt" },
        "TRF":              { icone: "📖", cor: "#1d9e75", desc: "Automação para Tribunal Regional Federal",       modo: "prompt" },
        "TRT":              { icone: "🤝", cor: "#e67e22", desc: "Automação para Tribunal Regional do Trabalho",   modo: "painel", txt: "g-txt",         btn: "g-btn" },
        "TST":              { icone: "🔨", cor: "#e24b4a", desc: "Automação para Tribunal Superior do Trabalho",   modo: "tst" }
    };

    // ── ONDE CADA ROBÔ MOSTRA O PROGRESSO DELE ───────────────────
    const statusRobo = {
        "ASSEDF": "assedf-status",
        "ASSEFAZ": "assefaz-status",
        "AMIL": "lg",
        "INAS": "g-status",
        "MEDSENIOR/UN SEG": "statusLog",
        "PLANASSISTE MPU": "rs",
        "PLENUM": "plenum-status",
        "TJDF": "b403-status",
        "TRT": "g-status"
    };

    // Robôs cujo contador fica num elemento separado do status
    const contadorRobo = {
        "TJDF": "b403-contador"
    };

    // ── ESTADO DA EXECUÇÃO ────────────────────────────────────────
    let rodando = false;
    let roboAtual = null;
    let elementosRobo = [];
    let janelasRobo = [];
    let vigias = [];

    // Tira o painel do robô da frente sem desligá-lo (ele continua clicável por código)
    const esconderElemento = el => {
        try {
            el.style.setProperty('position', 'fixed', 'important');
            el.style.setProperty('left', '-20000px', 'important');
            el.style.setProperty('top', '0px', 'important');
            el.style.setProperty('right', 'auto', 'important');
            el.style.setProperty('bottom', 'auto', 'important');
            el.style.setProperty('opacity', '0', 'important');
            el.style.setProperty('pointer-events', 'none', 'important');
            el.style.setProperty('z-index', '-1', 'important');
        } catch (e) { }
    };

    // ── PONTE: entrega os códigos colados para o robô escolhido ───
    const executarRobo = (nome, texto) => {
        const info = infoRobos[nome] || { modo: "prompt" };
        const func = robos[nome];
        if (!func) { alert("Robô não encontrado: " + nome); return; }

        if (info.modo === "prompt") {
            const promptOriginal = window.prompt;
            const openOriginal = window.open;
            window.prompt = () => texto;
            const nossoOpen = function () {
                const w = openOriginal.apply(window, arguments);
                if (w) janelasRobo.push(w);
                return w;
            };
            window.open = nossoOpen;
            try { func(); } finally {
                window.prompt = promptOriginal;
                // Só devolvo o window.open se ainda for o meu. Alguns robôs
                // (Unimed/Proasa) instalam o próprio gatilho aqui — se eu
                // restaurasse por cima, o botão nunca apareceria na janela.
                if (window.open === nossoOpen) window.open = openOriginal;
            }
            return;
        }

        if (info.modo === "tst") {
            let janelaCapturada = null;
            const openOriginal = window.open;
            window.open = function () {
                janelaCapturada = openOriginal.apply(window, arguments);
                if (janelaCapturada) janelasRobo.push(janelaCapturada);
                return janelaCapturada;
            };
            try {
                func();
                const botoes = Array.from(document.querySelectorAll('button'))
                    .filter(b => (b.innerText || '').includes('ROBÔ EQUILIBRADO'));
                if (botoes.length) botoes[botoes.length - 1].click();
            } finally {
                window.open = openOriginal;
            }
            let tent = 0;
            const espera = setInterval(() => {
                try {
                    if (janelaCapturada && janelaCapturada.document && janelaCapturada.document.getElementById('t')) {
                        clearInterval(espera);
                        janelaCapturada.document.getElementById('t').value = texto;
                        janelaCapturada.go();
                        return;
                    }
                } catch (e) { }
                if (++tent > 40) clearInterval(espera);
            }, 200);
            vigias.push(espera);
            return;
        }

        // modo "painel": roda o robô, espera o painel dele nascer, cola e clica em iniciar
        func();
        let tent = 0;
        const espera = setInterval(() => {
            const ta = document.getElementById(info.txt);
            const bt = document.getElementById(info.btn);
            if (ta && bt) {
                clearInterval(espera);
                ta.value = texto;
                ta.dispatchEvent(new Event('input', { bubbles: true }));
                ta.dispatchEvent(new Event('change', { bubbles: true }));
                setTimeout(() => bt.click(), 200);
            } else if (++tent > 50) {
                clearInterval(espera);
                alert('O painel do robô ' + nome + ' não abriu. Tente novamente.');
            }
        }, 150);
        vigias.push(espera);
    };

    // ═══════════════════════════════════════════════════════════════
    //  MODO ESPELHO — coloca o portal dentro de uma moldura na própria
    //  página e o robô pilota daqui. Substitui a janelinha separada.
    //  Se a moldura não carregar, cai de volta no método antigo.
    // ═══════════════════════════════════════════════════════════════
    let espelho = null;

    const abrirEspelho = () => {
        if (espelho) return espelho.iframe;
        const url = window.location.href;
        const escondidos = [];
        Array.from(document.body.children).forEach(el => {
            if (el !== menu) {
                escondidos.push([el, el.style.display]);
                el.style.display = 'none';
            }
        });
        const iframe = document.createElement('iframe');
        iframe.id = 'cr-espelho';
        iframe.src = url;
        iframe.style.cssText = 'position:fixed;top:0;left:0;width:100vw;height:100vh;border:none;z-index:1;background:#fff;';
        document.body.appendChild(iframe);
        const margemAntes = document.body.style.margin;
        const overflowAntes = document.body.style.overflow;
        document.body.style.margin = '0';
        document.body.style.overflow = 'hidden';
        espelho = { iframe, escondidos, margemAntes, overflowAntes };
        return iframe;
    };

    const fecharEspelho = () => {
        if (!espelho) return;
        try { espelho.iframe.remove(); } catch (e) { }
        espelho.escondidos.forEach(par => { try { par[0].style.display = par[1] || ''; } catch (e) { } });
        document.body.style.margin = espelho.margemAntes || '';
        document.body.style.overflow = espelho.overflowAntes || '';
        espelho = null;
    };

    // ── ROBÔS QUE RODAM NA PRÓPRIA JANELA (sem abrir outra) ───────
    const roboInline = {

        "POSTAL": (texto, ctx) => {
            var raw = texto.match(/\b\d{8}\b/g);
            if (!raw) { alert("Sem códigos!"); ctx.fim(); return; }
            var counts = {};
            raw.forEach(x => counts[x] = (counts[x] || 0) + 1);
            var unicos = [...new Set(raw)];
            var order = unicos.filter(c => counts[c] === 1).concat(unicos.filter(c => counts[c] > 1));
            var lista = order.map(k => ({ cod: k, qtd: counts[k] }));
            var selInp = "#FormMain > table > tbody > tr:nth-child(1) > td.frm_cell_field > table > tbody > tr > td:nth-child(1) > input.frm_field_lkp_big";
            var selQtd = "#FormMain > table > tbody > tr:nth-child(3) > td:nth-child(4) > input";
            var selBtn = "body > table > tbody > tr:nth-child(1) > td > div > table > tbody > tr:nth-child(2) > td > table > tbody > tr > td:nth-child(2) > table > tbody > tr > td > table > tbody > tr > td > table > tbody > tr:nth-child(1) > td > div > div.act_box > div > div > div > div:nth-child(2) > a > nobr";
            var selBtnFinalizar = "body > table > tbody > tr:nth-child(1) > td > div > table > tbody > tr:nth-child(2) > td > table > tbody > tr > td:nth-child(2) > table > tbody > tr > td > table > tbody > tr > td > table > tbody > tr:nth-child(1) > td > div > div.act_box > div > div > div > div:nth-child(3) > a";
            var idx = 0;
            var t = setInterval(function () {
                if (!ctx.ativo()) { clearInterval(t); return; }
                if (idx >= lista.length) {
                    clearInterval(t);
                    ctx.status("✅ FIM DO LOTE!");
                    ctx.fim();
                    return;
                }
                try {
                    var doc = ctx.doc();
                    var inp = doc.querySelector(selInp);
                    if (inp && inp.value == "") {
                        var item = lista[idx];
                        var c = item.cod;
                        var q = item.qtd;
                        var ehUltimo = (idx === lista.length - 1);
                        ctx.status("Lançando: " + c + " (" + (idx + 1) + "/" + lista.length + ")" + (q > 1 ? " Qtd: " + q : ""));
                        inp.focus();
                        inp.value = c;
                        inp.dispatchEvent(new Event('input', { bubbles: true }));
                        inp.dispatchEvent(new Event('change', { bubbles: true }));
                        if (q > 1) {
                            var qInp = doc.querySelector(selQtd);
                            if (qInp) {
                                qInp.value = q;
                                qInp.dispatchEvent(new Event('input', { bubbles: true }));
                                qInp.dispatchEvent(new Event('change', { bubbles: true }));
                            }
                        }
                        setTimeout(function () {
                            if (!ctx.ativo()) return;
                            try {
                                var d2 = ctx.doc();
                                var btn = ehUltimo ? d2.querySelector(selBtnFinalizar) : d2.querySelector(selBtn);
                                if (btn) {
                                    btn.click();
                                    idx++;
                                    ctx.status(ehUltimo ? "Finalizando lote..." : "Salvando... aguarde.");
                                } else {
                                    ctx.status("ERRO: Botão sumiu!");
                                }
                            } catch (e) { }
                        }, 800);
                    }
                } catch (e) {
                    ctx.status("Aguardando página...");
                }
            }, 1500);
            ctx.timer(t);
        },

        "CAMARA": (texto, ctx) => {
            var raw = texto.match(/\b\d{8}\b/g);
            if (!raw) { alert("Nenhum código!"); ctx.fim(); return; }

            // Repetidos viram quantidade; a ordem é a da colagem
            var counts = {};
            raw.forEach(function (c) { counts[c] = (counts[c] || 0) + 1; });
            var unicos = [];
            raw.forEach(function (c) { if (unicos.indexOf(c) === -1) unicos.push(c); });
            var lista = unicos.map(function (k) { return { cod: k, qtd: counts[k] }; });
            var idx = 0;

            var rotulo = function (e) {
                return ((e.innerText || e.textContent || e.value || '') + '').replace(/\s+/g, ' ').trim();
            };
            var digitavel = function (e) {
                var t = (e.getAttribute('type') || 'text').toLowerCase();
                return (t === 'text' || t === '') && !e.disabled && !e.readOnly;
            };

            // Os campos são achados pelo RÓTULO da linha, não por posição na tela
            var campoProcedimento = function (doc) {
                try {
                    var linhas = doc.querySelectorAll('tr');
                    for (var i = 0; i < linhas.length; i++) {
                        var t = (linhas[i].textContent || '').replace(/\s+/g, ' ').trim();
                        if (!/procedimento/i.test(t) || t.length > 140) continue;
                        if (/observa|cód\.?\s*proced/i.test(t)) continue;
                        var ins = Array.prototype.slice.call(linhas[i].querySelectorAll('input')).filter(digitavel);
                        if (ins.length) return ins[0];
                    }
                    var todos = Array.prototype.slice.call(doc.querySelectorAll('input')).filter(digitavel);
                    return todos.length ? todos[0] : null;
                } catch (e) { return null; }
            };

            var campoQuantidade = function (doc) {
                try {
                    var linhas = doc.querySelectorAll('tr');
                    for (var i = 0; i < linhas.length; i++) {
                        var cel = linhas[i].cells;
                        if (!cel) continue;
                        for (var c = 0; c < cel.length; c++) {
                            var t = (cel[c].textContent || '').replace(/\s+/g, ' ').trim();
                            if (!/qtd\.?\s*solic|quantidade/i.test(t) || t.length > 40) continue;
                            for (var k = c; k < cel.length; k++) {
                                var ins = Array.prototype.slice.call(cel[k].querySelectorAll('input')).filter(digitavel);
                                if (ins.length) return ins[0];
                            }
                        }
                    }
                } catch (e) { }
                return null;
            };

            // "Salvar / Novo" nos intermediários e "Salvar" no último
            var botao = function (doc, qual) {
                try {
                    var cand = Array.prototype.slice.call(
                        doc.querySelectorAll('a,button,input[type=button],input[type=submit],nobr'));
                    var achou = null;
                    for (var i = 0; i < cand.length; i++) {
                        var t = rotulo(cand[i]).toLowerCase();
                        if (qual === 'novo') {
                            if (/^salvar\s*\/\s*novo$/.test(t)) { achou = cand[i]; break; }
                        } else {
                            if (t === 'salvar') { achou = cand[i]; break; }
                        }
                    }
                    if (!achou) return null;
                    if (achou.tagName === 'NOBR' && achou.closest && achou.closest('a')) return achou.closest('a');
                    return achou;
                } catch (e) { return null; }
            };

            var escrever = function (el, v) {
                if (!el) return;
                try { el.focus(); } catch (e) { }
                el.value = v;
                try { el.dispatchEvent(new Event('input', { bubbles: true })); } catch (e) { }
                try { el.dispatchEvent(new Event('change', { bubbles: true })); } catch (e) { }
            };

            var esperandoSalvar = false;

            function passo() {
                if (!ctx.ativo()) return;

                if (idx >= lista.length) {
                    ctx.status("✅ TUDO FINALIZADO! " + lista.length + " código(s) lançado(s).");
                    ctx.fim();
                    return;
                }

                var doc = ctx.doc();
                if (!doc) { ctx.timer(setTimeout(passo, 700)); return; }

                var inp = campoProcedimento(doc);
                if (!inp) {
                    ctx.status("⏳ Aguardando a tela da guia...");
                    ctx.timer(setTimeout(passo, 600));
                    return;
                }

                // enquanto a tela ainda mostra o código anterior, esperamos ela voltar
                if ((inp.value || '').trim() !== '') {
                    ctx.timer(setTimeout(passo, 350));
                    return;
                }
                esperandoSalvar = false;

                var item = lista[idx];
                var ehUltimo = (idx === lista.length - 1);
                ctx.status("🚀 Lançando: " + item.cod + (item.qtd > 1 ? " (" + item.qtd + "x)" : "") +
                           " — " + (idx + 1) + "/" + lista.length +
                           (ehUltimo ? "  · último, finaliza em SALVAR" : ""));

                escrever(inp, item.cod);
                var q = campoQuantidade(doc);
                if (q) escrever(q, item.qtd);

                ctx.timer(setTimeout(function () {
                    if (!ctx.ativo()) return;
                    var d2 = ctx.doc();
                    if (!d2) { ctx.timer(setTimeout(passo, 700)); return; }
                    var bt = ehUltimo ? botao(d2, 'salvar') : botao(d2, 'novo');
                    if (!bt) {
                        ctx.status("⚠️ Não achei o botão " + (ehUltimo ? '"Salvar"' : '"Salvar / Novo"') + " — tentando de novo...");
                        ctx.timer(setTimeout(passo, 900));
                        return;
                    }
                    try { bt.click(); } catch (e) { }
                    idx++;
                    esperandoSalvar = true;
                    ctx.timer(setTimeout(passo, 700));
                }, 700));
            }

            ctx.timer(setTimeout(passo, 900));
        },
        "TRF": (texto, ctx) => {
            var cods = texto.match(/\b\d{8}\b/g);
            if (!cods) { alert("Nenhum código!"); ctx.fim(); return; }
            var counts = {};
            cods.forEach(function (c) { counts[c] = (counts[c] || 0) + 1; });
            var unicos = [...new Set(cods)];
            var lista = unicos.filter(function (c) { return counts[c] === 1; })
                .concat(unicos.filter(function (c) { return counts[c] > 1; }));
            var selCod = "#FormMain > table > tbody > tr:nth-child(2) > td:nth-child(2) > table > tbody > tr > td:nth-child(1) > input.frm_field_lkp";
            var sel22 = "#FormMain > table > tbody > tr:nth-child(1) > td:nth-child(4) > table > tbody > tr > td:nth-child(1) > input.frm_field_lkp";
            var selFrase = "#FormMain > table > tbody > tr:nth-child(2) > td:nth-child(4) > table > tbody > tr > td:nth-child(1) > input.frm_field_lkp";
            var selQtd = "#FormMain > table > tbody > tr:nth-child(3) > td:nth-child(2) > input";
            var selBtnSalvar = "body > table > tbody > tr:nth-child(1) > td > div > table > tbody > tr:nth-child(2) > td > table > tbody > tr > td:nth-child(2) > table > tbody > tr > td > table > tbody > tr > td > table > tbody > tr:nth-child(1) > td > div > div.act_box > div > div > div > div:nth-child(2) > a";
            var selBtnFinalizar = "body > table > tbody > tr:nth-child(1) > td > div > table > tbody > tr:nth-child(2) > td > table > tbody > tr > td:nth-child(2) > table > tbody > tr > td > table > tbody > tr > td > table > tbody > tr:nth-child(1) > td > div > div.act_box > div > div > div > div:nth-child(3) > a";
            var selErro = "#tsk_toolbar";
            var idx = 0;

            // Acha os botões pelo TEXTO, não pela posição. Antes o robô contava
            // a posição na tela e no último código clicava no botão errado —
            // por isso o último exame ficava sem salvar.
            var textoDe = e => ((e.innerText || e.textContent || e.value || '') + '')
                .replace(/\s+/g, ' ').trim().toLowerCase();
            var acharBotao = function (d, qual) {
                try {
                    var cand = Array.from(d.querySelectorAll('a,button,input[type=button],input[type=submit],nobr'));
                    if (qual === 'novo') {
                        return cand.find(e => /^salvar\s*\/\s*novo$/.test(textoDe(e)))
                            || cand.find(e => textoDe(e).indexOf('salvar') === 0 && textoDe(e).indexOf('novo') > -1)
                            || d.querySelector(selBtnSalvar);
                    }
                    return cand.find(e => textoDe(e) === 'salvar')
                        || cand.find(e => textoDe(e).indexOf('salvar') === 0 && textoDe(e).indexOf('novo') === -1)
                        || d.querySelector(selBtnFinalizar);
                } catch (e) { return null; }
            };
            // Se o alvo for um <nobr> dentro do link, clica no link
            var clicar = function (el) {
                if (!el) return false;
                var alvo = (el.tagName === 'NOBR' && el.closest('a')) ? el.closest('a') : el;
                try { alvo.click(); return true; } catch (e) { return false; }
            };
            // O portal reclama de duas formas: no rodapé ("Verifique...") e ao lado
            // do campo Item de custo ("Registro não encontrado").
            var temErro = function (d) {
                try {
                    var t = d.body ? (d.body.innerText || d.body.textContent || '') : '';
                    return /verifique\s+mensagens|registro\s+n[ãa]o\s+encontrado/i.test(t);
                } catch (e) { return false; }
            };

            function proximoPasso() {
                if (!ctx.ativo()) return;
                if (idx >= lista.length) {
                    ctx.status("✅ TUDO FINALIZADO!");
                    ctx.fim();
                    return;
                }
                try {
                    var doc = ctx.doc();
                    var inp = doc.querySelector(selCod);
                    var erro = doc.querySelector(selErro);
                    var ehUltimo = (idx === lista.length - 1);

                    if ((erro && erro.innerText.includes("Verifique")) || temErro(doc)) {
                        ctx.status("⚠️ Corrigindo o Item de custo do " + lista[idx] + " (trocando para \"Exame\")");
                        var f = doc.querySelector(selFrase);
                        if (f) {
                            f.value = "Exame";
                            f.dispatchEvent(new Event('input', { bubbles: true }));
                            f.dispatchEvent(new Event('change', { bubbles: true }));
                            erro.innerText = "AGUARDANDO SISTEMA...";
                            setTimeout(function () {
                                if (!ctx.ativo()) return;
                                var d2 = ctx.doc();
                                var btn = ehUltimo ? acharBotao(d2, 'salvar') : acharBotao(d2, 'novo');
                                clicar(btn);
                                var checarVazio = setInterval(function () {
                                    if (!ctx.ativo()) { clearInterval(checarVazio); return; }
                                    try {
                                        var docAtual = ctx.doc();
                                        var inpAtual = docAtual.querySelector(selCod);
                                        if (ehUltimo || (inpAtual && inpAtual.value === "")) {
                                            clearInterval(checarVazio);
                                            idx++;
                                            setTimeout(proximoPasso, 300);
                                        }
                                    } catch (e) { }
                                }, 250);
                                ctx.timer(checarVazio);
                            }, 500);
                        }
                        return;
                    }

                    var codAtual = lista[idx];
                    var qtdAtual = counts[codAtual];

                    if (!inp || inp.value !== "") {
                        setTimeout(proximoPasso, 500);
                        return;
                    }

                    ctx.status("🚀 Lançando: " + codAtual + " (" + qtdAtual + "x) — " + (idx + 1) + "/" + lista.length);
                    inp.value = codAtual;
                    inp.dispatchEvent(new Event('input', { bubbles: true }));
                    inp.dispatchEvent(new Event('change', { bubbles: true }));

                    var f22 = doc.querySelector(sel22);
                    if (f22) {
                        f22.value = "22";
                        f22.dispatchEvent(new Event('input', { bubbles: true }));
                        f22.dispatchEvent(new Event('change', { bubbles: true }));
                    }

                    var fFrase = doc.querySelector(selFrase);
                    if (fFrase) {
                        fFrase.value = "Exames-Patologia Clínica";
                        fFrase.dispatchEvent(new Event('input', { bubbles: true }));
                        fFrase.dispatchEvent(new Event('change', { bubbles: true }));
                    }

                    var inpQtd = doc.querySelector(selQtd);
                    if (inpQtd) {
                        inpQtd.value = qtdAtual;
                        inpQtd.dispatchEvent(new Event('input', { bubbles: true }));
                        inpQtd.dispatchEvent(new Event('change', { bubbles: true }));
                    }

                    setTimeout(function () {
                        if (!ctx.ativo()) return;
                        var d2 = ctx.doc();
                        var btn = ehUltimo ? acharBotao(d2, 'salvar') : acharBotao(d2, 'novo');
                        clicar(btn);
                        var checarVazio = setInterval(function () {
                            if (!ctx.ativo()) { clearInterval(checarVazio); return; }
                            try {
                                var docAtual = ctx.doc();
                                var erroAtual = docAtual.querySelector(selErro);
                                if ((erroAtual && erroAtual.innerText.includes("Verifique")) || temErro(docAtual)) {
                                    clearInterval(checarVazio);
                                    setTimeout(proximoPasso, 300);
                                    return;
                                }
                                var inpAtual = docAtual.querySelector(selCod);
                                // No último código, esperamos o formulário sumir ou limpar —
                                // é o sinal de que o registro foi mesmo salvo.
                                var salvouUltimo = ehUltimo && (!inpAtual || inpAtual.value === "");
                                if (salvouUltimo || (!ehUltimo && inpAtual && inpAtual.value === "")) {
                                    clearInterval(checarVazio);
                                    idx++;
                                    setTimeout(proximoPasso, 300);
                                }
                            } catch (erroInterno) { }
                        }, 250);
                        ctx.timer(checarVazio);
                    }, 500);
                } catch (e) {
                    setTimeout(proximoPasso, 1000);
                }
            }
            setTimeout(proximoPasso, 1000);
        },

        // DESATIVADO: a moldura recarregava o endereço da página, o que no TST
        // abre uma guia EM BRANCO e perde tudo que já foi preenchido.
        "TST_DESATIVADO_MOLDURA": (texto, ctx) => {
            var raw = texto.match(/\b\d{8}\b/g);
            if (!raw) { alert("Sem códigos!"); ctx.fim(); return; }
            var counts = {};
            raw.forEach(x => counts[x] = (counts[x] || 0) + 1);
            var unicos = [...new Set(raw)];
            var order = unicos.filter(c => counts[c] === 1).concat(unicos.filter(c => counts[c] > 1));
            var lst = order.map(k => ({ cod: k, qtd: counts[k] }));
            var idx = 0;

            const pausa = ms => new Promise(r => setTimeout(r, ms));

            async function esperarEl(sel, limite) {
                var t = 0;
                limite = limite || 5000;
                while (t < limite) {
                    if (!ctx.ativo()) throw new Error("Parado");
                    var el = ctx.doc().querySelector(sel);
                    if (el && el.offsetParent !== null) return el;
                    await pausa(200);
                    t += 200;
                }
                throw new Error("Timeout: " + sel);
            }

            (async function loop() {
                while (idx < lst.length) {
                    if (!ctx.ativo()) return;
                    var item = lst[idx], c = item.cod, q = item.qtd;
                    ctx.status("Item " + (idx + 1) + "/" + lst.length + ": " + c + (q > 1 ? " (Qtd: " + q + ")" : ""));
                    try {
                        await esperarEl("input[value='Adicionar Procedimento']", 10000);
                        await pausa(500);
                        var d = ctx.doc();
                        var w = ctx.win();
                        var b1 = d.querySelector("input[value='Adicionar Procedimento']") || d.querySelector("input[name='adicionarProcedimento']");
                        b1.click();
                        var fixo = await esperarEl("#noreset_txCodTabela");
                        await pausa(500);
                        fixo.value = "16";
                        fixo.dispatchEvent(new w.Event('change', { bubbles: true }));
                        fixo.dispatchEvent(new w.Event('blur', { bubbles: true }));
                        try { w.$(fixo).trigger('change'); } catch (e) { }
                        var inp = await esperarEl("#codItemProcedimento");
                        await pausa(300);
                        inp.value = c;
                        inp.dispatchEvent(new w.Event('change', { bubbles: true }));
                        inp.dispatchEvent(new w.Event('blur', { bubbles: true }));
                        var qtd = ctx.doc().getElementById("procedimento.numQtdSolicitada");
                        if (qtd) {
                            qtd.value = q;
                            qtd.dispatchEvent(new w.Event('input', { bubbles: true }));
                            qtd.dispatchEvent(new w.Event('change', { bubbles: true }));
                        }
                        await pausa(500);
                        var b2 = await esperarEl(".ui-dialog-buttonpane button:nth-child(2)");
                        if (!b2.innerText.includes("Salvar") && !b2.innerText.includes("Confirmar")) {
                            var bs = ctx.doc().querySelectorAll("button");
                            for (var bb of bs) if (bb.innerText.includes("Salvar")) b2 = bb;
                        }
                        b2.click();
                        ctx.status("Salvo! Aguardando...");
                        idx++;
                        await pausa(1500);
                    } catch (e) {
                        ctx.status("ERRO: " + e.message);
                        if (e.message !== "Parado") alert("Erro: " + e.message);
                        return;
                    }
                }
                ctx.status("✅ FIM!");
                ctx.fim();
            })();
        },

        "PLANASSISTE MPU": (texto, ctx) => {
            var v = texto.match(/\b\d{8}\b/g);
            if (!v) { alert('Nenhum código válido.'); ctx.fim(); return; }
            var cts = {};
            for (var i = 0; i < v.length; i++) { cts[v[i]] = (cts[v[i]] || 0) + 1; }
            var q = [];
            for (var k in cts) { q.push({ c: k, qty: cts[k] }); }
            var id = 0, st = 'tabela';
            ctx.status('Processando ' + q.length + ' códigos únicos...');

            var lp = setInterval(function () {
                if (!ctx.ativo()) { clearInterval(lp); return; }
                var d, cw;
                try { cw = ctx.win(); d = cw.document; } catch (e) { return; }
                if (d.readyState !== 'complete') return;

                if (id >= q.length) {
                    clearInterval(lp);
                    ctx.status('✅ Concluído! O último código foi salvo e a tela finalizada.');
                    ctx.fim();
                    return;
                }

                if (st === 'tabela') {
                    var b = d.querySelector('#CODIGOTABELA_btn');
                    if (b) {
                        if (!cw._hk) {
                            var o = cw.open;
                            cw.open = function (a, x, c) {
                                var w = o.call(cw, a, x, c);
                                var t = setInterval(function () {
                                    try {
                                        var l = null;
                                        var es = w.document.querySelectorAll('a');
                                        for (var i = 0; i < es.length; i++) {
                                            var txt = (es[i].innerText || '').toUpperCase();
                                            if (txt.includes('22 - PROCEDIMENTO') || txt === '22' || txt === '16' || txt.includes('PROCEDIMENTO')) {
                                                l = es[i];
                                                break;
                                            }
                                        }
                                        if (!l) {
                                            l = w.document.querySelector('#FormMain > div > div > div > div > div > div > div > div > div.div_grid > table > tbody > tr:nth-child(6) > td:nth-child(1) > a');
                                        }
                                        if (!l) {
                                            for (var i = 0; i < es.length; i++) {
                                                if ((es[i].innerText || '').includes('TUSS')) { l = es[i]; break; }
                                            }
                                        }
                                        if (l) { l.click(); clearInterval(t); st = 'preencher'; }
                                    } catch (e) { }
                                }, 500);
                                ctx.timer(t);
                                return w;
                            };
                            cw._hk = true;
                            b.click();
                            ctx.status('Aguardando a tabela TUSS...');
                        }
                    } else {
                        st = 'preencher';
                    }
                } else if (st === 'preencher') {
                    var f1 = d.querySelector('#FormMain > table > tbody > tr:nth-child(1) > td:nth-child(4) > table > tbody > tr > td:nth-child(1) > input.frm_field_lkp');
                    var f2 = d.querySelector('#FormMain > table > tbody > tr:nth-child(3) > td:nth-child(2) > table > tbody > tr > td:nth-child(1) > input.frm_field_lkp');
                    var fq = d.querySelector('#FormMain > table > tbody > tr:nth-child(2) > td:nth-child(2) > input');
                    var ult = (id === q.length - 1);
                    var sb = ult
                        ? 'body > table > tbody > tr:nth-child(1) > td > div > table > tbody > tr:nth-child(2) > td > table > tbody > tr > td.StmMain > table > tbody > tr > td > table > tbody > tr > td > table > tbody > tr:nth-child(1) > td > div > div.act_box > div > div > div > div:nth-child(3) > a'
                        : 'body > table > tbody > tr:nth-child(1) > td > div > table > tbody > tr:nth-child(2) > td > table > tbody > tr > td.StmMain > table > tbody > tr > td > table > tbody > tr > td > table > tbody > tr:nth-child(1) > td > div > div.act_box > div > div > div > div:nth-child(2) > a > nobr';
                    var bt = d.querySelector(sb);
                    if (f1 && f2 && bt) {
                        if (cw._wt) return;
                        ctx.status(ult
                            ? ('⏳ Finalizando com: ' + q[id].c + ' (Qtd: ' + q[id].qty + ') - Último!')
                            : ('⏳ Inserindo: ' + q[id].c + ' (Qtd: ' + q[id].qty + ') - ' + (id + 1) + '/' + q.length));
                        f1.value = ''; f1.value = q[id].c;
                        f1.dispatchEvent(new Event('input', { bubbles: true }));
                        f1.dispatchEvent(new Event('change', { bubbles: true }));
                        f2.value = ''; f2.value = 'Exames-Patologia Clínica';
                        f2.dispatchEvent(new Event('input', { bubbles: true }));
                        f2.dispatchEvent(new Event('change', { bubbles: true }));
                        if (fq && q[id].qty > 1) {
                            fq.value = ''; fq.value = q[id].qty;
                            fq.dispatchEvent(new Event('input', { bubbles: true }));
                            fq.dispatchEvent(new Event('change', { bubbles: true }));
                        }
                        cw._wt = true;
                        setTimeout(function () { try { bt.click(); id++; } catch (e) { } }, 800);
                    } else {
                        cw._wt = false;
                    }
                }
            }, 1500);
            ctx.timer(lp);
        }
    };

    // ── ROBÔ QUE PILOTA UMA JANELA SEPARADA (CNU Unimed) ──────────
    const roboJanela = {

        "CNU UNIMED": (texto, ctx) => {
            const LIMITE = 30;

            // Códigos repetidos não viram linhas novas: viram quantidade
            const brutos = texto.match(/\b\d{8}\b/g) || [];
            if (!brutos.length) {
                ctx.status('❌ Nenhum código de 8 dígitos encontrado no texto colado.');
                ctx.fim();
                return;
            }
            // ATENÇÃO: Object.keys devolve chaves numéricas em ordem CRESCENTE,
            // não na ordem em que foram coladas. Por isso montamos a lista
            // percorrendo o texto, para respeitar a ordem do atendente.
            const contagem = {};
            brutos.forEach(c => contagem[c] = (contagem[c] || 0) + 1);
            let unicos = [];
            brutos.forEach(c => { if (unicos.indexOf(c) === -1) unicos.push(c); });
            let aviso = '';
            if (unicos.length > LIMITE) {
                aviso = ' ⚠️ o Unimed aceita no máximo 30 — os demais ficaram de fora';
                unicos = unicos.slice(0, LIMITE);
            }
            const itens = unicos.map(c => ({ cod: c, qtd: contagem[c] }));

            const espera = ms => new Promise(r => setTimeout(r, ms));
            const doc = () => ctx.doc();

            const disparar = (el, tipo) => {
                try { el.dispatchEvent(new (ctx.win().Event || Event)(tipo, { bubbles: true })); }
                catch (e) { try { el.dispatchEvent(new Event(tipo, { bubbles: true })); } catch (e2) { } }
            };

            // Cada linha da tabela: o seletor de tabela + código, descrição e quantidade
            const digitaveis = raiz => Array.from(raiz.querySelectorAll('input')).filter(i => {
                const t = (i.getAttribute('type') || 'text').toLowerCase();
                return (t === 'text' || t === '') && !i.disabled;
            });

            // Qual coluna é o quê, descoberto pelos rótulos da própria tela
            // (25-Código do Procedimento, 26-Descrição, 27-Qt. Solic.)
            const mapaColunas = () => {
                try {
                    const sel = selectsTuss(doc())[0];
                    const tabela = sel && sel.closest && sel.closest('table');
                    if (!tabela) return null;
                    for (const tr of Array.from(tabela.rows || [])) {
                        const cels = Array.from(tr.cells || []);
                        const txt = cels.map(c => (c.textContent || '').replace(/\s+/g, ' ').trim());
                        const onde = pref => txt.findIndex(t => t.indexOf(pref) === 0);
                        const iCod = onde('25-'), iDesc = onde('26-'), iQtd = onde('27-');
                        if (iCod >= 0 && iQtd >= 0) return { cod: iCod, desc: iDesc, qtd: iQtd };
                    }
                } catch (e) { }
                return null;
            };

            // Reserva: casa cada campo com a coluna pela posição na tela
            const camposPorPosicao = tr => {
                try {
                    const centro = pref => {
                        const cand = Array.from(doc().querySelectorAll('td,th,div,span,b,font,p'))
                            .filter(e => (e.textContent || '').replace(/\s+/g, ' ').trim().indexOf(pref) === 0)
                            .sort((a, b) => (a.textContent || '').length - (b.textContent || '').length);
                        for (const e of cand) {
                            const r = e.getBoundingClientRect();
                            if (r && r.width > 0) return r.left + r.width / 2;
                        }
                        return null;
                    };
                    const xCod = centro('25-'), xDesc = centro('26-'), xQtd = centro('27-');
                    if (xCod === null || xQtd === null) return null;
                    const ins = digitaveis(tr).filter(i => {
                        const r = i.getBoundingClientRect();
                        return r && r.width > 0;
                    });
                    if (ins.length < 2) return null;
                    const perto = alvo => {
                        let melhor = null, dist = Infinity;
                        ins.forEach(i => {
                            const r = i.getBoundingClientRect();
                            const d = Math.abs((r.left + r.width / 2) - alvo);
                            if (d < dist) { dist = d; melhor = i; }
                        });
                        return melhor;
                    };
                    const cod = perto(xCod), qtd = perto(xQtd);
                    if (!cod || !qtd || cod === qtd) return null;
                    let desc = xDesc === null ? null : perto(xDesc);
                    if (desc === cod || desc === qtd) desc = null;
                    return { cod, desc, qtd };
                } catch (e) { return null; }
            };

            const camposDaLinha = (tr, mapa) => {
                const doCel = cel => cel ? cel.querySelector(
                    'input:not([type=hidden]):not([type=button]):not([type=submit]):not([type=image]):not([type=checkbox]):not([type=radio])') : null;

                // 1º) pelas colunas dos rótulos
                if (mapa && tr.cells && tr.cells.length > Math.max(mapa.cod, mapa.qtd)) {
                    const cod = doCel(tr.cells[mapa.cod]);
                    const qtd = doCel(tr.cells[mapa.qtd]);
                    const desc = (mapa.desc >= 0) ? doCel(tr.cells[mapa.desc]) : null;
                    if (cod && qtd && cod !== qtd) return { cod, desc, qtd };
                }
                // 2º) pela posição na tela
                const porTela = camposPorPosicao(tr);
                if (porTela) return porTela;
                // 3º) último recurso: ordem no código
                const ins = digitaveis(tr);
                return { cod: ins[0], desc: ins[1], qtd: ins[2] };
            };

            const linhas = () => {
                const mapa = mapaColunas();
                return selectsTuss(doc()).map(sel => {
                    const tr = sel.closest('tr') || (sel.parentElement && sel.parentElement.parentElement);
                    if (!tr) return null;
                    const c = camposDaLinha(tr, mapa);
                    if (!c.cod || !c.qtd || c.cod === c.qtd) return null;
                    return { sel, tr, cod: c.cod, desc: c.desc, qtd: c.qtd };
                }).filter(Boolean);
            };

            const botaoAdicionar = () => {
                try {
                    const alvos = Array.from(doc().querySelectorAll('input[type=button],input[type=submit],button,a'));
                    return alvos.find(b => {
                        const t = ((b.value || '') + ' ' + (b.textContent || '')).trim().toLowerCase();
                        return t === 'adicionar' || /(^|\s)adicionar(\s|$)/.test(t);
                    });
                } catch (e) { return null; }
            };

            const esperarPagina = async () => {
                for (let i = 0; i < 60; i++) {
                    if (!ctx.ativo()) return false;
                    try { if (doc().readyState === 'complete') return true; } catch (e) { }
                    await espera(300);
                }
                return false;
            };

            (async () => {
                if (!await esperarPagina()) {
                    ctx.status('❌ Perdi a janela de autorização.');
                    ctx.fim();
                    return;
                }
                if (!linhas().length) {
                    ctx.status('❌ Não achei a tabela de procedimentos nessa janela.\nConfira se ela está na tela de autorização (SP/SADT).');
                    ctx.fim();
                    return;
                }

                for (let i = 0; i < itens.length; i++) {
                    if (!ctx.ativo()) return;
                    const item = itens[i];
                    ctx.status(`⏳ ${i + 1}/${itens.length} — código ${item.cod}` +
                        (item.qtd > 1 ? ` (quantidade ${item.qtd})` : '') + aviso);

                    // 1) Garante uma linha vazia; se acabaram, clica em "Adicionar"
                    let linha = null;
                    let pediuMais = false;
                    for (let t = 0; t < 50; t++) {
                        if (!ctx.ativo()) return;
                        await esperarPagina();
                        const todas = linhas();
                        linha = todas.find(l => !(l.cod.value || '').trim());
                        if (linha) break;
                        if (!pediuMais) {
                            const add = botaoAdicionar();
                            if (!add) {
                                ctx.status('❌ Não encontrei o botão "Adicionar" na janela.');
                                ctx.fim();
                                return;
                            }
                            ctx.status(`➕ Abrindo mais linhas... (${i + 1}/${itens.length})`);
                            add.click();
                            pediuMais = true;
                        }
                        await espera(400);
                    }
                    if (!linha) {
                        ctx.status(`❌ Parei no ${item.cod}: não apareceu linha vazia.`);
                        ctx.fim();
                        return;
                    }

                    // 2) Escolhe "TUSS -- Procedimentos e eventos em saúde"
                    const opcao = Array.from(linha.sel.options)
                        .find(o => /procedimentos?\s+e\s+eventos/i.test(o.textContent || ''));
                    if (opcao) {
                        linha.sel.focus();
                        linha.sel.value = opcao.value;
                        disparar(linha.sel, 'input');
                        disparar(linha.sel, 'change');
                        try { if (typeof linha.sel.onchange === 'function') linha.sel.onchange(); } catch (e) { }
                        await espera(300);
                    }

                    // 3) Digita o código do procedimento
                    try { linha.cod.focus(); } catch (e) { }
                    linha.cod.value = item.cod;
                    disparar(linha.cod, 'input');
                    disparar(linha.cod, 'change');
                    try { linha.cod.blur(); } catch (e) { }
                    disparar(linha.cod, 'blur');
                    disparar(linha.cod, 'focusout');

                    // 4) Espera o portal trazer o nome do exame
                    let nomeVeio = false;
                    for (let t = 0; t < 48; t++) {
                        if (!ctx.ativo()) return;
                        try {
                            const atual = linhas().find(l => (l.cod.value || '').trim() === item.cod);
                            if (atual) {
                                linha = atual;
                                if (atual.desc && (atual.desc.value || '').trim().length > 1) { nomeVeio = true; break; }
                            }
                        } catch (e) { }
                        await espera(250);
                    }
                    if (!nomeVeio) ctx.status(`⚠️ ${item.cod}: o nome do exame não voltou — seguindo em frente`);

                    // 5) Quantidade solicitada (nunca no campo da descrição)
                    if (linha.qtd && linha.qtd !== linha.desc && linha.qtd !== linha.cod) {
                        try { linha.qtd.focus(); } catch (e) { }
                        linha.qtd.value = item.qtd;
                        disparar(linha.qtd, 'input');
                        disparar(linha.qtd, 'change');
                        try { linha.qtd.blur(); } catch (e) { }
                        disparar(linha.qtd, 'blur');
                    }
                    await espera(300);
                }

                ctx.status(`✅ Concluído! ${itens.length} exame(s) lançado(s).${aviso}\nConfira na janela e finalize a autorização.`);
                ctx.fim();
            })();
        }
    };

    // ── NAVEGAÇÃO ENTRE AS DUAS TELAS ─────────────────────────────
    const btnIniciar = document.getElementById('cr-iniciar');
    const btnLimpar = document.getElementById('cr-limpar');
    const campoCodigos = document.getElementById('cr-txt-codigos');
    const statusExec = document.getElementById('cr-exec-status');

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

    const limparVigias = () => {
        vigias.forEach(v => { try { clearInterval(v); } catch (e) { } });
        vigias = [];
    };

    // ═══════════════════════════════════════════════════════════════
    //  MOTOR DE FUNDO
    //  O Chrome desacelera (e quase congela) os relógios de uma aba
    //  que não está na frente. Isso faria o robô andar a passo de
    //  tartaruga com a aba minimizada. Aqui o relógio passa a bater
    //  fora da aba, num processo paralelo que o Chrome não freia.
    // ═══════════════════════════════════════════════════════════════
    const BASE_ID = 900000000;
    let motor = {
        som: null, relogio: null, rtc: null, ligado: false, originais: null,
        tarefas: {}, seq: 0, girando: false, alvo: 0, canal: null, diag: [],
        ultimoPulso: 0, guarda: null, backup: null
    };
    let dialogos = null;

    // ── Som inaudível: a aba passa a contar como "tocando algo" ────
    //    (grave demais para o alto-falante reproduzir, mas o Chrome vê)
    const ligarSom = () => {
        try {
            if (motor.som) return true;
            const AC = window.AudioContext || window.webkitAudioContext;
            if (!AC) return false;
            const ac = new AC();
            const osc = ac.createOscillator();
            const vol = ac.createGain();
            vol.gain.value = 0.02;
            osc.frequency.value = 30;
            osc.connect(vol);
            vol.connect(ac.destination);
            osc.start();
            const acordar = () => { try { if (ac.state !== 'running') ac.resume(); } catch (e) { } };
            acordar();
            document.addEventListener('visibilitychange', acordar);
            motor.som = { ac, osc, acordar };
            return true;
        } catch (e) { return false; }
    };

    const desligarSom = () => {
        try {
            if (!motor.som) return;
            document.removeEventListener('visibilitychange', motor.som.acordar);
            motor.som.osc.stop();
            motor.som.ac.close();
        } catch (e) { }
        motor.som = null;
    };

    // ── RELÓGIO DA PLACA DE SOM ────────────────────────────────────
    //    A placa de som processa áudio sem parar, esteja a aba na
    //    frente ou não — o Chrome nunca a congela. Usamos esse
    //    batimento como relógio do robô.
    const ligarRelogioSom = () => {
        try {
            if (motor.relogio) return true;
            if (!motor.som) return false;
            const ac = motor.som.ac;
            if (!ac.createScriptProcessor) return false;
            const proc = ac.createScriptProcessor(1024, 1, 1);
            const mudo = ac.createGain();
            mudo.gain.value = 0;
            proc.onaudioprocess = () => pulso();
            proc.connect(mudo);
            mudo.connect(ac.destination);
            motor.relogio = { proc, mudo };
            return true;
        } catch (e) { return false; }
    };

    const desligarRelogioSom = () => {
        try {
            if (!motor.relogio) return;
            motor.relogio.proc.onaudioprocess = null;
            motor.relogio.proc.disconnect();
            motor.relogio.mudo.disconnect();
        } catch (e) { }
        motor.relogio = null;
    };

    // ── Conexão viva: mais um motivo para o Chrome não frear a aba ──
    const ligarConexaoViva = () => {
        try {
            if (motor.rtc) return true;
            if (!window.RTCPeerConnection) return false;
            const a = new RTCPeerConnection();
            const b = new RTCPeerConnection();
            a.onicecandidate = e => { if (e.candidate) b.addIceCandidate(e.candidate).catch(() => { }); };
            b.onicecandidate = e => { if (e.candidate) a.addIceCandidate(e.candidate).catch(() => { }); };
            a.createDataChannel('cr');
            a.createOffer()
                .then(o => a.setLocalDescription(o).then(() => b.setRemoteDescription(o)))
                .then(() => b.createAnswer())
                .then(r => b.setLocalDescription(r).then(() => a.setRemoteDescription(r)))
                .catch(() => { });
            motor.rtc = { a, b };
            return true;
        } catch (e) { return false; }
    };

    const desligarConexaoViva = () => {
        try { motor.rtc.a.close(); motor.rtc.b.close(); } catch (e) { }
        motor.rtc = null;
    };

    // ── Agenda própria de tarefas ──────────────────────────────────
    const proximoVencimento = () => {
        let menor = Infinity;
        Object.keys(motor.tarefas).forEach(k => { const t = motor.tarefas[k]; if (t && t.prox < menor) menor = t.prox; });
        return menor;
    };

    const pulso = () => {
        if (!motor.ligado) return;
        const agora = Date.now();
        motor.ultimoPulso = agora;
        const vencidas = [];
        Object.keys(motor.tarefas).forEach(id => {
            const t = motor.tarefas[id];
            if (!t) return;
            if (agora >= t.prox) {
                vencidas.push(t);
                if (t.tipo === 't') delete motor.tarefas[id];
                else t.prox = agora + Math.max(t.periodo, 1);
            }
        });
        vencidas.forEach(t => { try { t.fn.apply(null, t.args); } catch (e) { } });
        if (!motor.relogio) agendarPulso();
    };

    // ── Reforço: giro por mensagens (não é relógio, não é freado) ──
    const iniciarGiro = () => {
        if (motor.girando) return;
        motor.girando = true;
        if (!motor.canal) {
            motor.canal = new MessageChannel();
            motor.canal.port1.onmessage = () => {
                if (!motor.girando || !motor.ligado) { motor.girando = false; return; }
                if (Date.now() >= motor.alvo) { motor.girando = false; pulso(); return; }
                motor.canal.port2.postMessage(0);
            };
        }
        motor.canal.port2.postMessage(0);
    };

    const agendarPulso = () => {
        if (!motor.ligado || motor.relogio) return;   // com relógio da placa não precisa agendar
        const venc = proximoVencimento();
        motor.alvo = venc === Infinity ? Date.now() + 250 : venc;
        const espera = Math.max(0, motor.alvo - Date.now());
        if (!document.hidden) {
            motor.originais.stO.call(window, pulso, espera);
            return;
        }
        iniciarGiro();
    };

    const ligarMotorFundo = (modoLeve) => {
        if (motor.ligado) return;
        motor.diag = [];
        const temSom = ligarSom();
        const temRtc = ligarConexaoViva();

        // MODO LEVE: mantém a aba acordada, mas NÃO toma o relógio da página.
        // Portais feitos em Angular (o do Amil, por exemplo) dependem do
        // relógio deles para saber que a busca terminou e redesenhar a tela.
        // Se a gente toma o relógio, o portal fica preso em "Buscando".
        if (modoLeve) {
            motor.diag.push('modo leve (portal sensível) ✅');
            motor.diag.push(temSom ? 'aba acordada ✅' : 'aba acordada ❌');
            motor.diag.push(temRtc ? 'conexão viva ✅' : 'conexão viva ❌');
            motor.ligado = true;
            motor.originais = null;
            return;
        }

        const temRelogio = temSom ? ligarRelogioSom() : false;
        motor.diag.push(temRelogio ? 'relógio da placa de som ✅' : 'relógio da placa de som ❌ → reforço ativo');
        motor.diag.push(temSom ? 'aba acordada ✅' : 'aba acordada ❌');
        motor.diag.push(temRtc ? 'conexão viva ✅' : 'conexão viva ❌');

        const stO = window.setTimeout, siO = window.setInterval;
        const ctO = window.clearTimeout, ciO = window.clearInterval;
        motor.originais = { stO, siO, ctO, ciO };

        const agendar = (tipo, fn, ms, args) => {
            if (typeof fn !== 'function') {
                return tipo === 'i' ? siO.call(window, fn, ms) : stO.call(window, fn, ms);
            }
            ms = ms || 0;
            const id = BASE_ID + (++motor.seq);
            motor.tarefas[id] = { fn, args: args || [], tipo, periodo: ms, prox: Date.now() + ms };
            if (!motor.relogio && (motor.alvo - (Date.now() + ms)) > 0) agendarPulso();
            return id;
        };

        window.setTimeout = function (fn, ms) { return agendar('t', fn, ms, [].slice.call(arguments, 2)); };
        window.setInterval = function (fn, ms) { return agendar('i', fn, ms, [].slice.call(arguments, 2)); };
        window.clearTimeout = function (id) {
            if (typeof id === 'number' && id >= BASE_ID) { delete motor.tarefas[id]; return; }
            return ctO.call(window, id);
        };
        window.clearInterval = function (id) {
            if (typeof id === 'number' && id >= BASE_ID) { delete motor.tarefas[id]; return; }
            return ciO.call(window, id);
        };

        motor.ligado = true;
        motor.ultimoPulso = Date.now();

        // Batida de reserva: garante que os relógios da página NUNCA morram,
        // mesmo que a placa de som e o reforço falhem os dois.
        motor.backup = siO.call(window, pulso, 200);

        // Vigia: se as batidas pararem, aciona o reforço na hora
        motor.guarda = siO.call(window, () => {
            if (!motor.ligado) return;
            if (Date.now() - motor.ultimoPulso > 2000) {
                if (motor.relogio) {
                    desligarRelogioSom();
                    motor.diag = motor.diag.map(d => d.indexOf('relógio') === 0
                        ? 'relógio da placa ⚠️ parou → reforço ativo' : d);
                }
                motor.girando = false;
                agendarPulso();
            }
        }, 1000);

        agendarPulso();
    };

    const desligarMotorFundo = () => {
        try { if (motor.originais) motor.originais.ciO.call(window, motor.backup); } catch (e) { }
        try { if (motor.originais) motor.originais.ciO.call(window, motor.guarda); } catch (e) { }
        motor.backup = null; motor.guarda = null;
        desligarRelogioSom();
        desligarSom();
        desligarConexaoViva();
        motor.girando = false;
        if (!motor.ligado || !motor.originais) { motor.ligado = false; return; }
        window.setTimeout = motor.originais.stO;
        window.setInterval = motor.originais.siO;
        window.clearTimeout = motor.originais.ctO;
        window.clearInterval = motor.originais.ciO;
        motor.tarefas = {};
        motor.ligado = false;
    };

    // Avisos do robô não podem travar a aba quando ela está no fundo:
    // em vez de caixinha do navegador, a mensagem aparece aqui no painel.
    let ultimoAviso = '';

    const silenciarAvisos = () => {
        if (dialogos) return;
        dialogos = { alerta: window.alert, pergunta: window.confirm };
        // Robôs sem painel próprio avisam o fim por alerta — guardamos a
        // mensagem para saber que a automação acabou.
        window.alert = msg => { ultimoAviso = String(msg); mostrarStatus(String(msg), '#4dc3ff'); };
        window.confirm = msg => {
            mostrarStatus('⚠️ ' + String(msg) + ' → seguindo em frente automaticamente', '#ffd633');
            return true;
        };
    };

    const restaurarAvisos = () => {
        if (!dialogos) return;
        window.alert = dialogos.alerta;
        window.confirm = dialogos.pergunta;
        dialogos = null;
    };

    // Os painéis dos robôs ficam escondidos FORA DA TELA (não podem sumir de
    // vez enquanto rodam, senão o robô perde os próprios botões). Só que eles
    // continuam no documento — e a caixa de códigos deles faz o Ctrl+F do
    // navegador contar cada código duas vezes. Ao terminar, tiramos de vez.
    const limparPaineisDoRobo = () => {
        try {
            const lista = elementosRobo.slice();
            elementosRobo = [];

            // Reforço: acha o painel pelos ids que o próprio robô usa, mesmo que
            // ele não tenha passado pelo nosso registro.
            try {
                const inf = infoRobos[roboAtual] || {};
                [inf.txt, inf.btn, statusRobo[roboAtual], contadorRobo[roboAtual]]
                    .filter(Boolean).forEach(id => {
                        const alvo = document.getElementById(id);
                        if (!alvo) return;
                        let p = alvo;
                        while (p && p.parentElement && p.parentElement !== document.body) p = p.parentElement;
                        if (!p || p === document.body) return;
                        if (menu && (p === menu || p.contains(menu))) return;   // nunca o nosso menu
                        if (lista.indexOf(p) === -1) lista.push(p);
                    });
            } catch (e) { }

            lista.forEach(el => {
                try {
                    const t = el.querySelectorAll('textarea, input');
                    for (let i = 0; i < t.length; i++) { try { t[i].value = ''; } catch (e) { } }
                    if (el.parentNode) el.parentNode.removeChild(el);
                } catch (e) { }
            });
        } catch (e) { }
    };

    const encerrarModoAutomacao = () => {
        restaurarAvisos();
        desligarMotorFundo();
        // com uma folga: alguns robôs ainda dão um último retoque na tela
        try { setTimeout(limparPaineisDoRobo, 3000); } catch (e) { limparPaineisDoRobo(); }
    };

    // ── CAMINHO PADRÃO: robôs que já rodam na própria página ──────
    // Só é painel do robô quem contém os elementos que o próprio robô criou
    // (a caixa de códigos, o botão de iniciar ou o texto de status dele).
    const ehPainelDoRobo = (el, nome) => {
        try {
            const inf = infoRobos[nome] || {};
            // Alguns robôs mostram a contagem no painel deles — deixamos à vista
            if (inf.mostrarPainel) return false;
            const ids = [inf.txt, inf.btn, statusRobo[nome], contadorRobo[nome]].filter(Boolean);
            for (const id of ids) {
                if (el.id === id) return true;
                if (el.querySelector && el.querySelector('[id="' + id + '"]')) return true;
            }
        } catch (e) { }
        return false;
    };

    const iniciarPadrao = (nome, texto) => {
        const antes = Array.from(document.body.children);

        // Lista de códigos deste lote, para conseguir contar o progresso
        // mesmo nos robôs que não mostram contagem nenhuma.
        const brutos = (texto || '').match(/\b\d{8}\b/g) || [];
        const doLote = [];
        brutos.forEach(c => { if (doLote.indexOf(c) === -1) doLote.push(c); });
        // Alguns convênios lançam numa janela separada — ali a contagem do app
        // não enxerga nada, então quem informa o progresso é o próprio robô.
        const total = (infoRobos[nome] || {}).semContagem ? 0 : doLote.length;

        // Texto do portal, sem contar o painel do app nem os painéis dos robôs
        const textoDoPortal = () => {
            let t = '';
            try {
                Array.from(document.body.children).forEach(el => {
                    if (el === menu || elementosRobo.indexOf(el) !== -1) return;
                    t += ' ' + (el.innerText || el.textContent || '');
                    // Em vários portais (PM, MedSenior, TJ, Unimed Seguros) o código
                    // fica DENTRO de um campo — e o texto da página não mostra isso.
                    if (el.querySelectorAll) {
                        el.querySelectorAll('input,textarea,select').forEach(c => {
                            t += ' ' + (c.value || '');
                            if (c.tagName === 'SELECT' && c.options && c.selectedIndex >= 0) {
                                t += ' ' + ((c.options[c.selectedIndex] || {}).textContent || '');
                            }
                        });
                    }
                });
            } catch (e) { }
            return t;
        };

        const encerrar = (msg, cor) => {
            rodando = false;
            limparVigias();
            encerrarModoAutomacao();
            modoIniciar();
            mostrarStatus(msg, cor || '#2ecc71');
        };

        executarRobo(nome, texto);

        let ciclos = 0, feitos = 0, iguais = 0;
        const idStatus = statusRobo[nome];
        const idContador = contadorRobo[nome];

        const vigia = setInterval(() => {
            if (!rodando) { clearInterval(vigia); return; }

            // Esconde APENAS o painel do próprio robô. Antes escondia qualquer
            // coisa nova no corpo da página — inclusive a lista de sugestões que
            // o portal cria (ASSEFAZ e afins), e o robô ficava travado no 1º código.
            Array.from(document.body.children).forEach(el => {
                if (el === menu || el.id === 'cr-espelho') return;
                if (antes.indexOf(el) !== -1 || elementosRobo.indexOf(el) !== -1) return;
                if (!ehPainelDoRobo(el, nome)) return;
                elementosRobo.push(el);
                esconderElemento(el);
            });

            // Conta quantos códigos do lote já aparecem na tela do portal
            if (total && ciclos % 2 === 0) {
                const pag = textoDoPortal();
                const agora = doLote.filter(c => pag.indexOf(c) !== -1).length;
                if (agora === feitos) { iguais++; } else { feitos = agora; iguais = 0; }
            }
            const contagem = total ? ('📋 ' + feitos + '/' + total + ' códigos lançados no portal') : '';

            // Recontagem na hora, para o número final sair exato
            const contagemAgora = () => {
                if (!total) return '';
                const pag = textoDoPortal();
                feitos = doLote.filter(c => pag.indexOf(c) !== -1).length;
                return '📋 ' + feitos + '/' + total + ' códigos lançados no portal';
            };

            // 1) O robô avisou alguma coisa? Para estes robôs, isso é o fim.
            if (ultimoAviso) {
                const fimBom = /✅|conclu|finaliz|fim|sucesso/i.test(ultimoAviso);
                clearInterval(vigia);
                const cFinal = contagemAgora();
                encerrar((fimBom ? '✅ ' : '⚠️ ') + ultimoAviso + (cFinal ? '\n' + cFinal : ''),
                    fimBom ? '#2ecc71' : '#ffd633');
                return;
            }

            // 2) Robô com painel próprio: espelha o texto dele
            if (idStatus) {
                const alvo = document.getElementById(idStatus);
                if (alvo) {
                    let txt = (alvo.innerText || '').trim();
                    const cEl = idContador ? document.getElementById(idContador) : null;
                    const cTxt = cEl ? (cEl.innerText || '').trim() : '';
                    if (txt) {
                        mostrarStatus(txt + (cTxt ? '  (' + cTxt + ')' : '') + (contagem ? '\n' + contagem : ''), '#4dc3ff');
                        if (/✅|conclu|finaliz|FIM/i.test(txt)) {
                            clearInterval(vigia);
                            const cF = contagemAgora();
                            // A mensagem do robô pode trazer avisos importantes
                            // (exames recusados, por exemplo) — preservamos ela.
                            encerrar(txt + (cF ? '\n' + cF : ''), '#2ecc71');
                            return;
                        }
                    }
                }
            } else {
                // 3) Robô sem painel: mostramos a contagem que calculamos
                if (ciclos >= 2) {
                    mostrarStatus('⏳ Automação em andamento no portal...' + (contagem ? '\n' + contagem : ''), '#4dc3ff');
                }
                // Todos os códigos já na tela e parou de crescer: terminou
                if (total && feitos >= total && iguais >= 4) {
                    clearInterval(vigia);
                    encerrar('✅ Automação concluída!\n' + contagemAgora(), '#2ecc71');
                    return;
                }
            }

            if (++ciclos > 7200) clearInterval(vigia);
        }, 400);
        vigias.push(vigia);
    };

    // ── CAMINHO ESPELHO: portal embutido, robô pilota daqui ───────
    const rodarInline = (nome, texto) => {
        mostrarStatus('⏳ Preparando o portal...', '#4dc3ff');
        const iframe = abrirEspelho();
        let tentativas = 0;

        const ctx = {
            doc: () => espelho.iframe.contentWindow.document,
            win: () => espelho.iframe.contentWindow,
            status: t => mostrarStatus(t, '#4dc3ff'),
            ativo: () => rodando && !!espelho,
            timer: t => vigias.push(t),
            fim: () => {
                rodando = false;
                limparVigias();
                encerrarModoAutomacao();
                modoIniciar();
                mostrarStatus('✅ Automação concluída! O portal continua aqui na tela.', '#2ecc71');
            }
        };

        const espera = setInterval(() => {
            if (!rodando) { clearInterval(espera); return; }
            tentativas++;
            let pronto = false;
            try {
                const d = iframe.contentWindow.document;
                pronto = !!(d && d.body && d.readyState === 'complete' && d.body.innerHTML.length > 200);
            } catch (e) { pronto = false; }

            if (pronto) {
                clearInterval(espera);
                mostrarStatus('▶ Iniciando automação...', '#4dc3ff');
                try {
                    roboInline[nome](texto, ctx);
                } catch (e) {
                    mostrarStatus('❌ ' + e.message, '#ff6b5e');
                    ctx.fim();
                }
                return;
            }

            if (tentativas > 50) {
                // Portal não aceitou ser embutido: volta para o método antigo
                clearInterval(espera);
                fecharEspelho();
                mostrarStatus('⚠️ Este portal não permitiu o modo embutido. Abrindo pelo método antigo...', '#ffd633');
                iniciarPadrao(nome, texto);
            }
        }, 400);
        vigias.push(espera);
    };

    // ── CAMINHO JANELA: o app abre a tela de autorização e pilota nela ─
    //
    //  Por que abrir em vez de procurar: se a janela nasceu a partir de
    //  OUTRA aba, o navegador não deixa esta aba enxergá-la de jeito
    //  nenhum. Abrindo aqui, a janela é nossa desde o começo e sempre
    //  funciona. Os dados do beneficiário vêm da sessão do portal, então
    //  a guia abre com o paciente já preenchido do mesmo jeito.
    //
    const rodarJanela = (nome, texto) => {
        jaProcureiPorNome = false;

        const comecar = alvo => {
            janelaUnimed = alvo;
            const ctx = {
                doc: () => janelaUnimed.document,
                win: () => janelaUnimed,
                status: t => mostrarStatus(t, '#4dc3ff'),
                ativo: () => rodando && janelaUnimed && !janelaUnimed.closed,
                timer: t => vigias.push(t),
                fim: () => {
                    rodando = false;
                    limparVigias();
                    encerrarModoAutomacao();
                    modoIniciar();
                }
            };
            mostrarStatus('✅ Janela pronta. Começando...', '#2ecc71');
            try { roboJanela[nome](texto, ctx); }
            catch (e) { mostrarStatus('❌ ' + e.message, '#ff6b5e'); ctx.fim(); }
        };

        const encerrarSemRodar = (msg, cor) => {
            rodando = false;
            limparVigias();
            encerrarModoAutomacao();
            modoIniciar();
            mostrarStatus(msg, cor || '#ffd633');
        };

        // Espera a janela terminar de carregar a tela SP/SADT
        const esperarJanela = () => {
            mostrarStatus('⏳ Aguardando a tela de autorização carregar...', '#4dc3ff');
            let t = 0;
            const iv = setInterval(() => {
                if (!rodando) { clearInterval(iv); return; }
                if (!janelaUnimed || janelaUnimed.closed) {
                    clearInterval(iv);
                    encerrarSemRodar('❌ A janela de autorização foi fechada.\nClique em INICIAR que eu abro de novo.', '#ff6b5e');
                    return;
                }
                if (serveComoSADT(janelaUnimed)) { clearInterval(iv); comecar(janelaUnimed); return; }
                if (++t > 60) {   // 30 segundos
                    clearInterval(iv);
                    encerrarSemRodar('⚠️ A janela abriu, mas ainda não está na tela SP/SADT.\n' +
                        'Deixe-a na tela de autorização e clique em INICIAR de novo.', '#ffd633');
                }
            }, 500);
            vigias.push(iv);
        };

        // 1) Já tenho uma janela aberta desta sessão? uso ela.
        if (janelaUnimed && !janelaUnimed.closed) { esperarJanela(); return; }

        // 2) Alguma janela que eu consiga enxergar daqui serve?
        const alvo = acharJanelaSADT();
        if (alvo) { janelaUnimed = alvo; comecar(alvo); return; }

        // 3) Não achei: abro eu mesmo. Isto roda dentro do clique do botão,
        //    que é a única hora em que o navegador libera abrir janela.
        let nova = null;
        try {
            nova = window.open(URL_SADT, 'crUnimedSADT',
                'width=1460,height=940,scrollbars=yes,resizable=yes');
        } catch (e) { }

        if (!nova) {
            encerrarSemRodar('❌ O navegador bloqueou a abertura da janela.\n' +
                'Clique no ícone de pop-up bloqueado na barra de endereço, permita para este site, ' +
                'e clique em INICIAR de novo.', '#ff6b5e');
            return;
        }

        janelaUnimed = nova;
        encerrarSemRodar('🪟 Abri a janela de autorização — agora ela é minha e eu consigo trabalhar nela.\n\n' +
            '1) Confira o cabeçalho da guia nessa janela nova\n' +
            '2) Volte aqui e clique em INICIAR\n\n' +
            'Pode fechar a janela antiga: esta abre com os mesmos dados do paciente.', '#2ecc71');
    };

    // ── INICIAR: roda o robô sem sair desta janela ────────────────
    const iniciarAutomacao = (nome, texto) => {
        rodando = true;
        elementosRobo = [];
        janelasRobo = [];
        ultimoAviso = '';
        modoParar();
        roboAtual = nome;
        const infoAtual = infoRobos[nome] || {};
        try { ligarMotorFundo(!!infoAtual.semMotor); } catch (e) { console.log('motor de fundo indisponível:', e.message); }
        try { silenciarAvisos(); } catch (e) { console.log('aviso:', e.message); }
        mostrarStatus('▶ Iniciando... pode minimizar ou trocar de aba.\n⚙️ ' + motor.diag.join(' · '), '#4dc3ff');

        if (roboJanela[nome]) { rodarJanela(nome, texto); return; }
        if (roboInline[nome]) { rodarInline(nome, texto); return; }
        iniciarPadrao(nome, texto);
    };

    // ── PARAR: desliga o que der e devolve o botão ao normal ──────
    const pararAutomacao = () => {
        const tinhaJanela = janelasRobo.length > 0;
        const tinhaPainel = elementosRobo.length > 0;
        const tinhaEspelho = !!espelho;

        rodando = false;
        limparVigias();
        encerrarModoAutomacao();

        janelasRobo.forEach(w => { try { w.close(); } catch (e) { } });
        janelasRobo = [];
        elementosRobo.forEach(el => { try { el.remove(); } catch (e) { } });
        elementosRobo = [];
        try { window._b403 = 0; } catch (e) { }

        modoIniciar();

        // A janela de autorização é do usuário: nunca fechar nem recarregar
        if (roboJanela[roboAtual]) {
            mostrarStatus('⏹ Automação interrompida. A janela de autorização continua aberta.', '#ff6b5e');
            return;
        }

        if (tinhaEspelho) {
            fecharEspelho();
            mostrarStatus('⏹ Automação interrompida. Se a tela parecer desatualizada, aperte F5.', '#ff6b5e');
            return;
        }

        if (!tinhaJanela && !tinhaPainel) {
            mostrarStatus('⏹ Para interromper este robô é preciso recarregar a página.', '#ffd633');
            if (confirm('Este convênio roda direto na página do portal.\n\nPara interromper de verdade é preciso recarregar a página (você perderá o que estiver preenchido).\n\nRecarregar agora?')) {
                location.reload();
            }
            return;
        }
        mostrarStatus('⏹ Automação interrompida.', '#ff6b5e');
    };

    const abrirJanelaCodigos = item => {
        if (rodando) {
            alert('Há uma automação em andamento. Pare ela antes de escolher outro convênio.');
            return;
        }
        roboAtual = item.chave;
        document.getElementById('cr-j-nome').innerText = item.rotulo;
        document.getElementById('cr-j-desc').innerText = item.desc;
        const ic = document.getElementById('cr-j-icone');
        const logo = LOGOS[item.rotulo];
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
        unimedForcar = false;
        unimedTentouAbrir = false;
        statusExec.style.display = 'none';
        const infoMotor = document.getElementById('cr-motor-info');
        if (infoMotor) infoMotor.innerText = '';
        modoIniciar();
        telaHome.style.display = 'none';
        telaJanela.style.display = 'block';
    };

    document.getElementById('cr-voltar').onclick = () => {
        telaJanela.style.display = 'none';
        telaHome.style.display = 'flex';
    };
    document.getElementById('cr-j-fechar').onclick = () => { encerrarModoAutomacao(); menu.remove(); };
    btnLimpar.onclick = () => {
        campoCodigos.value = '';
        campoCodigos.focus();
    };
    btnIniciar.onclick = () => {
        if (rodando) { pararAutomacao(); return; }
        const texto = campoCodigos.value;
        if (!texto.trim()) {
            alert('Cole os códigos do convênio antes de iniciar!');
            return;
        }
        iniciarAutomacao(roboAtual, texto);
    };

    // ── LOGOTIPOS DOS CONVÊNIOS (embutidos, não dependem de internet) ──
    const LOGOS = {
        "Assefaz": "data:image/webp;base64,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",
        "BRB Saúde": "data:image/webp;base64,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",
        "Câmara dos Deputados": "data:image/webp;base64,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",
        "Camed Saúde": "data:image/webp;base64,UklGRjQIAABXRUJQVlA4ICgIAACwLACdASp4AHgAPjEYikOiIaESjAUcIAMEsoA8XfwH4zc4Xw/iz72o3nXZ+y6QH3HeqB0gPMB/Ef8B+t3vX/wD1AegB+2HWAegB0kf7U/tf7ROao/0/tX/pf1M9qR3C9aNAj+FfYn7F+Q39L/cbnR9IHqBfjH8d/sP5BflRxhUsHqBeoPzP+2fkd/bOcr6m/271HfyL+7fkpzvNAD+Hf0P/h/dh9Jf8F/wfy8/0ntZ/L/6//tP73+Qf2B/x3+a/5T+4fuZ/fP///6fIZ+wHsh/sgS/DuXiEXm8YjsS4sRS8Mu1yNmEu3r7p0aRYc+6qMlHULy/iCHUC4Rkl/AagbhwLWjU0xCiAP3lmHDeQt5WPHt8QojC9PDV1sF/ljE+4QPGKSvvpTjRHjigoBH4FEsNjbzYbYjTSFZKsu/SInbhFrdijYciFhoa2aciYKFCtycy9uFFVpcoNKrkec4x7X3m8owjrB8S6gh4l1BDpAAA/v60IBKtoqACHes1Zcl9LkcfqrPOQHBfhqWlR9pcdxujaLhGj9+ffiC9gmIFS7K8RbytLRcf8m+4/4ExDIVAVUNfH2JXWf+DfiOxJqtvdRWc7fErE9NN2kX/5dAqWKFWOiGleowbfGprGETHbY5K4aWkCefmejtAvS8XxjKuq/VHDYa7iMOhOo4+btRAh+uh0NLv7Pu6hm3SyvZ5m9huinYyX/LcQJrL3OcPAVcyuNTvAy21/2z1YyJDBpLl//wzuUy7NWPqKqfZ7//8Mv9jGtqbhTk3NwRIWbAzq2spkfgGurTPbPuUseWjPRO174qdMlGo4RQDjCoHlFvYFPe5JWzFAtwPjmi3WWIakJEPMbLiGc/P+aGvE6ga+imfwtBKTQKq5CoN8MUJ9Y2JJL3Sh/pi/6vYe/vLDbVceS5myKGE7mXGyj7G/OQGVCr94PeI4BAm02WtL3OJ6QyZwbvm/0z9GjqHUN/NUAaxihCp00csM5nASVes31WYBThJ21iLzJvQ9nRwgIzfPbd0NyDzHkNx5XFbV4bbaOIeFuw/gN7y7LXe992NwsuR21Fx1SkE/bxxg6KIzq0cnPLRH4fGrWaj4ay35rWrD3aTwE50we91Osqrc44nL84sL4V4mT7RCE1wocCqkpxTpMqfaNyBuFq/uGoA+CzZAaDyyMyOrIHZe07QWutK4wgVb2zR8Z5n+riCzYCI2IjkhR11auqRXsaN3OQ/9BdI2roKMSJVJh8buv1j4Ozdo+1Ef9vx8+kUBxNSoP0FBub8cjKAWC361//zpnVe/HUT4ZnlIbka6wsv2yM+N82zzh8/tZ67b9VLqhBxQUWDn7dys0XQvBs39Bf14sjcHC0r9JWtvWzinK/f9RiN5ei5Q7GHNde0cN3sZ5OS2YDvXq+4BMqeQHilHo+KIpG1UzHKT6PXOAEqDeMJQWQ1TH3ZbZ47BPTzt2hgzVJRjrBDb76Ho9Le9xT+kVIz1jZAaPCHS05IIB4inx3taYoDoUsTUp//2b8Oq1fbPWH5cscqjRTeoDsOuyklflN6FT4xcke0fmODz6bV48qaIfiWEMEkA34CmuxS/m3pJk4VoKS85E/VpaiptWezNNWBkLeQJuZkT2AWiUlHnTxf1/ivF68TFq+j6FZQVTZ3ScZ8h1nDr46OKIodwmxnvu4xuNs1G8Lu/4HfRhgfekFI0Omw/S69G18vXDOObZ7HKvheYuxp76hu1l1UC4crurtWSqjRuoX+GrFq8H7Sm5vuW20VU6z6j//Nt+LS6p393o1yASJFTUmQMATh79gi3xPOHxg+qkJFtMnnA2pdyW2qngpRWyYS0ddyTx8ZuBFetqD6jkl79svRLZPiyhNjtYoY8JA+tFbStMsjXYwTorzFJFAkGdEA9BdZ2VShNcZeeKxuCy2zMWPMN6WHyls0ETyzk8l/ZA2XskFku1PSvCfycHieDMHbBaO7EHKUyHrG5ESr8Pl/t8Hkstsu0ZIExSyymYmpp/yzN1BlOnsa3S6w1A6FloYL1mSW2XVHWupKRsOC8iq71HRIxUWPl8n1J/8Xtc9P0ZYHVN0QpvLurhXc9hpXabd3xY/mF+5MbxoWm15/XCzAYcFX8iOexdG4d1p4Sd39LpiPF05yoFCbdPtYDWl5EeYbBqFwbNYfH46gUrzFjKHff/9gagoFl+D4D+XNsY6Bgqivb6spc+q2DGpPySjj4F2ioFmWWg/vc48ETJ0anrEFQJbns1HKyk3VmgIp5wTkrmmhm2TIhLbHV9GrDTB6MhwCFr/b2XQVHChBhWq0B6kDbKEWQoUTffVyXI80q34etWmf7CgIagl1f+KS77GxDIegvGHl1MK9m2TmQvigVGVS9yYKbLX2/UDxcKalTKB1i3AlQX+Kd8igNoy5g/JcroyYrqsud5/k+44rwfoapTD4JYm28/6vGnOkGf2a4bMVyNTtw4++Zu47T0CxSM6LUsO/ZwEwvEsxOUpECzsKnFzBiSMbOXd+f3mCPNw2VugJ8rBldo4qICRXzXexvNKRaMZoHOOezsBpkAFIl1YvIrh7/2rAeW/isZubrFDMT91Oh91V8dfv+n1ANaHIvIKTKfiRfhYV0cPZtekg+t69cav9R743Hmxyt/FiV7soCbEtFmdWn/bsHfMdlDpmHxVsWdGuc8HEQzOeCSeVtoCeHxm+bk9kWBDwknDBmpD9MQMp+sPprQSmIgMDBbBAF07uvUd5N9+SAZTzCc0RYzJAO4J4B31tyYdVswc5SQ4/UAr7c2rmxPU+hjh2H3iFk12AAAAAAAA=",
        "Fascal": "data:image/webp;base64,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",
        "GEAP": "data:image/webp;base64,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",
        "PF Saúde": "data:image/webp;base64,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",
        "Serpro": "data:image/webp;base64,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",
        "Affego": "data:image/webp;base64,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",
        "Amil": "data:image/webp;base64,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",
        "Assedf/Vida Card": "data:image/webp;base64,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",
        "CNU Unimed": "data:image/webp;base64,UklGRtAJAABXRUJQVlA4IMQJAAAwLgCdASp4AHgAPjEWiUOiISETSKYwIAMEsoHYD1RZnWGbL7L5ttV/vPkS7RIpXW1/T9an9m9Vv5z9gf9ROkB5gP2l9X7/M/tv7jfQA6Qr0AP2g9Oj2Yf7L/2K8z+IHnj5WfM/sR+42gk+0/3r8mvyG9oD8Sfxm9weAF6m/xf5SflVzPQAPyX+r/5r8x+ZXvM/zH/B8lj9a9QD+Tf2b/denp/ifdV7g/zX/G/9T/N/Ab/LP63/wvW16nc7nYTmN297FeFlYUhPkJoQxVlOySDenqvE9+bxjD9xJPtuPhTBNcZBpmglssHbAzpq/uZa/do9WtlNivRmgja2zu2Stsq4ftqNp/x3a/MmaK8aGCV/+xPwA2M7L9iNSmH7j/BcuWHpOZv1xNuqMu9etFUeO00uk+KAhMgYxW2GRQyIotiGkZ2jwayYvKICRGq5cKgInvZehk+slPHNTU6YgVZMvpNsV9u5arOM3vzfITBik+u3oVwtxxckkzuboAAA/v67OTgaysGlIjte3ESQkmcJEqImkMOdIZhxrvzVMfg9mXrbVx7AL3QzZnr7Z0hNP5FW+85yC9zfHtg1lKswtNFL+zXceOrFiZQk4UUut6Y5FHs47bAAumREhHv5EnigL7d83ZeqIXmsrqCh9S2BHyk2JHPlwdUMBtGQQJel37UvgM4g3dmuHBz2x+FuCzPszcdGc2Yn3sokyCntVp6hr0sXj+WxTs/TnGBpu35cwgslwUiY73tjSpJl3hHcBuoS4dCGXKfHDShtanpaGokIG0taj9xuojLzuecW2qxnUmsvGRBJ7z7z3qCYQud7z/g+o7f0SW4z/Ed1772Ll/++9htUOyMWvmg8/cqLc9hSyS1TDzRD+5qfnQe/BK1t93gbi2cfEuCpA/AqIk/Tg6z8aMp0y6CiGAUx9ezKtAQLkSIF6Cfg9BQqLHIslv9tF97yH+vKDsnEpFpgWSdua9QzTCGk70Yw6mVJMEjWse45Sj9p8H6QWdh/cfoO6fL+CE8TAaWwtbE9SPvjvm4DMuJf2bbC56J19dsOwgbeyOdZPrDPCZ9BdPmIzWYhrqh13JKF76o1wzlxWoX1r4fHYTPFmh2ggOSUDNX/utiO/GslYqCBQkUo6wU+/qBPSc2uG2MpvCQzgXqYBcoO4jAUYeLtt8cwLocXSCTEyjAMpCykn4IgS2uHFJl0H8lVHNOmavUnYF3WKfNqv0UJ9ny+FD6Js2Ihgr3tc3e81j8R1anctJq4CPBTBwP1HtJ0bsKGLxnYNFbsH2GkLMagKhxTBkO2C7u7pcdTRopCHufropCumMBfZ5PKWgBlOXXCj8d+eNp15zLCAzWsm4VQKew1DyKnazSgI/LYBrdp+vlUh9wFwnt//Dv/ktsRWzOK/Y6fDv4qD0xg6jgw+71zLdnsh82rsmH3euZZc8ezB6Ge6TaV9vVQQr/a8QsQiI6d1OoZJDXF6C5snIIxN0H+6w9sJtY9wdKfVJrRjpNU98Ft+MN96WPw7LHqXO+N1UYBlw+IO07ILQ8qD4vl+NImV75ZjOHCpr2SUZsJop5XtTxRfUsScXHE1EWg+tqyqBh20vuS4c7rBL+Wq8qQohd/tNdINwIIO8modUTcaZ+W1EL9ha2DDtGR8cP3inlXAzQMeYDFujs0TqQYxK8P0s/ibge6b+ILgUQd5rdu7tIbSo0rhYuLetPMxNmHoob9q4krm5KExO89yDowNG7gFzD/+pGv24u9gFvGPEqxaYnw/TH6jmFRqpH86Pn95/z/tE9SLxkIzsXpojuHgneagjz/rsQK0IyUel5UJ7iIr8P8/67ECqDUSF8r0ccSiz1WU2mjAIz4vd3ao4+P6PyugdWlkqb5ARKuPOGjtir2eEQtaBC37OnS8Xx13qira2shhLoL1YMUjoiIEZVocciaJL49yKqxrwyURPwOJWUH7j/VTAGALnX0XbTlAXcJfU0F+Mu27FclZdHobxiPVxzCOnPhTlrfvAStu+vHr+IMvmps2VpRVlvalZ8ATBsEn83D1xeRiFvgT35iq/AEcgR0tciuLyMML2lHoj6oAjsuk62ZcaNsdNMUOklbpMNtNPhNAni9hy8brH/VFCZUldGx/5eqy1Thg6T3EI6Ns8oP3cnhaQJojWrFohg4GRhUkjd1JSoezKzrr4ffUH56+/BuKA5VRJg1snqyoT1hBcM/HA6OBvU7CIksIbZgA+4Qx9Qqd3dud5+CC1+EBZd8ge3m6/+ClxfftHiUcMNlxcUUA/NGn/D8wF8Med8rsyace7oF3jSTvDpdh7mN1b7Xbkkjn/yINcB7iHIYD8Jzc2zqXVfGjMYpvcXh/qLgup7xOd3d6A3E96p6Ume1M3Z/fEo+ptYO3atAEwcdq0BA98QaGs3hXa8yOUpVR8on03WZUUlU8QCMuzMvMHnKSDW2uEVNkmPyvU9yktNwJFW+kQkDVLBT/NKxfcTu57+gpnWsM9zbX04q38ECRjPrFFHSf/IoGTVtsNoxatXA53mcp4uiI5aWbsYbjND+IE1F7W2KgaRofupsDBFfSSB4cPArDih+9puHnbJxiL/Bq5t7Xixrpb5H1vTzwrlrWpjmmAKpmop3fBWTk9TyRtWsxlsbbWB+KqF6E3a230TtQ4JlZl7k+03vZlv4HE/9+6R4AhVBh88gfgcfEt4yR/fP3dUmAW5tnQo9i9/jVsiIMbyQbnr93Wwi3zBa36JRn+7KU5ghwkG05y5C7ve/8B3wtsfP/PK7gz1F+E03nz4+5dT5wq+g6a7VASX3v/HWYDcv9SdQA/P46nUox82LHnWwfMVt8c9fu63XRK3mPFzdG+HPMlGpayDmxH/7xMH4UKsivbNe6L4WsT0QnfrPoNOXl1UO421j8dANefG3mrxLdHiwVB5GIXuBF38B/KDR9DOep8iUaSYjrjToimSlsv8Hha+5GSjn/dpq5eRz8PY1c8ZnpdvXR1eHtg9hl07D9JRMWS8MYGq9xbd3cdA8uI66LqKbideExBexJiNLt8i/4ndcfZtaGrYdku5X3ibf3ACYOWGl8KnUuPcIxNuBwkYSeIdZOz50fKx4vm0GzCaF+COXm5Zx4UcnoyDlMMQN9K4qBFuTWx5fI5QXCDxbN1fKoU2F86Um6/Dv5oxFZguW5Nr2Lua0dfLVLr4HwIo0bkqvDhz+3QzvsYcKNG5G6b7GS/9h2vND8Ku7/DbSfDNpyeELntcSGLE8adzl25h63pXmaFTo7EeR7VNx+MweM7dhX4G6YYE7KD2LkQpfBwYxYy4reOEwwDy8Y7+rGjRAkI1ULkGHTcYUEFDTBhDGKZIDj4yruHsYAAAA",
        "Evo Saúde": "data:image/webp;base64,UklGRgQGAABXRUJQVlA4IPgFAABwHgCdASp4AHgAPjEYikOiIaERiV0sIAMEsoBLE6sEZPhmV19hcz84DzAP1a6QH65+oD9l/2O94X0XegB+znWSegf5bP7hfB/+337a+1FmqHMAZVVvHECOtVvv07iK0n0z3yH/nH+k9g/+W/2zfVSCbveTVwxq80itQr8Ph+duPfUCn8RwXUxZ0/+QHgYWYN3O79AVF/kQSfpFfyc2bQoD5ZMXybya47HUaMJMNhfrCuYSz2nKQnzpMtiWA7D8SwFijuTOMc81+lMsQUmne8cMlmm3ckbSdhW3qj2wrhC3lwjvxB+Yl7kuX2Zgvn8qMPAEFb/rOhPNq83e8ZAA/v60IABe1aNfpfWYq5+JCk3yq1W5BiMh1UYr2r416MgEz8Q6puBm87noQvt+ufi9iPpls1uhmqVFex5+rip6/zgSaru56dicVmvOGsWcKgXKflK2I/w34XP8lNPdl7Yfv1tk0VvKTZs65fi+Qya+8T09jLDI/XDIQr53zWKXspBokigq9/yezxPAKdNfqcQit+MnnX2BbTg3VqvcYk1rhK67j9sC2nvp056fGXlrpRlcdo7GbAieeEaazQItX8DliPtYc0SG7iIicCSifj1gI7Inbxb+vR7CuAJEQmOnyABo3fKlEIBHCfuRz/lY3c4hCOgjrCTUryCnLCndKhlPtiLqIxXDw/25iybghPYaMcm4jy/192I6cU8Hsym9F1qUdtlzHum98MQ/raqt//oxxs7WIKmEUqeZrGh4PP3EWEFe80qhWMprF2FeXZ/gvXJdXG8zFrvd9wbbt/fLN1j6ISQh76lxBQmqHu7XpKeCMOI0jwbMrngDgQr1WDBeKSWyxC55hNPgqCxA/Z2qxQO0RX9aeL1xQyukM6a2OPDkaOg/H/jf/0xPcK6sb5V+IB+pyWae0y2+oh2ynyJ3Ij3IKA3v7WzJxWyUioxKsb/K7c5LfeId4yFe1APS/1hGkvi8PRV1bQtjjAi7fJf4gC+kTTdH3bmJQxG1Yx5hgeve308y/hpcaBY0sQVK+oOKaM59YTtYUvcHBlPkNssCsf8HnhXCNrTJf93MZW6P9WDvOFNrdsN+hS97LeRyPPeUIdPtbwA/P6TNFTmIqGmypXjAVHpDA1XO2f0l1VuA5WvelmpS3GDNuScNAjRuKUVtM/V7jjee522p3P6vkZmyr4+92EzRPXiZoebaEiJFcj9BbgJJN+e0GGIEF/xwYrpddwLsBv/wIxHOw6r+Bz5udL6rbfyjwctlxIXlz9cn0t+oh7Wx0kE8Fb5Q7yfVn/tScp6mCo3X3y2ff3aAotzJ8nr4iJ2q4nFV7gvFclxLBINHUJZJh08i2Vcrvs8gSYb9Aze/hjZTwbisyqPw4b1doTT2MFrLvpl2lOcwx3+fS2Kwsd/cTEgfgCWBafXK2t/71wU6o/zZR9dLhACC7d2TWeVsxt+aAY+450bVVrL8IBudXIPAGlXTcfEa9IC1haKCS1CmPVjzghLeSMvutg7nuNJHhOOUKYGjfNHParLRVKROqt6IEdWNFEuK7kgi7+WWlCZepYf3uKj/Xpa0CF6Q7LFqqwTCpeF1ZZAkWUohRInVQMYs93z084lsyM3/BawcjilFqwWr2+547Z+d/J9pxrb0EfAiQTe5MCX4scuX3jpvuitNwdmxKe4OGZu1iagKapq9dPEulClUIkhzY2JJz6Z1qdrtcbdeh8KbOSLxM5CA35Ntbsz9BSeclxfb2oH+ZBWP8LJcxxUMS4G0TVz/tjf1KfmTCmIV3cfe/sKPlcVRtx+JLYrcK6DD1+Htzyi9lyBFcjgKdidfjp5I2A42ifq0wa1CEUTWJS2b0srNxonlv3Km/T4XPAXywoyjN8Zl/9n5Usogv8/eSvl7/+1xo9TwJVO7Hq8k9/9+bvIeoP7yBm9+/TbkVnb4V6h7eP6UsBZTnwW9M3kCHoBfdwW/IHS431Aef8bdz7KQ+Z98PbtOsR3f6ALi0sU87DlQX0ivHMlD5XKke9Uf+T4/t1+xDPugzNCdf/AAAAAAAAAA",
        "Inas GDF": "data:image/webp;base64,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",
        "Medsenior": "data:image/webp;base64,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",
        "PM": "data:image/webp;base64,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",
        "Planassiste MPU": "data:image/webp;base64,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",
        "Plenum": "data:image/webp;base64,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",
        "Postal (Correios)": "data:image/webp;base64,UklGRhQPAABXRUJQVlA4IAgPAADQPwCdASp4AHgAPjEUiEKiISEVS26YIAMEsgBpzNj/a+z/Ax4v8RvZjsv9t/pv5g/bflWCxdgP5f8qv7N2svMA/T/++/b13RfMB+znq2f5n1QegB+pPWS/t17AH8w/6Hpc/+L/Y/B5/X/9j/4v+L8Cf7I/9bWO/NXZj/d/x889fxT5t+0/kNtxHod/GPtn9x/JT8zufv4S/3H41/AR+MfyH+w/k/+TnKjAA/GP6T/nfys/xfpQfvHoX9ZP8r7gH8i/nf9t/Lj++/LX+F/wHj6ec/4D8ZvoA/ln9U/1H+C/dD/i/Sh/I/8X/GfuT/sfbL+Zf4P/hf47/B/sp9gn8j/o3+u/v37v/4X///Vv7Lv2q9nX9r0LJj99opq8epo6DRtP8rA1Gl4m+1fKtwZ/RuYaEYKF8R9/rUOZrB83VKO32/S5+CT7qPpzQGT1oYn9eWuN4LdAmFnn7Yu+V3mk9IQlmJ5mW7Vk08OxUp5fsbEdmjPGD5iA1PDUD+/ifNsO+eSgIJnjR7m21pByR9w67WYH0O5sq/R+X4NKaOxYqh+gQIYiP/9z7cQMLJNPG4m30UIFPx58yuQouqNp7MR+iqNdTXvQYrQicM781/Z+LTpDVMl8TuqvRDgH04+XfH+0Gxz7i+zbStCtcO82yZ4xcaVhqREO3EpfB4abeSNafr7xxT6ZGhcKdAAA/v/8xF8BeuQg8V0TOLcAoXJ2YROop3QnzWQKB3OsZjRW+Lu6o/ytOimYa25/wH+Jv7Epx26Coa/VlEqTQuL5Dpnb2Brs6GKuzGohL0mcpJj7aJtrTI5RxsP7SPLze7SUylYIgZ7wkPnOrDPn1khMdy3KwW3MrOGcvfFFoqNjjSQpe04Uo810xIIX+u8oudz/zK380PwjWmpXu8EfwuifmzHw375fM7rD0ltWJ9mts0omPWKe/beDgWgjoNfC78l0ev9OE4JBJbfhPpcS/pAKKT3aeJomhVB8RBwOl+Un6cC7s5v9cCrZcdEWl6bFjfNw9hVgSr7Fc/h5NSP/qOytBpWv/MRNbp5VSgCvnrAfqygFDRZd53IX5/pFR8g7LiZdC7bi2deZIQDRdez8/gAwb54hMIJqZvsGEQG3gs7E4sjC4LU4yhqO7Qv8ME8ICAOI+L2mF9TF7jpbEYe7+LliLnMq0IVsrsK7ZX/pS2mc+5XsA+9kyBCvMPPSS8nCFJz7Egl3Q9YHBnXGPWfIsgNlxetFe/kNOXKljc6P2VRJirU1q52V/+OGwKibiRAcn7wPGYdqDYzSKvwO5pWs8HbPi5HSUzi8HqATeSm6X1HL1TwR6S5akaP6bJ1ojchfMyHszOBoucPQJYk4GWbPpT8BRwYGJE4koxjrzOhPM3yLArXwWwSTtT+/puObxjs+/t+cOTDiXIkwpgQdtjRDobHKsNgCBK9TawdPn5qPSOQLVvD36oQ9/QIYRVLHGZtYGV72HWvdDryCVi+D7qCWxtdLUmQIQkOGMSS6pGY1P8+iHFchk2yC9mnxfPlz92IR5NSZE8O6xRqOMrP7zvAfPfrOVFSXTWXoeyi7LpIOVTL71/of+9jm8PAGBkzY+gf0dGKHVsi/DQONwUB0U3vSL/osE/C0svapJ5YnK3zYkmd5WXi6G24+/ogSsY/ajEV5ctVFyzs/qd1PnPmMi9bZZvFgD04OcbpG4fQtrIbR4VOmjILjED1QVZ7XE7d40I2dyxJCeja3Murg0wPRqEWXdEkCq368STHwfBfrUKljW9o04sMfjpnCWFXE1dBzQMTudnk/Z/kl4jDC5Lozgm4VUrXH+dPCPMEFXSyQgnVXvDNPu2cgEK8YVjoqooBEUsQfMQ2tCP8rVuYVSb0i1kKPRjOgrmIUmzXAxkrKi0L1AZMbQau4wKzKzWG9W5DY0sJW/yMuZkON4+OfOpJjbfeLGS0129Wvw0BIYCAFr9tYPQPA0AwfhZnBfoFma1ShUCMKgFcuxxkZRnVUjethidUtIiB3c6LgvZG+ldODmBsFJXsT9SSdlH0GpDhmZ40QzMt0nHMoTsE41kjEDwoy5reHfftYhlzSicllHrS/TUGj3f1MxQaQTC5TwKiwvGCiI8lOf9cHvwetIJwI/l3NAjOCCUxzbEv/uGO3sQe7q817w1N+X7ml56ERwBIhEcctIUosQ/z+58pyVE3m1TIhqBWp5mU3w2VAGvMYpw3QDC0oFyL2u6n5IPDoH50dLFdlFnHxwG6rSyr1DRcToF+yji/ET1+l8tBztmGg1/PlhUUA1qlOrkyRuoFJWoYGSKiUmXnknqGLhBKV2Z/9fxgSp29djjrcnQ9bF9MKHI0ao1+o80vP177P3pUTaBbEOBKlREtXNcz8//Imr4wlL47q2WusmDCta4qqCR460jk+JRSNxj4Ojf6Y9IyAatk7s4JkjYWb+b91bxv3tzMYf4ow2alVGBAvzgAiOxqlfPX0r6i22nuaF0Vbf479bn0n4vn+CvnDh4fzj36WHkOZ5RZ5UN/5/Lau6f/qCnbBVJxz//lIB03cuZX0GJ4h9DvrfAM0wqZJOfg2yXcRwNO7zZAr7k/ks0DM6cdSb/hE+wobfFxxlB4MJvw7dvXiB5E+RdxBldNyRNqDCO0VolP05CxCVU27GPuYqeFBHlImYLE0h+VwC/xENN///4v6ZGROJBYG+0ZEgv7UcHvaCDBz29kRDF6XGwQifzWwBoYRqBa72FKj2Y+isQiF/Q4Ryq9NWK04E3qt88cKNbY4Gj570KJ5pWn0Dh/RXr6skYAEPkHCapAhVPTlqQT5FcD/5mg+MYuos8kqX/6vcWDbdM3TuuPDPPPWIPHN6TEZLOAPT7kZGPyLAGinqjN71/abeh/PkRuUO0ZiXABSrZgpV0Fw/0s6IpX1S0I77/j2RiSmi9gTh2d5Cp1uh9FvQaaVqIbKia7APBcIA3rHiel6HIhl1FenOujsNKS51RDfuW8H9M535sWVir2Hz5JoPgmr0aAe9B9wrGiK4//qHojdsnXLWZlHTtX8FcZcnje1y+P9QnxDi0YNxWSYsWPLP4ZWsohTvzShD8xSwpBLP9ILY/xyJj6UO3WDsU94NAJ4BbPn6NoeR8gxeD2i/8QXXkG4jiYrUO25/urLXl9mvPI0BvmDSh7RjafAKgIhBTX5VlNR058g78NBimx3HPh4reNxNcp7syyddbGF5EClgJQA/3Ln6k2MBCPHQpEuLMaBAq//9pz/6KrWPnS8Hgz0zdaY+rqNLtZlCxClk92900X2/aSGO+05P/OfeNPNh9ns2uaQ5H2SHznMOtm12O1GEZjSUfqsY2Q0HYui80V/px9Ub0RmlvGcL2I7O0l22fPuhIL+2oaDtAFX0joeIxe+ublgPHz9ZumH1r2N+FgfjC4FePXGffHT8bRf4bcejvsx/zX3kBafOiNO7eXG0k5upOnSjLx645FpD2/fSrw8Wi1ORjkxJwKHO1Ah5B80rrHyipr7+jG4BHJalTERVgO2bmY5z9ovEb8hu9nCZTUCeq4OOuagLyycnchiaTxddrKpJMR1jF4UR6Bzf3+KeZ7tCStuzJ2TAgT+id/TdEUixiwE1CSGf/3wPK5/t27HcErBJcGPDL3h6bUIx3eApb/HSYHrRh7837eEtSS0X/SnvOY2zC91zG6Ao/HNVpctSQ/qvo0ndDwCJ6BJHxsVE6vjASStggPLAQG/mFjEpXlvPCCSEv8dKs5WCvIRd+TBhBviPbgwvDVQddzcYYuCyCt6kazHCxn+gvRGWfFeo9WEUSSlYp1bqf4wDHTpbe9oKmUuPU8V0jQE4EoIPFVpkp53Ld15Mb1SDfwyYHuwgHhcoTrtQO48QlN1q5vNqLnmYRFw0BaKGQnjkLaCHIOuXfP/9sbxJTp9abxxGO7RQxbczvBkHuZmv1Xyo6jxJ+6uwyi/Wm0WDah2Njbb33sazZ4zbREmrX/q8oZqQBsIz2McD2NrpI0HKjKC6yHK+FlLP8H4NpUQK+xtYxZ33CHaRkDOn6vbfVUrgbhqKLebQqI+Z0nPLNp9CGoV23bKNyMRjJxo5jA1UlfxAbkGpZ92NHpixLF1/8n+yMwHD9lsg+8gQMPxIv2CHXZKNayjj/8QcfVHNoqsjpHVqTCWFoDPB/2E58vxrWucIaax/AbGL7GqsdJpsIe8JFf1OVrMb/c174fYO1wrKQnNK+qSvU/cpuPgEefgV/Iw6s7ouOuId1Evm0IL/ipmQiwJZ53c/y9Lonemu3xZKfD8Jeif/8HUBv+jLFsDAII5S8lYzuPBvipNGgPoxQGs5ADxcG12JTuUbWhaM6iewOKcN8NJhdloS3/xVNADL6XuGPcDfHQcQT66pTkVLJClVRShjAR/ILxRAj6q4LWhHt/owTLvKq9vt8uFOtaarngJSOvHpvaC41zp0rWV/B6RQsPV9BWX4DDtMQJ4oksFEKzbkyPl3xkMLK3asZQiFWkOztTxirzhyTRMqiS0iirBw16AfxGVq5NBX9mQn0pnSlWQEo5BGJ50sD8W4QX+5QQymyeZ0/hNgurjI8T9/nnkazgh/7oNcr5QZG7vpjeFx8JdxJ7v5e+eEnsSv9W7aHZCdDkt1v2N1nvHVG8AlyhEJJdhoud1/yIbkcrfDcErE/poSv8IHQqCCYN0WkxhuexJVjxjbl/yv0xX/c1WXXrlv0b7VXUtLKikbRc8E49oCQ5j9R2ytI27PUGg/8wgJXCjxHYFKKiYWY7qM5BVHFxgHaHMjmxE8Rcuqef4CAtNK6t6BspKJcKlyJwXn5f8EUqOKpssO5E9fiZBt3Wx5x0dX75iPMGaev38aHVz0mQ8x10Q86kJhsaRHcfS34qRZT2y6q5VUxxmrnVfnNEsoNhY0NB6b5dabJrqfssVedWv349eL/W7Tai1l9kE7a1XgPsNnk6Yqo2ZRlRQ+YEpB77CGsR6Et54UPKUeC++557SrqMIZ1RSsLmMse/0vx7DWaCO8lxGZyCP8AGsDWh2iB/neAwdhzB5v4ue4ouSapbWyexsgnS/X3EtVYtwuJWzUdPYBwnCrU50YB15JNv8C0QDpIYc5E33fRqANw27M33Z5XTz7ms/QvgTmI4IGsAhEAkk58IW8LuqyqwAzYs/KEHRJeidAX8gAAAAAA==",
        "Proasa": "data:image/webp;base64,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",
        "STJ": "data:image/webp;base64,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",
        "STM": "data:image/webp;base64,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",
        "Sul America": "data:image/webp;base64,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",
        "TJDF": "data:image/webp;base64,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",
        "TRE": "data:image/webp;base64,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",
        "TRF": "data:image/webp;base64,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",
        "TRT": "data:image/webp;base64,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",
        "TST": "data:image/webp;base64,UklGRnQIAABXRUJQVlA4IGgIAAAQKwCdASp4AHgAPjEWikOiISESiZ0IIAMEoG+BxqNg9v84utv2n8QdAKZ71T9rfzf3gdsLzB/07/2n8+62XmA/kn+U9U//C/4r2KegB/eP856wH+89l70EfLE/bn4O/3G/6H/F9or//3XTpn/Vns7lGvzn5S+blurv7twcXEv6P/mvtm50PmA84z1E8DqgB/Jv6V/pv6r6/X+r5evzT/Kf9P3Dv5X/Uv+f/bu1N6KX7EMNRJStZpuz3/FDO/QTxF/AC0wYM1pvfFEnvqYbH9ifC96DI62RFlral/O36e4l72aCMackDc4ObH0acefSdglBWg25f1n9Wjy08sh4iyK08N4GHSVn0dhm564FV2FLLkNnN4ZbMDHtO6CsKE0zcYsWgUoi1j9yQ0/naA+FZZRDiKlboaGp7Or8AMlO9ddl6xWNFT07lUaiKKR+Hli67z6LwlDSwYM7Fdn3WhZy+dEVwAD+/rex+TeLDsB9jzh7DnMIqoWEKrrOw+DRGa6WsNpK25iBk3oTPnsDCbAUUfNZqzPo20/+g26vin+fadrXfkIKjdmTaIxcO1R4uHqTP+y3yKSGduP3fmfmxv4pQh3JMJJIpf2hjQnEL6mizuCIPUNI7QEjUauaDqrtt+Uo8/T+rlP08Q//46Oi878l+uclJO0IGrp5D7zAw3GwSnboRc9C7VgtsUyhrINVeBZNcggTFl9/j73oJBJ4NB9iWE7UFlEU45315BCOMxaVwmquXWiKfvE3JdBA4canxfaVYKoTXQjxcGcdPx8ki4zyIbsFWhWjUFMdLm5BKJ+OYUpTeebevsF8qVeiXszx9soNq21lsfcNG/YvUh41OzUYNEM5ntVxqjCRaekYvb9bbIRy5Vz7mkPfyfKtT8AbkZkg+RdpPHYhXCxgYbn0oO/+MXgKt4i9M93SFwxcx0gryViEvKpyzTDbpHe7T5Uw6D6f1Hfg9TdSj3oGdsupez6halbT//HQ26P+mgnp6T3pXy5A8DRt/Vvw3NWGCHDC1pU0qcMKjQUWkLJHvFP2nMeomdKJyRZq4R7Ftx+6Fa5ZaOStktF+WAkL79EJf3fg4RiYJ18TBaRf2Bume/cG5j0O7/DwgoX7lANxCNCeSfKj76X3Kh2AuYrHXyuvVstq74hcJQfztxDvldCvxsc5iuee0wvuIJ4gVz+MlE75q1A2Ai8RMEXEZhf/LJr1gBpRq6/cSy1KM8WIN4s0uCr/eyd9XV45IrR7Khjj85x5cEJjwzy14hoAh1cmm8k7XuLe6ZAbPrqrXAzLBEhLvSKBO9b67FIwdpB7Qo2M+VcghOxUo8tjjZHXgEUfOZNbIJza/+1/9hKBV0N6xXD74ALAkWx+/7HzV5/TXzvBpt06ojlJ5hZdbfa/8PYoTwHCuf7YeoR4n55lsdq0xv4gGa8EAkmJTxYlXWpGmdqsdFwfuqpPOeJ6TZr6p4Xbrrw8JLUHJRo98obR0C0XzqFxn2xuMnGWYY8LjbSG7Luvjw3k/yDPcKsAg/lrZADLZ7ncCe2QZKts9DDP4uE+4q6jXMU12lxbSCagJ/yNlm0QmfESgunmMxRd2avTMRiuf1l5eyEm4fjRO8HZZ4Sum0FqnCuQqT6TDFqxIOKvfoIwwtaXyY7YbIFQQInhGVOPtpzUka0msbnmOVIOH3CL8o2YiR8feHzvDK2425mM4azwB+53olWREw1mMMbOOYTTCj4o+CDI0UNz2IW8POB6jvHJz+1sgGiPV4NtC544Dx5ivsaux3UQhHfNc4p7YC7wBWQqf5CudL/NfJLip+FFxKLR6Wg3bJDVcmc1WP5nYyK/jF0dXs9n4Sx3wOUXQUBUpKQSESTzLQyBBS6eY6krn5ft/pg2JS8PESCY4waPzvzXhQdSlTve0/YJLkQ6X1djcNR1fyr9Iq0McjlagxqlLVvyZOKGIXLJFw3LMKVl8r5C8USo3SOt/sUjYQI51wcuHUBXNuim9kTcbPItUf4YKPGFAM+ve0Y7ps/5cecbaUC5QL5LMgvEZWezbKNYxEBJ08qjlqN6QsfcJzsROw3P+lF8grwh849yV0KxW67m+Ha+xRMTtU3xMCFpKZgcmcI3Wej+22q2LtI1iTrxlxryZQ1Lbs0PVJr94W0/Voq3IUPFXH+3j+Ts9KCVlSK9V+lAgAE8ygu/OoI/+3gDs5jXaa+wDr+j/kyBhJ/yS693NTDebqoR6ATjTHO2tuA2WBm4UhXYVzlD2NpHiN+w4LhceYJ71Ms1dljFbjhLkd0j76lO+IBzXwRQy2MpR0WZH1od5ByhOr17d7+DAwHXG3lhuNfD2bWiHI5UdNnZFEiv0LqG3M/n4/eK785mx+04UI2G8HXpNBqhcet21H9Mxd7Deugzp6e67ZdJEt7IknXd7bWtHtu81AGv0ngo7AzVqoE4gHblYueBCuJ0gwDwlm9glc7tLcBBfaM7QFcH+sb7vzhwBUv/CLsRgBQYHcbB0cyM9CRo3FgmNI7q5wg+vBfC10/DwEQ6zIhZ/7pTRPpOWG8vJJNib7z6lfm+pTg7gYicUqLAEIN7VcuymEPuOQGECOz6v1DmXvEaZWt53nW+ZKVIQKUP30qhA0tmlb6IwNyusRl/vVzKfM8o5eKIlK3ks6BWpyyt9GRSIPD13Nw1stI3chY8smNu2tx8iz1tV5T/D8a06byndPvupYURljm4OoyAFnQYb7ZXS5iPV9ntZiosz5r5QsgSmsaHNXvTWjjFkP6i3VymCc8CGOoh5o2ADXag0E3t97YyjzZ7s5WG/qKx+Han8GabgK4zWcs/nuKv987X3juZ1gRtqPkiekrQBOyjNoGTRM2L4EWF5ZIEM/nPwUriQAhdD5ZfWf3iEvHoUAAA",
        "Unimed Seguros": "data:image/webp;base64,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",
        "Unity Saúde": "data:image/webp;base64,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"
    };

    // Monta o quadradinho do convênio: logo quando existir, senão o ícone
    const marcaHtml = (rotulo, icone, cor, tam) => {
        const logo = LOGOS[rotulo];
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

    // ── CARDS DOS CONVÊNIOS (ordem alfabética, nomes de exibição) ─
    // Medsenior e Unimed Seguros usam o mesmo autorizador; PM e STJ também.
    const EXIBICAO = [
        { rotulo: "Affego",            chave: "AFFEGO",           icone: "🛠️", cor: "#378ADD", desc: "Automação para Fisco e Convênios Affego" },
        { rotulo: "Amil",              chave: "AMIL",             icone: "🩺", cor: "#2ecc71", desc: "Automação para Rede Credenciada Amil" },
        { rotulo: "Assedf/Vida Card",  chave: "ASSEDF",           icone: "💳", cor: "#1b3a6b", desc: "Automação para Convênios ASSEDF / Vida Card" },
        { rotulo: "Assefaz",           chave: "ASSEFAZ",          icone: "🏛️", cor: "#1a4f8a", desc: "Automação para Convênios Assefaz" },
        { rotulo: "BRB Saúde",         chave: "ASSEFAZ",          icone: "🏦", cor: "#2b6cb0", desc: "Automação para Convênios BRB Saúde" },
        { rotulo: "Câmara dos Deputados", chave: "CAMARA",        icone: "🏛️", cor: "#1e7a3c", desc: "Automação para Câmara dos Deputados" },
        { rotulo: "Camed Saúde",       chave: "PM/STJ",           icone: "👨‍👩‍👦", cor: "#3d6f9e", desc: "Automação para Convênios Camed Saúde" },
        { rotulo: "CNU Unimed",        chave: "CNU UNIMED",       icone: "🧬", cor: "#00995d", desc: "Automação para Autorizações CNU Unimed" },
        { rotulo: "Evo Saúde",         chave: "ASSEFAZ",          icone: "🌸", cor: "#e08b8b", desc: "Automação para Convênios Evo Saúde" },
        { rotulo: "Fascal",            chave: "ASSEFAZ",          icone: "🔷", cor: "#d4a017", desc: "Automação para Convênios Fascal" },
        { rotulo: "GEAP",              chave: "MEDSENIOR/UN SEG", icone: "🔴", cor: "#c0202a", desc: "Automação para Convênios GEAP Saúde" },
        { rotulo: "Inas GDF",          chave: "INAS",             icone: "🤝", cor: "#d9a520", desc: "Automação para Convênios Inas GDF" },
        { rotulo: "Medsenior",         chave: "MEDSENIOR/UN SEG", icone: "🏥", cor: "#27ae60", desc: "Automação para Convênio Medsenior" },
        { rotulo: "PF Saúde",          chave: "ASSEFAZ",          icone: "🚔", cor: "#3aa0d1", desc: "Automação para Convênios PF Saúde" },
        { rotulo: "Planassiste MPU",   chave: "PLANASSISTE MPU",  icone: "📝", cor: "#2d7dff", desc: "Automação para Planilhas do MPU" },
        { rotulo: "Plenum",            chave: "PLENUM",           icone: "⚖️", cor: "#8e44ad", desc: "Automação para Convênios de Advocacia e Justiça" },
        { rotulo: "PM",                chave: "PM/STJ",           icone: "🛡️", cor: "#5dade2", desc: "Automação para Polícia Militar" },
        { rotulo: "Postal (Correios)", chave: "POSTAL",           icone: "✉️", cor: "#d4ac0d", desc: "Automação para Logística Postal" },
        { rotulo: "Proasa",            chave: "CNU UNIMED",       icone: "🧪", cor: "#2e86c1", desc: "Automação para Autorizações Proasa" },
        { rotulo: "Serpro",            chave: "ASSEFAZ",          icone: "💻", cor: "#1f3fa8", desc: "Automação para Convênios Serpro" },
        { rotulo: "STJ",               chave: "PM/STJ",           icone: "🏛️", cor: "#4a90d9", desc: "Automação para Superior Tribunal de Justiça" },
        { rotulo: "STM",               chave: "ASSEFAZ",          icone: "⚖️", cor: "#8b1a1a", desc: "Automação para Convênio STM (Plas/JMU)" },
        { rotulo: "Sul America",       chave: "SULAMERICA",       icone: "🌎", cor: "#e74c3c", desc: "Automação para Convênios SulAmérica" },
        { rotulo: "TJDF",              chave: "TJDF",             icone: "🏛️", cor: "#e67e22", desc: "Automação para Tribunal de Justiça do DF" },
        { rotulo: "TRE",               chave: "TRE",              icone: "🗳️", cor: "#7f9fc4", desc: "Automação para Tribunal Regional Eleitoral" },
        { rotulo: "TRF",               chave: "TRF",              icone: "📖", cor: "#1d9e75", desc: "Automação para Tribunal Regional Federal" },
        { rotulo: "TRT",               chave: "TRT",              icone: "🤝", cor: "#e67e22", desc: "Automação para Tribunal Regional do Trabalho" },
        { rotulo: "TST",               chave: "TST",              icone: "🔨", cor: "#e24b4a", desc: "Automação para Tribunal Superior do Trabalho" },
        { rotulo: "Unimed Seguros",    chave: "MEDSENIOR/UN SEG", icone: "💚", cor: "#16a085", desc: "Automação para Convênio Unimed Seguros" },
        { rotulo: "Unity Saúde",      chave: "ASSEFAZ",          icone: "🩶", cor: "#31445f", desc: "Automação para Convênios Unity Saúde" }
    ];
    // Deixa o texto pronto para comparar: sem acento e em minúsculas, para
    // "Unity Saúde" ser encontrado digitando "unity saude".
    const semAcento = t => (t || '')
        .toString()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase();

    const container = document.getElementById('cr-lista');
    for (const item of EXIBICAO) {
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
        card.onclick = () => abrirJanelaCodigos(item);
        // guarda o nome sem acento e em minúsculas, para a pesquisa achar
        // "unity" digitando "unity" ou "Unity", e "saude" digitando "saúde"
        card.dataset.busca = semAcento(rotulo + ' ' + desc);
        container.appendChild(card);
    }

    // ── PESQUISA DE CONVÊNIO ──────────────────────────────────────
    // Filtra os cards conforme a pessoa digita. Apagando tudo, todos voltam.
    (function () {
        const campo = document.getElementById('cr-busca');
        const limpar = document.getElementById('cr-busca-limpar');
        const vazio = document.getElementById('cr-vazio');
        if (!campo) return;

        const filtrar = () => {
            const termo = semAcento(campo.value.trim());
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
            // Enter abre o convênio quando sobrou só um na lista
            if (e.key === 'Enter') {
                const visiveis = [...container.querySelectorAll('.cr-card')].filter(c => c.style.display !== 'none');
                if (visiveis.length === 1) visiveis[0].click();
            }
        });
        limpar.onclick = () => { campo.value = ''; filtrar(); campo.focus(); };
    })();
})();
