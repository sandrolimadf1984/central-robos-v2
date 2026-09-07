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

## TST: o primeiro código não entra

**Corrigido na 3.5.1.** Se ainda acontecer, confira em ⚙️ Versão se você está
mesmo na 3.5.1 ou mais nova — o favorito busca a versão do repositório, então
basta fechar a Central e clicar de novo.

Era a Central que barrava o aviso que o robô manda ao portal quando termina de
escrever no campo. Sem esse aviso, o portal não saía para buscar a tabela e o
primeiro código se perdia.

---

## Minimizei e o robô parou

Não deveria mais acontecer. Confira nesta ordem:

1. **O rodapé, logo depois de clicar em INICIAR.** Ele mostra o estado do
   segundo plano. O ideal é `página segue "à vista" ✅ · batida em segundo
   plano ✅`.
2. **Se aparecer `batida em segundo plano ❌`**, o portal bloqueou o Web Worker.
   A Central cai para as reservas sozinha e continua funcionando, mas mais
   devagar. Me avise qual convênio.
3. **Se for o Amil** (ou outro portal em Angular), é esperado: ele roda em modo
   leve e fica mais lento quando minimizado — mas não para. Trocar isso trava a
   tela do portal em "Buscando".
4. **Se for o TST**, a janelinha de controle tem laço próprio. Deixe-a aberta em
   algum canto da tela em vez de minimizar.

E olhe os **📄 Logs**: se a aba ficou escondida e nada andou por 1 minuto, tem um
aviso registrado lá dizendo exatamente onde parou.

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

Abra **⚙️ Versão** no rodapé. Ali aparece quanto está ocupado e tem o botão
**🗑 APAGAR TUDO**. Os robôs e os convênios não são afetados.

Não é preciso fazer isso por causa de espaço: tudo tem teto, e mesmo depois de
dois anos de uso o total fica em torno de 14 KB.
