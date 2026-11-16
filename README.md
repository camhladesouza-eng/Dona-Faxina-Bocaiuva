# Dona Faxina — site inicial

## O que está incluído
- Site responsivo com a identidade visual da Dona Faxina: azul `#022C63`, turquesa `#01B7AB`, laranja `#FE9402` e branco.
- Catálogo de serviços, formulário de agendamento, adicionais e estimativa.
- Validação de data, horário e endereço em Bocaiúva.
- Demonstração local de solicitações usando `localStorage`.
- Função inicial de backend para gerar checkout Mercado Pago (Pix e cartão; boleto excluído).

## Antes de publicar
1. Abra `config.js` e cadastre os preços reais dos três pacotes e dos adicionais. Não foram inventados preços.
2. Repita exatamente os mesmos preços em `api/pricing.js`.
3. Revise os horários disponíveis, o texto dos serviços e as regras de atendimento.
4. Não habilite pagamentos enquanto os preços não estiverem definidos e testados.

## Publicar a parte visual no GitHub Pages
1. Crie um repositório no GitHub, por exemplo `dona-faxina`.
2. Envie `index.html`, `styles.css`, `app.js` e `config.js` para a raiz do repositório.
3. No GitHub, abra **Settings > Pages**.
4. Em **Build and deployment**, selecione **Deploy from a branch**.
5. Escolha `main` e `/ (root)` e salve.
6. Aguarde o endereço publicado. Ele será parecido com `https://SEU-USUARIO.github.io/dona-faxina/`.

## Backend e Mercado Pago
GitHub Pages não executa Node.js. A função `api/create-preference.js` precisa ser publicada em um serviço de backend/serverless compatível, como Vercel:
1. Importe o repositório no Vercel.
2. Cadastre `MP_ACCESS_TOKEN`, `SITE_URL`, `ALLOWED_ORIGIN` e `MP_WEBHOOK_URL` nas variáveis de ambiente.
3. Use o token privado de produção somente no servidor. Nunca coloque o token no `config.js`, `app.js` ou em repositório público.
4. Publique o backend e copie sua URL HTTPS.
5. Em `config.js`, configure `apiBaseUrl` com a URL HTTPS do backend, sem barra no final.
6. Atualize `ALLOWED_ORIGIN` com o domínio exato do GitHub Pages.
7. Faça testes com credenciais de teste antes de ativar produção.

A função de checkout usa o endpoint de preferências do Checkout Pro. A documentação atual do Mercado Pago apresenta a API Orders como opção recomendada para novas integrações; Preferences continua documentada e disponível. Consulte a documentação oficial e confirme o fluxo adequado à sua conta antes de produção.

## Limitações desta versão inicial — leia antes de receber pedidos
Esta entrega é uma base visual funcional para demonstração, não um sistema de produção completo:
- Cadastro/login está apenas representado na interface. Não há autenticação real.
- Os pedidos de demonstração ficam somente no navegador de quem os preencheu. Não existe banco de dados compartilhado.
- Não existem ainda painéis protegidos de cliente, profissional e administrador, controle de equipe, faturamento consolidado, avaliações verificadas ou galeria com upload.
- A função de checkout cria uma preferência, mas não salva um agendamento em banco de dados e não confirma o pagamento por webhook.
- O retorno do Mercado Pago não deve ser tratado como comprovante. O servidor precisa consultar/validar o pagamento e receber webhooks antes de marcar um pedido como pago.
- A agenda exibida no formulário é uma lista inicial de horários, não uma disponibilidade em tempo real. A equipe deve confirmar cada solicitação.
