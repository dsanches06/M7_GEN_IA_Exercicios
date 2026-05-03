## 🆘 Troubleshooting & Troubleshooting

### ❌ Backend não inicia

**Erro: "Port 3000 already in use"**
```bash
# Windows - Kill processo na porta 3000
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Ou usar porta diferente no .env
PORT=3001
```

**Erro: "Cannot find module '@google/generative-ai'"**
```bash
cd DB/backend
npm install
npm install @google/generative-ai zod
```

**Erro: "ECONNREFUSED - Cannot connect to database"**
- Verificar se MySQL está rodando
- Verificar credenciais em `.env`
```bash
mysql -u root -p
USE clickup_db;
```

---

### ❌ ChatUI não conecta ao backend

**Erro: "CORS error" ou "Failed to fetch"**

Solução 1 - Verificar Proxy Vite (`vite.config.js`):
```javascript
server: {
  proxy: {
    "/chat_history": "http://localhost:3000",
    "/conversations": "http://localhost:3000",
    "/meeting_summaries": "http://localhost:3000",
    "/tickets": "http://localhost:3000",
  },
},
```

Solução 2 - Verificar `.env.local`:
```
VITE_API_URL=http://localhost:3000
```

Solução 3 - Reiniciar dev server:
```bash
# Kill processo e reiniciar
npm run dev
```

---

### ❌ API Gemini retorna erro

**Erro: "API key not valid"**
```bash
# Verificar .env
cat DB/backend/src/.env

# Obter chave em https://ai.google.dev
# Copiar e colar no .env corretamente
```

**Erro: "Resource exhausted" ou "429 Too Many Requests"**
- Aguardar alguns minutos
- Implementar retry com backoff exponencial

---

### ❌ Streaming não funciona

**Problema: Resposta não aparece em tempo real**

Verificar se é realmente stream:
```bash
# Deve retornar event stream
curl -v "http://localhost:3000/chat_history?message=teste"

# Deve ver: Content-Type: text/event-stream
```

Se não ver, verificar `chatHistoryRoutes.js`:
```javascript
res.setHeader("Content-Type", "text/event-stream");
res.setHeader("Cache-Control", "no-cache");
res.setHeader("Connection", "keep-alive");
```

---

### ❌ Database não persiste

**Problema: Chat history não está sendo salvo**

Verificar estrutura das tabelas:
```sql
-- Backend database
USE clickup_db;
SHOW TABLES;
DESCRIBE chat_history;
```

Se tabela não existe, verificar controller:
```bash
# Ver se controller está salvando
cat DB/backend/src/controllers/chatHistoryController.js
```

---

### ✅ Testes Manuais Rápidos

**1. Backend está respondendo?**
```bash
curl http://localhost:3000/health
# Deve retornar: { "status": "OK" }
```

**2. Gemini API conectando?**
```bash
curl "http://localhost:3000/chat_history?message=teste"
# Deve ver streaming em tempo real
```

**3. ChatUI carregando?**
```bash
# Abrir http://localhost:5173
# Ver console (F12) para erros
```

---

### 📊 Verificação de Saúde

**Criar arquivo `health-check.ps1`:**

```powershell
$services = @(
    @{ name = "Backend"; url = "http://localhost:3000/health" },
    @{ name = "ChatUI"; url = "http://localhost:5173" },
    @{ name = "MySQL"; port = 3306 }
)

foreach ($service in $services) {
    Write-Host "Verificando $($service.name)..." -ForegroundColor Yellow
    
    if ($service.url) {
        try {
            $response = Invoke-WebRequest -Uri $service.url -TimeoutSec 2 -ErrorAction Stop
            Write-Host "✅ $($service.name) OK" -ForegroundColor Green
        } catch {
            Write-Host "❌ $($service.name) FALHOU" -ForegroundColor Red
        }
    }
}
```

---

### 🔧 Debug Mode

**Backend com logs detalhados:**

```bash
# Adicionar ao .env
DEBUG=*

# Rodar
npm start
```

**ChatUI com React DevTools:**
- Instalar Chrome Extension: React Developer Tools
- F12 → Components
- Ver state em tempo real

---

### 💡 Performance Tips

1. **Limpar cache do browser:**
   - F12 → Application → Clear Site Data

2. **Usar nodemon para auto-restart:**
   ```bash
   npm install --save-dev nodemon
   # Já está no package.json
   ```

3. **Monitorar requisições:**
   ```bash
   # Terminal 3
   tail -f DB/backend/src/.env
   ```

4. **Verificar memória:**
   ```bash
   # PowerShell
   Get-Process node | Select ProcessName, WorkingSet
   ```

---

### 📖 Documentação Útil

- **Google Gemini API:** https://ai.google.dev
- **Express Streaming:** https://expressjs.com/
- **Server-Sent Events:** https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events
- **Zod Validation:** https://zod.dev
- **Vite Proxy:** https://vitejs.dev/config/server-options.html#server-proxy

---

### 🚨 Casos Extremos

**O backend travou?**
```bash
# Kill todos os node processes
Get-Process node | Stop-Process -Force

# Reiniciar
npm start
```

**Preciso resetar a database?**
```bash
# Conectar ao MySQL
mysql -u root -p clickup_db

# Limpar tabelas
TRUNCATE TABLE chat_history;
TRUNCATE TABLE meeting_summaries;
TRUNCATE TABLE tickets;
```

**ChatUI não atualiza?**
```bash
# Limpar node_modules
rm -r chatUI/node_modules
npm install

# Limpar Vite cache
rm -r chatUI/.vite

# Reiniciar dev server
npm run dev
```

---

### 📞 Checklist Final

- [ ] Backend rodando na porta 3000?
- [ ] ChatUI rodando na porta 5173?
- [ ] `.env` com `GEMINI_API_KEY` correto?
- [ ] `.env.local` com `VITE_API_URL` correto?
- [ ] MySQL conectando?
- [ ] Proxy Vite configurado?
- [ ] Consegue ver streaming no curl?
- [ ] ChatUI mostra mensagens em tempo real?

Se tudo OK ✅ → Pronto para usar!

---

**Precisa de mais ajuda? Verifique os arquivos de log:**
- Backend: Console do terminal
- ChatUI: F12 → Console
- MySQL: Event Viewer (Windows) ou logs do MySQL
