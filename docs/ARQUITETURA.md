# Arquitetura

## A ideia geral

```
                    CENTRAL DE AUTOMAÇÃO
                            │
             ┌──────────────┴──────────────┐
             │                             │
        MOTOR CENTRAL                  INTERFACE
      (src/core/automation)            (src/core/ui)
             │                             │
       ┌─────┼─────┐              ┌───────┼────────┐
       │     │     │              │       │        │
      AMIL  INAS  TJDF          Fila  Histórico Diagnóstico
       │     │     │
       ▼     ▼     ▼
     Portal Portal Portal
```

Cada robô é independente. A Central fornece interface, fila, logs, histórico,
tratamento de erros, progresso, diagnóstico, versionamento, configuração e
estatísticas.

---

## Carregamento

1. O favorito busca `central.js` (o carregador, ~240 linhas)
2. O carregador monta `window.CentralRobos` (chamado de `CR` no código)
3. Lê o `manifest.json`: versão e lista de módulos
4. Baixa os 30 módulos **ao mesmo tempo**
5. Executa **na ordem da lista** — a tela por último, de propósito, para os
   avisos e a situação dos robôs já estarem em mãos quando os cards nascem
6. Se algo falhar, cai em `releases/ATUAL/central-completo.js`

A ordem importa: utilidades → configuração → motor de fundo → robôs → tela.

---

## O objeto `CR`

Tudo que é da V3 mora dentro de `CR`. Assim nada novo esbarra em nome de variável
dos robôs antigos.

| Campo | O que guarda |
|---|---|
| `CR.robos` | robôs do caminho **padrão** |
| `CR.roboMoldura` | robôs do caminho **moldura** |
| `CR.roboJanela` | robôs do caminho **janela** |
| `CR.legado` | robôs desativados, guardados por história |
| `CR.fichas` | tipo, portal e origem de cada robô |
| `CR.infoRobos` | ficha técnica (modo de entrega, `semMotor`, ...) |
| `CR.EXIBICAO` | os cards da tela |
| `CR.LOGOS` | logos em base64 |
| `CR.estado` | o que está acontecendo agora (rodando, vigias, fila...) |
| `CR.utils` `CR.log` `CR.fila` `CR.historico` `CR.stats` | núcleo comum |
| `CR.avisos` `CR.erros` `CR.diag` `CR.motor` `CR.auto` `CR.ui` | subsistemas |

---

## O padrão dos robôs

Cada robô se registra assim:

```js
CR.registrar({
    chave: "AMIL",
    nome: "Amil",
    tipo: "padrao",
    ativo: true,
    portal: { seletores: [...], nota: "..." },
    origem: "central.js v2.1.0, linhas 1419-1516",
    executar: () => { /* o robô */ }
});
```

A Central não precisa saber como o robô funciona por dentro — só o `tipo`.

> **Sobre os robôs de hoje:** o corpo de `executar` foi copiado do `central.js`
> 2.1.0 **byte a byte**, sem uma vírgula de diferença. Eles não usam as funções
> comuns do núcleo, e isso é de propósito: reescrever robô que funciona sem poder
> testar no portal real já quebrou o Amil e o TST. As funções comuns existem para
> robôs novos.

---

## A ordem de despacho

```
iniciarAutomacao(chave, texto)
        │
        ├── CR.roboJanela[chave]  ?  → caminho JANELA
        ├── CR.roboMoldura[chave] ?  → caminho MOLDURA
        └── senão                    → caminho PADRÃO
```

**Esta ordem é a mesma da 2.1.0 e não pode mudar.** É por causa dela que Postal,
Câmara, TRF e Planassiste rodam na moldura, mesmo tendo também uma versão padrão
guardada no arquivo.

---

## Como a Central sabe o que já entrou

Ela **lê a tela do portal**, sem nunca escrever nela:

- pega o texto de cada elemento do corpo da página
- pega também o **conteúdo dos campos**, porque em vários portais (PM, MedSenior,
  TJ, Unimed Seguros) o código fica dentro de um `input` e não aparece no texto
- ignora o painel do próprio app e os painéis dos robôs
- compara com a lista de códigos do lote

Disso saem três coisas: o progresso, a contagem final e o **continuar de onde
parou**.

---

## Segurança

**Execução de código remoto.** O favorito baixa e executa código do repositório.
É como a ferramenta sempre funcionou e é o que permite atualizar todo mundo de
uma vez. Os cuidados: só HTTPS, só o repositório oficial, repositório sob uma
conta só.

*Verificação por assinatura (hash) foi avaliada e descartada:* como os arquivos
são editados direto pelo GitHub, uma assinatura desatualizada deixaria a equipe
sem a ferramenta. O risco de indisponibilidade era maior que o benefício.

**Dados.** Nada de paciente é guardado. O histórico registra convênio, quantidade
de códigos, duração e situação. Tudo fica no navegador do próprio atendente
(`localStorage`, prefixo `cr2:`) e nunca sai do computador dele.

**Credenciais.** Não existem no código. A Central usa a sessão que o atendente já
abriu no portal.

**Logs.** Registram código de procedimento, convênio e mensagem do portal —
nunca carteirinha, nome ou login.
