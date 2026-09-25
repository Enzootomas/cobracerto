# 🐍 CobraCerto

> **Receba melhor. Cobre menos.**

O **CobraCerto** é uma plataforma SaaS voltada para pequenas e médias empresas, criada para ajudar no controle de contas a receber, redução da inadimplência, automação de cobranças e conciliação financeira.

O projeto utiliza inteligência artificial para auxiliar na geração de mensagens de cobrança e na análise das informações financeiras da empresa.

---

## 🌐 Aplicação online

### Frontend

https://frontend-production-4dea.up.railway.app

### Backend / API

https://backend-production-1a9d.up.railway.app

### Swagger

https://backend-production-1a9d.up.railway.app/docs

---

## 🎯 Objetivo

Muitas pequenas empresas ainda fazem o controle de cobranças e pagamentos de forma manual.

Isso pode gerar problemas como:

- cobranças esquecidas;
- dificuldade para acompanhar inadimplentes;
- perda de tempo conciliando pagamentos;
- falta de visão sobre a situação financeira;
- dificuldade para priorizar clientes em atraso.

O CobraCerto centraliza essas informações em uma única plataforma.

---

## 🚀 Funcionalidades

### 👥 Clientes

- Cadastro de clientes
- Consulta de clientes
- Validação de dados duplicados
- Telefone, e-mail e documento

### 💰 Contas a receber

- Cadastro de cobranças
- Valor da cobrança
- Data de vencimento
- Status automático
- Marcação de pagamento
- Identificação de contas pendentes e vencidas

### ⚠️ Inadimplentes

O sistema identifica automaticamente cobranças vencidas e calcula:

- dias de atraso;
- valor da dívida;
- cliente responsável;
- situação da cobrança.

### 🤖 Cobranças com Inteligência Artificial

Integração com a API Gemini para gerar mensagens de cobrança.

É possível utilizar diferentes tons:

- amigável;
- profissional;
- formal;
- direto.

As mensagens são geradas utilizando os dados reais da cobrança.

### 📱 WhatsApp

Depois de gerar a cobrança, o usuário pode abrir o WhatsApp com:

- telefone do cliente;
- mensagem de cobrança preenchida automaticamente.

### 📊 Dashboard financeiro

O dashboard apresenta:

- total a receber;
- total recebido;
- total em atraso;
- quantidade de cobranças;
- taxa de inadimplência;
- distribuição por status;
- indicadores financeiros.

### 📈 Analytics

Visualizações financeiras com gráficos utilizando Recharts.

Permite acompanhar:

- cobranças pagas;
- cobranças pendentes;
- cobranças vencidas;
- valores por situação;
- taxa de inadimplência.

### 🏦 Conciliação bancária por CSV

O CobraCerto permite importar um arquivo CSV contendo transações bancárias.

O sistema tenta encontrar automaticamente cobranças com valores correspondentes.

Fluxo:

1. Upload do CSV
2. Análise das transações
3. Identificação de correspondências
4. Visualização das transações não encontradas
5. Confirmação da conciliação
6. Atualização das cobranças como pagas

### 🧠 Assistente Financeiro com IA

O sistema possui um assistente financeiro conectado aos dados reais do PostgreSQL.

Exemplos de perguntas:

- Quanto eu já recebi?
- Quanto tenho em atraso?
- Quantas cobranças foram pagas?
- Qual é minha taxa de inadimplência?
- Quais cobranças precisam de mais atenção?

A IA utiliza somente os dados financeiros existentes na aplicação.

---

## 🏗️ Arquitetura

```text
                    ┌─────────────────┐
                    │     Usuário     │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │     Next.js     │
                    │    Frontend     │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │     FastAPI     │
                    │     Backend     │
                    └───────┬─┬───────┘
                            │ │
                ┌───────────┘ └───────────┐
                ▼                         ▼
        ┌───────────────┐         ┌───────────────┐
        │  PostgreSQL   │         │  Gemini API   │
        │ Banco de dados│         │      IA       │
        └───────────────┘         └───────────────┘