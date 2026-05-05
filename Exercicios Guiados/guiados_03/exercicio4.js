import { GoogleGenerativeAI } from "@google/generative-ai"; // 1. SDK Correto
import * as z from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";
import dotenv from "dotenv";

dotenv.config({ path: "../../.env" });

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const BugTriageSchema = z.object({
  error_type: z.enum(["UI", "API", "Database"]),
  severity: z.number().min(1).max(10),
  fix_suggestion: z.string(),
});

const schema = zodToJsonSchema(BugTriageSchema);

const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash-lite",
});

export async function triageBugReport(errorReport) {
  try {
    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `Analise este erro e devolva um JSON estruturado: "${errorReport}"`,
            },
          ],
        },
      ],
      generationConfig: {
        temperature: 0.1,
        responseMimeType: "application/json",
        responseJsonSchema: schema,
      },
    });

    const responseText = result.response.text();
    const parsed = JSON.parse(responseText);

    const triage = BugTriageSchema.parse(parsed);

    console.log("🐛 Triage do erro:", triage);

    if (triage.severity >= 8) {
      console.log("🚨 CRÍTICO! Severity >= 8");
      return {
        ...triage,
        priority: "CRITICAL",
        auto_escalated: true,
      };
    }

    console.log("⚠️ Gravidade moderada");
    return {
      ...triage,
      priority: triage.severity >= 5 ? "HIGH" : "NORMAL",
      auto_escalated: false,
    };
  } catch (error) {
    console.error("❌ Erro no triage:", error.message);
    throw error;
  }
}

export function setupBugTriageRoutes(app) {
  app.post("/bugs/triage", async (req, res) => {
    const { error_report } = req.body;

    if (!error_report) {
      return res.status(400).json({ error: "error_report é obrigatório" });
    }

    try {
      const result = await triageBugReport(error_report);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: "Erro ao processar o relatório de bug" });
    }
  });
}
