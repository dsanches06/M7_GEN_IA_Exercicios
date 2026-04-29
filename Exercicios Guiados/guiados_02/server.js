import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import {
  classifyPriority,
  generateNames,
  sendMessage,
  summarizeHistory,
  generateTaskBreakdown,
} from "./index.js";
dotenv.config({ path: "../../.env" });

const PORT = process.env.PORT || 3000;

const app = express();
app.use(cors());
app.use(express.json());

app.post("/api/clickbot/chat", async (req, res) => {
  const { message } = req.body;

  try {
    const text = await sendMessage(message);
    res.json({ reply: text });
  } catch (err) {
    console.error("Erro no endpoint /api/clickbot/chat:", err);
    res.status(500).json({ error: "Erro na AI" });
  }
});

//Classificação de texto
app.post("/api/clickbot/classify", async (req, res) => {
  try {
    const { text } = req.body;
    const response = await classifyPriority(text);
    res.json(response);
  } catch (error) {
    res.status(500).json({ error: "Erro na AI" });
  }
});

//Gerar nomes
app.post("/api/clickbot/generate-names", async (req, res) => {
  const temp = Number(req.body.temp);

  try {
    const response = await generateNames(temp);
    res.json(response);
  } catch (err) {
    res.status(500).json({ error: "Erro na AI" });
  }
});

//Resumo de conversa
app.post("/api/clickbot/summarize", async (req, res) => {
  try {
    const summaryHistory = await summarizeHistory();
    res.json({ summary: summaryHistory[1].parts[0].text });
  } catch (err) {
    res.status(500).json({ error: "Erro na AI" });
  }
});

//Gerar breakdown de tarefa com thinking mode
app.post("/api/clickbot/task-breakdown", async (req, res) => {
  try {
    const { task } = req.body;
    const breakdown = await generateTaskBreakdown(task);
    res.json({ breakdown });
  } catch (err) {
    console.error("Erro no endpoint /api/clickbot/task-breakdown:", err);
    res.status(500).json({ error: "Erro na AI" });
  }
});

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`ClickBot API running on port ${PORT}`);
});
