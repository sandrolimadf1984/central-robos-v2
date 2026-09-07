# Registro de mudanças

Todas as mudanças relevantes da Central de Automação ficam anotadas aqui.
Formato: o mais recente em cima.

---

## [3.5.0] — 2026-09-07

**O TST voltou a ser exatamente o que era.** Nenhuma das minhas três tentativas
funcionou no portal real, e o certo era parar de insistir.

### O que está no ar agora

O robô original do colega, com a janelinha de controle de sempre —
**byte a byte idêntico** ao do `central.js` 2.1.0 (sha `be21b30cf2a40546`).
A ficha dele em `src/config/convenios.js` também voltou a ser a original
(`modo: "tst"`), caractere por caractere.

Ou seja: o TST se comporta hoje exatamente como se comportava antes de eu
encostar nele.

### Defeito conhecido, que volta junto

O primeiro código costuma não entrar. A causa está entendida e anotada em
`docs/ARMADILHAS.md`: o campo `#noreset_txCodTabela` guarda o valor entre um item
e outro, então só na primeira vez o portal sai para buscar a tabela TUSS — e
enquanto busca, limpa o campo do código.

Entender a causa não bastou. Uma nova tentativa só deve acontecer com teste no
portal real e mexendo o mínimo possível.

### Guardadas, desativadas

As três tentativas continuam no arquivo, fora do ar, para não se perder o que foi
aprendido:

| Guardado | O que era | Por que saiu |
|---|---|---|
| `TST_PAINEL_NOVO_DESATIVADO` | Painel completo na janelinha | No portal real os códigos não chegaram na janela |
| `TST_MOLDURA_DESATIVADA` | Robô de moldura da 3.3.0 | A moldura devolve a tela inicial do convênio |
| `TST_DESATIVADO_MOLDURA` | Primeira tentativa de moldura | Já vinha desativada da 2.1.0 |

### O que ficou de bom destas rodadas

Nada disso encosta no TST, e tudo continua valendo:

- a **trava de segurança da moldura** (3.4.0), que desiste e devolve a página
  como estava quando a tela recarregada não tem os campos esperados
- as armadilhas anotadas em `docs/ARMADILHAS.md`: o campo `noreset`, a moldura
  que recarrega, `innerText` × `textContent`, `offsetParent` com `position:fixed`,
  e não passar dado por dentro de HTML montado com texto
- a réplica do portal do TST em `tests/`, que fica como ponto de partida

---

## [3.4.1] — 2026-09-07

Correção do defeito visto no primeiro uso real da janelinha: o painel abriu
dizendo **"Item 1 de 583"** e **"undefined"**, com 11 códigos colados.

### O que era

Os códigos iam para a janelinha **dentro do HTML**, num `<script>` montado por
texto. No Chrome esse caminho entregou a fila **como texto** em vez de lista —
por isso o painel contou 583 "itens" (as letras do texto) e o primeiro item veio
`undefined`. Nada foi mexido no portal, mas o painel ficou parado.

O teste da versão anterior não pegou isso porque ele **injetava os dados na mão**
na janelinha, pulando justamente o trecho que falhava.

### Corrigido

- Os dados **não passam mais por dentro do HTML**. A casca vai por
  `document.write`; a fila é atribuída direto à janela como texto simples; e o
  motor entra como elemento de script. Sem montagem de HTML no meio, não há como
  o dado se perder na tradução.
- **Trava de entrada.** Antes de encostar no portal, o painel confere item por
  item se a fila é uma lista de códigos de 8 dígitos com quantidade. Se não for,
  ele **para, explica o que recebeu e não mexe em nada**.
- O painel agora registra, na primeira linha, quais códigos recebeu — dá para
  conferir de bate-pronto se chegou tudo.

### Adicionado

- O teste da réplica passou a nascer **exatamente como no navegador**: casca por
  `document.write`, dados por atribuição, motor por elemento de script. É o
  caminho de produção inteiro.
- Cenário novo no teste: **fila corrompida**. Confere que o painel recusa,
  explica, e que nada é mexido no portal.

