/**
 * Exercício 3: Transcritor de Reuniões em Tempo Real
 * Stream de análise + persistência em meeting_summaries
 */

import { GoogleGenAI } from "@google/genai"; // Sintaxe da escola

const genAI = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export async function transcribeMeetingWithStream(meetingNotes, projectId, req, res) {
  try {
    // Headers para Server-Sent Events (SSE)
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    // Enviar indicador inicial
    res.write(`data: ${JSON.stringify({ status: "processing", message: "A processar pontos chave..." })}\n\n`);

    let fullSummary = "";

    const prompt = `
      Analise as seguintes notas de reunião e gere um sumário executivo estruturado:
      ${meetingNotes}

      Gere um sumário que inclua:
      1. Principais pontos de decisão
      2. Tarefas atribuídas
      3. Próximos passos
      4. Riscos ou preocupações identificadas
    `;

    // Implementação seguindo o padrão da escola
    const result = await genAI.models.generateContentStream({
      model: "gemini-2.5-flash-lite",
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
      generationConfig: { temperature: 0.2 }, // Temperatura baixa para sumários mais precisos
    });

    // Stream dos chunks
    for await (const chunk of result.stream) {
      const chunkText = chunk.text();
      fullSummary += chunkText;
      
      console.log("Chunk processado:", chunkText);
      res.write(`data: ${JSON.stringify({ chunk: chunkText })}\n\n`);
    }

    console.log("[DONE] Sumário de reunião gerado com sucesso");

    // Aqui poderias adicionar a persistência na DB se necessário (Exercicio 1)
    
    res.write(`data: ${JSON.stringify({ status: "completed", message: "Sumário gerado!", fullResponse: fullSummary })}\n\n`);
    res.end();

  } catch (error) {
    console.error("Erro no transcritor:", error);
    // Em streams SSE, o erro deve ser enviado como data ou fechando a conexão
    res.write(`data: ${JSON.stringify({ error: "Erro ao processar reunião" })}\n\n`);
    res.end();
  }
}

export function setupMeetingRoutes(app) {
  app.post("/meetings/transcribe", async (req, res) => {
    const { notes, project_id } = req.body;

    if (!notes) {
      return res.status(400).json({ error: "notes é obrigatório" });
    }

    await transcribeMeetingWithStream(notes, project_id || 1, req, res);
  });
}
