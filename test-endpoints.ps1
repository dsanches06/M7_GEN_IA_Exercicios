# 🧪 Script de Teste - ClickBot GenAI Endpoints (PowerShell)

$API_URL = "http://localhost:3000"

Write-Host "📋 Testando Endpoints - ClickBot GenAI" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 1. Chat de Suporte
Write-Host "1. Testando Chat de Suporte (Stream)" -ForegroundColor Yellow
Write-Host "GET /chat_history?message=Como%20uso%20o%20ClickUp"
$response = Invoke-WebRequest -Uri "$API_URL/chat_history?message=Como%20uso%20o%20ClickUp" -Method GET
Write-Host $response.Content.Substring(0, [Math]::Min(200, $response.Content.Length)) -ForegroundColor Green
Write-Host "✓ Concluído" -ForegroundColor Green
Write-Host ""

# 2. Smart Task Parser
Write-Host "2. Testando Smart Task Parser" -ForegroundColor Yellow
Write-Host "POST /conversations/parse-task"
$body = @{
    text = "Preciso de um design para a home page até sexta com prioridade alta"
} | ConvertTo-Json

$response = Invoke-WebRequest -Uri "$API_URL/conversations/parse-task" `
  -Method POST `
  -Headers @{"Content-Type"="application/json"} `
  -Body $body
Write-Host $response.Content | ConvertFrom-Json | ConvertTo-Json -Depth 5
Write-Host "✓ Concluído" -ForegroundColor Green
Write-Host ""

# 3. Meeting Transcribe
Write-Host "3. Testando Meeting Transcribe (Stream)" -ForegroundColor Yellow
Write-Host "POST /meeting_summaries/transcribe"
$body = @{
    notes = "Reunião sobre novo projeto ClickBot. Discutimos: arquitetura, timeline, equipa. Decisões: usar Next.js, deploy em Vercel. Proximos passos: criar prototipo, user testing."
    project_id = 1
} | ConvertTo-Json

$response = Invoke-WebRequest -Uri "$API_URL/meeting_summaries/transcribe" `
  -Method POST `
  -Headers @{"Content-Type"="application/json"} `
  -Body $body
Write-Host $response.Content.Substring(0, [Math]::Min(300, $response.Content.Length)) -ForegroundColor Green
Write-Host "✓ Concluído" -ForegroundColor Green
Write-Host ""

# 4. Bug Triage
Write-Host "4. Testando Bug Triage" -ForegroundColor Yellow
Write-Host "POST /tickets/triage"
$body = @{
    error_report = "Servidor retorna erro 500 ao criar nova tarefa, impede toda operação de CRUD"
} | ConvertTo-Json

$response = Invoke-WebRequest -Uri "$API_URL/tickets/triage" `
  -Method POST `
  -Headers @{"Content-Type"="application/json"} `
  -Body $body
Write-Host $response.Content | ConvertFrom-Json | ConvertTo-Json -Depth 5
Write-Host "✓ Concluído" -ForegroundColor Green
Write-Host ""

# 5. Weekly Planner
Write-Host "5. Testando Weekly Planner (Stream)" -ForegroundColor Yellow
Write-Host "POST /conversations/planner/weekly"
$body = @{
    tasks = "Tenho que entregar logo do projeto, ir ao dentista na terça-feira, estudar React todos os dias, prepare apresentação para sexta"
} | ConvertTo-Json

$response = Invoke-WebRequest -Uri "$API_URL/conversations/planner/weekly" `
  -Method POST `
  -Headers @{"Content-Type"="application/json"} `
  -Body $body
Write-Host $response.Content.Substring(0, [Math]::Min(300, $response.Content.Length)) -ForegroundColor Green
Write-Host "✓ Concluído" -ForegroundColor Green
Write-Host ""

# 6. Sentiment Dashboard
Write-Host "6. Testando Sentiment Dashboard" -ForegroundColor Yellow
Write-Host "GET /conversations/sentiment/dashboard"
$response = Invoke-WebRequest -Uri "$API_URL/conversations/sentiment/dashboard" -Method GET
Write-Host $response.Content | ConvertFrom-Json | ConvertTo-Json -Depth 5
Write-Host "✓ Concluído" -ForegroundColor Green
Write-Host ""

# Health Check
Write-Host "🏥 Health Check" -ForegroundColor Yellow
$response = Invoke-WebRequest -Uri "$API_URL/health" -Method GET
Write-Host $response.Content | ConvertFrom-Json | ConvertTo-Json -Depth 5
Write-Host "✓ Servidor está online" -ForegroundColor Green
Write-Host ""

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "✅ Testes Concluídos!" -ForegroundColor Green