---

## [3.4.0] — 2026-09-06

Correção da 3.3.0 depois do teste no portal real: **a moldura não serve para o
TST**, e o motivo vale como regra para o projeto inteiro.

### O que o teste real mostrou

Ao iniciar, a tela do portal voltava para a **página inicial do convênio**.

Causa: a moldura precisa **buscar a página de novo** para colocá-la dentro do
quadro. No TST, a tela em que o atendente está é resultado de um **envio de
formulário** — pedir o mesmo endereço de novo devolve a tela inicial, não a guia.

Isso vale para qualquer portal assim, não só o TST.

### Alterado

- **O TST voltou para a janelinha**, que é a única arquitetura que funciona
  naquele portal: ela não recarrega, então sobrevive, e a aba do portal continua
  na tela certa porque ninguém pede nada de novo a ela.
- **A janelinha virou um painel de verdade**, com a cara do app: barra de
  progresso, percentual, código atual, item X de Y, concluídos / pendentes /
  erros, andamento e botão de copiar relatório.
- **A janelinha continua trabalhando minimizada** — ela tem a própria batida em
  Web Worker. Some a ressalva do TST que existia desde a 3.1.0.
- O painel do app explica, ao iniciar, por que o acompanhamento foi para a
  janelinha.

### Mantido da 3.3.0

- O primeiro código entra (escreve e confere, até 6 vezes)
- Nada entra duas vezes (conferência por contagem, "entrou" vence "repetir")
- A ordem da colagem é respeitada

### Adicionado

- **Trava de segurança da moldura.** Antes de soltar qualquer robô de moldura, a
  Central confere se os campos que ele espera estão na tela recarregada. Se não
  estiverem, ela desiste, **devolve a página exatamente como estava** e explica o
  que houve. Esta falha teria sido explicada em vez de confusa.
- O teste da réplica do TST passou a exercitar o painel da janelinha de verdade
  (duas janelas, opener e tudo), conferindo inclusive a contagem na tela

### Guardados, desativados

`TST_JANELINHA_ORIGINAL` (a do colega), `TST_MOLDURA_DESATIVADA` (a tentativa da
3.3.0) e `TST_DESATIVADO_MOLDURA` (a primeira tentativa). Para usar qualquer uma,
troque `ativo: false` por `true` e desative a de cima.

---

## [3.3.0] — 2026-09-06

Reescrita do robô do TST. **É a primeira mudança em robô que estava no ar** —
feita a pedido, com a versão antiga guardada e ligada como plano B automático.

### O que era

O portal do TST recarrega a página inteira a cada procedimento salvo. Como o app
mora dentro da página do portal, ele morria junto no primeiro código. Por isso a
solução antiga abria uma janelinha separada, que sobrevivia ao recarregamento e
pilotava a página de fora — com dois preços: uma janela estranha na cara do
atendente e contagem nenhuma no painel do app.

E havia um defeito: **o primeiro código não entrava**.

### A causa do primeiro código

O campo da tabela chama-se `#noreset_txCodTabela` — o "noreset" do nome entrega
tudo: o portal **não limpa esse campo** entre um procedimento e outro.

Na primeira vez ele está vazio, então receber "16" é uma mudança de verdade e o
portal sai para buscar a tabela TUSS. Enquanto busca, ele **limpa o campo do
código**. O robô já tinha digitado, o portal apagava, e o primeiro exame se
perdia. Da segunda em diante a tabela já estava em 16, nada era buscado, nada
era apagado.

### Alterado

- **O TST passou a rodar na moldura**, como TRF, Postal e Câmara: sem janela
  separada, com progresso e contagem no painel do app
- **A ordem da colagem passou a ser respeitada.** O robô antigo jogava os códigos
  repetidos para o fim da lista
- A janelinha antiga continua registrada e **entra sozinha** se o portal recusar
  ser embutido na moldura

### Corrigido

- **O primeiro código agora entra.** O robô escreve e CONFERE se ficou; se o
  portal apagou, escreve de novo (até 6 vezes). Não depende de acertar tempo
