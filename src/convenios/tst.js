/* ════════════════════════════════════════════════════════════════
 *  TST — PAINEL DE CONTROLE
 *
 *  POR QUE ESTE ROBÔ É DIFERENTE DOS OUTROS
 *
 *  O portal do TST recarrega a página INTEIRA a cada procedimento
 *  salvo. Como o app mora dentro da página do portal, ele morre
 *  junto — não existe jeito de contornar isso por dentro da página.
 *
 *  Duas saídas foram tentadas e falharam:
 *
 *    1. Rodar na própria página → o robô morre no primeiro código.
 *    2. Rodar na MOLDURA (portal dentro de um quadro) → a moldura
 *       precisa BUSCAR a página de novo, e a tela em que o atendente
 *       está no TST é resultado de um envio de formulário. Buscar o
 *       endereço de novo devolve a TELA INICIAL do convênio, não a
 *       guia. Foi exatamente o que aconteceu no teste real.
 *
 *  A única arquitetura que funciona aqui é a janelinha: um painel
 *  numa janela separada, que NÃO recarrega e por isso sobrevive,
 *  pilotando a aba do portal pelo window.opener. A aba do portal
 *  continua na tela certa, porque ninguém pede nada de novo a ela.
 *
 *  O QUE MUDOU EM RELAÇÃO À JANELINHA ANTIGA
 *
 *    · o painel tem a cara do app: barra de progresso, percentual,
 *      código atual, item X de Y, concluídos / pendentes / erros;
 *    · o primeiro código passou a entrar (explicação abaixo);
 *    · nada entra duas vezes;
 *    · a ordem da colagem é respeitada;
 *    · o painel continua trabalhando com a janela minimizada.
 *
 *  O PRIMEIRO CÓDIGO QUE NÃO ENTRAVA
 *
 *  O campo da tabela chama-se #noreset_txCodTabela — o "noreset" no
 *  nome entrega o segredo: o portal NÃO limpa esse campo entre um
 *  procedimento e outro.
 *
 *  Na PRIMEIRA vez ele está vazio, então receber "16" é uma mudança
 *  de verdade e o portal sai para buscar a tabela TUSS — e enquanto
 *  busca, ele LIMPA o campo do código. O robô antigo já tinha
 *  digitado, o portal apagava, e o primeiro exame se perdia. Da
 *  segunda em diante a tabela já estava em 16, nada era buscado,
 *  nada era apagado.
 *
 *  A correção não depende de acertar tempo: o robô escreve o código
 *  e CONFERE se ele ficou. Se o portal apagou, escreve de novo.
 * ════════════════════════════════════════════════════════════════ */
