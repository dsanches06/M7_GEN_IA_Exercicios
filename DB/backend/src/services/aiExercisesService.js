/**
 * 🤖 Serviço de IA - Exercícios ClickBot GenAI
 * Implementação dos 6 exercícios com Google Generative AI
 * Integrado com Services da Database
 */

import { GoogleGenAI } from "@google/genai";
import { z } from "zod";
import * as chatHistoryService from "./chatHistoryService.js";
import * as conversationService from "./conversationService.js";
import * as meetingSummaryService from "./meetingSummaryService.js";
import * as ticketService from "./ticketService.js";
import dotenv from "dotenv";
dotenv.config({ path: "../../.env" });

const genAI = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// ============================================================
// EXERCÍCIO 1: Chat de Suporte com Stream
// ============================================================

export async function chatSuportWithStream(userMessage, req, res) {
  try {
    const model = await genAI.models({
      model: "gemini-2.5-flash-lite",
    });

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    const conversationId = req.query.conversation_id
      ? Number(req.query.conversation_id)
      : null;

    let conversation = null;

    if (conversationId) {
      conversation =
        await conversationService.getConversationById(conversationId);
      if (!conversation) {
        return res.status(404).json({ error: "Conversa não encontrada" });
      }
    }

    let fullResponse = "";

    const result = await model.generateContentStream({
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `Age como suporte técnico do ClickUp. Pergunta: ${userMessage}`,
            },
          ],
        },
      ],
      generationConfig: { temperature: 0.4 },
    });

    for await (const chunk of result.stream) {
      const chunkText = chunk.text();
      fullResponse += chunkText;

      console.log("Chunk recebido:", chunkText);
      res.write(`data: ${JSON.stringify({ chunk: chunkText })}\n\n`);
    }

    console.log("[DONE] Chat support concluído");

    // ✅ PERSISTÊNCIA: Salvar na BD após stream terminar
    try {
      if (!conversation) {
        conversation = await conversationService.createConversation({
          title: `Chat Support - ${new Date().toISOString()}`,
        });
      }

      // Salvar mensagem do utilizador (role_id = 2 = USER)
      await chatHistoryService.createChatHistory({
        conversation_id: conversation.id,
        role_id: 2,
        content: userMessage,
      });

      // Salvar resposta da IA (role_id = 3 = MODEL)
      await chatHistoryService.createChatHistory({
        conversation_id: conversation.id,
        role_id: 3,
        content: fullResponse,
      });

      console.log(`✅ Chat salvo em BD (conversation_id: ${conversation.id})`);
    } catch (dbError) {
      console.error("⚠️ Erro ao salvar chat em BD:", dbError.message);
    }

    res.write(
      `data: ${JSON.stringify({ status: "completed", fullResponse })}\n\n`,
    );
    res.end();
  } catch (error) {
    console.error("Erro no chat com stream:", error);
    res.write(
      `data: ${JSON.stringify({ error: "Erro ao processar resposta" })}\n\n`,
    );
    res.end();
  }
}

// ============================================================
// EXERCÍCIO 2: Smart Task Parser (NLP para JSON)
// ============================================================

const TaskSchema = z.object({
  title: z.string(),
  due_date: z.string(),
  priority: z.enum(["urgent", "high", "normal", "low"]),
  department: z.enum(["design", "dev", "marketing"]),
});

export async function parseTaskFromNaturalLanguage(userMessage) {
  try {
    const model = gemini.models.generateContent({
      model: "gemini-2.5-flash-lite",
      generationConfig: { responseMimeType: "application/json" },
    });

    const prompt = `Extraia os dados da tarefa em JSON: "${userMessage}". 
    Use o schema: {title, due_date, priority, department}`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    const parsed = JSON.parse(responseText);
    return TaskSchema.parse(parsed);
  } catch (error) {
    console.error("❌ Erro ao parsear tarefa:", error.message);
    throw error;
  }
}

// ============================================================
// EXERCÍCIO 3: Transcritor de Reuniões em Tempo Real
// ============================================================

