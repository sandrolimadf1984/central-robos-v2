/* ============================================================
 *  TESTES DA CENTRAL
 *
 *  Cobrem só o que NÃO depende de portal nenhum: leitura dos
 *  códigos colados, montagem da fila, contagem, retomada,
 *  histórico e estatísticas.
 *
 *  Rodam de dois jeitos:
 *    · no navegador  → abra tests/index.html
 *    · no computador → node tests/testes.js
 *
 *  Vários destes testes existem por causa de erro que já
 *  aconteceu de verdade. Estão marcados com "REGRA DE OURO".
 * ============================================================ */
(function (raiz, definir) {
    if (typeof module !== 'undefined' && module.exports) module.exports = definir;
    else raiz.TESTES = definir;
})(typeof window !== 'undefined' ? window : global, function (CR) {

    var casos = [];
    function teste(nome, fn) { casos.push({ nome: nome, fn: fn }); }

    function igual(a, b, oque) {
        var x = JSON.stringify(a), y = JSON.stringify(b);
        if (x !== y) throw new Error((oque || 'valor') + '\n      esperado: ' + y + '\n      veio:     ' + x);
    }
    function verdade(v, oque) {
        if (!v) throw new Error(oque || 'esperava verdadeiro');
    }

    var U = CR.utils, F = CR.fila, H = CR.historico, E = CR.stats;

    /* ══════════ LEITURA DOS CÓDIGOS COLADOS ══════════ */

    teste('REGRA DE OURO: mantém a ordem exata da colagem', function () {
        var texto = '40901220\n31001112\n40808010\n20101015';
        igual(U.extrairCodigos(texto),
              ['40901220', '31001112', '40808010', '20101015'],
              'ordem dos códigos');
    });

    teste('REGRA DE OURO: número maior colado depois NÃO sobe para o começo', function () {
        /* Este é o erro que o Object.keys() causava: ele devolve chave
           numérica em ordem crescente e reordenava a lista sozinho. */
        var texto = '99999999 11111111 55555555';
        igual(U.codigosUnicos(texto), ['99999999', '11111111', '55555555'], 'ordem preservada');
    });

    teste('lê códigos separados por espaço, vírgula, tabulação ou linha', function () {
        igual(U.extrairCodigos('40901220, 31001112\t40808010\n20101015').length, 4, 'quantidade');
    });

    teste('ignora número que não tem 8 dígitos', function () {
        igual(U.extrairCodigos('123 40901220 123456789012 99'), ['40901220'], 'só o de 8 dígitos');
    });

    teste('texto vazio ou nulo não quebra', function () {
        igual(U.extrairCodigos(''), [], 'vazio');
        igual(U.extrairCodigos(null), [], 'nulo');
        igual(U.montarFila(undefined), [], 'fila de nada');
    });

    /* ══════════ MONTAGEM DA FILA ══════════ */

    teste('código repetido vira quantidade, sem duplicar a linha', function () {
        var fila = U.montarFila('40301120 40301120 40301120 40301121 40301122');
        igual(fila.length, 3, 'três códigos únicos');
        igual(fila[0], { cod: '40301120', qtd: 3, estado: 'pendente' }, 'primeiro item');
        igual(fila[1].qtd, 1, 'segundo item');
    });

    teste('repetido fora de sequência conta certo e fica na posição da 1ª aparição', function () {
        var fila = U.montarFila('11111111 22222222 11111111');
        igual(fila.map(function (i) { return i.cod; }), ['11111111', '22222222'], 'ordem');
        igual(fila[0].qtd, 2, 'quantidade do repetido');
    });

    teste('resumo da fila: 5 lançamentos e 3 códigos únicos', function () {
        var fila = U.montarFila('40301120 40301120 40301120 40301121 40301122');
        igual(U.resumoFila(fila), { lancamentos: 5, unicos: 3 }, 'resumo');
    });

    teste('fila volta a virar texto sem perder quantidade nem ordem', function () {
        var texto = '11111111\n11111111\n22222222';
        igual(U.filaParaTexto(U.montarFila(texto)), texto, 'ida e volta');
    });

    /* ══════════ CONTAGEM E RETOMADA ══════════ */

    teste('contagem separa feitos, pendentes e erros', function () {
        var fila = F.criar('TESTE', '11111111 22222222 33333333');
        igual(F.contagem(fila), { total: 3, feitos: 0, pendentes: 3, erros: 0 }, 'no começo');
        F.marcarPeloPortal(fila, ['11111111']);
        igual(F.contagem(fila).feitos, 1, 'depois de um entrar');
        F.marcarErro(fila, '22222222', 'recusado');
        igual(F.contagem(fila), { total: 3, feitos: 1, pendentes: 1, erros: 1 }, 'com erro');
    });

    teste('CONTINUAR DE ONDE PAROU manda só o que falta, na ordem certa', function () {
        var fila = F.criar('TESTE', '11111111 22222222 33333333 44444444');
        F.marcarPeloPortal(fila, ['11111111', '22222222']);
        igual(F.pendentesComoTexto(fila), '33333333\n44444444', 'só os pendentes');
    });

    teste('retomada preserva a quantidade do código repetido', function () {
        var fila = F.criar('TESTE', '11111111 22222222 22222222 22222222');
        F.marcarPeloPortal(fila, ['11111111']);
        igual(F.pendentesComoTexto(fila), '22222222\n22222222\n22222222', 'quantidade mantida');
    });

    teste('código que já estava marcado não é remarcado nem contado duas vezes', function () {
        var fila = F.criar('TESTE', '11111111 22222222');
        F.marcarPeloPortal(fila, ['11111111']);
        F.marcarPeloPortal(fila, ['11111111']);
        F.marcarPeloPortal(fila, ['11111111']);
        igual(F.contagem(fila).feitos, 1, 'contou uma vez só');
    });

    teste('portal sem nenhum código na tela deixa tudo pendente', function () {
        var fila = F.criar('TESTE', '11111111 22222222');
        F.marcarPeloPortal(fila, []);
        igual(F.contagem(fila).pendentes, 2, 'nada entrou');
    });

    teste('remover um código tira ele da fila e refaz o resumo', function () {
        var fila = F.criar('TESTE', '11111111 11111111 22222222');
        F.remover(fila, '11111111');
        igual(fila.itens.length, 1, 'sobrou um');
        igual(fila.lancamentos, 1, 'resumo refeito');
    });

    /* ══════════ PROGRESSO ══════════ */

    teste('percentual e barra acompanham o andamento', function () {
        igual(U.percentual(0, 20), 0, 'no começo');
        igual(U.percentual(15, 20), 75, 'no meio');
        igual(U.percentual(20, 20), 100, 'no fim');
        igual(U.percentual(3, 0), 0, 'sem total não divide por zero');
        igual(U.barra(5, 10, 10), '█████░░░░░', 'barra pela metade');
    });

    teste('duração sai em português e arredondada', function () {
        igual(U.formatarDuracao(45000), '45s', 'segundos');
        igual(U.formatarDuracao(92000), '1min 32s', 'minutos');
        igual(U.formatarDuracao(3720000), '1h 2min', 'horas');
        igual(U.formatarDuracao(0), '0s', 'zero');
        igual(U.formatarDuracao(null), '0s', 'nulo');
    });

    /* ══════════ BUSCA ══════════ */

    teste('busca acha "Unity Saúde" digitando "unity saude"', function () {
        verdade(U.semAcento('Unity Saúde').indexOf(U.semAcento('unity saude')) !== -1, 'sem acento');
        verdade(U.semAcento('Câmara dos Deputados').indexOf('camara') !== -1, 'com circunflexo');
        verdade(U.semAcento('Sul America').indexOf('sul') !== -1, 'parcial');
    });

    /* ══════════ SEGURANÇA DA TELA ══════════ */

    teste('texto do usuário não vira HTML na tela', function () {
        igual(U.escapar('<script>x</script>'), '&lt;script&gt;x&lt;/script&gt;', 'escapado');
        igual(U.escapar(null), '', 'nulo vira vazio');
    });

    /* ══════════ HISTÓRICO E ESTATÍSTICAS ══════════ */

    teste('histórico guarda e devolve a execução', function () {
        H.limpar();
        H.registrar({ convenio: 'AMIL', total: 20, feitos: 20, erros: 0, duracao: 60000, situacao: 'concluida' });
        H.registrar({ convenio: 'INAS', total: 15, feitos: 14, erros: 1, duracao: 50000, situacao: 'erro' });
        var l = H.listar();
        igual(l.length, 2, 'duas execuções');
        igual(l[0].convenio, 'INAS', 'mais recente primeiro');
    });

    teste('estatísticas somam certo e apontam o convênio mais usado', function () {
        H.limpar();
        H.registrar({ convenio: 'AMIL', total: 10, feitos: 10, erros: 0, duracao: 20000, situacao: 'concluida' });
        H.registrar({ convenio: 'AMIL', total: 10, feitos: 10, erros: 0, duracao: 20000, situacao: 'concluida' });
        H.registrar({ convenio: 'INAS', total: 5, feitos: 4, erros: 1, duracao: 30000, situacao: 'erro' });
        var e = E.calcular();
        igual(e.automacoes, 3, 'três automações');
        igual(e.codigos, 24, 'códigos processados');
        igual(e.erros, 1, 'erros');
        igual(e.convenioMaisUsado, 'AMIL', 'mais usado');
        verdade(e.economiaMs > 0, 'economia estimada positiva');
    });

    teste('estatísticas sem histórico nenhum não quebram', function () {
        H.limpar();
        var e = E.calcular();
        igual(e.automacoes, 0, 'zero automações');
        igual(e.convenioMaisUsado, '—', 'sem convênio');
    });

    /* ══════════ NADA PODE CRESCER SEM FIM ══════════ */

    teste('o histórico para de crescer no teto, por mais que se use', function () {
        H.limpar();
        for (var i = 0; i < 500; i++) {
            H.registrar({ convenio: 'AMIL', total: 20, feitos: 20, erros: 0,
                          duracao: 45000, situacao: 'concluida',
                          mensagem: '✅ Automação concluída! 20/20 códigos lançados' });
        }
        igual(H.listar().length, 60, 'teto de 60 registros');
        verdade(U.tamanhoGuardado() < 30 * 1024, 'ocupa menos de 30 KB depois de 500 automações');
    });

    teste('mensagem enorme do portal não incha o histórico', function () {
        H.limpar();
        var enorme = new Array(5000).join('erro muito comprido ');
        H.registrar({ convenio: 'INAS', total: 1, feitos: 0, erros: 1,
                      situacao: 'erro', mensagem: enorme });
        verdade(H.listar()[0].mensagem.length <= 400, 'mensagem cortada em 400 caracteres');
    });

    teste('a fila guardada não carrega o texto colado duas vezes', function () {
        var fila = F.criar('TESTE', '11111111 22222222 33333333');
        igual(fila.textoOriginal, undefined, 'o texto original não é guardado');
        verdade(F.pendentesComoTexto(fila).length > 0, 'e mesmo assim a retomada continua funcionando');
    });

    teste('FAXINA: fila vencida é jogada fora mesmo sem ninguém reabrir o convênio', function () {
        U.apagarTudo();
        var velha = F.criar('CONVENIO_ESQUECIDO', '11111111 22222222');
        velha.criadaEm = Date.now() - (13 * 3600 * 1000);   // ontem
        F.guardar(velha);
        var nova = F.criar('CONVENIO_DE_HOJE', '33333333');
        F.guardar(nova);

        igual(U.chaves('fila:').length, 2, 'duas filas guardadas');
        igual(F.limparAntigas(), 1, 'só a vencida foi jogada fora');
        igual(U.chaves('fila:'), ['fila:CONVENIO_DE_HOJE'], 'a de hoje continua');
    });

    teste('avisos já lidos param num teto de 40', function () {
        U.apagar('avisos-vistos');
        for (var i = 0; i < 200; i++) CR.avisos.dispensar('aviso-' + i);
        var guardados = Object.keys(U.ler('avisos-vistos', {}));
        igual(guardados.length, 40, 'teto de 40');
        verdade(guardados.indexOf('aviso-199') !== -1, 'guardou os mais recentes');
        verdade(guardados.indexOf('aviso-0') === -1, 'e descartou os mais antigos');
    });

    /* ══════════ SITUAÇÃO DO CONVÊNIO NO CARD ══════════ */

    teste('convênio não listado no status.json fica normal', function () {
        CR.avisos.status = {};
        igual(CR.avisos.estadoDe('AMIL'), null, 'sem marca nenhuma');
    });

    teste('estado "fora" pinta o card de vermelho e pede confirmação', function () {
        CR.avisos.status = { INAS: { estado: 'fora', nota: 'Site com inconsistência' } };
        var e = CR.avisos.estadoDe('INAS');
        igual(e.texto, 'Site com inconsistência', 'usa a nota escrita no arquivo');
        igual(e.travar, true, 'pede confirmação antes de iniciar');
        verdade(!!e.borda && !!e.fundo, 'tem cor de borda e de fundo');
    });

    teste('sem nota escrita, entra o texto padrão do estado', function () {
        CR.avisos.status = { AMIL: { estado: 'manutencao' } };
        igual(CR.avisos.estadoDe('AMIL').texto, 'Robô em manutenção', 'texto padrão');
    });

    teste('estado "atencao" marca o card mas NÃO trava', function () {
        CR.avisos.status = { TRE: { estado: 'atencao', nota: 'Portal mudou' } };
        var e = CR.avisos.estadoDe('TRE');
        igual(e.travar, false, 'deixa iniciar sem perguntar');
        igual(e.texto, 'Portal mudou', 'mostra a nota');
    });

    teste('estado escrito errado não quebra a tela', function () {
        CR.avisos.status = { PLENUM: { estado: 'inventado', nota: 'oi' } };
        var e = CR.avisos.estadoDe('PLENUM');
        verdade(e !== null && !!e.cor, 'cai num estado seguro em vez de dar erro');
        CR.avisos.status = {};
    });

    /* ══════════ CATÁLOGO DE CONVÊNIOS (quando disponível) ══════════ */

    if (CR.EXIBICAO && CR.infoRobos) {
        teste('todo card aponta para um robô que existe na ficha', function () {
            var faltando = [];
            CR.EXIBICAO.forEach(function (c) {
                if (!CR.infoRobos[c.chave]) faltando.push(c.rotulo + ' -> ' + c.chave);
            });
            igual(faltando, [], 'cards órfãos');
        });

        teste('não há dois cards com o mesmo rótulo', function () {
            var vistos = {}, repetidos = [];
            CR.EXIBICAO.forEach(function (c) {
                if (vistos[c.rotulo]) repetidos.push(c.rotulo);
                vistos[c.rotulo] = true;
            });
            igual(repetidos, [], 'rótulos repetidos');
        });

        teste('os cards estão em ordem alfabética', function () {
            var nomes = CR.EXIBICAO.map(function (c) { return U.semAcento(c.rotulo); });
            var ordenados = nomes.slice().sort();
            igual(nomes, ordenados, 'ordem alfabética');
        });
    }

    /* ══════════ EXECUÇÃO ══════════ */

    return function rodar(mostrar) {
        var ok = 0, falhas = [];
        for (var i = 0; i < casos.length; i++) {
            try {
                casos[i].fn();
                ok++;
                mostrar('ok', casos[i].nome);
            } catch (e) {
                falhas.push({ nome: casos[i].nome, erro: e.message });
                mostrar('falha', casos[i].nome, e.message);
            }
        }
        return { total: casos.length, ok: ok, falhas: falhas };
    };
});
