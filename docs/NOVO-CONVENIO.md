# Acrescentar um convênio

Existem dois casos bem diferentes. Veja em qual você está antes de começar.

---

## Caso 1 — O convênio usa um portal que já temos (o mais comum)

Exemplo: entrou um convênio novo que usa o mesmo autorizador do ASSEFAZ.

**Só um arquivo muda: `src/config/convenios.js`.**

1. Abra o arquivo no GitHub e clique no lápis
2. Em `CR.EXIBICAO`, acrescente uma linha **na posição alfabética certa**:

```js
{ rotulo: "Nome do Convênio", chave: "ASSEFAZ", icone: "🏥", cor: "#2b6cb0",
  desc: "Automação para Convênios Nome do Convênio" },
```

- `rotulo` — o que aparece no card
- `chave` — o robô que vai ser usado (ASSEFAZ, PM/STJ, MEDSENIOR/UN SEG, ...)
- `cor` — em hexadecimal, dá a listinha embaixo do card

3. **Commit changes**

Pronto. Se quiser a logo de verdade em vez do ícone, acrescente uma linha em
`src/config/logos.js` com o **mesmo `rotulo`** e a imagem em base64.

> Não precisa mexer no `manifest.json` nem no `central.js` neste caso.

---

## Caso 2 — O convênio tem um portal novo (precisa de robô)

1. **Crie** `src/convenios/nome-do-convenio.js` a partir do modelo abaixo
2. **Registre** o caminho no `manifest.json`, na lista `modulos`, junto dos
   outros convênios (a ordem entre convênios não importa; o que importa é que
   fique **antes** de `src/core/ui.js`)
3. **Acrescente a ficha** em `CR.infoRobos` (src/config/convenios.js)
4. **Acrescente o card** em `CR.EXIBICAO`
5. **Teste** e só então avise a equipe

### Modelo

```js
(function (CR) {
    "use strict";

    CR.registrar({
        chave: "NOME_DO_ROBO",
        nome: "Nome do Convênio",
        tipo: "padrao",              // padrao | moldura | janela
        ativo: true,
        portal: {
            // usados pelo 🛠️ DIAGNÓSTICO para dizer se o portal mudou
            seletores: ["#campoCodigo", "#botaoSalvar"],
            nota: "Tela de inclusão de procedimento"
        },
        origem: "escrito em 2026-09",
        executar: () => {
            // O texto colado chega por window.prompt() — a Central já cuida disso.
            const texto = prompt();

            // Ordem da colagem PRESERVADA. Nunca use Object.keys() para montar
            // a lista: ele devolve chave numérica em ordem crescente.
            const codigos = texto.match(/\b\d{8}\b/g) || [];
            const fila = [];
            const indice = {};
            codigos.forEach(c => {
                if (indice[c] === undefined) { indice[c] = fila.length; fila.push({ cod: c, qtd: 1 }); }
                else fila[indice[c]].qtd++;
            });

            // ... daqui para baixo é a conversa com o portal ...
        }
    });

})(window.CentralRobos);
```

### Escolhendo o `tipo`

| Se o portal... | use |
|---|---|
| fica na mesma tela o tempo todo | `padrao` |
| **recarrega a página** a cada item salvo | `moldura` |
| abre a autorização numa janela separada | `janela` |
| usa quadros e a função de salvar mora em outra janela | `padrao` + agente injetado (veja `assedf.js`) |

> Errar aqui é o erro mais caro. Portal que recarrega mata qualquer robô que
> rode dentro da página — ele morre no primeiro código.

### Ficha em `CR.infoRobos`

```js
"NOME_DO_ROBO": { icone: "🏥", cor: "#2b6cb0",
                  desc: "Automação para Convênio X", modo: "prompt" },
```

| Campo | Para quê |
|---|---|
| `modo` | como os códigos chegam: `prompt`, `painel`, `inline`, `janela`, `tst` |
| `txt` / `btn` | no modo `painel`: os ids da caixa de texto e do botão do robô |
| `semMotor: true` | **portal Angular** — não troca o relógio da página |
| `mostrarPainel: true` | deixa o painel do robô à vista |
| `semContagem: true` | a Central não consegue contar (lançamento em outra janela) |

### Se for portal moderno (Angular, React)

Marque `semMotor: true`. Sem isso a tela trava em "Buscando" para sempre —
foi exatamente o que aconteceu com o Amil.