export async function transcribeMeetingWithStream(
  meetingNotes,
  projectId,
  req,
  res,
) {
  try {
    const model = gemini.models.generateContent({
      model: "gemini-2.5-flash-lite",
    });

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    res.write(
      `data: ${JSON.stringify({
        status: "processing",
        message: "A processar pontos chave...",
      })}\n\n`,
    );

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

    const result = await model.generateContentStream({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });

    for await (const chunk of result.stream) {
      const chunkText = chunk.text();
      fullSummary += chunkText;
      console.log("Chunk processado:", chunkText);
      res.write(`data: ${JSON.stringify({ chunk: chunkText })}\n\n`);
    }

    console.log("[DONE] Sumário de reunião gerado com sucesso");

    // ✅ PERSISTÊNCIA: Salvar na BD após stream terminar
    try {
      await meetingSummaryService.createMeetingSummary({
        project_id: projectId,
        original_text: meetingNotes,
        summary: fullSummary,
      });
      console.log(`✅ Sumário salvo em BD (project_id: ${projectId})`);
    } catch (dbError) {
      console.error("⚠️ Erro ao salvar sumário em BD:", dbError.message);
    }

    res.write(
      `data: ${JSON.stringify({
        status: "completed",
        message: "Sumário gerado e salvo com sucesso",
        full_summary: fullSummary,
      })}\n\n`,
    );
    res.end();
  } catch (error) {
    console.error("Erro no transcritor de reuniões:", error);
    if (!res.headersSent) {
      res.status(500).json({ error: error.message });
    } else {
      res.write(`data: ${JSON.stringify({ error: error.message })}\n\n`);
      res.end();
    }
  }
}

// ============================================================
// EXERCÍCIO 4: Bug Triage com Classificação Automática
// ============================================================

const BugTriageSchema = z.object({
  error_type: z.enum(["UI", "API", "Database"]),
  severity: z.number().min(1).max(10),
  fix_suggestion: z.string(),
});

export async function triageBugReport(errorReport) {
  try {
    const model = gemini.models.generateContent({
      model: "gemini-2.5-flash-lite",
      generationConfig: { responseMimeType: "application/json" },
    });

    const prompt = `Analise o seguinte relato de erro e classifique-o em JSON: "${errorReport}"`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    const parsed = JSON.parse(responseText);
    const triage = BugTriageSchema.parse(parsed);

    console.log("🐛 Triage do erro:", triage);

    let response = {
      ...triage,
      priority:
        triage.severity >= 8
          ? "CRITICAL"
          : triage.severity >= 5
            ? "HIGH"
            : "NORMAL",
      auto_escalated: false,
    };

    // ✅ PERSISTÊNCIA AUTOMÁTICA: Se severity >= 8, inserir em tickets
    if (triage.severity >= 8) {
      console.log("🚨 CRÍTICO! Severity >= 8 - Auto-escalando para TICKETS");
      try {
        const ticket = await ticketService.createTicket({
          user_report: errorReport,
          error_type: triage.error_type,
          severity: triage.severity,
          fix_suggestion: triage.fix_suggestion,
          status: "open",
        });
        console.log(
          `✅ Ticket criado automaticamente (ticket_id: ${ticket.id})`,
        );
        response.ticket_id = ticket.id;
        response.auto_escalated = true;
      } catch (dbError) {
        console.error("⚠️ Erro ao criar ticket em BD:", dbError.message);
      }
    }

    return response;
  } catch (error) {
    console.error("❌ Erro no triage:", error.message);
    throw error;
  }
}

// ============================================================
// EXERCÍCIO 5: Smart Planner Semanal
// ============================================================

const ScheduleItemSchema = z.object({
  day: z.enum([
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ]),
  time: z.string(),
  task: z.string(),
  duration_hours: z.number().min(0.5),
  priority: z.enum(["high", "medium", "low"]),
});

const WeeklyAgendaSchema = z.object({
  reasoning: z.string(),
  schedule: z.array(ScheduleItemSchema),
  insights: z.string(),
});

