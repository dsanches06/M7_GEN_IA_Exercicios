import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config({ path: "../.env" });

const PORT = process.env.PORT || 3000;

const app = express();
app.use(cors());

let history = [];

app.post("/api/clickbot/chat", async (req, res) => {
  const { message } = req.body;

  history.push({ role: "user", parts: [{ text: message }] });

  history = history.slice(-5);

  try {
    const response = await gemini.generateContent({
      contents: history
    });

    const text = response.response.text();

    history.push({ role: "model", parts: [{ text }] });

    res.json({ reply: text });

  } catch (err) {
    res.status(500).json({ error: "Erro na AI" });
  }
});
app.listen(PORT, () => {
  console.log(`ClickBot API running on port ${PORT}`);
});
