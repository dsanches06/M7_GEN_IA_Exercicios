import express from "express";
import {
  chatSuportWithStream,
  parseTaskFromNaturalLanguage,
  transcribeMeetingWithStream,
  transcribeAudioWithStream,
  triageBugReport,
  planWeeklySchedule,
  analyzeTeamSentiment,
} from "../services/aiExercisesService.js";
import * as exercisesController from "../controllers/exercisesController.js";

const router = express.Router();

/**
 * 🚀 EXERCÍCIO 1: Chat de Suporte com Stream
 * POST /exercises/chat
 */
router.post("/chat", async (req, res) => {
  const { message, conversation_id } = req.body;
  if (!message) {
    return res.status(400).json({ error: "Parâmetro 'message' obrigatório" });
  }
  if (conversation_id) {
    req.query.conversation_id = conversation_id;
  }
  await chatSuportWithStream(message, req, res);
});

/**
 * 🚀 EXERCÍCIO 2: Smart Task Parser
 * POST /exercises/parse-task
 */
router.post("/parse-task", async (req, res) => {
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
 * 🚀 EXERCÍCIO 3: Transcritor de Reuniões
 * POST /exercises/meetings/transcribe
 */
router.post("/meetings/transcribe", async (req, res) => {
  try {
    const { notes, audio, mimeType, project_id } = req.body;

    if (audio) {
      const audioBuffer = Buffer.from(audio, "base64");
      await transcribeAudioWithStream(audioBuffer, mimeType || "audio/wav", project_id || 1, req, res);
    } else if (notes) {
      await transcribeMeetingWithStream(notes, project_id || 1, req, res);
    } else {
      return res.status(400).json({ error: "Parâmetro 'notes' ou 'audio' obrigatório" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * 🚀 EXERCÍCIO 4: Bug Triage
 * POST /exercises/bugs/triage
 */
router.post("/bugs/triage", async (req, res) => {
  const { error_report } = req.body;
  if (!error_report) {
    return res.status(400).json({ error: "Campo 'error_report' obrigatório" });
  }
  try {
    const result = await triageBugReport(error_report);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * 🚀 EXERCÍCIO 5: Smart Planner Semanal
 * POST /exercises/planner/weekly
 */
router.post("/planner/weekly", async (req, res) => {
  const { tasks } = req.body;
  if (!tasks) {
    return res.status(400).json({ error: "Campo 'tasks' obrigatório" });
  }
  await planWeeklySchedule(tasks, req, res);
});

/**
 * 🚀 EXERCÍCIO 6: Sentiment Dashboard (Análise de Feedback Direto)
 * POST /exercises/dashboard/sentiment
 */
router.post("/dashboard/sentiment", async (req, res) => {
  const { feedback } = req.body;
  if (!feedback) {
    return res.status(400).json({ error: "Campo 'feedback' obrigatório" });
  }
  try {
    const result = await analyzeTeamSentiment(feedback);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * 🚀 EXERCÍCIO 6: Sentiment Dashboard (Busca do BANCO DE DADOS)
 * GET /exercises/dashboard/sentiment/database
 * Rota usada pelo teu CLI
 */
router.get("/dashboard/sentiment/database", async (req, res) => {
  try {
    await exercisesController.getSentimentDashboardFromDB(req, res);
  } catch (error) {
    res.status(500).json({ error: "Erro ao aceder ao banco de dados" });
  }
});

/**
 * 🚀 EXERCÍCIO 6B: Análise dos Últimos 20 Comentários
 * POST /exercises/dashboard/sentiment/latest
 */
router.post("/dashboard/sentiment/latest", async (req, res) => {
  try {
    await exercisesController.analyzeLatestComments(req, res);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
