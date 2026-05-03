# 🚀 ClickBot GenAI - Workshop Avançado

Implementação de 6 exercícios práticos com GenAI, Streaming, Zod e Express.

## 📋 Exercícios

### 1️⃣ Chat de Suporte com Stream
Stream de respostas do Gemini em tempo real.
```bash
curl "http://localhost:5000/ex1/chat?message=Como uso o ClickUp?"
```

### 2️⃣ Smart Task Parser
Converte linguagem natural em tarefas estruturadas.
```bash
curl -X POST http://localhost:5000/ex2/parse-task \
  -H "Content-Type: application/json" \
  -d '{"text": "Design até sexta com prioridade alta"}'
```

### 3️⃣ Meeting Transcriber
Gera sumários de reuniões em tempo real.
```bash
curl -X POST http://localhost:5000/meetings/transcribe \
  -H "Content-Type: application/json" \
  -d '{"notes": "Reunião de sprint..."}'
```

### 4️⃣ Bug Triage
Classifica erros automaticamente.
```bash
curl -X POST http://localhost:5000/bugs/triage \
  -H "Content-Type: application/json" \
  -d '{"error_report": "Botão não funciona"}'
```

### 5️⃣ Weekly Planner
Organiza tarefas semanais com agenda estruturada.
```bash
curl -X POST http://localhost:5000/planner/weekly \
  -H "Content-Type: application/json" \
  -d '{"tasks": "Logo até quarta, dentista terça..."}'
```

### 6️⃣ Sentiment Dashboard
Analisa sentimento da equipa.
```bash
curl http://localhost:5000/dashboard/sentiment
```

## ⚡ Quick Start

### 1. Instalar
```bash
npm install
```

### 2. Configurar
```bash
cp .env.example .env
# Editar .env e adicionar GEMINI_API_KEY
```

### 3. Executar
```bash
npm start
```

### 4. Testar (CLI)
```bash
npm run cli:demo
npm run cli:parser
npm run cli:sentiment
```

## 📁 Ficheiros

- `index.js` - Main server
- `exercicio1.js` - Chat com Stream
- `exercicio2.js` - Task Parser
- `exercicio3.js` - Meeting Transcriber
- `exercicio4.js` - Bug Triage
- `exercicio5.js` - Weekly Planner
- `exercicio6.js` - Sentiment Dashboard
- `cli.js` - CLI para testes

## 🎓 Conceitos

- **Streaming**: Server-Sent Events (SSE)
- **Structured Output**: JSON Schema validation com Zod
- **NLP**: Natural Language Processing
- **Automation**: Decisões autónomas com IA
- **Error Handling**: Try-catch com validação

## 🔧 Dependências

- `@google/generative-ai` - Gemini API
- `express` - Framework web
- `zod` - Type validation
- `zod-to-json-schema` - Schema converter
- `dotenv` - Environment variables

## 🆘 Troubleshooting

**Erro: GEMINI_API_KEY not set**
```bash
cp .env.example .env
# Editar .env com sua chave
```

**Porta 5000 em uso**
```bash
# Mudar em .env
PORT=3001
```

**Módulos não encontrados**
```bash
npm install
```

---

**Desenvolvido no Workshop ClickBot GenAI - Módulo 07**
