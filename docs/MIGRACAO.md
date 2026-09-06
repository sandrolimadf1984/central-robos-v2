# O que foi feito da V2 para a V3

O plano de evolução pedia 26 itens. Este documento diz o que virou realidade,
o que virou outra coisa e o que ficou de fora — com o motivo.

---

## Como a migração foi feita

**Fase 1 — Mapeamento.** O `central.js` de 5.659 linhas foi mapeado inteiro:
onde começa e termina cada robô, quais funções são comuns, o que depende de quê.

Descoberta que destravou tudo: **os 25 robôs são autocontidos**. Nenhum deles usa
variável do resto do arquivo. Isso tornou a separação em módulos segura.

**Fase 2 — Núcleo.** As funções genéricas foram para `src/core/`. O motor de
fundo foi copiado inteiro, trocando só as variáveis que vinham de fora.

**Fase 3 — Robôs.** Cada robô foi extraído **por contagem de chaves**, não por
recorte de texto — e depois conferido byte a byte contra o original.

**Fase 4 a 7 — Experiência, diagnóstico, versionamento e testes.** Tudo
acrescentado por fora, sem tocar nos robôs.

---

## Item por item

| # | Item do plano | Situação |
|---|---|---|
| 1 | Arquitetura e organização | ✅ 30 módulos, um convênio por arquivo |
| 2 | Motor central de funções comuns | ⚠️ Existe para robôs novos; os atuais não migraram (veja abaixo) |
| 3 | Padronização dos robôs | ✅ `CR.registrar({ chave, nome, tipo, portal, executar })` |
| 4 | Painel de progresso | ✅ Barra, %, código atual, item X de Y, concluídos/pendentes/erros |
| 5 | Histórico | ✅ 60 últimas, no navegador |
| 6 | Tratamento de erros | ✅ Painel com causa provável e ações |
| 7 | Continuar de onde parou | ✅ Lê da tela o que já entrou e manda só o resto |
| 8 | Sistema de fila | ✅ Com resumo e remoção item a item |
| 9 | Favoritos / mais utilizados | ✅ |
| 10 | Busca de convênios | ✅ Já existia; agora acha também pela chave do robô |
| 11 | Status dos robôs | ✅ `status.json` → bolinha no card |
| 12 | Sistema de avisos | ✅ `avisos.json`, geral e por convênio; `aviso.txt` ainda funciona |
| 13 | Versionamento e atualização | ✅ `manifest.json` + `releases/` + tela de versão |
| 14 | Modo de diagnóstico | ✅ Com relatório copiável |
| 15 | Logs | ✅ Centralizados, com botão de copiar |
| 16 | Estatísticas | ✅ Derivadas do histórico, sem servidor |
| 17 | Testes automatizados | ✅ 25 testes |
| 18 | Interface | ✅ Mesma cara, novidades atrás dos botõezinhos do rodapé |
| 19 | Compatibilidade | ✅ Robôs byte a byte idênticos |
| 20 | Documentação | ✅ README + 5 documentos + CHANGELOG |
| 21 | Processo para novo convênio | ✅ `docs/NOVO-CONVENIO.md` |
| 22 | Segurança | ⚠️ Documentada; assinatura por hash descartada (veja abaixo) |
| 23 | Estratégia de migração | ✅ Foi seguida |
| 24 | Não destruir o que funciona | ✅ |
| 25 | Visão final | ✅ |
| 26 | Critério de sucesso | ✅ 14 de 15 marcados |

---

## O que ficou de fora, e por quê

### Os robôs atuais não passaram a usar o motor central

O plano pedia que os robôs usassem `Robo.preencher()`, `Robo.clicar()`,
`Robo.aguardarElemento()`. **Isso não foi feito nos robôs que já existem.**

Motivo: reescrever robô que funciona **sem poder testar no portal real** já
quebrou o Amil e o TST. O próprio plano diz, no item 19, para não substituir
implementação funcional por uma "mais bonita" se isso aumentar o risco.

O que existe: as funções comuns estão no núcleo e o padrão de registro está
pronto. Robô novo já nasce usando. Robô antigo migra **um por vez**, quando
houver como testar no portal real — que é exatamente o que a Fase 3 do plano
manda fazer.

### Verificação de integridade por hash

O item 22 pedia validar a integridade das atualizações. Uma assinatura por
arquivo exigiria regerar todas as assinaturas a cada edição feita pelo GitHub.
Uma assinatura esquecida deixaria a equipe **sem a ferramenta** no meio do
expediente.

O que foi feito no lugar: HTTPS, repositório único e conhecido, versões guardadas
em `releases/` e caminho de rollback documentado.

---

## Como isto foi conferido

```
25 robôs conferidos byte a byte contra o central.js 2.1.0 → todos idênticos
25 testes automatizados                                    → todos passando
30 cards, 30 módulos, sintaxe válida em todos os arquivos
```

O `releases/v2.1.0-legado/central.js` tem MD5 `183ee948d18abb5ec368c077797e4c23`,
igual ao arquivo em produção.
