import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { classifyPriority, generateNames, sendMessage, summarizeHistory } from "./index.js";
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
  const { temp } = req.body;

  try {
    const response = await generateNames(temp);
    res.json(response);
  } catch (err) {
    res.status(500).json({ error: "Erro na AI" });
  }
});

//enviar mensagem
app.post("/api/clickbot/send-message", async (req, res) => {
  const { message } = req.body;
  try {
    const response = await sendMessage(message);
    res.json({ reply: response });
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

app.listen(PORT, () => {
  console.log(`ClickBot API running on port ${PORT}`);
});
