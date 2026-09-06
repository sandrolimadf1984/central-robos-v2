# Armadilhas já descobertas

Cada item aqui custou muitas rodadas. Guardar.

---

### Ordem dos códigos

Os exames devem entrar no portal **na mesma ordem em que foram colados**.
`Object.keys()` devolve chaves numéricas em ordem crescente e reordena a lista
sozinho. A lista precisa ser montada **percorrendo o texto colado**.

Existem dois testes automatizados só para isso (`REGRA DE OURO`, em
`tests/testes.js`).

---

### Portais que recarregam a tela

TRF, Postal, Câmara e TST recarregam a página a cada item salvo. Robô que rode
dentro da página **morre no primeiro código**. A solução é a **moldura** ou uma
janela de controle.

O TST usa janelinha de controle porque ela sobrevive ao recarregamento e continua
pilotando pelo `window.opener`. **Não tente de novo rodar o TST na própria tela
nem em moldura.**

---

### Portais em Angular (Amil)

O motor de fundo troca os relógios (`setTimeout`/`setInterval`) da página, e
portais modernos **dependem desse relógio** para redesenhar a tela. Com o relógio
tomado, a busca do exame fica presa em "Buscando" para sempre.

Solução: `semMotor: true` na ficha. O Amil roda em **modo leve** — mantém a aba
acordada com som e conexão, mas não troca o relógio.

Se outro portal travar assim, é o mesmo problema.

---

### Achar botão pelo texto

A **célula da tabela** que envolve o botão também casa com a busca por texto, e
clicar nela não faz nada. Sempre desça até o elemento mais interno
(`span` / `a` / `button` / `input`) antes de clicar.

---

### Acionar duas vezes o mesmo item

Se o robô não esperar o portal responder e tentar de novo, o portal acusa
duplicidade e **parece recusa**. No ASSEDF isso fazia relatar "0 de 6" com tudo
recusado, mesmo tendo entrado.

Espere o suficiente e trate "aviso com o item já na lista" como repetição, não
como recusa. E dê prioridade ao "entrou" sobre o aviso.

---

### Funções em outra janela

Em portais com quadros (frames), a função que o botão chama pode viver em outra
janela. No ASSEDF o erro era `Insere is not defined` — a função morava em outro
quadro. Procure em todas as janelas alcançáveis.

---

### Ctrl+F contando dobrado

Os atendentes conferem a quantidade com Ctrl+F, digitando os primeiros dígitos do
código. O painel escondido do robô ficava na página e era contado de novo.

Os painéis são removidos ao terminar — com proteção para nunca remover o menu do
próprio app.

---

### Esconder o que aparece na página

Esconder qualquer elemento novo do corpo da página travava o ASSEFAZ no primeiro
código: o próprio portal cria ali a lista de sugestões. Esconda **apenas** o
painel do robô, reconhecido pelos ids da ficha dele.

---

### Trocar Enter por clique

No ASSEFAZ, trocar "apertar Enter" por "clicar no item da lista" quebrou o robô —
aquele portal responde ao Enter, não ao clique. Sem portal real para testar,
**não troque**.

---

### Esperar por evento, não por tempo

Ficar espiando a tela de tempos em tempos desperdiça. Ser avisado pelo navegador
(`MutationObserver`) quando a tela muda é muito mais rápido — no ASSEDF deixou
4,3× mais leve (0,78s → 0,18s por exame). Mas **mantenha os tetos de espera**,
para portal lento não quebrar.

---

### Escolher item da lista pelo código, não pelo índice

O INAS duplicava um exame e pulava outros porque apertava Enter às cegas ou usava
o índice do laço. Escolha sempre o item que **casa com o código**.

---

### Janela aberta por outra aba

Se a janela nasceu a partir de OUTRA aba, o navegador não deixa esta aba
enxergá-la de jeito nenhum. Por isso, no CNU Unimed, o app **abre ele mesmo** a
janela de autorização: assim ela é nossa desde o começo.
