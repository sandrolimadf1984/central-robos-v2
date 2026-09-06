/* ============================================================
 *  CONFIGURAÇÃO DOS CONVÊNIOS
 *
 *  Este é o único arquivo que precisa ser editado para
 *  ACRESCENTAR UM CONVÊNIO NOVO que use um robô já existente.
 *  (Convênio com portal novo também precisa de um arquivo em
 *   src/convenios/ — veja docs/NOVO-CONVENIO.md.)
 *
 *  CR.infoRobos    — ficha técnica de cada robô (modo de entrega)
 *  CR.statusRobo   — onde o robô mostra o progresso dele
 *  CR.contadorRobo — robôs com contador em elemento separado
 *  CR.EXIBICAO     — os cards que aparecem na tela, em ordem alfabética
 *
 *  Tudo abaixo veio do central.js v2.1.0 sem alteração de conteúdo.
 * ============================================================ */
(function (CR) {
    "use strict";

    CR.infoRobos = {
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

    CR.statusRobo = {
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

    CR.contadorRobo = {
        "TJDF": "b403-contador"
    };

    CR.EXIBICAO = [
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

})(window.CentralRobos);
