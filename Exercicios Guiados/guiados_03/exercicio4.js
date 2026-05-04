import { GoogleGenAI } from "@google/genai";
import { z } from "zod";

const genAI = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const BugTriageSchema = z.object({
  error_type: z.enum(["UI", "API", "Database"]),
  severity: z.number().min(1).max(10),
  fix_suggestion: z.string(),
});

export async function triageBugReport(errorReport) {
  try {
    const result = await genAI.models.generateContent({
      model: "gemini-2.5-flash-lite",
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `Analise este erro e devolva um JSON estruturado: "${errorReport}".
              Use exatamente este formato:
              {
                "error_type": "UI" | "API" | "Database",
                "severity": (número de 1 a 10),
                "fix_suggestion": "string"
              }`
            }
          ]
        }
      ],
      generationConfig: {
        temperature: 0.1,
        responseMimeType: "application/json"
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
        auto_escalated: true
      };
    }

    console.log("⚠️ Gravidade moderada");
    return {
      ...triage,
      priority: triage.severity >= 5 ? "HIGH" : "NORMAL",
      auto_escalated: false
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