(function (CR) {
    "use strict";

    /* ────────────────────────────────────────────────────────────
     *  ESTA FUNÇÃO RODA DENTRO DA JANELINHA, NÃO AQUI.
     *
     *  Ela é convertida em texto e escrita na janela nova. Por isso
     *  NÃO pode usar nada de fora: tudo que ela precisa chega por
     *  window.__crTST. Se ela dependesse do código daqui, morreria
     *  junto com a página do portal no primeiro recarregamento —
     *  que é justamente o que se quer evitar.
     * ──────────────────────────────────────────────────────────── */
    function motorTST() {
        /* Os dados chegam como TEXTO puro numa propriedade da janela.
           Já vieram corrompidos por dentro do HTML uma vez (a fila chegou
           como texto e o painel rodou com 583 "itens" que eram letras),
           então aqui a leitura é desconfiada: aceita texto ou objeto, e
           confere item por item antes de deixar o robô encostar no portal. */
        var dados = {};
        try {
            var bruto = window.__crTSTjson;
            if (typeof bruto === "string") dados = JSON.parse(bruto);
            else if (window.__crTST) {
                dados = (typeof window.__crTST === "string")
                    ? JSON.parse(window.__crTST) : window.__crTST;
            }
        } catch (e) { dados = {}; }

        var fila = dados.fila;
        if (typeof fila === "string") {
            try { fila = JSON.parse(fila); } catch (e) { fila = null; }
        }

        var filaValida = Array.isArray(fila) && fila.length > 0 &&
            fila.every(function (i) {
                return i && typeof i.cod === "string" && /^\d{8}$/.test(i.cod) && i.qtd > 0;
            });

        var portal = window.opener;

        var parado = false;
        var feitos = 0;
        var naoEntraram = [];
        var atual = "";
        var indice = 0;
        var comeco = Date.now();

        var $ = function (id) { return document.getElementById(id); };

        /* ── BATIDA QUE O NAVEGADOR NÃO FREIA ────────────────────
           Janela escondida também é desacelerada pelo Chrome. Um Web
           Worker roda num processo separado e não sofre esse freio:
           é ele que marca o tempo das esperas. Se o navegador não
           deixar criar o worker, cai no relógio comum. */
        var operario = null;
        var esperas = [];

        function baterRelogio() {
            var agora = Date.now();
            for (var i = esperas.length - 1; i >= 0; i--) {
                if (agora >= esperas[i].alvo) { var e = esperas.splice(i, 1)[0]; e.pronto(); }
            }
        }

        try {
            var fonte = 'setInterval(function(){postMessage(1)},40);';
            operario = new Worker(URL.createObjectURL(new Blob([fonte], { type: 'text/javascript' })));
            operario.onmessage = baterRelogio;
        } catch (e) { operario = null; }

        function pausa(ms) {
            if (!operario) return new Promise(function (r) { setTimeout(r, ms); });
            return new Promise(function (r) { esperas.push({ alvo: Date.now() + ms, pronto: r }); });
        }

        /* ── TELA ────────────────────────────────────────────────── */
        function registrar(msg) {
            var linha = document.createElement("div");
            var hora = new Date().toTimeString().slice(0, 8);
            linha.innerHTML = '<span style="color:#3d5a85;">[' + hora + ']</span> ' + msg;
            $("cr-log").prepend(linha);
        }

        function pintar(rodando) {
            var total = fila.length;
            var pct = total ? Math.min(100, Math.round((feitos / total) * 100)) : 0;
            var pendentes = Math.max(0, total - feitos - naoEntraram.length);
            $("cr-barra").style.width = pct + "%";
            $("cr-pct").innerText = pct + "%";
            $("cr-atual").innerText = atual || "—";
            $("cr-item").innerText = Math.min(indice + 1, total) + " de " + total;
            $("cr-feitos").innerText = "✓ " + feitos + " concluídos";
            $("cr-pendentes").innerText = "⏳ " + pendentes + " pendentes";
            $("cr-erros").innerText = "⚠ " + naoEntraram.length + " erros";
            $("cr-erros").style.color = naoEntraram.length ? "#ff6b5e" : "#5f7aa3";
            $("cr-titulo").innerText = rodando ? "⏳ AUTOMAÇÃO EM ANDAMENTO" : "⏹ AUTOMAÇÃO PARADA";
        }

        function avisar(texto, cor) {
            var caixa = $("cr-recado");
            caixa.style.display = "block";
            caixa.style.color = cor || "#9db4d8";
            caixa.innerText = texto;
        }

        /* ── LEITURA DA ABA DO PORTAL ────────────────────────────── */
        function doc() { return portal.document; }

        function portalVivo() {
            try { return !!(portal && !portal.closed && portal.document); }
            catch (e) { return false; }
        }

        /* ARMADILHA: offsetParent é nulo para elemento com position:fixed,
           que está bem na cara do usuário. Conferir por três caminhos. */
        function visivel(el) {
            if (!el || el.disabled) return false;
            try {
                if (el.offsetParent !== null) return true;
                if (el.getClientRects && el.getClientRects().length) return true;
                var est = portal.getComputedStyle(el);
                if (est && est.position === "fixed" &&
                    est.display !== "none" && est.visibility !== "hidden") return true;
            } catch (e) { }
            return false;
        }

        async function esperar(sel, teto, oque) {
            var t = 0;
            teto = teto || 8000;
            while (t < teto) {
                if (parado) throw new Error("Parado");
                if (!portalVivo()) throw new Error("a aba do portal foi fechada");
                var el = null;
                try { el = doc().querySelector(sel); } catch (e) { el = null; }
                if (visivel(el)) return el;
                await pausa(150);
                t += 150;
            }
            throw new Error("não apareceu na tela: " + (oque || sel));
        }

        function escrever(campo, valor) {
            try { campo.focus(); } catch (e) { }
            campo.value = valor;
            ["input", "change", "blur"].forEach(function (nome) {
                try { campo.dispatchEvent(new portal.Event(nome, { bubbles: true })); } catch (e) { }
            });
            try { portal.$(campo).trigger("change"); } catch (e) { }
        }

        function valorDe(sel) {
            try { return ((doc().querySelector(sel) || {}).value || "").trim(); }
            catch (e) { return ""; }
        }

        /* Quantas vezes o código aparece na tela, FORA do diálogo.
           O diálogo é ignorado porque enquanto ele está aberto o código
           está lá dentro, e contar isso enganaria a conferência. */
        function contarNaTela(cod) {
            try {
                var d = doc();
                var txt = "";
                Array.prototype.forEach.call(d.body.children, function (el) {
                    if (el.classList && el.classList.contains("ui-dialog")) return;
                    txt += " " + (el.textContent || "");
                    if (el.querySelectorAll) {
                        Array.prototype.forEach.call(
                            el.querySelectorAll("input,select,textarea"),
                            function (c) { txt += " " + (c.value || ""); });
                    }
                });
                var n = 0, i = 0;
                while ((i = txt.indexOf(cod, i)) !== -1) { n++; i += cod.length; }
                return n;
            } catch (e) { return -1; }
        }

        var BOTAO_ADICIONAR =
            "input[value='Adicionar Procedimento'],input[name='adicionarProcedimento']";

        async function fixarTabela() {
            var campo = await esperar("#noreset_txCodTabela", 8000, "campo da tabela TUSS");
            if (valorDe("#noreset_txCodTabela") === "16") return false;
            escrever(campo, "16");
            registrar('tabela TUSS definida — aguardando a busca do portal');
            await pausa(1200);
            return true;
        }

        /* AQUI mora a correção do primeiro código: escreve e confere. */
        async function escreverCodigo(cod) {
            for (var tentativa = 1; tentativa <= 6; tentativa++) {
                var campo = await esperar("#codItemProcedimento", 8000, "campo do código");
                escrever(campo, cod);
                await pausa(450);
                if (valorDe("#codItemProcedimento").indexOf(cod) !== -1) {
                    if (tentativa > 1) registrar("o código ficou no campo na tentativa " + tentativa);
                    return true;
                }
                registrar('<span style="color:#ffd633;">o portal limpou o campo (tentativa ' +
                    tentativa + ") — escrevendo de novo</span>");
                await pausa(600);
            }
            return false;
        }

        async function escreverQuantidade(q) {
            var campo = null;
            try { campo = doc().getElementById("procedimento.numQtdSolicitada"); } catch (e) { }
            if (!campo) return;
            escrever(campo, q);
            await pausa(150);
        }

        /* ARMADILHA: a célula que envolve o botão também casa com a busca
           por texto, e clicar nela não faz nada. Descer até o mais interno. */
        async function acharSalvar() {
            var querAchar = /salvar|confirmar|gravar|^ok$/i;
            var t = 0;
            while (t < 8000) {
                if (parado) throw new Error("Parado");
                try {
                    var d = doc();
                    var painel = d.querySelector(".ui-dialog-buttonpane");
                    var candidatos = Array.prototype.slice.call(
                        (painel || d).querySelectorAll("button,input[type=button],input[type=submit],a"));
                    for (var i = 0; i < candidatos.length; i++) {
                        var el = candidatos[i];
                        var rotulo = (el.innerText || el.textContent || el.value || "").trim();
                        if (!querAchar.test(rotulo)) continue;
                        if (!visivel(el)) continue;
                        var dentro = el.querySelector("span,b,font");
                        return (dentro && (dentro.textContent || "").trim()) ? dentro : el;
                    }
                } catch (e) { }
                await pausa(150);
                t += 150;
            }
            throw new Error("não achei o botão de salvar do procedimento");
        }

        /* NUNCA mandar o mesmo item duas vezes: espera o código APARECER
           na lista, com folga larga, em vez de contar tempo. */
        async function esperarEntrar(cod, tinhaAntes) {
            var t = 0;
            while (t < 20000) {
                if (parado) throw new Error("Parado");
                if (contarNaTela(cod) > tinhaAntes) return true;
                await pausa(250);
                t += 250;
            }
            return false;
        }

        async function esperarTelaVoltar() {
            var t = 0;
            while (t < 25000) {
                if (parado) throw new Error("Parado");
                if (!portalVivo()) throw new Error("a aba do portal foi fechada");
                var pronto = false;
                try {
                    var d = doc();
                    pronto = !!(d && d.readyState === "complete" && d.querySelector(BOTAO_ADICIONAR));
                } catch (e) { pronto = false; }
                if (pronto) return true;
                await pausa(200);
                t += 200;
            }
            throw new Error("a tela do portal não voltou depois de salvar");
        }

        async function fecharDialogo() {
            try {
                var d = doc();
                var fechar = d.querySelector(".ui-dialog-titlebar-close");
                if (fechar) { fechar.click(); await pausa(400); return; }
                var botoes = d.querySelectorAll(".ui-dialog-buttonpane button");
                for (var i = 0; i < botoes.length; i++) {
                    if (/cancelar|fechar/i.test(botoes[i].innerText || botoes[i].textContent || "")) {
                        botoes[i].click(); await pausa(400); return;
                    }
                }
            } catch (e) { }
        }

        async function lancar(cod, qtd, tinhaAntes) {
            await esperar(BOTAO_ADICIONAR, 12000, "botão Adicionar Procedimento");
            await pausa(300);

            var botao = null;
            try { botao = doc().querySelector(BOTAO_ADICIONAR); } catch (e) { }
            if (!botao) throw new Error("o botão Adicionar Procedimento sumiu da tela");
            botao.click();

            await fixarTabela();

            if (!await escreverCodigo(cod)) {
                throw new Error("o portal não aceitou manter o código " + cod + " no campo");
            }

            await escreverQuantidade(qtd);
            await pausa(400);

            (await acharSalvar()).click();
            var entrou = await esperarEntrar(cod, tinhaAntes);
            await esperarTelaVoltar();
            await pausa(200);
            return entrou;
        }

        async function rodar() {
            if (!portalVivo()) {
                avisar("A aba do portal não está mais acessível. Feche esta janelinha, " +
                    "volte ao portal e comece de novo.", "#ff6b5e");
                pintar(false);
                return;
            }

            registrar("iniciando " + fila.length + " código(s), na ordem colada");
            pintar(true);

            for (indice = 0; indice < fila.length; indice++) {
                if (parado) break;
                var cod = fila[indice].cod, qtd = fila[indice].qtd;
                atual = cod;
                pintar(true);
                registrar("item " + (indice + 1) + "/" + fila.length + ": <b>" + cod + "</b>" +
                    (qtd > 1 ? " (quantidade " + qtd + ")" : ""));

                var tinhaAntes = Math.max(0, contarNaTela(cod));
                var deu = false;

                for (var volta = 1; volta <= 2 && !deu; volta++) {
                    try {
                        deu = await lancar(cod, qtd, tinhaAntes);
                        if (!deu) registrar('<span style="color:#ffd633;">salvou mas não apareceu na lista</span>');
                    } catch (e) {
                        if (e.message === "Parado") { parado = true; break; }
                        registrar('<span style="color:#ff6b5e;">' + e.message + "</span>");
                        await fecharDialogo();
                    }
                    if (!deu && volta === 1 && !parado) {
                        /* ENTROU tem prioridade sobre REPETIR: portal lento pode
                           ter registrado depois da hora, e repetir gera duplicidade. */
                        await pausa(2000);
                        if (contarNaTela(cod) > tinhaAntes) {
                            registrar("entrou com atraso — não vou repetir");
                            deu = true;
                        } else {
                            registrar("tentando de novo...");
                            await fecharDialogo();
                        }
                    }
                }

                if (parado) break;
                if (deu) { feitos++; } else { naoEntraram.push(cod); }
                pintar(true);
            }

            atual = "";
            pintar(false);
            var seg = Math.round((Date.now() - comeco) / 1000);
            var tempo = seg >= 60 ? (Math.floor(seg / 60) + "min " + (seg % 60) + "s") : (seg + "s");

            if (parado) {
                avisar("⏹ Interrompido.  " + feitos + " de " + fila.length +
                    " códigos lançados.  A aba do portal continua como está.", "#ffd633");
            } else if (naoEntraram.length === 0) {
                avisar("✅ Concluído!  " + feitos + " de " + fila.length +
                    " códigos lançados no portal · " + tempo, "#2ecc71");
            } else {
                avisar("⚠️ Terminou com pendência.  " + feitos + " de " + fila.length +
                    " lançados · " + tempo + "\nNão entraram: " + naoEntraram.join(", ") +
                    "\nConfira esses no portal antes de fechar a guia.", "#ffd633");
            }
            $("cr-parar").innerText = "✖ FECHAR ESTA JANELA";
            try { if (operario) operario.terminate(); } catch (e) { }
        }

        /* ── BOTÕES ──────────────────────────────────────────────── */
        $("cr-parar").onclick = function () {
            if (/FECHAR/.test(this.innerText)) { window.close(); return; }
            parado = true;
            this.innerText = "✖ FECHAR ESTA JANELA";
            avisar("⏹ Parando... a aba do portal continua como está.", "#ffd633");
        };

        $("cr-copiar").onclick = function () {
            var texto = "RELATÓRIO — TST\n" +
                feitos + " de " + fila.length + " códigos lançados\n" +
                (naoEntraram.length ? "Não entraram: " + naoEntraram.join(", ") + "\n" : "") +
                "\n" + ($("cr-log").innerText || "");
            var caixa = document.createElement("textarea");
            caixa.value = texto;
            document.body.appendChild(caixa);
            caixa.select();
            var deu = false;
            try { deu = document.execCommand("copy"); } catch (e) { }
            caixa.remove();
            this.innerText = deu ? "✔ COPIADO" : "✖ NÃO DEU";
            var b = this;
            setTimeout(function () { b.innerText = "📋 COPIAR RELATÓRIO"; }, 2000);
        };

        /* TRAVA: sem fila boa, não começa. Melhor parar com uma mensagem
           clara do que sair mexendo no portal com dado errado. */
        if (!filaValida) {
            fila = [];
            pintar(false);
            avisar("❌ Os códigos não chegaram direito nesta janelinha.\n\n" +
                "Recebido: " + (Array.isArray(dados.fila)
                    ? dados.fila.length + " item(ns), mas em formato inesperado"
                    : "um valor do tipo " + (typeof dados.fila)) + ".\n\n" +
                "Feche esta janelinha, volte ao portal e clique em INICIAR de novo. " +
                "Se repetir, use COPIAR RELATÓRIO e mande para o Sandro.", "#ff6b5e");
            registrar('<span style="color:#ff6b5e;">a fila chegou inválida — nada foi feito no portal</span>');
            document.getElementById("cr-parar").innerText = "✖ FECHAR ESTA JANELA";
            return;
        }

        registrar(fila.length + " código(s) recebidos: " +
            fila.map(function (i) { return i.cod + (i.qtd > 1 ? "×" + i.qtd : ""); }).join(", "));

        pintar(true);
        rodar();
    }

    /* ────────────────────────────────────────────────────────────
     *  A CASCA DA JANELINHA — mesmo visual do painel do app
     * ──────────────────────────────────────────────────────────── */
    function cascaHTML(versao) {
        return '<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8">' +
            '<title>TST — Central de Automação</title><style>' +
            'body{margin:0;padding:14px;background:linear-gradient(180deg,#0c1322 0%,#0a0f1c 100%);' +
            "color:#dbe7ff;font-family:'Segoe UI',system-ui,Arial,sans-serif;font-size:12px;}" +
            '.cx{background:#0a1424;border:1px solid #1b3157;border-radius:12px;padding:12px;margin-bottom:10px;}' +
            '.rot{font-size:9.5px;color:#7f97bd;letter-spacing:1.2px;font-weight:700;}' +
            '#cr-log{background:#050b16;border:1px solid #1b3157;border-radius:10px;padding:9px;' +
            'font-family:Consolas,monospace;font-size:10.5px;line-height:1.6;height:190px;overflow-y:auto;}' +
            '#cr-log::-webkit-scrollbar{width:7px;}#cr-log::-webkit-scrollbar-thumb{background:#2d7dff;border-radius:4px;}' +
            'button{width:100%;padding:11px;border-radius:11px;cursor:pointer;font-weight:800;' +
            'font-family:inherit;font-size:12px;letter-spacing:1px;}' +
            '</style></head><body>' +

            '<div style="display:flex;align-items:center;gap:10px;margin-bottom:12px;">' +
            '<div style="font-size:26px;">🤖</div><div style="flex:1;">' +
            '<div style="font-size:11px;font-weight:700;color:#e8f1ff;letter-spacing:1.6px;">CENTRAL DE AUTOMAÇÃO</div>' +
            '<div style="font-size:19px;font-weight:800;color:#4dc3ff;letter-spacing:1.4px;line-height:1.1;">TST</div>' +
            '</div><div style="font-size:9px;color:#3d5a85;">v' + versao + '</div></div>' +

            '<div class="cx">' +
            '<div id="cr-titulo" style="font-size:11px;font-weight:800;color:#4dc3ff;letter-spacing:1.2px;margin-bottom:9px;">⏳ AUTOMAÇÃO EM ANDAMENTO</div>' +
            '<div style="background:#0b1526;border:1px solid #1b3157;border-radius:8px;height:12px;overflow:hidden;">' +
            '<div id="cr-barra" style="height:100%;width:0%;background:linear-gradient(90deg,#2d7dff,#4dc3ff);transition:width .3s;"></div></div>' +
            '<div id="cr-pct" style="text-align:right;font-size:10.5px;color:#4dc3ff;font-weight:800;margin-top:3px;">0%</div>' +
            '<div style="color:#9db4d8;margin-top:4px;">Código atual: <span id="cr-atual" style="font-family:Consolas,monospace;color:#eaf3ff;">—</span></div>' +
            '<div style="color:#9db4d8;">Item: <span id="cr-item">0 de 0</span></div>' +
            '<div style="display:flex;gap:10px;margin-top:8px;font-size:11px;">' +
            '<span id="cr-feitos" style="color:#2ecc71;">✓ 0 concluídos</span>' +
            '<span id="cr-pendentes" style="color:#4dc3ff;">⏳ 0 pendentes</span>' +
            '<span id="cr-erros" style="color:#5f7aa3;">⚠ 0 erros</span></div>' +
            '<div style="margin-top:9px;padding-top:8px;border-top:1px solid #1b3157;font-size:10.5px;color:#2ecc71;">' +
            '🔽 Pode minimizar esta janelinha — ela continua trabalhando.</div>' +
            '</div>' +

            '<div id="cr-recado" style="display:none;background:#0a1424;border:1px solid #1b3157;' +
            'border-radius:12px;padding:11px;margin-bottom:10px;white-space:pre-line;line-height:1.6;"></div>' +

            '<div class="cx"><div class="rot" style="margin-bottom:6px;">📄 ANDAMENTO</div>' +
            '<div id="cr-log"></div></div>' +

            '<button id="cr-parar" style="background:linear-gradient(180deg,#e23b2e,#b91f16);color:#fff;' +
            'border:1px solid #ff6b5e;box-shadow:0 0 14px rgba(226,59,46,0.45);">⏹ PARAR</button>' +
            '<button id="cr-copiar" style="margin-top:8px;background:#0e1a2e;color:#9db4d8;border:1px solid #223a5e;">' +
            '📋 COPIAR RELATÓRIO</button>' +

            '</body></html>';
    }

    CR.registrar({
        chave: "TST",
        nome: "TST",
        tipo: "padrao",
        ativo: true,
        portal: {
            seletores: ["input[value=\"Adicionar Procedimento\"]", "#noreset_txCodTabela"],
            nota: "Botão de adicionar e campo da tabela TUSS (a tela recarrega a cada item)"
        },
        origem: "reescrito em set/2026 — painel de controle na janelinha",
        executar: () => {
            var texto = prompt();
            var fila = CR.utils.montarFila(texto);   // ORDEM DA COLAGEM preservada

            if (!fila.length) {
                alert("Nenhum código de 8 dígitos encontrado no texto colado.");
                return;
            }

            var janela = window.open("", "crPainelTST",
                "width=430,height=700,scrollbars=yes,resizable=yes");

            if (!janela) {
                alert("O navegador bloqueou o painel do TST.\n\n" +
                    "Clique no ícone de pop-up bloqueado na barra de endereço, " +
                    "permita para este site e clique em INICIAR de novo.");
                return;
            }

            /* A casca vai por document.write; os DADOS e o MOTOR, não.
               Passar dado dentro do HTML já deu errado uma vez: a fila
               chegou como texto na janelinha. Agora o dado é atribuído
               direto, como texto simples (que sobrevive ao recarregamento
               desta página), e o motor entra como elemento de script. */
            var casca = cascaHTML(CR.versao || "");
            try { janela.document.open(); } catch (e) { }
            janela.document.write(casca);
            janela.document.close();

            janela.__crTSTjson = JSON.stringify({ fila: fila, versao: CR.versao || "" });

            var script = janela.document.createElement("script");
            script.textContent = "(" + motorTST.toString() + ")();";
            janela.document.body.appendChild(script);

            try { janela.focus(); } catch (e) { }

            /* Explica na tela do app por que o painel foi para outra janela.
               Esta página vai recarregar a cada procedimento salvo e levar o
               app junto — por isso o acompanhamento fica lá. */
            try {
                var st = document.getElementById("cr-exec-status");
                if (st) {
                    st.style.display = "block";
                    st.style.color = "#4dc3ff";
                    st.innerText = "🪟 O painel do TST abriu numa janelinha.\n\n" +
                        "Acompanhe o progresso por lá: esta página recarrega a cada " +
                        "procedimento salvo e leva o app junto — a janelinha não.";
                }
            } catch (e) { }
        }
    });

    /* Exportado para os testes conseguirem rodar o motor da janelinha
       fora do navegador (tests/tst-portal-falso.js). Não é usado em produção. */
    CR.__tst = { motor: motorTST, casca: cascaHTML };


    /* ────────────────────────────────────────────────────────────
     *  GUARDADOS, DESATIVADOS
     *
     *  Ficam aqui por história e para poder voltar atrás. Para usar
     *  qualquer um deles, troque ativo: false por ativo: true — e
     *  desative o de cima, senão dois robôs disputam a mesma chave.
     * ──────────────────────────────────────────────────────────── */

    CR.registrar({
        chave: "TST_JANELINHA_ORIGINAL",
        nome: "TST (janelinha original do colega, guardada)",
        tipo: "padrao",
        ativo: false,
        portal: {
            seletores: ["input[value=\"Adicionar Procedimento\"]"],
            nota: "Botão \"Adicionar Procedimento\" (a tela recarrega a cada item)"
        },
        origem: "central.js v2.1.0, linhas 1332-1346",
        executar: () => {
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
        }
    });

    CR.registrar({
        chave: "TST_MOLDURA_DESATIVADA",
        nome: "TST (moldura — não serve neste portal, guardada)",
        tipo: "moldura",
        ativo: false,
        portal: {
            seletores: ["input[value=\"Adicionar Procedimento\"]", "#noreset_txCodTabela"],
            nota: "Botão de adicionar e campo da tabela TUSS (a tela recarrega a cada item)"
        },
        origem: "reescrito em set/2026 a partir do robô de janelinha do colega",
        executar: (texto, ctx) => {
            const U = CR.utils;

            /* ORDEM DA COLAGEM PRESERVADA. O robô antigo jogava os códigos
               repetidos para o fim da lista; este mantém a ordem em que
               foram colados, como nos demais convênios. */
            const fila = U.montarFila(texto);
            if (!fila.length) {
                ctx.status("Nenhum código de 8 dígitos encontrado no texto colado.");
                ctx.fim();
                return;
            }

            const anotar = m => { try { CR.log.info("TST · " + m); } catch (e) { } };
            const pausa = ms => new Promise(r => setTimeout(r, ms));
            const doc = () => ctx.doc();

            const BOTAO_ADICIONAR =
                "input[value='Adicionar Procedimento'],input[name='adicionarProcedimento']";

            /* ARMADILHA: o teste "offsetParent !== null" dá FALSO para
               elemento com position:fixed — que está na cara do usuário.
               Por isso conferimos por três caminhos antes de desistir. */
            const visivel = el => {
                if (!el || el.disabled) return false;
                try {
                    if (el.offsetParent !== null) return true;
                    if (el.getClientRects && el.getClientRects().length) return true;
                    const est = ctx.win().getComputedStyle(el);
                    if (est && est.position === "fixed" &&
                        est.display !== "none" && est.visibility !== "hidden") return true;
                } catch (e) { }
                return false;
            };

            /* Espera um elemento aparecer, ficar visível e habilitado.
               Durante o recarregamento o documento some por um instante —
               por isso cada leitura vai dentro de um try. */
            async function esperar(sel, teto, oque) {
                let t = 0;
                teto = teto || 8000;
                while (t < teto) {
                    if (!ctx.ativo()) throw new Error("Parado");
                    let el = null;
                    try { el = doc().querySelector(sel); } catch (e) { el = null; }
                    if (visivel(el)) return el;
                    await pausa(150);
                    t += 150;
                }
                throw new Error("não apareceu na tela: " + (oque || sel));
            }

            /* Escreve num campo avisando o portal de todas as formas que
               ele possa estar ouvindo (inclusive jQuery, que este portal usa). */
            const escrever = (campo, valor) => {
                const w = ctx.win();
                try { campo.focus(); } catch (e) { }
                campo.value = valor;
                ["input", "change", "blur"].forEach(nome => {
                    try { campo.dispatchEvent(new w.Event(nome, { bubbles: true })); } catch (e) { }
                });
                try { w.$(campo).trigger("change"); } catch (e) { }
            };

            const valorDe = sel => {
                try { return ((doc().querySelector(sel) || {}).value || "").trim(); }
                catch (e) { return ""; }
            };

            /* A tabela TUSS é 16. Só mexe se ainda não estiver lá — e, quando
               mexe, dá tempo do portal terminar a busca antes de seguir. */
            async function fixarTabela() {
                const campo = await esperar("#noreset_txCodTabela", 8000, "campo da tabela TUSS");
                if (valorDe("#noreset_txCodTabela") === "16") return false;
                escrever(campo, "16");
                anotar("tabela TUSS definida — esperando o portal terminar a busca");
                await pausa(1200);
                return true;
            }

            /* AQUI mora a correção do primeiro código: escreve e confere.
               Se o portal apagou (porque estava buscando a tabela), escreve
               de novo, até seis vezes. */
            async function escreverCodigo(cod) {
                for (let tentativa = 1; tentativa <= 6; tentativa++) {
                    const campo = await esperar("#codItemProcedimento", 8000, "campo do código");
                    escrever(campo, cod);
                    await pausa(450);
                    if (valorDe("#codItemProcedimento").indexOf(cod) !== -1) {
                        if (tentativa > 1) anotar(cod + " ficou no campo na tentativa " + tentativa);
                        return true;
                    }
                    anotar("o portal limpou o campo do código (tentativa " + tentativa + ") — escrevendo de novo");
                    await pausa(600);
                }
                return false;
            }

            async function escreverQuantidade(q) {
                let campo = null;
                try { campo = doc().getElementById("procedimento.numQtdSolicitada"); } catch (e) { }
                if (!campo) return;
                escrever(campo, q);
                await pausa(150);
            }

            /* Acha o botão de salvar do diálogo. ARMADILHA CONHECIDA: a
               célula que envolve o botão também casa com a busca por texto,
               e clicar nela não faz nada — por isso descemos até o elemento
               mais interno que seja clicável de verdade. */
            async function acharSalvar() {
                const querAchar = /salvar|confirmar|gravar|^ok$/i;
                let t = 0;
                while (t < 8000) {
                    if (!ctx.ativo()) throw new Error("Parado");
                    try {
                        const d = doc();
                        const painel = d.querySelector(".ui-dialog-buttonpane");
                        const candidatos = Array.from(
                            (painel || d).querySelectorAll("button,input[type=button],input[type=submit],a"));
                        for (const el of candidatos) {
                            /* innerText some quando o elemento não está desenhado;
                               textContent nunca some. Ler os dois evita não achar
                               um botão que está ali na frente. */
                            const rotulo = (el.innerText || el.textContent || el.value || "").trim();
                            if (!querAchar.test(rotulo)) continue;
                            if (!visivel(el)) continue;
                            const dentro = el.querySelector("span,b,font");
                            return (dentro && (dentro.textContent || "").trim()) ? dentro : el;
                        }
                    } catch (e) { }
                    await pausa(150);
                    t += 150;
                }
                throw new Error("não achei o botão de salvar do procedimento");
            }

            /* Depois de salvar, o portal recarrega a tela inteira.
               Só seguimos quando ela voltar pronta. */
            async function esperarTelaVoltar() {
                let t = 0;
                while (t < 25000) {
                    if (!ctx.ativo()) throw new Error("Parado");
                    let pronto = false;
                    try {
                        const d = doc();
                        pronto = !!(d && d.readyState === "complete" && d.querySelector(BOTAO_ADICIONAR));
                    } catch (e) { pronto = false; }
                    if (pronto) return true;
                    await pausa(200);
                    t += 200;
                }
                throw new Error("a tela do portal não voltou depois de salvar");
            }

            /* Quantas vezes o código aparece na TELA (fora do diálogo).
               O diálogo é ignorado de propósito: enquanto ele está aberto o
               código está lá dentro, e contar isso enganaria a conferência.
               Devolve -1 quando não deu para ler — normalmente porque a tela
               está no meio do recarregamento. */
            const contarNaTela = cod => {
                try {
                    const d = doc();
                    let txt = "";
                    Array.from(d.body.children).forEach(el => {
                        if (el.classList && el.classList.contains("ui-dialog")) return;
                        txt += " " + (el.textContent || "");
                        if (el.querySelectorAll) {
                            el.querySelectorAll("input,select,textarea").forEach(c => {
                                txt += " " + (c.value || "");
                            });
                        }
                    });
                    let n = 0, i = 0;
                    while ((i = txt.indexOf(cod, i)) !== -1) { n++; i += cod.length; }
                    return n;
                } catch (e) { return -1; }
            };

            /* ARMADILHA MAIS CARA DO PROJETO: mandar o mesmo item duas vezes.
               Se o robô desiste antes de o portal responder e tenta de novo, o
               portal acusa duplicidade — e o exame entra dobrado ou parece
               recusado. Por isso aqui NÃO se conta o tempo: espera-se o código
               APARECER na lista, com folga larga. */
            async function esperarEntrar(cod, tinhaAntes) {
                let t = 0;
                while (t < 20000) {
                    if (!ctx.ativo()) throw new Error("Parado");
                    const agora = contarNaTela(cod);
                    if (agora > tinhaAntes) return true;
                    await pausa(250);
                    t += 250;
                }
                return false;
            }

            /* Se um item deu errado no meio, o diálogo pode ter ficado aberto
               e travaria o próximo. Fecha antes de tentar de novo. */
            async function fecharDialogo() {
                try {
                    const d = doc();
                    const fechar = d.querySelector(".ui-dialog-titlebar-close");
                    if (fechar) { fechar.click(); await pausa(400); return; }
                    const botoes = Array.from(d.querySelectorAll(".ui-dialog-buttonpane button"));
                    for (const b of botoes) {
                        if (/cancelar|fechar/i.test(b.innerText || b.textContent || "")) { b.click(); await pausa(400); return; }
                    }
                } catch (e) { }
            }

            async function lancar(cod, qtd, tinhaAntes) {
                await esperar(BOTAO_ADICIONAR, 12000, "botão Adicionar Procedimento");
                await pausa(300);

                let botao = null;
                try { botao = doc().querySelector(BOTAO_ADICIONAR); } catch (e) { }
                if (!botao) throw new Error("o botão Adicionar Procedimento sumiu da tela");
                botao.click();

                await fixarTabela();

                if (!await escreverCodigo(cod)) {
                    throw new Error("o portal não aceitou manter o código " + cod + " no campo");
                }

                await escreverQuantidade(qtd);
                await pausa(400);

                (await acharSalvar()).click();

                /* Espera o código APARECER na lista — não um tempo qualquer. */
                const entrou = await esperarEntrar(cod, tinhaAntes);
                await esperarTelaVoltar();
                await pausa(200);
                return entrou;
            }

            (async function () {
                const comeco = Date.now();
                const naoEntraram = [];
                let entraram = 0;

                anotar("iniciando " + fila.length + " código(s) na moldura, na ordem colada");

                for (let i = 0; i < fila.length; i++) {
                    if (!ctx.ativo()) return;
                    const cod = fila[i].cod, qtd = fila[i].qtd;

                    ctx.status("⏳ Item " + (i + 1) + "/" + fila.length + ": " + cod +
                        (qtd > 1 ? "  (quantidade " + qtd + ")" : ""));

                    /* Quanto já havia deste código na tela ANTES de tentar.
                       É a régua para saber se o item entrou de verdade. */
                    const tinhaAntes = Math.max(0, contarNaTela(cod));

                    let deu = false;
                    for (let volta = 1; volta <= 2 && !deu; volta++) {
                        try {
                            deu = await lancar(cod, qtd, tinhaAntes);
                            if (!deu) anotar(cod + ": salvou mas não apareceu na lista");
                        } catch (e) {
                            if (e.message === "Parado") return;
                            anotar(cod + ": " + e.message);
                            await fecharDialogo();
                        }

                        if (!deu && volta === 1) {
                            /* Antes de repetir, conferir de novo: portal lento pode
                               ter registrado depois da hora. ENTROU tem prioridade
                               sobre repetir — repetir é o que gera duplicidade. */
                            await pausa(2000);
                            if (contarNaTela(cod) > tinhaAntes) {
                                anotar(cod + " entrou com atraso — não vou repetir");
                                deu = true;
                            } else {
                                ctx.status("↻ " + cod + " não entrou — tentando de novo...");
                                await fecharDialogo();
                            }
                        }
                    }

                    if (deu) entraram++; else naoEntraram.push(cod);
                }

                const tempo = U.formatarDuracao(Date.now() - comeco);
                if (naoEntraram.length === 0) {
                    ctx.status("✅ Automação concluída!\n📋 " + entraram + "/" + fila.length +
                        " códigos lançados no portal · " + tempo);
                    anotar("fim — " + entraram + "/" + fila.length + " em " + tempo);
                } else {
                    ctx.status("⚠️ Terminou com pendência.\n📋 " + entraram + "/" + fila.length +
                        " lançados · " + tempo + "\nNão entraram: " + naoEntraram.join(", ") +
                        "\nConfira esses no portal antes de fechar.");
                    anotar("fim — não entraram: " + naoEntraram.join(", "));
                }
                ctx.fim();
            })();
        }
    });

    CR.registrar({
        chave: "TST_DESATIVADO_MOLDURA",
        nome: "TST (primeira tentativa de moldura, guardada)",
        tipo: "moldura",
        ativo: false,
        origem: "central.js v2.1.0, linhas 4336-4409",
        executar: (texto, ctx) => {
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
        }
    });

})(window.CentralRobos);
