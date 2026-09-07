/* ============================================================
 *  MOTOR DE FUNDO
 *
 *  O Chrome desacelera (e quase congela) os relógios de uma aba que
 *  não está na frente. Isso faria o robô andar a passo de tartaruga
 *  com a aba minimizada. Aqui o relógio passa a bater fora da aba,
 *  num processo paralelo que o Chrome não freia.
 *
 *  ATENÇÃO — LIÇÃO CARA: portais modernos (Angular, como o da Amil)
 *  DEPENDEM do relógio da página para redesenhar a tela. Trocar o
 *  relógio deles trava o portal em "Buscando" para sempre. Por isso
 *  existe o MODO LEVE: mantém a aba acordada com som e conexão, mas
 *  NÃO troca o relógio. Para ligar o modo leve num convênio, basta
 *  marcar semMotor: true na ficha dele em src/config/convenios.js.
 *
 *  Este arquivo é cópia fiel do motor do central.js v2.1.0. As
 *  únicas mudanças foram trocar as variáveis que antes eram do
 *  escopo de fora (menu, elementosRobo, roboAtual...) pelos mesmos
 *  valores dentro de CR. Nenhum comportamento foi alterado.
 * ============================================================ */
(function (CR) {
    "use strict";

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
        ultimoPulso: 0, guarda: null, backup: null,
        operario: null, visao: null, rafOriginais: null, batidas: 0, acordadas: []
    };
    let dialogos = null;

    // ═══════════════════════════════════════════════════════════════
    //  SABER SE A ABA ESTÁ MESMO ESCONDIDA
    //
    //  Logo abaixo a gente vai FINGIR para a página que ela continua à
    //  vista. Só que o próprio motor precisa saber a verdade para
    //  escolher a batida certa. Por isso guardamos aqui o medidor
    //  original, ANTES de qualquer disfarce.
    // ═══════════════════════════════════════════════════════════════
    const MEDIDOR_REAL = (() => {
        try {
            return Object.getOwnPropertyDescriptor(Document.prototype, 'hidden');
        } catch (e) { return null; }
    })();

    const escondidoDeVerdade = () => {
        try {
            if (MEDIDOR_REAL && MEDIDOR_REAL.get) return !!MEDIDOR_REAL.get.call(document);
            return !!document.hidden;
        } catch (e) { return false; }
    };

    // ═══════════════════════════════════════════════════════════════
    //  DISFARCE DE VISIBILIDADE
    //
    //  Metade dos casos de "minimizei e o robô parou" não é o Chrome:
    //  é o PRÓPRIO PORTAL que percebe que saiu da frente e se cala.
    //  Muita tela moderna faz isso para poupar recurso — para de
    //  atualizar, adia requisição, congela a lista.
    //
    //  Aqui a página passa a enxergar document.hidden = false e
    //  visibilityState = "visible" o tempo todo. Para ela, a aba nunca
    //  saiu da frente. Nada disso mexe em relógio, então vale também
    //  para os portais sensíveis (modo leve).
    // ═══════════════════════════════════════════════════════════════
    const enganarVisibilidade = (doc, win) => {
        doc = doc || document;
        win = win || window;
        try {
            if (doc.__crDisfarce) return false;

            /* CUIDADO — LIÇÃO CARA: este engolidor fica em modo CAPTURA na
               janela, e a captura passa por TODO evento, inclusive os que
               nascem num campo lá dentro.

               Vários robôs avisam o portal disparando 'blur' no campo depois
               de escrever (é assim que o portal sai para buscar a tabela ou
               validar o código). Engolir tudo matava esses avisos: o portal
               não era notificado e o lançamento não pegava.

               Por isso só engolimos o que é da JANELA ou do DOCUMENTO —
               que é o que interessa para o disfarce. Evento de campo passa
               reto, como sempre passou. */
            const engolir = ev => {
                try {
                    if (ev.target !== win && ev.target !== doc) return;
                    ev.stopImmediatePropagation();
                } catch (e) { }
            };

            Object.defineProperty(doc, 'hidden', { configurable: true, get: () => false });
            Object.defineProperty(doc, 'visibilityState', { configurable: true, get: () => 'visible' });
            try { Object.defineProperty(doc, 'webkitHidden', { configurable: true, get: () => false }); } catch (e) { }
            try { Object.defineProperty(doc, 'webkitVisibilityState', { configurable: true, get: () => 'visible' }); } catch (e) { }

            const focoOriginal = doc.hasFocus;
            doc.hasFocus = () => true;

            win.addEventListener('visibilitychange', engolir, true);
            win.addEventListener('blur', engolir, true);
            win.addEventListener('pagehide', engolir, true);

            doc.__crDisfarce = { engolir, focoOriginal, win, doc };
            motor.acordadas.push(doc.__crDisfarce);
            return true;
        } catch (e) { return false; }
    };

    const restaurarVisibilidade = () => {
        motor.acordadas.forEach(d => {
            try {
                delete d.doc.hidden;
                delete d.doc.visibilityState;
                try { delete d.doc.webkitHidden; } catch (e) { }
                try { delete d.doc.webkitVisibilityState; } catch (e) { }
                if (d.focoOriginal) d.doc.hasFocus = d.focoOriginal;
                d.win.removeEventListener('visibilitychange', d.engolir, true);
                d.win.removeEventListener('blur', d.engolir, true);
                d.win.removeEventListener('pagehide', d.engolir, true);
                delete d.doc.__crDisfarce;
            } catch (e) { }
        });
        motor.acordadas = [];
    };

    // Vale também para a moldura e para as janelas que o robô abrir.
    const manterAcordada = alvo => {
        try {
            if (!alvo) return false;
            const win = alvo.contentWindow || alvo;
            if (!win || !win.document) return false;
            return enganarVisibilidade(win.document, win);
        } catch (e) { return false; }   // janela de outro domínio: não dá para alcançar
    };

    // ═══════════════════════════════════════════════════════════════
    //  OPERÁRIO — a batida que o Chrome não consegue frear
    //
    //  O Chrome desacelera os relógios do THREAD PRINCIPAL de uma aba
    //  escondida: de 100ms passa para 1s e, depois de 5 minutos, para
    //  1 por minuto. É por isso que o robô parecia congelar.
    //
    //  Um Web Worker roda num thread separado e NÃO sofre esse freio.
    //  Ele bate a cada 40ms e, a cada batida, avisa a página. É esse
    //  aviso que faz as tarefas do robô vencerem na hora certa,
    //  minimizada ou não.
    //
    //  É a batida mais confiável que existe hoje. As outras (placa de
    //  som, mensagens, relógio comum) continuam como reserva.
    // ═══════════════════════════════════════════════════════════════
    const ligarOperario = () => {
        try {
            if (motor.operario) return true;
            if (!window.Worker || !window.Blob || !window.URL || !URL.createObjectURL) return false;

            const tarefa = [
                'var t = null;',
                'onmessage = function (e) {',
                '  if (e.data && e.data.ms) {',
                '    if (t) clearInterval(t);',
                '    t = setInterval(function () { postMessage(1); }, e.data.ms);',
                '  } else if (e.data === "parar") {',
                '    if (t) clearInterval(t); t = null;',
                '  }',
                '};'
            ].join('\n');

            const endereco = URL.createObjectURL(new Blob([tarefa], { type: 'text/javascript' }));
            const w = new Worker(endereco);

            w.onmessage = () => {
                if (!motor.ligado) return;
                pulso();
                // de dois em dois segundos, confere se o som não caiu
                if ((++motor.batidas % 50) === 0) revisarSom();
            };
            w.onerror = () => { };
            w.postMessage({ ms: 40 });

            motor.operario = { w, endereco };
            return true;
        } catch (e) { return false; }
    };

    const desligarOperario = () => {
        try {
            if (!motor.operario) return;
            motor.operario.w.postMessage('parar');
            motor.operario.w.terminate();
            URL.revokeObjectURL(motor.operario.endereco);
        } catch (e) { }
        motor.operario = null;
    };

    // O Chrome às vezes suspende o som sozinho. Sem som, a aba volta a
    // ser candidata ao congelamento — então religamos na hora.
    const revisarSom = () => {
        try {
            if (motor.som && motor.som.ac && motor.som.ac.state !== 'running') motor.som.ac.resume();
        } catch (e) { }
    };

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
        try {
            if (!motor.canal) {
                if (!window.MessageChannel) throw new Error('sem MessageChannel');
                motor.canal = new MessageChannel();
                motor.canal.port1.onmessage = () => {
                    if (!motor.girando || !motor.ligado) { motor.girando = false; return; }
                    if (Date.now() >= motor.alvo) { motor.girando = false; pulso(); return; }
                    try { motor.canal.port2.postMessage(0); }
                    catch (e) { motor.girando = false; giroDeUltimoCaso(); }
                };
            }
            motor.canal.port2.postMessage(0);
        } catch (e) {
            // Alguns portais bloqueiam esse recurso. Nunca deixar a automação
            // cair por causa de um reforço: cai para o relógio comum.
            motor.girando = false;
            giroDeUltimoCaso();
        }
    };

    // Último caso: o relógio comum do navegador. É freado em aba escondida,
    // mas é infinitamente melhor do que parar de vez.
    const giroDeUltimoCaso = () => {
        try {
            if (!motor.originais) return;
            const espera = Math.max(0, motor.alvo - Date.now());
            motor.originais.stO.call(window, pulso, espera);
        } catch (e) { }
    };

    const agendarPulso = () => {
        if (!motor.ligado || motor.relogio) return;   // com relógio da placa não precisa agendar
        if (!motor.originais) return;                 // modo leve: não temos agenda própria
        const venc = proximoVencimento();
        motor.alvo = venc === Infinity ? Date.now() + 250 : venc;
        const espera = Math.max(0, motor.alvo - Date.now());
        if (!escondidoDeVerdade()) {
            try { motor.originais.stO.call(window, pulso, espera); } catch (e) { }
            return;
        }
        iniciarGiro();
    };

    const ligarMotorFundo = (modoLeve) => {
        if (motor.ligado) return;
        motor.diag = [];
        motor.batidas = 0;
        const temSom = ligarSom();
        const temRtc = ligarConexaoViva();

        // Vale para os dois modos: não mexe em relógio nenhum, só faz a
        // página acreditar que continua à vista.
        const temDisfarce = enganarVisibilidade(document, window);
        motor.diag.push(temDisfarce ? 'página segue "à vista" ✅' : 'página segue "à vista" ❌');

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
            // Sem tomar o relógio da página, mas o operário ainda serve para
            // religar o som sozinho se o Chrome derrubar.
            motor.operarioLeve = ligarOperario();
            return;
        }

        // Batida principal: o operário, que o Chrome não freia.
        const temOperario = ligarOperario();
        motor.diag.push(temOperario ? 'batida em segundo plano ✅' : 'batida em segundo plano ❌ → usando a placa de som');

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

        // ── RELÓGIO DE TELA ────────────────────────────────────────
        // O requestAnimationFrame PARA POR COMPLETO em aba escondida —
        // não é freado, é desligado. Portal que dependa dele para
        // redesenhar fica parado de vez. Enquanto a aba estiver mesmo
        // escondida, mandamos esses pedidos pela nossa agenda; quando
        // volta para a frente, tudo segue pelo caminho normal do navegador.
        try {
            const rafO = window.requestAnimationFrame;
            const cafO = window.cancelAnimationFrame;
            if (rafO) {
                motor.rafOriginais = { rafO, cafO };
                window.requestAnimationFrame = function (fn) {
                    if (!escondidoDeVerdade()) return rafO.call(window, fn);
                    return window.setTimeout(function () {
                        try { fn(Date.now()); } catch (e) { }
                    }, 16);
                };
                window.cancelAnimationFrame = function (id) {
                    if (typeof id === 'number' && id >= BASE_ID) return window.clearTimeout(id);
                    return cafO ? cafO.call(window, id) : undefined;
                };
                motor.diag.push('relógio de tela ✅');
            }
        } catch (e) { }

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
        desligarOperario();
        restaurarVisibilidade();
        try {
            if (motor.rafOriginais) {
                window.requestAnimationFrame = motor.rafOriginais.rafO;
                if (motor.rafOriginais.cafO) window.cancelAnimationFrame = motor.rafOriginais.cafO;
            }
        } catch (e) { }
        motor.rafOriginais = null;
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

    const silenciarAvisos = () => {
        if (dialogos) return;
        dialogos = { alerta: window.alert, pergunta: window.confirm };
        // Robôs sem painel próprio avisam o fim por alerta — guardamos a
        // mensagem para saber que a automação acabou.
        window.alert = msg => { CR.estado.ultimoAviso = String(msg); CR.ui.status(String(msg), '#4dc3ff'); };
        window.confirm = msg => {
            CR.ui.status('⚠️ ' + String(msg) + ' → seguindo em frente automaticamente', '#ffd633');
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
            const lista = CR.estado.elementosRobo.slice();
            CR.estado.elementosRobo = [];

            // Reforço: acha o painel pelos ids que o próprio robô usa, mesmo que
            // ele não tenha passado pelo nosso registro.
            try {
                const inf = CR.infoRobos[CR.estado.roboAtual] || {};
                [inf.txt, inf.btn, CR.statusRobo[CR.estado.roboAtual], CR.contadorRobo[CR.estado.roboAtual]]
                    .filter(Boolean).forEach(id => {
                        const alvo = document.getElementById(id);
                        if (!alvo) return;
                        let p = alvo;
                        while (p && p.parentElement && p.parentElement !== document.body) p = p.parentElement;
                        if (!p || p === document.body) return;
                        if (CR.ui.menu && (p === CR.ui.menu || p.contains(CR.ui.menu))) return;   // nunca o nosso menu
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


    /* ── O que o resto da Central usa daqui ─────────────────────── */
    CR.motor = {
        estado: motor,
        ligar: ligarMotorFundo,
        desligar: desligarMotorFundo,
        silenciarAvisos: silenciarAvisos,
        restaurarAvisos: restaurarAvisos,
        limparPaineisDoRobo: limparPaineisDoRobo,
        encerrarModoAutomacao: encerrarModoAutomacao,
        manterAcordada: manterAcordada,
        escondidoDeVerdade: escondidoDeVerdade,
        diagnostico: () => motor.diag
    };

})(window.CentralRobos);
