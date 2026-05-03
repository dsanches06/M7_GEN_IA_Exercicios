/**
 * 🚀 ClickBot GenAI - Servidor Principal
 */

import express from "express";
import dotenv from "dotenv";

// Importar exercícios
import { chatSuportWithStream } from "./exercicio1.js";
import { parseTaskFromNaturalLanguage } from "./exercicio2.js";
import { setupMeetingRoutes } from "./exercicio3.js";
import { triageBugReport, setupBugTriageRoutes } from "./exercicio4.js";
import { planWeeklySchedule, setupPlannerRoutes } from "./exercicio5.js";
import { analyzeTeamSentiment, setupSentimentRoutes } from "./exercicio6.js";

dotenv.config();

const app = express();
app.use(express.json());

console.log("🎯 Iniciando ClickBot GenAI Workshop...\n");

// =====================================================
// ROTAS DOS EXERCÍCIOS
// =====================================================

/**
 * EXERCÍCIO 1: Chat de Suporte com Stream
 * GET /chat?message=...
 */
app.get("/chat", async (req, res) => {
  const { message } = req.query;
  if (!message) {
    return res.status(400).json({ error: "Parâmetro 'message' obrigatório" });
  }
  await chatSuportWithStream(message, req, res);
});

/**
 * EXERCÍCIO 2: Smart Task Parser
 * POST /parse-task
 * Body: { "text": "Preciso de um design..." }
 */
app.post("/parse-task", async (req, res) => {
  const { text } = req.body;
  if (!text) {
    return res.status(400).json({ error: "Campo 'text' obrigatório" });
  }

  try {
    const task = await parseTaskFromNaturalLanguage(text);
    res.json({ success: true, task });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * EXERCÍCIO 3: Transcritor de Reuniões
 * POST /meetings/transcribe
 */
setupMeetingRoutes(app);

/**
 * EXERCÍCIO 4: Triage de Bugs
 * POST /bugs/triage
 */
setupBugTriageRoutes(app);

/**
 * EXERCÍCIO 5: Weekly Planner
 * POST /planner/weekly
 */
setupPlannerRoutes(app);

/**
 * EXERCÍCIO 6: Sentiment Dashboard
 * GET /ex6/sentiment
 */
setupSentimentRoutes(app);

// =====================================================
// HEALTH CHECK
// =====================================================

app.get("/", (req, res) => {
  res.json({
    status: "OK",
    message: "ClickBot GenAI Workshop",
    exercicios: {
      "1. Chat Suporte": "GET /chat?message=...",
      "2. Task Parser": "POST /parse-task",
      "3. Meeting Transcriber": "POST /meetings/transcribe",
      "4. Bug Triage": "POST /bugs/triage",
      "5. Weekly Planner": "POST /planner/weekly",
      "6. Sentiment Dashboard": "GET /dashboard/sentiment"
    }
  });
});

// =====================================================
// INICIAR SERVIDOR
// =====================================================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Servidor ClickBot GenAI rodando em http://localhost:${PORT}`);
  console.log(`📚 Endpoints disponíveis:`);
  console.log(`   - GET  /                 (info)`);
  console.log(`   - GET  /chat         (Chat com Stream)`);
  console.log(`   - POST /parse-task   (Task Parser)`);
  console.log(`   - POST /meetings/transcribe   (Meeting Transcriber)`);
  console.log(`   - POST /bugs/triage       (Bug Triage)`);
  console.log(`   - POST /planner/weekly    (Weekly Planner)`);
  console.log(`   - GET  /dashboard/sentiment    (Sentiment Dashboard)\n`);
});

export default app;
