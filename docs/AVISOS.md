# Avisar a equipe sobre um convênio

Dois arquivos controlam isso, e os dois são editados direto pelo GitHub. Não
precisa mexer em código nenhum.

| Arquivo | Para quê |
|---|---|
| `status.json` | **muda a cor do card** do convênio na tela |
| `avisos.json` | escreve um **recado** — no topo da tela ou dentro do convênio |

Depois de salvar, a mudança chega para todo mundo **no próximo clique do
favorito**. Ninguém precisa reinstalar nada.

---

## Deixar um convênio marcado na tela

### Passo a passo

1. Abra o repositório no GitHub
2. Clique em **`status.json`**
3. Clique no **lápis** (ícone de editar), no canto direito
4. Ache a parte que diz `"convenios": {` — perto do fim do arquivo
5. Escreva a linha do convênio ali dentro
6. Role até embaixo e clique no botão verde **Commit changes**

### Como fica a linha

```json
  "convenios": {
    "INAS": { "estado": "fora", "nota": "Site do convênio com inconsistência" }
  }
```

Mais de um convênio ao mesmo tempo — **vírgula entre eles, menos no último**:

```json
  "convenios": {
    "INAS": { "estado": "fora", "nota": "Site com inconsistência" },
    "AMIL": { "estado": "manutencao", "nota": "Robô sendo atualizado — previsão 14h" }
  }
```

Para tirar a marcação, apague a linha e deixe `"convenios": { }`.

### Os estados e as cores

| `estado` | Como o card fica | Texto padrão (se você não escrever `nota`) |
|---|---|---|
| `fora` | 🔴 **vermelho** | Site com inconsistência |
| `erro` | ⚠️ **vermelho** | Erro conhecido |
| `manutencao` | 🔧 **amarelo** | Robô em manutenção |
| `atualizar` | 🟡 **amarelo** | Atualização necessária |
| `atencao` | 🟡 **amarelo** | Atualização recente |
| `desativado` | ⛔ **apagado** | Desativado temporariamente |
| `ok` | sem destaque | — |

A `nota` é o texto que aparece **dentro do card**, então escreva algo curto e
direto: *"Site com inconsistência"*, *"Robô sendo atualizado"*, *"Portal fora do
ar desde 8h"*.

### As chaves dos robôs

A chave é o **robô**, não o nome do card. Marcar um robô pinta **todos** os
convênios que usam ele:

| Chave | Pinta quantos cards |
|---|---|
| `ASSEFAZ` | 8 (Assefaz, BRB, Evo, Fascal, PF, Serpro, STM, Unity) |
| `MEDSENIOR/UN SEG` | 3 (GEAP, Medsenior, Unimed Seguros) |
| `PM/STJ` | 3 (Camed, PM, STJ) |
| `CNU UNIMED` | 2 (CNU Unimed, Proasa) |
| `AFFEGO` `AMIL` `ASSEDF` `CAMARA` `INAS` `PLANASSISTE MPU` `PLENUM` `POSTAL` `SULAMERICA` `TJDF` `TRE` `TRF` `TRT` `TST` | 1 cada |

A lista completa também está dentro do próprio `status.json`.

---

## Escrever um recado

### Recado para todo mundo, no topo da tela

Edite **`avisos.json`**, na parte `"geral"`:

```json
  "geral": {
    "id": "2026-09-08-manutencao",
    "texto": "O portal do INAS está fora do ar. Lançar à mão até segunda ordem."
  }
```

O `texto` aparece numa faixa amarela no topo, com um botão **ENTENDI**. Quem
clicar não vê mais aquele recado.

**Troque o `id` sempre que escrever um recado novo.** É o `id` que faz o aviso
voltar a aparecer para quem já tinha clicado em ENTENDI — se você mudar só o
texto e deixar o `id` antigo, quem já dispensou não vê o novo.

Para tirar o recado, deixe `"texto": ""`.

### Recado só de um convênio

Aparece ao abrir aquele convênio. Em `avisos.json`, na parte `"convenios"`:

```json
  "convenios": {
    "INAS": {
      "id": "inas-2026-09-08",
      "titulo": "MANUTENÇÃO",
      "texto": "O robô do INAS está temporariamente indisponível.",
      "previsao": "14:30",
      "motivo": "Alteração no portal"
    }
  }
```

`titulo`, `previsao` e `motivo` são opcionais.

---

## Qual usar

- **Só a cor do card** → `status.json`. É o mais rápido e já resolve na maioria
  dos casos: a pessoa vê de longe que aquele convênio está com problema.
- **Cor do card + explicação ao abrir** → os dois arquivos, com a mesma chave.
- **Recado que vale para todos** (mudança de rotina, aviso da chefia) →
  `avisos.json`, parte `geral`.

---

## Se errar a digitação

Os dois arquivos são JSON: se faltar uma vírgula ou sobrar uma, o arquivo fica
inválido. **A Central não quebra** — ela simplesmente ignora o arquivo com
defeito e segue funcionando normalmente.

Para conferir antes de salvar, o próprio GitHub avisa em vermelho quando o JSON
está errado enquanto você edita.


---

## O que acontece quando um convênio está marcado

| Onde | O que muda |
|---|---|
| **Card na tela inicial** | Muda de cor (vermelho, amarelo ou apagado) e ganha uma faixa com o recado. Dá para ver de longe, sem abrir. |
| **Ao abrir o convênio** | Aparece uma faixa no topo com o mesmo recado. |
| **Ao clicar em INICIAR** | Nos estados `fora`, `erro`, `manutencao`, `atualizar` e `desativado`, a Central **pergunta antes**: *"Este convênio está marcado pela equipe. Iniciar assim mesmo?"*. Quem quiser seguir, segue — mas ninguém automatiza sem saber. |

O estado `atencao` marca o card mas **não pergunta nada** — é para recado
informativo, tipo "portal mudou mês passado".

---

## Tirar a marca

Apague a linha do convênio de dentro de `convenios` e faça o commit. Ou troque o
estado para `"ok"`. Nos dois casos o card volta ao normal no próximo clique.
