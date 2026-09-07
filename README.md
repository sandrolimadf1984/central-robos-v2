<div align="center">

# 🤖 Central de Automação — CLTzinho Digital

**Versão 3.4.0 · ambiente de testes**

*Cole os códigos uma vez. O robô digita por você.*

![Versão](https://img.shields.io/badge/vers%C3%A3o-3.4.0-2d7dff)
![Convênios](https://img.shields.io/badge/conv%C3%AAnios-30-4dc3ff)
![Robôs](https://img.shields.io/badge/rob%C3%B4s-25-1a5bcc)
![Testes](https://img.shields.io/badge/testes-30%20passando-2ecc71)
![Segundo plano](https://img.shields.io/badge/aba%20minimizada-continua%20rodando-2ecc71)

</div>

---

## ⚠️ Leia isto primeiro

Este repositório é o **laboratório**. A Central que a equipe usa para trabalhar
continua em `sandrolimadf1984/central-robos` e **não foi tocada**.

Aqui as novidades são testadas em paz. Se no fim a V3 ficar melhor, o link novo
é passado para a equipe. Se não ficar, ninguém perdeu nada.

---

## 📌 O que é

Uma ferramenta que roda direto no navegador (sem instalar programa nenhum) e
preenche sozinha os códigos de procedimento nos portais de autorização dos
convênios de saúde.

Antes: o atendente digitava código por código, campo por campo.
Agora: cola a lista inteira, clica em **🚀 INICIAR AUTOMAÇÃO** e o robô lança tudo,
inclusive as quantidades quando um código se repete.

---

## 🚀 Como instalar

1. Abra a página de instalação: **[index.html](https://sandrolimadf1984.github.io/central-robos-v2/)**
2. Arraste o botão azul para a barra de favoritos (`Ctrl + Shift + B` mostra a barra)
3. Abra o portal do convênio, chegue na tela de lançar procedimentos e clique no favorito

Se o computador não deixar arrastar: botão direito na barra → **Adicionar página** →
cole o código no campo do endereço.

**Atualização é automática.** O favorito busca sempre a versão mais recente do
repositório. Depois de mexer nos arquivos aqui, é só fechar e clicar de novo.

---

## 🏥 Os 30 convênios

Vários convênios **compartilham o mesmo robô**, porque usam o mesmo sistema de
autorização. Mexer num robô afeta todos os que dependem dele.

| Robô | Convênios que usam |
|---|---|
| **ASSEFAZ** (8) | Assefaz, BRB Saúde, Evo Saúde, Fascal, PF Saúde, Serpro, STM, Unity Saúde |
| **MEDSENIOR/UN SEG** (3) | GEAP, Medsenior, Unimed Seguros |
| **PM/STJ** (3) | Camed Saúde, PM, STJ |
| **CNU UNIMED** (2) | CNU Unimed, Proasa |
| Individuais (14) | Affego, Amil, Assedf/Vida Card, Câmara dos Deputados, Inas GDF, Planassiste MPU, Plenum, Postal (Correios), Sul America, TJDF, TRE, TRF, TRT, TST |

> **Sobre o TST:** é o único convênio com painel em janela separada, e isso é
> físico: o portal recarrega a página inteira a cada item e leva o app junto.
> A janelinha não recarrega, então sobrevive. Desde a 3.4.0 ela tem a cara do
> app — barra de progresso, contagem, andamento — e continua trabalhando
> minimizada.

> **Sobre o TRE:** tem robô próprio, mas é uma **cópia do PM** — o portal mudou em
> agosto/2026 e ficou igual ao da Polícia Militar (mesmo campo `#HandleTermo`).
> Ele tem trava interna separada (`_b403tre`) para os dois não se atrapalharem.

---

## ⚙️ Como funciona por dentro

```
Clique no favorito
        │
        ▼
central.js  ← o carregador (pequeno, é só isto que o favorito busca)
        │
        ├── lê o manifest.json (versão + lista de arquivos)
        ├── baixa os 30 módulos ao mesmo tempo
        └── executa na ordem: utilidades → configuração → robôs → tela
        │
        ▼
Central aberta por cima do portal
```

Se algum módulo não baixar, o carregador cai sozinho em
`releases/ATUAL/central-completo.js` — a mesma coisa num arquivo só. O atendente
não fica na mão.

### As quatro formas de um robô rodar

Os robôs nasceram em épocas diferentes e existem quatro arquiteturas convivendo.
**Isso é intencional — cada portal exige uma. Não unifique.**

| Forma | Quando é usada | Quem usa |
|---|---|---|
| **padrão** | O robô roda na própria página do portal | a maioria |
| **moldura** | O portal é exibido dentro do painel do app. Usada quando a tela do portal **recarrega** a cada item (senão o robô morreria junto). Só serve onde a tela atual sobrevive a um F5 | TRF, Postal, Câmara, Planassiste |
| **janelinha** | Um painel numa janela separada, que não recarrega e por isso sobrevive, pilotando a aba do portal de fora | TST |
| **janela** | O app abre a tela de autorização e preenche nela | CNU Unimed / Proasa |
| **agente injetado** | O robô coloca um ajudante **dentro** da janela do portal, com botão próprio | só o ASSEDF |

### Onde fica cada coisa

```
central-robos-v2/
├── central.js                 ← o carregador (é o que o favorito busca)
├── manifest.json              ← versão + lista de módulos, na ordem certa
├── index.html                 ← página de instalação do favorito
├── avisos.json                ← mural de recados para a equipe
├── status.json                ← situação de cada robô (🟢 🟡 🔴)
├── aviso.txt                  ← recado antigo (continua funcionando)
│
├── src/
│   ├── core/                  ← o núcleo comum
│   │   ├── utils.js           ← leitura dos códigos, fila, datas, textos
│   │   ├── logger.js          ← sistema de logs
│   │   ├── fila.js            ← fila de códigos e "continuar de onde parou"
│   │   ├── historico.js       ← histórico das automações
│   │   ├── estatisticas.js    ← números derivados do histórico
│   │   ├── notifications.js   ← avisos, status dos robôs, painel de erro
│   │   ├── diagnostico.js     ← "o portal mudou?"
│   │   ├── motor.js           ← motor de fundo (aba minimizada)
│   │   ├── automation.js      ← escolhe o caminho e acompanha o portal
│   │   └── ui.js              ← a tela
│   │
│   ├── convenios/             ← UM ARQUIVO POR CONVÊNIO (18 arquivos)
│   │   ├── affego.js  amil.js  assedf.js  assefaz.js  camara.js
│   │   ├── cnu-unimed.js  inas.js  medsenior.js  planassiste.js
│   │   ├── plenum.js  pm-stj.js  postal.js  sulamerica.js  tjdf.js
│   │   └── tre.js  trf.js  trt.js  tst.js
│   │
│   └── config/
│       ├── convenios.js       ← fichas dos robôs + cards da tela
│       └── logos.js           ← logos embutidas em base64
│
├── releases/                  ← versões guardadas, para voltar atrás
│   ├── ATUAL/                 ← reserva da versão em uso
│   ├── v3.0.0/
│   └── v2.1.0-legado/         ← a Central de hoje, intacta
│
├── tests/                     ← testes (navegador e computador)
├── docs/                      ← documentação detalhada
└── ferramentas/               ← script que gera a reserva
```

---

## ✨ O que a V3 tem de novo

Tudo isto foi acrescentado **por fora**, observando. Nada disso muda o que o robô
recebe nem quando ele é chamado.

| Recurso | O que faz |
|---|---|
| 📊 **Progresso de verdade** | Barra, percentual, código atual, item X de Y, concluídos / pendentes / erros |
| 📋 **Fila** | Mostra `40301120 ×3` e o resumo `5 lançamentos · 3 códigos únicos`. Dá para tirar um código antes de iniciar |
| ▶ **Continuar de onde parou** | Se a automação parar no meio, na próxima vez a Central oferece mandar **só o que falta** — lendo da tela do portal o que já entrou |
| 🕘 **Histórico** | As 60 últimas execuções, com data, quantidade, erros e duração |
| 📈 **Estatísticas** | Automações, códigos processados, tempo estimado economizado, convênio mais usado |
| ❌ **Erro que explica** | Convênio, código, problema, causa provável e os botões TENTAR NOVAMENTE / COPIAR RELATÓRIO / ENCERRAR |
| 🛠️ **Diagnóstico** | Confere se a tela tem o que o robô espera. Responde rápido: *o portal mudou?* |
| 📄 **Logs** | Tudo que aconteceu na sessão, com botão de copiar |
| 🟢 **Status do robô** | Bolinha no card, controlada pelo `status.json` |
| 🔧 **Avisos** | `avisos.json` manda recado geral ou por convênio, com botão ENTENDI |
| ⚙️ **Versão e rollback** | Versão à vista e versões guardadas em `releases/` |
| 🔽 **Segundo plano de verdade** | Dá para minimizar e trabalhar em outra aba: o robô continua. Veja abaixo |
| 🧪 **Testes** | 30 testes das regras críticas + teste da aba minimizada |

---

## 🔽 Minimizar sem parar a automação

O Chrome desacelera de propósito as abas que saem da frente: os relógios da
página passam de 100ms para 1 segundo e, depois de 5 minutos, para **1 por
minuto**. É por isso que o robô parecia congelar quando a aba era minimizada.

E tem uma segunda causa, que quase ninguém percebe: **muito portal se cala
sozinho** quando nota que saiu da frente, para poupar recurso.

A V3 ataca as duas coisas ao mesmo tempo:

| O que faz | Para que serve |
|---|---|
| **Operário (Web Worker)** | A batida do robô passa a vir de um processo paralelo, que o Chrome **não freia**. É a batida principal |
| **Página segue "à vista"** | O portal passa a enxergar `document.hidden = false` o tempo todo. Para ele, a aba nunca saiu da frente |
| **Relógio de tela** | O `requestAnimationFrame` **morre de vez** em aba escondida. Enquanto ela estiver no fundo, esses pedidos passam pela agenda da Central |
| **Aba acordada** | Um som grave e inaudível faz o Chrome tratar a aba como "tocando algo" — o que a livra do congelamento pesado |
| **Moldura e janelas juntas** | A moldura e as janelas que o robô abre recebem o mesmo tratamento, cada uma é escondida por conta própria |
| **Corrente de reservas** | Se o portal bloquear o Worker, entra a placa de som; se bloquear, entram as mensagens; por último, o relógio comum. Nunca para de vez |

**Como saber se está ligado:** ao clicar em INICIAR, o rodapé mostra o estado —
`página segue "à vista" ✅ · batida em segundo plano ✅ · ...`. E o painel de
progresso avisa: *🔽 Pode minimizar e trabalhar em outra aba*.

### A exceção: o Amil (e portais sensíveis)

Portais feitos em Angular **dependem do relógio deles** para saber que a busca
terminou. Se a Central toma esse relógio, a tela fica presa em "Buscando" para
sempre — foi o que aconteceu com o Amil.

Por isso esses convênios rodam em **modo leve** (`semMotor: true`): recebem a aba
acordada e o "página segue à vista", mas **o relógio continua sendo deles**.

Consequência honesta: minimizado, o Amil continua trabalhando, mas mais devagar
(o Chrome segura em ~1 passo por segundo). Ele não para — só anda em ritmo menor.

### O que ainda pode escapar

- A **janelinha do TST** roda o laço dela dentro da própria janela. Se você
  minimizar *aquela* janela, ela desacelera. Deixe-a aberta em algum canto.
- Portal com regra de segurança muito apertada pode bloquear o Worker. A Central
  cai para as reservas sozinha e avisa no rodapé qual batida está valendo.
- Se a aba ficar escondida e **nada andar por 1 minuto**, isso vai para os
  📄 Logs. É a pista que diz onde o segundo plano falhou, em vez de a gente
  ficar adivinhando depois.

---

## 💾 O que a Central guarda (e por que não engorda)

Histórico, estatísticas, avisos já lidos e filas de automação interrompida ficam
no navegador do próprio atendente, com o prefixo `cr2:`. Nada disso sai do
computador dele.

**Nada cresce sem fim** — todo depósito tem teto:

| O que | Teto | Quanto dá |
|---|---|---|
| Histórico | 60 execuções | ~11 KB |
| Mensagem de erro guardada | 400 caracteres cada | — |
| Logs | 400 linhas, só da sessão | some ao fechar |
| Avisos já lidos | 40 mais recentes | ~1 KB |
| Filas interrompidas | validade de 12h, com faxina ao abrir | ~2 KB por convênio |

Medido de verdade: depois de **1500 automações** (uns dois anos de uso) o total
fica em torno de **14 KB** — menos do que uma foto de perfil. Registrar uma
automação leva **0,065 ms** e gravar a fila durante a execução, **0,021 ms**.

Para ver o número do seu navegador: **⚙️ Versão** → *guardado neste navegador*.
No mesmo lugar tem o botão **🗑 APAGAR TUDO**, que não afeta robôs nem convênios.

Os testes `node tests/rodar.js` conferem cada um desses tetos.

---

## 🔄 Como atualizar

**Mexer num convênio:** abra o arquivo dele em `src/convenios/`, lápis, edite,
**Commit changes**. Pronto — chega para todo mundo no próximo clique.

**Depois de mexer em qualquer arquivo de `src/`:** rode a ferramenta que
regenera a reserva, senão o plano B fica desatualizado:

```bash
python3 ferramentas/gerar-reserva.py
```

**Mandar um recado para a equipe:** edite `avisos.json`.
**Marcar um robô como em manutenção:** edite `status.json`.

---

## ⏪ Como voltar atrás

Se a V3 der problema, tem três saídas, da mais rápida para a mais completa:

1. **Voltar para a Central de sempre** — o favorito antigo continua funcionando.
   Ela nunca foi tocada.
2. **Fixar uma versão anterior da V3** — no favorito, troque `central.js` por
   `releases/v3.4.0/central-completo.js`.
3. **Rodar a Central de hoje a partir daqui** — no favorito, aponte para
   `releases/v2.1.0-legado/central.js`. Esse arquivo é **byte a byte idêntico**
   ao que está em produção hoje (MD5 `183ee948d18abb5ec368c077797e4c23`).

---

## 🧪 Testes

```bash
node tests/rodar.js            # 30 testes, não precisa instalar nada
node tests/segundo-plano.js    # aba minimizada       (npm install jsdom)
node tests/tst-portal-falso.js # réplica do TST       (npm install jsdom)
```

Ou abra `tests/index.html` no navegador. Não acessam portal nenhum.

Vários testes existem por causa de erro que já aconteceu de verdade — estão
marcados com **REGRA DE OURO**. O principal deles garante que os códigos entrem
**na mesma ordem em que foram colados**.

---

## 📚 Documentação

| Documento | Para quê |
|---|---|
| [docs/NOVO-CONVENIO.md](docs/NOVO-CONVENIO.md) | Acrescentar um convênio |
| [docs/ARQUITETURA.md](docs/ARQUITETURA.md) | Como as peças se encaixam |
| [docs/ARMADILHAS.md](docs/ARMADILHAS.md) | Erros já cometidos — não repetir |
| [docs/MIGRACAO.md](docs/MIGRACAO.md) | O que foi feito da V2 para a V3, e o que não foi |
| [docs/PROBLEMAS.md](docs/PROBLEMAS.md) | Deu errado? comece por aqui |
| [CONTRIBUTING.md](CONTRIBUTING.md) | Regras de ouro do projeto |
| [CHANGELOG.md](CHANGELOG.md) | O que mudou em cada versão |

---

## 🔒 Segurança

- Nenhuma senha, token ou login no código
- Nada de dado de paciente é guardado: o histórico registra convênio, quantidade e horário
- Tudo que a Central guarda fica **no navegador do próprio atendente** (`localStorage`), com o prefixo `cr2:`
- Os arquivos vêm sempre do repositório oficial, por HTTPS
- Detalhes em [docs/ARQUITETURA.md](docs/ARQUITETURA.md#segurança)

---

<div align="center">
<sub>Criado por <b>Sandro de Lima Pereira</b> · Sabin Brasília</sub>
</div>
