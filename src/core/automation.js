/* ============================================================
 *  MOTOR CENTRAL DE AUTOMAÇÃO
 *
 *  É aqui que a Central escolhe COMO entregar os códigos ao robô e
 *  fica olhando o portal para saber como está indo. Os robôs em si
 *  não moram aqui — eles estão em src/convenios/, um por arquivo.
 *
 *  AS QUATRO FORMAS DE UM ROBÔ RODAR (isto é intencional, cada
 *  portal exige uma — não unifique):
 *
 *    padrão   → o robô roda na própria página do portal.
 *    moldura  → o portal é exibido dentro do painel do app. Usada
 *               quando a tela do portal RECARREGA a cada item
 *               (TRF, Postal, Câmara) — senão o robô morreria junto.
 *    janela   → o app abre a tela de autorização e preenche nela
 *               (CNU Unimed / Proasa).
 *    agente   → o robô coloca um ajudante DENTRO da janela do
 *               portal, com botão próprio (só o ASSEDF; o agente
 *               vive dentro do próprio robô).
 *
 *  O que é cópia fiel do central.js v2.1.0: os ajudantes da janela
 *  do Unimed, o executarRobo, a moldura e o reconhecedor de painel.
 *  O que é novo: progresso, fila, retomada, histórico e erro útil —
 *  tudo POR FORA, só observando. Nenhuma dessas novidades muda o
 *  que o robô recebe nem quando ele é chamado.
 * ============================================================ */
