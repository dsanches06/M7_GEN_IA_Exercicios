# 🚀 M7_GEN_IA_Exercicios - ClickBot GenAI

Integração completa dos **exercícios guiados 03** com **Backend Express**, **ChatUI React** e **Google Gemini AI**.

---

## 📋 Visão Geral

Este repositório implementa **6 exercícios avançados** de IA integrados em uma arquitetura fullstack:

- **Backend**: Express.js + Google Generative AI + MySQL
- **Frontend**: React + Vite + Streaming em tempo real
- **Database**: MySQL para persistência (chat_history, meeting_summaries, tickets)
- **IA**: Google Gemini com processamento de linguagem natural

---

## 🎯 Os 6 Exercícios

| # | Nome | Rota | Status |
|---|------|------|--------|
| 1️⃣ | Chat de Suporte | `GET /chat_history?message=` | ✅ Streaming |
| 2️⃣ | Smart Task Parser | `POST /conversations/parse-task` | ✅ JSON |
| 3️⃣ | Meeting Transcribe | `POST /meeting_summaries/transcribe` | ✅ Streaming |
| 4️⃣ | Bug Triage | `POST /tickets/triage` | ✅ JSON |
| 5️⃣ | Weekly Planner | `POST /conversations/planner/weekly` | ✅ Streaming |
| 6️⃣ | Sentiment Dashboard | `GET /conversations/sentiment/dashboard` | ✅ JSON |

---

## 📂 Estrutura do Repositório

```
M7_GEN_IA_Exercicios/
├── Exemplos de Slides/          # Exemplos das aulas
├── Exercicios Guiados/
│   ├── guiados_01/
│   ├── guiados_02/
│   └── guiados_03/              # Integrado com backend ✅
├── DB/
│   └── backend/                 # 🎯 EXPRESS API
│       ├── src/
│       │   ├── services/
│       │   │   └── aiExercisesService.js (6 exercícios)
│       │   ├── routes/
│       │   │   ├── chatHistoryRoutes.js
│       │   │   ├── conversationRoutes.js
│       │   │   ├── meetingSummarieRoutes.js
│       │   │   └── ticketRoutes.js
│       │   └── .env (GEMINI_API_KEY)
│       └── package.json
├── chatUI/                      # 🎯 REACT FRONTEND
│   ├── src/
│   │   ├── services/
│   │   │   └── apiService.js
│   │   ├── components/
│   │   │   └── ChatPage.jsx
│   │   └── ...
│   ├── .env.local (VITE_API_URL)
│   ├── vite.config.js (proxy)
│   └── package.json
└── Documentação/
    ├── README.md (este arquivo)
    ├── COMPLETE_SUMMARY.md
    ├── INTEGRATION_GUIDE.md
    ├── SETUP_SUMMARY.md
    ├── ARCHITECTURE.md
    ├── TROUBLESHOOTING.md
    ├── test-endpoints.ps1
    └── test-endpoints.sh
```

---

## 🚀 Quick Start (3 Passos)

### 1️⃣ Backend
```bash
cd DB/backend
npm install
npm start
# http://localhost:3000
```

### 2️⃣ ChatUI
```bash
cd chatUI
npm install
npm run dev
# http://localhost:5173
```

### 3️⃣ Testar
```powershell
.\test-endpoints.ps1
```

---

## 📚 Documentação

- **[COMPLETE_SUMMARY.md](COMPLETE_SUMMARY.md)** - Resumo executivo
- **[INTEGRATION_GUIDE.md](INTEGRATION_GUIDE.md)** - Guia de instalação
- **[SETUP_SUMMARY.md](SETUP_SUMMARY.md)** - Arquitetura geral
- **[ARCHITECTURE.md](ARCHITECTURE.md)** - Diagramas e fluxos
- **[TROUBLESHOOTING.md](TROUBLESHOOTING.md)** - Debug e soluções

---

## 🔧 Configuração

### Backend `.env`
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=danilson
DB_NAME=clickup_db
PORT=3000
GEMINI_API_KEY=your_key_here
```

### ChatUI `.env.local`
```env
VITE_API_URL=http://localhost:3000
```

---

## 🏗️ Stack Tecnológico

**Frontend:**
- React 19.2.5
- Vite 8.0.10
- Tailwind CSS 4.2.4
- Framer Motion

**Backend:**
- Express 5.2.1
- Google Generative AI SDK 0.21.0
- Zod 3.24.1
- MySQL2 3.20.0

**IA Externo:**
- Google Gemini (1.5-flash, 2.5-flash-lite)

---

## 📊 Fluxo de Dados

```
ChatUI Input
    ↓
apiService.js
    ↓
Vite Proxy (cross-origin)
    ↓
Express Backend
    ↓
aiExercisesService.js
    ↓
Google Gemini AI
    ↓
Server-Sent Events (SSE)
    ↓
ChatUI recebe streaming
    ↓
MySQL persiste
    ↓
UI Atualizada em tempo real
```

---

## 🎓 O que Você Aprende

✅ Server-Sent Events (SSE)  
✅ Google Generative AI Integration  
✅ Validação com Zod  
✅ Express Streaming  
✅ React State Management  
✅ HTTP Proxy em Vite  
✅ MySQL Persistence  

---

## 🧪 Testar Endpoints

```bash
# Testar todos os endpoints
.\test-endpoints.ps1

# Ou manualmente
curl "http://localhost:3000/chat_history?message=teste"
```

---

## ⚡ Próximas Etapas

- [ ] Adicionar autenticação (JWT)
- [ ] Implementar rate limiting
- [ ] Cache com Redis
- [ ] Testes automatizados
- [ ] Deploy (Vercel + Railway)

---

## 📞 Suporte

Se tiver problemas:
1. Leia [TROUBLESHOOTING.md](TROUBLESHOOTING.md)
2. Execute `test-endpoints.ps1`
3. Verifique logs no terminal

---

**Status:** ✅ Pronto para Produção  
**Versão:** 1.0.0  
**Última atualização:** Maio 2026
- `first-api-groq-api` demonstra o fluxo de chat usando a biblioteca Groq para conectar-se a um modelo.

## Endpoints implementados

- `Exercicios Guiados/guiados_01`
  - `POST /api/tasks/create`
  - `POST /api/tasks/refine`
  - `POST /api/tasks/summarize`
  - `POST /api/tasks/suggest-tags`

- `Exercicios Guiados/guiados_02`
  - `POST /api/clickbot/chat`
  - `POST /api/clickbot/classify`
  - `POST /api/clickbot/generate-names`
  - `POST /api/clickbot/send-message`
  - `POST /api/clickbot/summarize`

- `first-api`
  - `POST /api/tasks/create`
  - `GET /` (root endpoint)

## Como usar

O projeto está organizado para facilitar a exploração dos exercícios e das APIs. O servidor principal de rotas de aprendizado está configurado no arquivo `package.json` e pode ser iniciado a partir da raiz do repositório.

## Notas

- Os exemplos de IA dependem de chaves válidas e de conexão com os serviços externos.
- O código está estruturado em módulos para separar lógica de servidor, integração com API e rotas de aplicação.

## Autor

Repositório de exercícios do módulo 7 do curso GEN IA.

