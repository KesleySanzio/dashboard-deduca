# Firebase · Dashboard Deduca

Projeto `dashboard-deduca` (plano gratuito Spark). Usado para:

- **Login** (Firebase Authentication, e-mail e senha): só entra quem um administrador cadastrou.
- **Usuários** (`usuarios`): nome, e-mail, perfil (`equipe`, `gestao`, `admin`), ativo, último acesso.
- **Log** (`log`): acessos (entrou / saiu) e ações (pendências, exportações, mudanças na equipe). Só admins leem; ninguém altera nem apaga.
- **Pendências** (`pendencias`) da aba Em Andamento, em tempo real.

As regras de segurança estão em `firestore.rules`. A `apiKey` no `index.html` não é senha: só identifica o projeto.

## Perfis

| Perfil | Vê |
|---|---|
| Equipe | Produtividade (Em Aberto, Em Andamento) e pendências |
| Gestão | + Visão Geral, Relatório Gerencial e CSC |
| Admin | + Gerenciar equipe e Log de atividades |

**Admins principais:** Diego Eduardo e Kesley Sanzio (lista em `firestore.rules` e em `ADMINS_PRINCIPAIS` no `index.html`; as duas precisam ser iguais). Eles são admin mesmo sem cadastro, desde que o e-mail esteja confirmado. Ninguém consegue tirar o acesso deles pela tela.

## Configuração no console (uma vez)

1. **Authentication → Começar → Método de login → E-mail/senha → Ativar** (deixe "Link do e-mail" desativado) → Salvar.
2. **Authentication → Modelos (Templates)** → idioma **Português (Brasil)**, para os e-mails de redefinição de senha e de confirmação saírem em português.
3. **Firestore Database → Regras**: cole o conteúdo de `firestore.rules` e clique em **Publicar**.
   Faça isso **junto** com a publicação do `index.html` novo: as regras novas exigem login, e a versão antiga do site deixa de funcionar.
4. **Primeiro acesso dos admins principais:** em **Authentication → Usuários → Adicionar usuário**, cada um cria a própria conta (e-mail `@pucminas.br` + uma senha). Depois entra no dashboard, clica em **Enviar link de confirmação**, confirma pelo e-mail e clica em **Já confirmei**.

## Uso no dia a dia

- **Cadastrar alguém:** menu do usuário (canto inferior esquerdo) → **Gerenciar equipe** → nome, e-mail e perfil → **Cadastrar**. Aparece uma **senha provisória** (só uma vez): envie para a pessoa. No primeiro acesso ela cria a própria senha.
- **Esqueceu a senha:** a pessoa clica em **Esqueci minha senha** no login, ou o admin clica em **🔄 Senha** na lista. Chega um e-mail do Firebase com o link (pode cair no spam).
- **Tirar o acesso:** **Desativar** na lista. A conta continua existindo (para o histórico), mas não entra mais. **Reativar** devolve o acesso.
- Depois de 3 senhas erradas, a tela leva para a redefinição; o Firebase também bloqueia tentativas em excesso no servidor.

## Testar localmente (sem tocar no projeto real)

Emulador do Firebase (precisa de Java 21 e firebase-tools; no computador do Diego estão em `C:\Users\Usuario\Ferramentas`):

```bash
firebase emulators:start --only auth,firestore --project dashboard-deduca
```

Depois abra a prévia com `?emulador` no endereço (ex.: `http://localhost:8793/?emulador`). Contas e dados do emulador são fictícios e somem quando ele é desligado.

## Observações

- A lista de motivos de pendência existe em dois lugares: `MOTIVOS_PENDENCIA` no `index.html` e `motivo in [...]` no `firestore.rules`.
- O login protege a tela e os dados do Firebase. O `dados.json` (tarefas do Deduca) ainda é lido do GitHub, que é público.
- Plano gratuito: 50 mil leituras e 20 mil gravações por dia no Firestore, com folga para a equipe.