(function (CR) {
    "use strict";

    var U = CR.utils;


    /* ═══════════════════════════════════════════════════════════
     *  CNU UNIMED — a tela de autorização abre numa janela separada
     *  sem barra de favoritos, então o app não pode ser aberto nela.
     *  Solução: o app fica nesta aba e pilota aquela janela de fora.
     *  (cópia fiel do central.js v2.1.0)
     * ═══════════════════════════════════════════════════════════ */
    let janelaUnimed = null;
    // ═══════════════════════════════════════════════════════════════
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


    /* ── Tira o painel do robô da frente sem desligá-lo ───────── */
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


    /* ── PONTE: entrega os códigos colados para o robô escolhido ─ */
    const executarRobo = (nome, texto) => {
        const info = CR.infoRobos[nome] || { modo: "prompt" };
        const func = CR.robos[nome];
        if (!func) { alert("Robô não encontrado: " + nome); return; }

        if (info.modo === "prompt") {
            const promptOriginal = window.prompt;
            const openOriginal = window.open;
            window.prompt = () => texto;
            const nossoOpen = function () {
                const w = openOriginal.apply(window, arguments);
                if (w) CR.estado.janelasRobo.push(w);
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
                if (janelaCapturada) CR.estado.janelasRobo.push(janelaCapturada);
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
            CR.estado.vigias.push(espera);
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
        CR.estado.vigias.push(espera);
    };

    /* ═══════════════════════════════════════════════════════════
     *  MODO ESPELHO — coloca o portal dentro de uma moldura na
     *  própria página e o robô pilota daqui.
     * ═══════════════════════════════════════════════════════════ */
    let espelho = null;

    const abrirEspelho = () => {
        if (espelho) return espelho.iframe;
        const url = window.location.href;
        const escondidos = [];
        Array.from(document.body.children).forEach(el => {
            if (el !== CR.ui.menu) {
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


    /* ── Só é painel do robô o que o próprio robô criou ────────── */
    const ehPainelDoRobo = (el, nome) => {
        try {
            const inf = CR.infoRobos[nome] || {};
            // Alguns robôs mostram a contagem no painel deles — deixamos à vista
            if (inf.mostrarPainel) return false;
            const ids = [inf.txt, inf.btn, CR.statusRobo[nome], CR.contadorRobo[nome]].filter(Boolean);
            for (const id of ids) {
                if (el.id === id) return true;
                if (el.querySelector && el.querySelector('[id="' + id + '"]')) return true;
            }
        } catch (e) { }
        return false;
    };

    /* ═══════════════════════════════════════════════════════════
     *  LEITURA DA TELA DO PORTAL (só leitura, nunca escreve)
     *
     *  É o que permite mostrar progresso de verdade e, principalmente,
     *  saber QUAIS códigos já entraram — que é a base do "continuar
     *  de onde parou". Em vários portais (PM, MedSenior, TJ, Unimed
     *  Seguros) o código fica DENTRO de um campo e não aparece no
     *  texto da página; por isso lemos também o conteúdo dos campos.
     * ═══════════════════════════════════════════════════════════ */
    const textoDaTela = (raiz, ignorar) => {
        let t = '';
        try {
            const corpo = raiz && raiz.body ? raiz.body : null;
            if (!corpo) return '';
            Array.from(corpo.children).forEach(el => {
                if (ignorar && ignorar.indexOf(el) !== -1) return;
                t += ' ' + (el.innerText || el.textContent || '');
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

    /* Quais códigos do lote já estão visíveis na tela. */
    const codigosNaTela = (lote, raiz, ignorar) => {
        const pag = textoDaTela(raiz, ignorar);
        const achados = [];
        for (let i = 0; i < lote.length; i++) {
            if (pag.indexOf(lote[i]) !== -1) achados.push(lote[i]);
        }
        return achados;
    };

    /* ═══════════════════════════════════════════════════════════
     *  ACOMPANHAMENTO (progresso, fila e histórico)
     *  Tudo aqui é observação. Se qualquer coisa falhar, a automação
     *  segue: por isso as chamadas passam por U.seguro().
     * ═══════════════════════════════════════════════════════════ */
    const acompanhar = {

        comecar(convenio, texto) {
            const fila = CR.fila.criar(convenio, texto);
            CR.estado.fila = fila;
            CR.estado.inicioEm = Date.now();
            CR.estado.erros = 0;
            CR.fila.guardar(fila);
            const r = U.resumoFila(fila.itens);
            CR.log.info('Automação iniciada · ' + convenio);
            CR.log.info(r.lancamentos + ' lançamentos · ' + r.unicos + ' códigos únicos');
            U.seguro(() => CR.ui.progresso({
                convenio, feitos: 0, total: fila.itens.length,
                erros: 0, codigoAtual: fila.itens.length ? fila.itens[0].cod : '', rodando: true
            }), 'progresso');
            return fila;
        },

        /* Recebe os códigos vistos na tela e atualiza tudo. */
        viu(vistos) {
            const fila = CR.estado.fila;
            if (!fila) return 0;
            CR.fila.marcarPeloPortal(fila, vistos);
            const c = CR.fila.contagem(fila);
            const pendentes = CR.fila.pendentes(fila);
            U.seguro(() => CR.ui.progresso({
                convenio: fila.convenio,
                feitos: c.feitos, total: c.total, erros: c.erros,
                codigoAtual: pendentes.length ? pendentes[0].cod : '',
                rodando: CR.estado.rodando
            }), 'progresso');
            /* guarda de vez em quando, para sobreviver a um F5 */
            if (Date.now() - (CR.estado.ultimoSalvo || 0) > 2500) {
                CR.estado.ultimoSalvo = Date.now();
                U.seguro(() => CR.fila.guardar(fila), 'fila');
            }
            return c.feitos;
        },

        terminar(situacao, mensagem) {
            const fila = CR.estado.fila;
            if (!fila) return;
            const c = CR.fila.contagem(fila);

            /* Se sobrou código, isto NÃO é uma automação concluída — por mais
               que o robô tenha dito que terminou. Chamar de concluída faz o
               atendente fechar a guia achando que está tudo lá dentro. */
            if (situacao === 'concluida' && c.pendentes > 0) {
                situacao = 'interrompida';
                const faltam = CR.fila.pendentes(fila).map(i => i.cod);
                mensagem = 'Terminou faltando ' + faltam.length + ' de ' + c.total +
                    ': ' + faltam.join(', ');
            }
            const duracao = Date.now() - (CR.estado.inicioEm || Date.now());
            U.seguro(() => CR.historico.registrar({
                convenio: fila.convenio, total: c.total, feitos: c.feitos,
                erros: c.erros, duracao, situacao, mensagem
            }), 'historico');
            CR.log[situacao === 'concluida' ? 'ok' : 'aviso'](
                'Automação ' + situacao + ' · ' + c.feitos + '/' + c.total +
                ' · ' + U.formatarDuracao(duracao));
            /* terminou tudo: não há o que retomar */
            if (c.pendentes === 0) U.seguro(() => CR.fila.descartar(fila.convenio), 'fila');
            else U.seguro(() => CR.fila.guardar(fila), 'fila');
            U.seguro(() => CR.ui.progresso({
                convenio: fila.convenio, feitos: c.feitos, total: c.total,
                erros: c.erros, codigoAtual: '', rodando: false
            }), 'progresso');
        }
    };

    /* ═══════════════════════════════════════════════════════════
     *  CAMINHO PADRÃO — robôs que rodam na própria página do portal
     *  (a estrutura da vigia é a mesma da v2.1.0; o que entrou de
     *   novo foi o acompanhamento por fora)
     * ═══════════════════════════════════════════════════════════ */
    const iniciarPadrao = (nome, texto) => {
        const antes = Array.from(document.body.children);

        /* Lista de códigos deste lote, na ordem colada. */
        const doLote = U.codigosUnicos(texto);
        const semContagem = !!(CR.infoRobos[nome] || {}).semContagem;
        const total = semContagem ? 0 : doLote.length;

        const encerrar = (msg, cor, situacao) => {
            CR.estado.rodando = false;
            limparVigias();
            CR.motor.encerrarModoAutomacao();
            CR.ui.modoIniciar();
            CR.ui.status(msg, cor || '#2ecc71');
            U.seguro(() => acompanhar.terminar(situacao || 'concluida', msg), 'fim');
        };

        executarRobo(nome, texto);

        let ciclos = 0, feitos = 0, iguais = 0;
        const idStatus = CR.statusRobo[nome];
        const idContador = CR.contadorRobo[nome];

        const vigia = setInterval(() => {
            if (!CR.estado.rodando) { clearInterval(vigia); return; }

            /* Esconde APENAS o painel do próprio robô. Esconder qualquer
               coisa nova quebrava o ASSEFAZ (o portal cria a lista de
               sugestões no corpo da página). */
            Array.from(document.body.children).forEach(el => {
                if (el === CR.ui.menu || el.id === 'cr-espelho') return;
                if (antes.indexOf(el) !== -1 || CR.estado.elementosRobo.indexOf(el) !== -1) return;
                if (!ehPainelDoRobo(el, nome)) return;
                CR.estado.elementosRobo.push(el);
                esconderElemento(el);
            });

            /* Conta quantos códigos do lote já aparecem na tela do portal */
            if (total && ciclos % 2 === 0) {
                const vistos = codigosNaTela(doLote, document, [CR.ui.menu].concat(CR.estado.elementosRobo));
                const agora = vistos.length;
                if (agora === feitos) { iguais++; } else { feitos = agora; iguais = 0; }
                U.seguro(() => acompanhar.viu(vistos), 'acompanhar');
            }
            const contagem = total ? ('📋 ' + feitos + '/' + total + ' códigos lançados no portal') : '';

            const contagemAgora = () => {
                if (!total) return '';
                const vistos = codigosNaTela(doLote, document, [CR.ui.menu].concat(CR.estado.elementosRobo));
                feitos = vistos.length;
                U.seguro(() => acompanhar.viu(vistos), 'acompanhar');
                return '📋 ' + feitos + '/' + total + ' códigos lançados no portal';
            };

            /* 1) O robô avisou alguma coisa? Para estes robôs, isso é o fim. */
            if (CR.estado.ultimoAviso) {
                const fimBom = /✅|conclu|finaliz|fim|sucesso/i.test(CR.estado.ultimoAviso);
                clearInterval(vigia);
                const cFinal = contagemAgora();
                encerrar((fimBom ? '✅ ' : '⚠️ ') + CR.estado.ultimoAviso + (cFinal ? '\n' + cFinal : ''),
                    fimBom ? '#2ecc71' : '#ffd633', fimBom ? 'concluida' : 'erro');
                return;
            }

            /* 2) Robô com painel próprio: espelha o texto dele */
            if (idStatus) {
                const alvo = document.getElementById(idStatus);
                if (alvo) {
                    let txt = (alvo.innerText || '').trim();
                    const cEl = idContador ? document.getElementById(idContador) : null;
                    const cTxt = cEl ? (cEl.innerText || '').trim() : '';
                    if (txt) {
                        CR.ui.status(txt + (cTxt ? '  (' + cTxt + ')' : '') + (contagem ? '\n' + contagem : ''), '#4dc3ff');
                        if (/✅|conclu|finaliz|FIM/i.test(txt)) {
                            clearInterval(vigia);
                            const cF = contagemAgora();
                            encerrar(txt + (cF ? '\n' + cF : ''), '#2ecc71', 'concluida');
                            return;
                        }
                    }
                }
            } else {
                /* 3) Robô sem painel: mostramos a contagem que calculamos */
                if (ciclos >= 2) {
                    CR.ui.status('⏳ Automação em andamento no portal...' + (contagem ? '\n' + contagem : ''), '#4dc3ff');
                }
                if (total && feitos >= total && iguais >= 4) {
                    clearInterval(vigia);
                    encerrar('✅ Automação concluída!\n' + contagemAgora(), '#2ecc71', 'concluida');
                    return;
                }
            }

            if (++ciclos > 7200) clearInterval(vigia);
        }, 400);
        CR.estado.vigias.push(vigia);
    };

    /* ═══════════════════════════════════════════════════════════
     *  CAMINHO MOLDURA — portal embutido, robô pilota daqui
     * ═══════════════════════════════════════════════════════════ */
    const rodarInline = (nome, texto) => {
        CR.ui.status('⏳ Preparando o portal...', '#4dc3ff');
        const iframe = abrirEspelho();
        let tentativas = 0;
        const doLote = U.codigosUnicos(texto);

        /* contador por fora, lendo a moldura (novidade da V2) */
        const contador = setInterval(() => {
            if (!CR.estado.rodando || !espelho) { clearInterval(contador); return; }
            U.seguro(() => {
                const d = espelho.iframe.contentWindow.document;
                acompanhar.viu(codigosNaTela(doLote, d));
            }, 'contagem-moldura');
        }, 1200);
        CR.estado.vigias.push(contador);

        const ctx = {
            doc: () => espelho.iframe.contentWindow.document,
            win: () => espelho.iframe.contentWindow,
            status: t => CR.ui.status(t, '#4dc3ff'),
            ativo: () => CR.estado.rodando && !!espelho,
            timer: t => CR.estado.vigias.push(t),
            fim: () => {
                CR.estado.rodando = false;
                limparVigias();
                CR.motor.encerrarModoAutomacao();
                CR.ui.modoIniciar();
                CR.ui.status('✅ Automação concluída! O portal continua aqui na tela.', '#2ecc71');
                U.seguro(() => acompanhar.terminar('concluida', 'Automação concluída (moldura)'), 'fim');
            }
        };

        const espera = setInterval(() => {
            if (!CR.estado.rodando) { clearInterval(espera); return; }
            tentativas++;
            let pronto = false;
            try {
                const d = iframe.contentWindow.document;
                pronto = !!(d && d.body && d.readyState === 'complete' && d.body.innerHTML.length > 200);
            } catch (e) { pronto = false; }

            if (pronto) {
                /* ── TRAVA DE SEGURANÇA DA MOLDURA ─────────────────────
                   A moldura BUSCA a página de novo. Em portal cuja tela
                   atual é resultado de um envio de formulário (o TST é
                   assim), essa nova busca devolve a TELA INICIAL do
                   convênio — e o atendente vê a tela dele sumir sem
                   entender por quê.

                   Antes de soltar o robô, conferimos se os campos que
                   ele espera estão na tela recarregada. Se não estiverem,
                   desistimos da moldura, devolvemos a página exatamente
                   como estava e explicamos o que houve. */
                const ficha = CR.fichas[nome] || {};
                const esperados = (ficha.portal && ficha.portal.seletores) || [];
                if (esperados.length) {
                    let achou = false;
                    try {
                        const d = iframe.contentWindow.document;
                        for (let k = 0; k < esperados.length; k++) {
                            if (d.querySelector(esperados[k])) { achou = true; break; }
                        }
                    } catch (e) { achou = true; }   // não deu para olhar: não acuso à toa

                    /* margem: o portal pode ainda estar desenhando */
                    if (!achou && tentativas < 60) return;

                    if (!achou) {
                        clearInterval(espera);
                        fecharEspelho();
                        CR.estado.rodando = false;
                        limparVigias();
                        CR.motor.encerrarModoAutomacao();
                        CR.ui.modoIniciar();
                        CR.log.aviso(nome + ': moldura descartada — a tela recarregada não tem ' +
                            'os campos que o robô espera (' + esperados.join(', ') + ')');
                        CR.ui.erroDetalhado({
                            convenio: nome,
                            problema: 'A moldura recarregou o portal e caiu numa tela diferente: ' +
                                'os campos que o robô precisa não estão nela.',
                            causa: 'Neste portal a tela em que você estava é resultado de um envio ' +
                                'de formulário. Pedir o endereço de novo devolve a tela inicial. ' +
                                'Sua página foi devolvida exatamente como estava — nada foi perdido.'
                        });
                        return;
                    }
                }

                clearInterval(espera);
                U.seguro(() => CR.motor.manterAcordada(iframe), 'moldura-acordada');
                CR.ui.status('▶ Iniciando automação...', '#4dc3ff');
                try {
                    CR.roboMoldura[nome](texto, ctx);
                } catch (e) {
                    CR.ui.erroDetalhado({ convenio: nome, problema: e.message });
                    ctx.fim();
                }
                return;
            }

            if (tentativas > 50) {
                /* Portal não aceitou ser embutido: volta para o método antigo */
                clearInterval(espera);
                fecharEspelho();
                CR.ui.status('⚠️ Este portal não permitiu o modo embutido. Abrindo pelo método antigo...', '#ffd633');
                CR.log.aviso(nome + ': moldura recusada pelo portal, caindo para o modo padrão');
                iniciarPadrao(nome, texto);
            }
        }, 400);
        CR.estado.vigias.push(espera);
    };

    /* ═══════════════════════════════════════════════════════════
     *  CAMINHO JANELA — o app abre a tela de autorização e pilota nela
     *
     *  Por que ABRIR em vez de procurar: se a janela nasceu a partir
     *  de OUTRA aba, o navegador não deixa esta aba enxergá-la de
     *  jeito nenhum. Abrindo aqui, a janela é nossa desde o começo.
     * ═══════════════════════════════════════════════════════════ */
    const rodarJanela = (nome, texto) => {
        jaProcureiPorNome = false;
        const doLote = U.codigosUnicos(texto);

        const comecar = alvo => {
            janelaUnimed = alvo;
            U.seguro(() => CR.motor.manterAcordada(janelaUnimed), 'janela-acordada');

            const contador = setInterval(() => {
                if (!CR.estado.rodando || !janelaUnimed || janelaUnimed.closed) { clearInterval(contador); return; }
                U.seguro(() => acompanhar.viu(codigosNaTela(doLote, janelaUnimed.document)), 'contagem-janela');
            }, 1200);
            CR.estado.vigias.push(contador);

            const ctx = {
                doc: () => janelaUnimed.document,
                win: () => janelaUnimed,
                status: t => CR.ui.status(t, '#4dc3ff'),
                ativo: () => CR.estado.rodando && janelaUnimed && !janelaUnimed.closed,
                timer: t => CR.estado.vigias.push(t),
                fim: () => {
                    CR.estado.rodando = false;
                    limparVigias();
                    CR.motor.encerrarModoAutomacao();
                    CR.ui.modoIniciar();
                    U.seguro(() => acompanhar.terminar('concluida', 'Automação concluída (janela)'), 'fim');
                }
            };
            CR.ui.status('✅ Janela pronta. Começando...', '#2ecc71');
            try { CR.roboJanela[nome](texto, ctx); }
            catch (e) { CR.ui.erroDetalhado({ convenio: nome, problema: e.message }); ctx.fim(); }
        };

        const encerrarSemRodar = (msg, cor) => {
            CR.estado.rodando = false;
            limparVigias();
            CR.motor.encerrarModoAutomacao();
            CR.ui.modoIniciar();
            CR.ui.status(msg, cor || '#ffd633');
        };

        const esperarJanela = () => {
            CR.ui.status('⏳ Aguardando a tela de autorização carregar...', '#4dc3ff');
            let t = 0;
            const iv = setInterval(() => {
                if (!CR.estado.rodando) { clearInterval(iv); return; }
                if (!janelaUnimed || janelaUnimed.closed) {
                    clearInterval(iv);
                    encerrarSemRodar('❌ A janela de autorização foi fechada.\nClique em INICIAR que eu abro de novo.', '#ff6b5e');
                    return;
                }
                if (serveComoSADT(janelaUnimed)) { clearInterval(iv); comecar(janelaUnimed); return; }
                if (++t > 60) {
                    clearInterval(iv);
                    encerrarSemRodar('⚠️ A janela abriu, mas ainda não está na tela SP/SADT.\n' +
                        'Deixe-a na tela de autorização e clique em INICIAR de novo.', '#ffd633');
                }
            }, 500);
            CR.estado.vigias.push(iv);
        };

        if (janelaUnimed && !janelaUnimed.closed) { esperarJanela(); return; }

        const alvo = acharJanelaSADT();
        if (alvo) { janelaUnimed = alvo; comecar(alvo); return; }

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

    /* ── Desliga as vigias ─────────────────────────────────────── */
    const limparVigias = () => {
        CR.estado.vigias.forEach(v => { try { clearInterval(v); } catch (e) { } });
        CR.estado.vigias = [];
    };

    /* ═══════════════════════════════════════════════════════════
     *  VIGIA DE SEGUNDO PLANO
     *
     *  O motor cuida da aba principal. Mas o robô também trabalha em
     *  outros lugares: a moldura (que é uma página dentro da página) e
     *  as janelas que ele abre. Cada uma delas é escondida pelo Chrome
     *  por conta própria.
     *
     *  Esta vigia varre esses lugares de dois em dois segundos e aplica
     *  neles o mesmo disfarce: para todos, a tela nunca saiu da frente.
     *  Janela de outro domínio simplesmente é ignorada — não dá para
     *  alcançar, e tentar não custa nada.
     * ═══════════════════════════════════════════════════════════ */
    const vigiarSegundoPlano = () => {
        let semAndar = 0;
        let ultimoFeitos = -1;

        const iv = setInterval(() => {
            if (!CR.estado.rodando) { clearInterval(iv); return; }

            U.seguro(() => {
                if (espelho && espelho.iframe) CR.motor.manterAcordada(espelho.iframe);
                if (janelaUnimed && !janelaUnimed.closed) CR.motor.manterAcordada(janelaUnimed);
                CR.estado.janelasRobo.forEach(w => {
                    if (w && !w.closed) CR.motor.manterAcordada(w);
                });
            }, 'manter-acordada');

            /* MEDE a batida do motor. É este número que diz, na volta, se o
               segundo plano funcionou ou se a aba foi congelada pelo Chrome.
               Sem medir, a gente só teria achismo. */
            U.seguro(() => {
                const m = CR.motor.medirBatida();
                CR.estado.batida = m;
                if (m.escondida) {
                    const pior = CR.estado.piorBatida;
                    if (pior === undefined || m.porSegundo < pior) CR.estado.piorBatida = m.porSegundo;
                    if (m.paradaHa > 4000) {
                        CR.log.aviso('Segundo plano travou: ' + Math.round(m.paradaHa / 1000) +
                            's sem batida com a aba escondida' +
                            (m.operario ? '' : ' · o navegador não deixou criar a batida de fundo') +
                            (m.som ? '' : ' · o som que mantém a aba viva está desligado'));
                    }
                }
            }, 'medir-batida');

            /* Se estiver escondida e nada andar por muito tempo, isso vai
               para o log — é a pista de que o segundo plano falhou naquele
               portal, em vez de a gente ficar adivinhando depois. */
            U.seguro(() => {
                if (!CR.motor.escondidoDeVerdade()) { semAndar = 0; return; }
                const c = CR.fila.contagem(CR.estado.fila);
                if (c.feitos !== ultimoFeitos) { ultimoFeitos = c.feitos; semAndar = 0; return; }
                semAndar += 2;
                if (semAndar === 60) {
                    CR.log.aviso('Aba escondida e sem avanço há 1 minuto (parou em ' +
                        c.feitos + '/' + c.total + '). Se isso se repetir neste convênio, ' +
                        'o segundo plano precisa de ajuste aqui.');
                }
            }, 'vigia-parada');
        }, 2000);

        CR.estado.vigias.push(iv);
    };

    /* ═══════════════════════════════════════════════════════════
     *  INICIAR e PARAR
     * ═══════════════════════════════════════════════════════════ */
    const iniciarAutomacao = (nome, texto) => {
        CR.estado.rodando = true;
        CR.estado.elementosRobo = [];
        CR.estado.janelasRobo = [];
        CR.estado.ultimoAviso = '';
        CR.ui.modoParar();
        CR.estado.roboAtual = nome;

        CR.estado.piorBatida = undefined;
        CR.estado.batida = null;
        U.seguro(() => acompanhar.comecar(nome, texto), 'acompanhar');

        const infoAtual = CR.infoRobos[nome] || {};
        try { CR.motor.ligar(!!infoAtual.semMotor); }
        catch (e) { CR.log.aviso('motor de fundo indisponível: ' + e.message); }
        try { CR.motor.silenciarAvisos(); } catch (e) { CR.log.aviso('aviso: ' + e.message); }

        CR.ui.status('▶ Iniciando... pode minimizar ou trocar de aba.\n⚙️ ' +
            CR.motor.diagnostico().join(' · '), '#4dc3ff');

        U.seguro(vigiarSegundoPlano, 'vigia-segundo-plano');

        /* A ORDEM ABAIXO É A MESMA DE SEMPRE e não pode mudar:
           janela → moldura → padrão. */
        if (CR.roboJanela[nome]) { rodarJanela(nome, texto); return; }
        if (CR.roboMoldura[nome]) { rodarInline(nome, texto); return; }
        iniciarPadrao(nome, texto);
    };

    const pararAutomacao = () => {
        const tinhaJanela = CR.estado.janelasRobo.length > 0;
        const tinhaPainel = CR.estado.elementosRobo.length > 0;
        const tinhaEspelho = !!espelho;

        CR.estado.rodando = false;
        limparVigias();
        CR.motor.encerrarModoAutomacao();
        U.seguro(() => acompanhar.terminar('interrompida', 'Interrompida pelo usuário'), 'fim');

        CR.estado.janelasRobo.forEach(w => { try { w.close(); } catch (e) { } });
        CR.estado.janelasRobo = [];
        CR.estado.elementosRobo.forEach(el => { try { el.remove(); } catch (e) { } });
        CR.estado.elementosRobo = [];
        try { window._b403 = 0; } catch (e) { }

        CR.ui.modoIniciar();

        /* A janela de autorização é do usuário: nunca fechar nem recarregar */
        if (CR.roboJanela[CR.estado.roboAtual]) {
            CR.ui.status('⏹ Automação interrompida. A janela de autorização continua aberta.', '#ff6b5e');
            return;
        }

        if (tinhaEspelho) {
            fecharEspelho();
            CR.ui.status('⏹ Automação interrompida. Se a tela parecer desatualizada, aperte F5.', '#ff6b5e');
            return;
        }

        if (!tinhaJanela && !tinhaPainel) {
            CR.ui.status('⏹ Para interromper este robô é preciso recarregar a página.', '#ffd633');
            if (confirm('Este convênio roda direto na página do portal.\n\nPara interromper de verdade é preciso recarregar a página (você perderá o que estiver preenchido).\n\nRecarregar agora?')) {
                location.reload();
            }
            return;
        }
        CR.ui.status('⏹ Automação interrompida.', '#ff6b5e');
    };

    /* ── O que o resto da Central usa daqui ─────────────────────── */
    CR.auto = {
        iniciar: iniciarAutomacao,
        parar: pararAutomacao,
        limparVigias,
        fecharEspelho: () => fecharEspelho(),
        temEspelho: () => !!espelho,
        codigosNaTela,
        /* usado pela tela ao trocar de convênio */
        zerarUnimed: () => { unimedForcar = false; unimedTentouAbrir = false; }
    };

})(window.CentralRobos);
