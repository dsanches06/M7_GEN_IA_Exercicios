import express from "express";
import {
  chatSuportWithStream,
  parseTaskFromNaturalLanguage,
  transcribeMeetingWithStream,
  triageBugReport,
  planWeeklySchedule,
  analyzeTeamSentiment,
} from "../services/aiExercisesService.js";
import * as exercisesController from "../controllers/exercisesController.js";

const router = express.Router();

// 🚀 EXERCÍCIO 1: Chat de Suporte com Stream
// GET /exercises/chat?message=...
router.get("/chat", async (req, res) => {
  const { message } = req.query;
  if (!message) {
    return res.status(400).json({ error: "Parâmetro 'message' obrigatório" });
  }
  await chatSuportWithStream(message, req, res);
});

// 🚀 EXERCÍCIO 2: Smart Task Parser
// POST /exercises/parse-task
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

// 🚀 EXERCÍCIO 3: Transcritor de Reuniões
// POST /exercises/meetings/transcribe
router.post("/meetings/transcribe", async (req, res) => {
  const { notes, project_id } = req.body;
  if (!notes) {
    return res.status(400).json({ error: "Parâmetro 'notes' obrigatório" });
  }
  await transcribeMeetingWithStream(notes, project_id || 1, req, res);
});

// 🚀 EXERCÍCIO 4: Bug Triage
// POST /exercises/bugs/triage
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

// 🚀 EXERCÍCIO 5: Smart Planner Semanal
// POST /exercises/planner/weekly
router.post("/planner/weekly", async (req, res) => {
  const { tasks } = req.body;
  if (!tasks) {
    return res.status(400).json({ error: "Campo 'tasks' obrigatório" });
  }
  await planWeeklySchedule(tasks, req, res);
});

// 🚀 EXERCÍCIO 6: Sentiment Dashboard
// POST /exercises/dashboard/sentiment
router.post("/dashboard/sentiment", async (req, res) => {
  const { comments } = req.body;
  if (!comments) {
    return res.status(400).json({ error: "Campo 'comments' obrigatório" });
  }
  try {
    const result = await analyzeTeamSentiment(comments);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 🚀 EXERCÍCIO 6: Sentiment Dashboard (Busca do BANCO DE DADOS)
// GET /exercises/dashboard/sentiment/database
router.get("/dashboard/sentiment/database", async (req, res) => {
  await exercisesController.getSentimentDashboardFromDB(req, res);
});

export default router;
