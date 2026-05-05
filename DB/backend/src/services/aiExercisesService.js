/**
 * 🤖 Serviço de IA - Exercícios ClickBot GenAI
 * Implementação dos 6 exercícios com Google Generative AI
 * Integrado com Services da Database
 */

import { GoogleGenerativeAI } from "@google/generative-ai";
import { z } from "zod";
import * as chatHistoryService from "./chatHistoryService.js";
import * as conversationService from "./conversationService.js";
import * as meetingSummaryService from "./meetingSummaryService.js";
import * as ticketService from "./ticketService.js";
import * as commentService from "./commentService.js";
import dotenv from "dotenv";
import zodToJsonSchema from "zod-to-json-schema";
dotenv.config({ path: "../../.env" });

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({
  model: "gemini-3-flash-preview",
});

// ============================================================
// EXERCÍCIO 1: Chat de Suporte com Stream
// ============================================================

export async function chatSuportWithStream(userMessage, req, res) {
  try {
    // ✅ CORRIGIDO: Usar genAI.models.generateContentStream() direto
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

    let chat_history =
      await chatHistoryService.getChatHistoryByConversationId(conversationId);

    let fullResponse = "";

    // 1️⃣ Gerar resposta do bot via stream
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
      history: chat_history || [],
      generationConfig: { temperature: 0.4 },
    });

    for await (const chunk of result.stream) {
      const chunkText = chunk.text();
      fullResponse += chunkText;

      console.log("Chunk recebido:", chunkText);
      res.write(`data: ${JSON.stringify({ chunk: chunkText })}\n\n`);
    }

    console.log("[DONE] Chat support concluído");

    // 2️⃣ Gerar título inteligente baseado na resposta (apenas se nova conversa)
    let dynamicTitle = `Chat Support - ${new Date().toISOString().split("T")[0]}`;

    if (!conversationId) {
      try {
        const titleResult = await model.generateContent({
          contents: [
            {
              role: "user",
              parts: [
                {
                  text: `Analisa esta conversa de suporte e gera um título curto (máx 50 caracteres) que resuma o tema:
                  
                  Pergunta do user: "${userMessage}"
                  Resposta do bot: "${fullResponse.substring(0, 500)}"

                  Responde APENAS com o título, sem explicações.`,
                },
              ],
            },
          ],
          generationConfig: { temperature: 0.3 },
        });

        if (typeof titleResult.text === "function") {
          const generatedTitle = titleResult.text().trim();
          if (generatedTitle && generatedTitle.length < 100) {
            dynamicTitle = generatedTitle;
          }
        } else if (titleResult.response && titleResult.response.text) {
          const generatedTitle = titleResult.response.text().trim();
          if (generatedTitle && generatedTitle.length < 100) {
            dynamicTitle = generatedTitle;
          }
        }
        console.log("✅ Título gerado:", dynamicTitle);
      } catch (titleError) {
        console.warn(
          "⚠️ Erro ao gerar título, usando padrão:",
          titleError.message,
        );
      }
    }

    // ✅ PERSISTÊNCIA: Salvar na BD após stream terminar
    try {
      if (!conversation) {
        conversation = await conversationService.createConversation({
          title: dynamicTitle,
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
      `data: ${JSON.stringify({ status: "completed", fullResponse, conversationTitle: dynamicTitle })}\n\n`,
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
    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `Extract task data as JSON ONLY. No explanations, no prefix, no suffix. Just pure JSON.
              Input: "${userMessage}"
              Output JSON (no other text):`,
            },
          ],
        },
      ],
      generationConfig: {
        temperature: 0.1,
        responseMimeType: "application/json",
        responseJsonSchema: zodToJsonSchema(TaskSchema),
      },
    });

    let responseText = "";

    try {
      // Try the standard helper method first
      if (result.response && typeof result.response.text === "function") {
        responseText = result.response.text();
      }
      // Fallback: Deep dive into the candidates array
      else if (result.response?.candidates?.[0]?.content?.parts?.[0]?.text) {
        responseText = result.response.candidates[0].content.parts[0].text;
      }
      // Fallback: Check if result itself has the text (older versions)
      else if (typeof result.text === "function") {
        responseText = result.text();
      } else {
        // If it's already an object/string, stringify or use as is
        responseText =
          typeof result === "string" ? result : JSON.stringify(result);
      }
    } catch (e) {
      console.error("Critical error reading response structure:", e);
      throw new Error("Could not read response from AI model.");
    }

    console.log("Raw model response:", responseText);

    // Ensure responseText is treated as a string before replacing
    const cleanText = String(responseText)
      .replace(/^[\s\S]*?({)/, "$1")
      .trim();

    const parsed = JSON.parse(cleanText);
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
    // ✅ CORRIGIDO: Trocar 'gemini' por 'genAI'
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
// EXERCÍCIO 3B: Transcrição de Áudio com Stream
// ============================================================

export async function transcribeAudioWithStream(
  audioBuffer,
  mimeType,
  projectId,
  req,
  res,
) {
  try {
    console.log("🎤 Transcrevendo áudio...");

    // 1. Converter buffer para base64
    const base64Audio = audioBuffer.toString("base64");

    // 2. Transcrever áudio com Gemini
    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [
            {
              inlineData: {
                mimeType: mimeType || "audio/wav",
                data: base64Audio,
              },
            },
            {
              text: "Transcreva este áudio e gere um sumário detalhado da reunião.",
            },
          ],
        },
      ],
    });

    // 3. Extrair resposta
    let responseText;
    if (typeof result.text === "function") {
      responseText = result.text();
    } else if (result.response && result.response.text) {
      responseText = result.response.text();
    } else {
      responseText = JSON.stringify(result);
    }

    console.log("📝 Transcrição concluída");

    // 4. Enviar resposta com streaming (simular stream enviando em chunks)
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    const chunks = responseText.match(/[\s\S]{1,100}/g) || [responseText];
    for (const chunk of chunks) {
      res.write(`data: ${JSON.stringify({ chunk })}\n\n`);
      await new Promise((resolve) => setTimeout(resolve, 50));
    }
    res.write("data: [DONE]\n\n");
    res.end();
  } catch (error) {
    console.error("❌ Erro na transcrição de áudio:", error);
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
    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `Analise este erro e devolva um JSON estruturado: "${errorReport}".
              Use exatamente este formato, sem explicações:
              {
                "error_type": "UI" ou "API" ou "Database",
                "severity": número de 1 a 10,
                "fix_suggestion": "string com a sugestão"
              }`,
            },
          ],
        },
      ],
      generationConfig: {
        temperature: 0.1,
        responseMimeType: "application/json",
        responseJsonSchema: zodToJsonSchema(BugTriageSchema),
      },
    });

    // ✅ CORRIGIDO: result.text() é um MÉTODO
    const responseText = result.text();

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
    // ✅ CORRIGIDO: Trocar 'genAI.getGenerativeModel()' por 'genAI.models.generateContentStream()'
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
      generationConfig: {
        responseMimeType: "application/json",
        responseJsonSchema: zodToJsonSchema(WeeklyAgendaSchema),
      },
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