- **Nada entra duas vezes.** A conferência é por contagem do código na tela, com
  20 segundos de folga, e "entrou" tem prioridade sobre "repetir" — é a lição
  que custou caro no ASSEDF
- **Achar botão por `innerText` falhava** quando o elemento não expõe esse texto.
  Agora lê `textContent` também
- **`offsetParent !== null` dava elemento invisível como falso** para botão com
  `position: fixed`, que está na cara do usuário. Agora a visibilidade é
  conferida por três caminhos

### Adicionado

- **Réplica do portal do TST** (`node tests/tst-portal-falso.js`), que reproduz o
  defeito de propósito. O teste roda os dois robôs: o antigo, mostrando o
  primeiro código se perdendo, e o novo, mostrando o problema resolvido. Inclui
  um cenário de **portal lento**, que é onde a duplicidade costuma aparecer
- O workflow do GitHub passou a rodar essa réplica

### Como voltar atrás

Em `src/convenios/tst.js`, no robô de `tipo: "moldura"`, troque `ativo: true` por
`ativo: false`. A janelinha volta a ser a única, exatamente como era.

---

## [3.2.0] — 2026-09-06

Versão sobre uma pergunta certeira: *"o histórico não vai deixar o robô mais
pesado com o tempo?"*. Medido: o histórico não pesa (teto de 60 execuções, ~11 KB,
0,07 ms para registrar). Mas a medição achou três coisas que cresciam ou
desperdiçavam à toa — todas corrigidas.

### Corrigido

- **A fila guardava o texto colado duas vezes.** O campo `textoOriginal` era
  gravado e nunca lido por ninguém. Uma fila de 200 códigos ocupava 11,2 KB;
  agora ocupa 9,3 KB, e a retomada continua igual.
- **Filas de convênios esquecidos ficavam guardadas para sempre.** A validade de
  12 horas só era conferida quando alguém reabria aquele convênio específico.
  Agora existe uma faxina que roda quando a Central abre e varre todas de uma vez.
- **A lista de avisos já lidos crescia sem teto.** Cada recado novo deixava mais
  uma linha ali, para sempre. Agora guarda só os 40 mais recentes.

### Adicionado

- No painel **⚙️ Versão**: quanto a Central ocupa neste navegador, com botão
  **🗑 APAGAR TUDO** (não afeta robôs nem convênios)
- 5 testes novos que provam que nada cresce sem fim: teto do histórico, corte da
  mensagem de erro, fila sem duplicata, faxina das filas vencidas e teto dos
  avisos lidos

### Números medidos

| | |
|---|---|
| Depois de 750 automações (≈1 ano) | 15,5 KB |
| Depois de 1500 automações (≈2 anos) | 13,6 KB |
| Registrar uma automação | 0,065 ms |
| Gravar a fila durante a automação (a cada 2,5s) | 0,021 ms |

---

## [3.1.0] — 2026-09-06

### Adicionado

- **Segundo plano de verdade.** A automação continua andando com a aba
  minimizada ou com outra aba na frente:
  - batida principal num **Web Worker**, que o Chrome não freia (o thread
    principal de aba escondida é freado de 100ms para 1s e, depois de 5
    minutos, para 1 por minuto)
  - a página passa a enxergar `document.hidden = false` o tempo todo — muito
    portal se cala sozinho ao perceber que saiu da frente
  - `requestAnimationFrame` (que **morre de vez** em aba escondida) passa pela
    agenda da Central enquanto ela estiver no fundo
  - a moldura e as janelas que o robô abre recebem o mesmo tratamento
  - o som que mantém a aba acordada é religado sozinho se o Chrome derrubar
- Aviso no painel de progresso: *🔽 Pode minimizar e trabalhar em outra aba*
- Teste automatizado que simula minimizar a aba (`node tests/segundo-plano.js`)
- O workflow do GitHub passou a rodar esse teste também

### Corrigido

