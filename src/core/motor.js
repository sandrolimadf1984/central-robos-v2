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
        diagnostico: () => motor.diag
    };

})(window.CentralRobos);
