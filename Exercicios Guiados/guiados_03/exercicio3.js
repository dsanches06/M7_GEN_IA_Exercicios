/**
 * Exercise 3: Real-Time Meeting Transcriber
 */
import { GoogleGenerativeAI } from "@google/generative-ai"; // 1. SDK Correto
import dotenv from "dotenv";

dotenv.config({ path: "../../.env" });

// 2. Correct initialization
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// 3. Model instance (outside the function for better performance)
const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash-lite", // Correct version
});

export async function transcribeMeetingWithStream(
  meetingNotes,
  projectId,
  req,
  res,
) {
  try {
    // Headers for Server-Sent Events (SSE)
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    res.write(
      `data: ${JSON.stringify({ status: "processing", message: "Processing key points..." })}\n\n`,
    );

    let fullSummary = "";

    const prompt = `
      Analyze the following meeting notes and generate a structured executive summary:
      "${meetingNotes}"

      Include the following:
      1. Key decisions
      2. Assigned tasks
      3. Next steps
      4. Identified risks
    `;

    // 4. Use of model.generateContentStream
    const result = await model.generateContentStream({
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
      generationConfig: {
        temperature: 0.2, // High precision for summaries
      },
    });

    for await (const chunk of result.stream) {
      const chunkText = chunk.text();
      fullSummary += chunkText;

      // Sending the chunk in real time to the client
      res.write(`data: ${JSON.stringify({ chunk: chunkText })}\n\n`);
    }

    console.log("✅ Summary generated!");

    res.write(
      `data: ${JSON.stringify({
        status: "completed",
        message: "Summary generated!",
        fullResponse: fullSummary,
      })}\n\n`,
    );

    res.end();
  } catch (error) {
    console.error("❌ Transcriber error:", error.message);
    res.write(
      `data: ${JSON.stringify({ error: "Error processing meeting" })}\n\n`,
    );
    res.end();
  }
}

export function setupMeetingRoutes(app) {
  app.post("/meetings/transcribe", async (req, res) => {
    const { notes, project_id } = req.body;
    if (!notes) return res.status(400).json({ error: "notes is required" });

    await transcribeMeetingWithStream(notes, project_id || 1, req, res);
  });
}
