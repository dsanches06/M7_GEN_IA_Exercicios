# 🎯 Arquitetura Visual - ClickBot GenAI

## Diagrama de Fluxo

```
┌─────────────────────────────────────────────────────────────────┐
│                        USER BROWSER                             │
│                   (localhost:5173)                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │              CHATUI (React + Vite)                      │   │
│  ├─────────────────────────────────────────────────────────┤   │
│  │                                                         │   │
│  │  • ChatPage.jsx                                         │   │
│  │    └─ handleSend(text)                                  │   │
│  │       └─ apiService.chatWithStream(text)               │   │
│  │                                                         │   │
│  │  • MessageList.jsx                                      │   │
│  │    └─ Exibe mensagens em tempo real                     │   │
│  │                                                         │   │
│  │  • apiService.js                                        │   │
│  │    ├─ chatWithStream()       → Exercise 1              │   │
│  │    ├─ parseTask()            → Exercise 2              │   │
│  │    ├─ transcribeMeeting()    → Exercise 3              │   │
│  │    ├─ triageBug()            → Exercise 4              │   │
│  │    ├─ planWeekly()           → Exercise 5              │   │
│  │    └─ getSentimentDashboard()→ Exercise 6              │   │
│  │                                                         │   │
│  └─────────────────────────────────────────────────────────┘   │
│                         │ Proxy Vite                             │
│                         │ (cross-origin)                         │
│                         ▼                                        │
└──────────────────────────────────────────────────────────────────┘
                          │
                    HTTP + JSON
                    SSE (Streaming)
                          │
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│                    BACKEND (Express)                            │
│                (localhost:3000)                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │              Express App (app.js)                         │ │
│  │  • CORS: origin: "*"                                      │ │
│  │  • Logger middleware                                      │ │
│  │  • JSON parser                                            │ │
│  └───────────────────────────────────────────────────────────┘ │
│                         │                                       │
│                         ▼                                       │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │              ROTAS DE EXERCÍCIOS                          │ │
│  ├───────────────────────────────────────────────────────────┤ │
│  │                                                           │ │
│  │  1️⃣  chatHistoryRoutes                                   │ │
│  │      └─ GET / (Stream Chat)                              │ │
│  │      └─ GET /list (CRUD)                                 │ │
│  │      └─ POST /save (CRUD)                                │ │
│  │                                                           │ │
│  │  2️⃣  conversationRoutes                                  │ │
│  │      └─ POST /parse-task (Task Parser)                   │ │
│  │      └─ POST /planner/weekly (Planner)                   │ │
│  │      └─ GET /sentiment/dashboard (Sentiment)             │ │
│  │      └─ GET /list (CRUD)                                 │ │
│  │      └─ POST /save (CRUD)                                │ │
│  │                                                           │ │
│  │  3️⃣  meetingSummarieRoutes                               │ │
│  │      └─ POST /transcribe (Stream Meeting)                │ │
│  │      └─ GET /list (CRUD)                                 │ │
│  │      └─ POST /save (CRUD)                                │ │
│  │                                                           │ │
│  │  4️⃣  ticketRoutes                                        │ │
│  │      └─ POST /triage (Bug Triage)                        │ │
│  │      └─ GET /list (CRUD)                                 │ │
│  │      └─ POST /save (CRUD)                                │ │
│  │                                                           │ │
│  └───────────────────────────────────────────────────────────┘ │
│                         │                                       │
│                         ▼                                       │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │         AI EXERCISES SERVICE                             │ │
│  │     (aiExercisesService.js)                              │ │
│  ├───────────────────────────────────────────────────────────┤ │
│  │                                                           │ │
│  │  Funções Exportadas:                                      │ │
│  │  • chatSuportWithStream()                                 │ │
│  │  • parseTaskFromNaturalLanguage()                         │ │
│  │  • transcribeMeetingWithStream()                          │ │
│  │  • triageBugReport()                                      │ │
│  │  • planWeeklySchedule()                                   │ │
│  │  • analyzeTeamSentiment()                                 │ │
│  │                                                           │ │
│  │  Cada função:                                             │ │
│  │  1. Valida entrada                                        │ │
│  │  2. Chama Gemini API                                      │ │
│  │  3. Valida com Zod (estruturado)                          │ │
│  │  4. Retorna resposta ou stream                            │ │
│  │                                                           │ │
│  └───────────────────────────────────────────────────────────┘ │
│                         │                                       │
│        ┌────────────────┼────────────────┐                     │
│        ▼                ▼                ▼                     │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐           │
│  │ Google AI    │ │  MySQL DB    │ │  Error LOG   │           │
│  │  (Gemini)    │ │              │ │              │           │
│  │              │ │ • chat_      │ │ • console    │           │
│  │ • Models:    │ │   history    │ │   logs       │           │
│  │   1.5-flash  │ │ • meeting_   │ │ • stack      │           │
│  │   2.5-flash  │ │   summaries  │ │   traces     │           │
│  │   lite       │ │ • tickets    │ │              │           │
│  │              │ │ • tasks      │ │              │           │
│  │ • Features:  │ │              │ │              │           │
│  │   Stream     │ │              │ │              │           │
│  │   JSON       │ │              │ │              │           │
│  │   Validation │ │              │ │              │           │
│  └──────────────┘ └──────────────┘ └──────────────┘           │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Fluxo de Dados - Exemplo Chat

```
┌─────────────────────────────────────────────────────────────────┐
│ 1. User digita "Como uso o ClickUp?" e clica ENVIAR            │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│ 2. ChatPage.handleSend() é chamado                              │
│    • Cria mensagem do usuário                                   │
│    • Chama: apiService.chatWithStream(text)                    │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│ 3. apiService faz requisição HTTP                               │
│    GET /chat_history?message=Como%20uso%20o%20ClickUp           │
│    Headers: { "Content-Type": "text/event-stream" }            │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│ 4. Backend recebe em chatHistoryRoutes                           │
│    router.get("/", async (req, res) => {                        │
│      const { message } = req.query;                             │
│      await chatSuportWithStream(message, req, res);             │
│    })                                                            │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│ 5. aiExercisesService.chatSuportWithStream() executa:           │
│    • res.setHeader("Content-Type", "text/event-stream")         │
│    • const result = await model.generateContentStream({...})    │
│    • for await (const chunk of result.stream) {                 │
│      • fullResponse += chunk.text()                             │
│      • res.write(`data: ${JSON.stringify({chunk})}\n\n`)       │
│    }                                                             │
│    • res.end()                                                   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│ 6. ChatUI recebe stream em apiService                            │
│    for await (const chunk of stream) {                          │
│      if (chunk.chunk) {                                         │
│        botResponse += chunk.chunk;                              │
│        setMessages([...]) // Atualiza UI                        │
│      }                                                           │
│    }                                                             │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│ 7. MessageList mostra resposta em tempo real!                   │
│    "A resposta completa aparece gradualmente..."               │
└─────────────────────────────────────────────────────────────────┘
```

---

## Stack Tecnológico

```
┌──────────────────────────────────────────────────────┐
│                   FRONTEND                           │
├──────────────────────────────────────────────────────┤
│ • React 19.2.5                                       │
│ • Vite 8.0.10                                        │
│ • Tailwind CSS 4.2.4                                 │
│ • Framer Motion 12.38.0 (animações)                 │
└──────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────┐
│                   BACKEND                            │
├──────────────────────────────────────────────────────┤
│ • Express 5.2.1                                      │
│ • Node.js (ECMAScript modules)                       │
│ • Google Generative AI SDK 0.21.0                   │
│ • Zod 3.24.1 (validação)                            │
│ • CORS 2.8.6                                        │
│ • MySQL2 3.20.0 (driver)                            │
└──────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────┐
│                   BANCO DE DADOS                     │
├──────────────────────────────────────────────────────┤
│ • MySQL 8.0+                                        │
│ • Database: clickup_db                              │
│ • Tabelas: chat_history, meeting_summaries, etc     │
└──────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────┐
│                   IA EXTERNO                         │
├──────────────────────────────────────────────────────┤
│ • Google Gemini                                      │
│ • Models: 1.5-flash, 2.5-flash-lite                │
│ • Streaming: Sim                                    │
│ • JSON Output: Sim                                  │
└──────────────────────────────────────────────────────┘
```

---

## Mapa de Componentes React

```
App.jsx
└── ThemeProvider
    └── ChatPage.jsx
        ├── HeaderUI.jsx
        │   └── Theme Toggle
        │
        ├── MessageList.jsx
        │   └── Message.jsx (multiple)
        │       ├── Markdown support
        │       └── Animations
        │
        └── ChatUI.jsx (ChatInput)
            └── Input field + Send button
