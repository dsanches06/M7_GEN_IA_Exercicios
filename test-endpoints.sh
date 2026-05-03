#!/bin/bash

# 🧪 Script de Teste - ClickBot GenAI Endpoints

API_URL="http://localhost:3000"

echo "📋 Testando Endpoints - ClickBot GenAI"
echo "========================================"
echo ""

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 1. Chat de Suporte
echo -e "${YELLOW}1. Testando Chat de Suporte (Stream)${NC}"
echo "GET /chat_history?message=Como%20uso%20o%20ClickUp"
curl -s "${API_URL}/chat_history?message=Como%20uso%20o%20ClickUp" | head -c 200
echo -e "\n${GREEN}✓ Concluído${NC}\n"

# 2. Smart Task Parser
echo -e "${YELLOW}2. Testando Smart Task Parser${NC}"
echo "POST /conversations/parse-task"
curl -s -X POST "${API_URL}/conversations/parse-task" \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Preciso de um design para a home page até sexta com prioridade alta"
  }' | jq '.'
echo -e "${GREEN}✓ Concluído${NC}\n"

# 3. Meeting Transcribe
echo -e "${YELLOW}3. Testando Meeting Transcribe (Stream)${NC}"
echo "POST /meeting_summaries/transcribe"
curl -s -X POST "${API_URL}/meeting_summaries/transcribe" \
  -H "Content-Type: application/json" \
  -d '{
    "notes": "Reunião sobre novo projeto ClickBot. Discutimos: arquitetura, timeline, equipa. Decisões: usar Next.js, deploy em Vercel. Proximos passos: criar prototipo, user testing.",
    "project_id": 1
  }' | head -c 300
echo -e "\n${GREEN}✓ Concluído${NC}\n"

# 4. Bug Triage
echo -e "${YELLOW}4. Testando Bug Triage${NC}"
echo "POST /tickets/triage"
curl -s -X POST "${API_URL}/tickets/triage" \
  -H "Content-Type: application/json" \
  -d '{
    "error_report": "Servidor retorna erro 500 ao criar nova tarefa, impede toda operação de CRUD"
  }' | jq '.'
echo -e "${GREEN}✓ Concluído${NC}\n"

# 5. Weekly Planner
echo -e "${YELLOW}5. Testando Weekly Planner (Stream)${NC}"
echo "POST /conversations/planner/weekly"
curl -s -X POST "${API_URL}/conversations/planner/weekly" \
  -H "Content-Type: application/json" \
  -d '{
    "tasks": "Tenho que entregar logo do projeto, ir ao dentista na terça-feira, estudar React todos os dias, prepare apresentação para sexta"
  }' | head -c 300
echo -e "\n${GREEN}✓ Concluído${NC}\n"

# 6. Sentiment Dashboard
echo -e "${YELLOW}6. Testando Sentiment Dashboard${NC}"
echo "GET /conversations/sentiment/dashboard"
curl -s "${API_URL}/conversations/sentiment/dashboard" | jq '.'
echo -e "${GREEN}✓ Concluído${NC}\n"

# Health Check
echo -e "${YELLOW}🏥 Health Check${NC}"
curl -s "${API_URL}/health" | jq '.'
echo -e "${GREEN}✓ Servidor está online${NC}\n"

echo "========================================"
echo "✅ Testes Concluídos!"