export async function analyzeTeamSentiment(userInput) {
  try {
    // Validar input
    if (
      !userInput ||
      typeof userInput !== "string" ||
      userInput.trim().length === 0
    ) {
      throw new Error(
        "É necessário fornecer comentários ou feedback da equipa.",
      );
    }

    const prompt = `Analise o sentimento e bem-estar da equipa com base nos seguintes comentários e retorne um JSON estruturado:

Comentários:
${userInput}

Retorne APENAS JSON (sem explicações adicionais):`;

    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [
            {
              text: prompt,
            },
          ],
        },
      ],
      generationConfig: {
        temperature: 0.2,
        responseMimeType: "application/json",
        responseJsonSchema: zodToJsonSchema(SentimentDashboardSchema),
      },
    });

    // 4️⃣ Extrair resposta (Standardized for Gemini SDK)
    let responseText = "";

    try {
      // The most reliable way in recent SDK versions
      if (result.response && typeof result.response.text === "function") {
        responseText = result.response.text();
      }
      // Manual path traversal if .text() is unavailable
      else if (result.response?.candidates?.[0]?.content?.parts?.[0]?.text) {
        responseText = result.response.candidates[0].content.parts[0].text;
      } else {
        // Final fallback: stringify whatever we got to avoid .replace() errors
        responseText =
          typeof result.text === "string"
            ? result.text
            : JSON.stringify(result);
      }
    } catch (e) {
      throw new Error("Falha ao extrair texto do Gemini: " + e.message);
    }

    // Now safe to use .replace because responseText is guaranteed to be a string
    const cleanJson = responseText.replace(/^[\s\S]*?({)/, "$1").trim();

    const parsed = JSON.parse(cleanJson);
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

// ============================================================
// EXERCÍCIO 6B: Análise dos Últimos 20 Comentários (Mock)
// ============================================================

export async function analyzeLatestComments() {
  try {
    // 1️⃣ Buscar últimos 20 comentários da BD
    const allComments = await commentService.getAllComments();
    const lastTwenty = allComments.slice(0, 20);

    if (lastTwenty.length === 0) {
      throw new Error("Sem comentários disponíveis para análise.");
    }

    // 2️⃣ Consolidar comentários num texto
    const consolidatedFeedback = lastTwenty.join("\n- ");

    const prompt = `Analise o sentimento e bem-estar da equipa com base nos seguintes comentários (últimos 20 da BD):

Comentários:
- ${consolidatedFeedback}

Retorne APENAS JSON (sem explicações adicionais):`;

    // 3️⃣ Enviar para Gemini com schema
    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
      generationConfig: {
        temperature: 0.2,
        responseMimeType: "application/json",
        responseJsonSchema: zodToJsonSchema(SentimentDashboardSchema),
      },
    });

    // 4️⃣ Extrair resposta (Standardized for Gemini SDK)
    let responseText = "";

    try {
      // The most reliable way in recent SDK versions
      if (result.response && typeof result.response.text === "function") {
        responseText = result.response.text();
      }
      // Manual path traversal if .text() is unavailable
      else if (result.response?.candidates?.[0]?.content?.parts?.[0]?.text) {
        responseText = result.response.candidates[0].content.parts[0].text;
      } else {
        // Final fallback: stringify whatever we got to avoid .replace() errors
        responseText =
          typeof result.text === "string"
            ? result.text
            : JSON.stringify(result);
      }
    } catch (e) {
      throw new Error("Falha ao extrair texto do Gemini: " + e.message);
    }

    // Now safe to use .replace because responseText is guaranteed to be a string
    const cleanJson = responseText.replace(/^[\s\S]*?({)/, "$1").trim();

    const parsed = JSON.parse(cleanJson);
    const dashboard = SentimentDashboardSchema.parse(parsed);

    console.log(
      `\n📊 Análise dos Últimos 20 Comentários (${lastTwenty.length} comentários):`,
    );
    console.log(
      `${dashboard.team_mood === "happy" ? "😊" : dashboard.team_mood === "stressed" ? "😰" : "😐"} Estado da Equipa: ${dashboard.team_mood.toUpperCase()}`,
    );
    console.log(`⚠️ Principal Bloqueador: ${dashboard.main_blocker}`);
    console.log(
      `🔴 Risco de Burnout: ${dashboard.burnout_risk ? "SIM" : "NÃO"}`,
    );
    console.log("📋 Recomendações:");
    dashboard.recommendations.forEach((rec, i) =>
      console.log(`  ${i + 1}. ${rec}`),
    );

    return { ...dashboard, totalComments: lastTwenty.length };
  } catch (error) {
    console.error("❌ Erro na análise dos últimos comentários:", error.message);
    throw error;
  }
}
