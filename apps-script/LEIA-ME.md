# Servidor de pendências (Google Apps Script)

Guarda as pendências registradas na aba **Em Andamento** do dashboard.
Sem ele, o dashboard funciona em **modo de teste**: as pendências ficam salvas só no navegador de quem testou.

## Instalação (uma vez, numa conta Google da equipe)

1. Crie uma planilha Google, por exemplo **"Pendências · Dashboard Deduca"**.
2. Na planilha, abra **Extensões → Apps Script**.
3. Apague o conteúdo do `Código.gs` e cole todo o `Pendencias.gs` desta pasta. Salve.
4. Na barra de cima, escolha a função **`configurar`** e clique em **Executar**. Autorize o acesso quando o Google pedir. Isso cria a aba `Pendencias` com o cabeçalho.
5. Clique em **Implantar → Nova implantação → Tipo: App da Web**:
   - **Executar como:** Eu
   - **Quem pode acessar:** Qualquer pessoa
6. Copie a **URL do app da Web** (termina em `/exec`).
7. No `index.html`, cole a URL em `const PENDENCIAS_API = "";` e suba a alteração por Pull Request.

Para conferir se está no ar, abra a URL `/exec` no navegador. Deve aparecer "Servidor de pendências do Dashboard Deduca: no ar."

## Atualizar o código depois

Cole a nova versão do `Pendencias.gs` e vá em **Implantar → Gerenciar implantações → editar (lápis) → Versão: Nova versão**. Assim a URL continua a mesma.

## Observações

- A lista de motivos existe em dois lugares: `MOTIVOS` no `Pendencias.gs` e `MOTIVOS_PENDENCIA` no `index.html`. As duas precisam ser iguais.
- Como o dashboard é público, qualquer pessoa com o link consegue registrar uma pendência. O servidor limita o tamanho dos textos, só aceita motivos da lista e bloqueia fórmulas na planilha. O histórico completo fica na planilha, para conferência.