```

---

## Endpoints Resumo Executivo

```
┌──────┬──────────────────────────┬─────────┬──────────┐
│ EX.  │ ENDPOINT                 │ MÉTODO  │ RESPOSTA │
├──────┼──────────────────────────┼─────────┼──────────┤
│ 1️⃣   │ /chat_history            │ GET     │ Stream   │
│ 2️⃣   │ /conversations/parse-task│ POST    │ JSON     │
│ 3️⃣   │ /meeting_summaries/...   │ POST    │ Stream   │
│ 4️⃣   │ /tickets/triage          │ POST    │ JSON     │
│ 5️⃣   │ /conversations/planner.. │ POST    │ Stream   │
│ 6️⃣   │ /conversations/sentiment │ GET     │ JSON     │
└──────┴──────────────────────────┴─────────┴──────────┘
```

---

## Ciclo de Vida - Desde o Início

```
npm install (Backend)
    ↓
npm install (ChatUI)
    ↓
Configurar .env (Backend)
    ↓
Configurar .env.local (ChatUI)
    ↓
npm start (Backend) → http://localhost:3000
    ↓
npm run dev (ChatUI) → http://localhost:5173
    ↓
Abrir browser → localhost:5173
    ↓
Digitar mensagem → Enter
    ↓
API call → Backend
    ↓
Gemini processa
    ↓
SSE Streaming
    ↓
Update UI em tempo real
    ↓
Salva em database
    ↓
Pronto! ✅
```

---

**Diagrama criado com ASCII art para visualização rápida!**