- **O reforço por mensagens podia derrubar a automação inteira.** Se o portal
  bloqueasse o `MessageChannel`, o erro subia e a automação parava. Agora existe
  uma corrente de reservas: Worker → placa de som → mensagens → relógio comum.
  Descoberto pelo novo teste de segundo plano.
- `agendarPulso` chamava os relógios originais sem conferir se eles existiam,
  o que quebrava no modo leve

### Removido

- A seção **⭐ MAIS UTILIZADOS** da tela inicial, a pedido

### Preservado

- O modo leve (`semMotor`) continua **sem tocar no relógio da página** — é o que
  protege o Amil e os demais portais em Angular
- Os 25 robôs continuam byte a byte idênticos

---

## [3.0.0] — 2026-09-06

Primeira versão do repositório de testes. O objetivo desta versão foi
**reorganizar sem quebrar**: a aplicação saiu de um arquivo único de 446 KB
para 30 módulos, e todo robô continuou exatamente como estava.

### Adicionado

- Painel de progresso com barra, percentual, código atual e item X de Y
- Fila de códigos com resumo (`5 lançamentos · 3 códigos únicos`) e remoção item a item
- **Continuar de onde parou** — manda para o robô só os códigos que ainda não
  apareceram na tela do portal, preservando ordem e quantidade
- Histórico das 60 últimas automações, guardado no navegador
- Estatísticas derivadas do histórico (com o tempo economizado declarado como estimativa)
- Painel de erro com convênio, código, problema, causa provável e ações
- Modo de diagnóstico (`🛠️ DIAGNÓSTICO`) com relatório copiável
- Sistema centralizado de logs, com botão de copiar
- Favoritos / mais utilizados
- Situação de cada robô no card, controlada por `status.json`
- Avisos por `avisos.json`, geral e por convênio, com botão ENTENDI
- Tela de versão e pasta `releases/` para voltar atrás
- 25 testes automatizados (`node tests/rodar.js` ou `tests/index.html`)
- Arquivo único de reserva, usado se algum módulo não baixar

### Alterado

- `central.js` deixou de ser a aplicação e virou um **carregador** de ~240 linhas
- Cada convênio ganhou seu próprio arquivo em `src/convenios/`
- Funções comuns foram para `src/core/`
- Contagem de progresso passou a funcionar também nos caminhos **moldura** e
  **janela** (antes só o caminho padrão contava)
- A busca passou a achar também pela chave do robô, não só pelo nome do card

### Preservado (de propósito)

- **Os 25 robôs estão byte a byte idênticos** aos do `central.js` 2.1.0
- As quatro arquiteturas de execução continuam convivendo
- A ordem de despacho continua: janela → moldura → padrão
- Os robôs desativados continuam guardados (`TRE_MODELO_ANTIGO_DESATIVADO`,
  `CAMARA_JANELINHA_DESATIVADA`, `PROASA_CNU_DESATIVADO`, `TST_DESATIVADO_MOLDURA`)
- O modo leve do Amil (`semMotor`) e todas as demais fichas
- `aviso.txt` continua sendo lido, para nada se perder

### Não feito (e por quê)

- **Os robôs existentes não passaram a usar as funções comuns do núcleo.**
  O plano pedia isso, mas reescrever robô que funciona sem poder testar no portal
  real já quebrou o Amil e o TST antes. As funções comuns existem para robôs
  novos; os atuais seguem com o código deles.
- **Sem verificação de integridade por hash.** Ela exigiria regerar as
  assinaturas a cada edição feita pelo GitHub, e uma assinatura desatualizada
  deixaria a equipe sem a ferramenta. O risco não compensou.

---

## [2.1.0] — versão em produção

A Central que a equipe usa hoje, em
[`sandrolimadf1984/central-robos`](https://github.com/sandrolimadf1984/central-robos).
Guardada aqui em `releases/v2.1.0-legado/central.js`, intacta.

- 30 convênios, 25 robôs, arquivo único de 446 KB
- Campo de pesquisa de convênio
- Logos reais dos convênios embutidas
- Motor de fundo com relógio da placa de som
- Modo leve para portais Angular (Amil)