export async function planWeeklySchedule(userInput, req, res) {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash-lite",
      generationConfig: { responseMimeType: "application/json" },
    });

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    let fullResponse = "";

    const prompt = `
O utilizador quer organizar a sua semana: "${userInput}"

Gere uma resposta com:
1. Explicação do raciocínio
2. Uma agenda estruturada em JSON

Termine a sua resposta estritamente com o JSON entre as tags [JSON_START] e [JSON_END].
Formato do JSON:
{
  "reasoning": "string",
  "schedule": [{"day": "Monday", "time": "HH:MM", "task": "string", "duration_hours": number, "priority": "high|medium|low"}],
  "insights": "string"
}

[JSON_START]
    `;

    const result = await model.generateContentStream({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });

    for await (const chunk of result.stream) {
      const chunkText = chunk.text();
      fullResponse += chunkText;
      res.write(`data: ${JSON.stringify({ chunk: chunkText })}\n\n`);
    }

    const jsonMatch = fullResponse.match(
      /\[JSON_START\]([\s\S]*?)\[JSON_END\]/,
    );

    if (jsonMatch) {
      try {
        const rawJson = jsonMatch[1].trim();
        const scheduleJson = JSON.parse(rawJson);

        const validated = WeeklyAgendaSchema.parse(scheduleJson);

        res.write(
          `data: ${JSON.stringify({
            status: "completed",
            agenda: validated,
          })}\n\n`,
        );
      } catch (parseError) {
        console.error("Erro ao parsear JSON:", parseError);
        res.write(
          `data: ${JSON.stringify({
            status: "error",
            message: "Erro no formato JSON",
          })}\n\n`,
        );
      }
    }

    res.end();
  } catch (error) {
    console.error("Erro no planner:", error);
    if (!res.headersSent) {
      res.status(500).json({ error: error.message });
    } else {
      res.write(`data: ${JSON.stringify({ error: error.message })}\n\n`);
      res.end();
    }
  }
}

// ============================================================
// EXERCÍCIO 6: Análise de Sentimento da Equipa
// ============================================================

const SentimentDashboardSchema = z.object({
  team_mood: z.enum(["happy", "stressed", "neutral"]),
  main_blocker: z.string(),
  burnout_risk: z.boolean(),
  recommendations: z.array(z.string()),
});

export async function analyzeTeamSentiment() {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash-lite",
      generationConfig: { responseMimeType: "application/json" },
    });

    const comments = [
      "A sprint está muito pesada, não estou a conseguir acompanhar",
      "Adorei o novo design, ótimo trabalho!",
      "O servidor caiu novamente, estou frustrado",
      "Consegui terminar a tarefa antes do prazo",
      "A reunião foi muito longa e improdutiva",
      "Preciso de férias urgentemente",
      "O cliente ficou muito satisfeito com o resultado",
      "Falta comunicação entre os departamentos",
      "Estou entusiasmado com o novo projeto",
      "As reuniões diárias são excessivas",
    ];

    const commentsList = comments.map((c, i) => `${i + 1}. "${c}"`).join("\n");

    const prompt = `Analise os seguintes comentários e gere um relatório em JSON: ${commentsList}`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    const parsed = JSON.parse(responseText);
    const dashboard = SentimentDashboardSchema.parse(parsed);

    const moodEmoji = { happy: "😊", stressed: "😰", neutral: "😐" };

    console.log(
      `\n${moodEmoji[dashboard.team_mood]} Estado da Equipa: ${dashboard.team_mood.toUpperCase()}`,
    );
    console.log(`⚠️ Principal Bloqueador: ${dashboard.main_blocker}`);
    console.log(
      `🔴 Risco de Burnout: ${dashboard.burnout_risk ? "SIM" : "NÃO"}`,
    );
    console.log("📋 Recomendações:");
    dashboard.recommendations.forEach((rec, i) =>
      console.log(`  ${i + 1}. ${rec}`),
    );

    return dashboard;
  } catch (error) {
    console.error("❌ Erro na análise de sentimento:", error.message);
    throw error;
  }
}
