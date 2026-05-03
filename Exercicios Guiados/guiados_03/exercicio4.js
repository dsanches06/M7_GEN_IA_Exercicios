import { GoogleGenerativeAI } from "@google/generative-ai";
import { z } from "zod";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Schema para resposta da IA (Mantemos o Zod para validação de dados)
const BugTriageSchema = z.object({
  error_type: z.enum(["UI", "API", "Database"]),
  severity: z.number().min(1).max(10),
  fix_suggestion: z.string(),
});

// ❌ REMOVIDO: type BugTriage = z.infer<typeof BugTriageSchema>;

export async function triageBugReport(errorReport) {
  try {
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash-lite",
      generationConfig: { responseMimeType: "application/json" } // Garante resposta JSON
    });

    const prompt = `Analise o seguinte relato de erro e classifique-o em JSON: "${errorReport}"`;

    const result = await model.generateContent(prompt);
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
    } else {
      console.log("⚠️ Gravidade moderada");
      return {
        ...triage,
        priority: triage.severity >= 5 ? "HIGH" : "NORMAL",
        auto_escalated: false
      };
    }
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
      res.status(500).json({ error: error.message });
    }
  });
}
