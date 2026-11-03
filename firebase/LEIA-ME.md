# Firebase · pendências do dashboard

Guarda as pendências registradas na aba **Em Andamento**, com atualização em tempo real para todos.
Sem o Firebase configurado, o dashboard funciona em **modo de teste**: as pendências ficam salvas só no navegador de quem testou.

## Instalação (uma vez, com a conta Google da equipe)

1. Acesse https://console.firebase.google.com e clique em **Criar um projeto**. Sugestão de nome: `dashboard-deduca`.
   - O Google Analytics pode ficar **desativado**.
2. No menu da esquerda, abra **Criação → Firestore Database → Criar banco de dados**.
   - Local: **`southamerica-east1` (São Paulo)**. Não dá para trocar depois.
   - Modo: **produção**.
3. Na aba **Regras** do Firestore, apague tudo, cole o conteúdo de `firestore.rules` desta pasta e clique em **Publicar**.
4. Volte em **Visão geral do projeto** (ícone de engrenagem → **Configurações do projeto**) e, em "Seus apps", clique no ícone **`</>`** (Web).
   - Apelido: `dashboard`. **Não** marque o Firebase Hosting.
5. O Firebase mostra um bloco `const firebaseConfig = { ... }`. Copie esse bloco (apiKey, authDomain, projectId etc.).
6. No `index.html`, troque `const FIREBASE_CONFIG = null;` pelo objeto copiado e suba a alteração por Pull Request.

> A `apiKey` do Firebase **não é senha**: ela só identifica o projeto e pode ficar no código público. Quem protege os dados são as regras do passo 3.

## Ver as pendências

No console: **Firestore Database → Dados → coleção `pendencias`**. Cada documento é um registro, com o motivo, o detalhe, quem registrou e quando, e o status (`aberta` ou `resolvida`).

## Observações

- A lista de motivos existe em dois lugares: `MOTIVOS_PENDENCIA` no `index.html` e a lista `motivo in [...]` no `firestore.rules`. As duas precisam ser iguais.
- Como o dashboard é público e sem login, qualquer pessoa com o link consegue registrar. As regras só aceitam registros no formato da tela, só permitem marcar como resolvida e **não permitem apagar**, então o histórico fica completo.
- A regra de "uma pendência aberta por tarefa" é aplicada pela tela.
- O plano gratuito (Spark) aguenta com folga o volume da equipe: 50 mil leituras e 20 mil gravações por dia.
