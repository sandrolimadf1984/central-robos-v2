# Deu errado? Comece por aqui

## A Central não abre

**Aparece a barrinha de carregamento e trava.**
Algum arquivo não baixou. A Central tenta sozinha o arquivo de reserva. Se nem
isso funcionar, aparece um aviso dizendo o motivo. Confira a internet e clique
no favorito de novo.

**Não acontece nada ao clicar no favorito.**
Confira se a página do portal terminou de carregar. Em algumas telas o navegador
bloqueia o favorito por segurança — nesse caso, use a Central de sempre.

**Abre duas Centrais.**
Não abre: a Central se recusa a abrir se já houver uma na tela. Feche a que está
aberta pelo ✖ FECHAR APP.

---

## O robô não faz nada

1. Abra o convênio e clique em **🛠️ DIAGNÓSTICO**
2. Se aparecer `✗` em algum item, o portal provavelmente mudou
3. Clique em **📋 COPIAR RELATÓRIO** e mande para quem cuida da manutenção

O relatório traz o endereço da página, o título, o tipo do robô, o que faltou e
o log da sessão. É a informação que resolve em uma rodada o que sem ela se
arrasta por semanas.

---

## Parou no meio

Feche e abra a Central, entre no mesmo convênio. Ela vai perguntar se você quer
**CONTINUAR DE ONDE PAROU** — e vai mandar só os códigos que ainda não estão na
tela do portal.

Se preferir recomeçar, clique em **COMEÇAR DO ZERO**.

> A oferta some depois de 12 horas.

---

## O contador não bate com o Ctrl+F

Conte de novo depois que a automação terminar. Durante a execução o número é
aproximado (a Central lê a tela a cada 0,8s).

Se continuar sem bater, o portal pode estar mostrando o código de um jeito que a
Central não enxerga. Mande o relatório do diagnóstico.

---

## A tela do portal fica presa em "Buscando"

É o motor de fundo em portal moderno (Angular). O convênio precisa de
`semMotor: true` na ficha, em `src/config/convenios.js`.

O Amil já tem. Se acontecer em outro, é o mesmo problema.

---

## Quero voltar para a Central de sempre

O favorito antigo continua funcionando e nunca foi tocado. Use ele.

Se quiser rodar a versão de produção a partir deste repositório, aponte o
favorito para `releases/v2.1.0-legado/central.js`.

---

## Como limpar o que a Central guardou

Histórico, estatísticas, favoritos e filas ficam no navegador com o prefixo
`cr2:`. Limpar os dados do site apaga tudo. Nada disso sai do computador.
