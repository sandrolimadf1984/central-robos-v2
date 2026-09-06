# Como mexer neste projeto sem quebrar nada

A Central resolve um problema real e tem gente dependendo dela para trabalhar.
Estas regras nasceram de erros que já custaram caro.

---

## As regras de ouro

### 1. Não mexa no que funciona

Se um robô está funcionando, **não toque nele** — nem para "melhorar".
Se precisar mexer, avise antes e explique por quê.

### 2. Sempre baixe a versão atual antes de mexer

Nunca trabalhe em cima de uma versão antiga de conversa. Baixe sempre do
repositório.

### 3. Sempre guarde um backup do que funciona

Antes de publicar uma mudança arriscada, copie a versão atual para
`releases/vX.Y.Z/`. Assim dá para voltar sozinho.

### 4. Sempre prove que nada mais mudou

Ao terminar, mostre:

- quais robôs foram alterados (deve ser só o pedido)
- que os demais continuam **byte a byte idênticos**
- que os 30 convênios abrem e iniciam normalmente

### 5. Robô de colega que funciona: copiar exatamente

Já quebramos o Amil e o TST tentando melhorar robô que funcionava.
Se o código de origem funciona no portal real, **copie exatamente**.

### 6. Sem acesso ao portal real, não adivinhe: diagnostique

Quando um robô novo falhar, coloque um diagnóstico que mostre o que o portal
respondeu, em vez de tentar adivinhar. Isso já resolveu em uma rodada problemas
que se arrastavam por seis.

---

## Antes de publicar

```bash
node tests/rodar.js                    # 25 testes têm que passar
python3 ferramentas/gerar-reserva.py   # atualiza o plano B
```

E anote o que mudou no `CHANGELOG.md`.

---

## O que NÃO fazer

- ❌ Unificar as quatro arquiteturas de execução — cada portal exige a sua
- ❌ Trocar `Enter` por clique (ou vice-versa) sem poder testar no portal real
- ❌ Reordenar códigos: eles entram na ordem em que foram colados
- ❌ Esconder qualquer coisa nova que aparecer na página (o portal cria
      elementos próprios; esconder tudo travava o ASSEFAZ no 1º código)
- ❌ Ligar o motor de fundo em portal Angular sem `semMotor: true`
- ❌ Fazer um recurso novo poder derrubar a automação — use `U.seguro()`

A lista completa está em [docs/ARMADILHAS.md](docs/ARMADILHAS.md).
