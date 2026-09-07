# Registro de mudanças

Todas as mudanças relevantes da Central de Automação ficam anotadas aqui.
Formato: o mais recente em cima.

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
