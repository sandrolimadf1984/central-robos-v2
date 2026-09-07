/* ============================================================
 *  TST
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
        chave: "TST",
        nome: "TST (janelinha — plano B)",
        tipo: "padrao",
        ativo: true,
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

    /* ════════════════════════════════════════════════════════════
     *  TST — VERSÃO QUE RODA NA MOLDURA  (esta é a que vale)
     *
     *  POR QUE ESTE ROBÔ EXISTE
     *
     *  O portal do TST recarrega a página INTEIRA a cada procedimento
     *  salvo (SolicitacaoSpSadtManter.do). Como o app mora dentro da
     *  página do portal, ele morria junto no primeiro código — por isso
     *  a solução antiga abria uma janelinha separada, que sobrevivia ao
     *  recarregamento e pilotava a página de fora.
     *
     *  O preço disso era alto: janela estranha na cara do atendente e
     *  contagem nenhuma no painel do app.
     *
     *  Na moldura o problema some pela raiz: o portal passa a viver
     *  dentro de um quadro e é ELE que recarrega. O app fica por fora,
     *  intacto, contando e mostrando o progresso como em qualquer outro
     *  convênio.
     *
     *  O PRIMEIRO CÓDIGO QUE NÃO ENTRAVA
     *
     *  O campo da tabela chama-se #noreset_txCodTabela — o "noreset" no
     *  nome entrega o segredo: o portal NÃO limpa esse campo entre um
     *  procedimento e outro.
     *
     *  Resultado: na PRIMEIRA vez ele está vazio, receber "16" é uma
     *  mudança de verdade, e o portal sai para buscar a tabela TUSS —
     *  e enquanto busca, ele LIMPA o campo do código. O robô antigo já
     *  tinha digitado, o portal apagava, e o primeiro exame se perdia.
     *  Da segunda em diante a tabela já estava em 16, nada era buscado,
     *  nada era apagado, e tudo entrava.
     *
     *  A correção não depende de adivinhar tempo: o robô escreve o
     *  código e CONFERE se ele ficou lá. Se o portal apagou, escreve de
     *  novo, até seis vezes. E, depois de salvar, confere se o código
     *  apareceu mesmo na tela antes de dar o item por entrado.
     * ════════════════════════════════════════════════════════════ */
    CR.registrar({
        chave: "TST",
        nome: "TST",
        tipo: "moldura",
        ativo: true,
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
