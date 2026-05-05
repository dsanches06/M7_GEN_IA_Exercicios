/**
 * 🔌 API Service - ClickBot Gemini Backend
 * Comunicação com endpoints REST do backend
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

/**
 * ✅ Utilitário para leitura de streams SSE
 */
async function createStreamIterator(response, errorMessage) {
  if (!response.ok) {
    throw new Error(errorMessage);
  }

  if (!response.body) {
    throw new Error("Stream não suportado pelo navegador");
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();

  return {
    async *[Symbol.asyncIterator]() {
      try {
        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();

          if (done) break;

          buffer += decoder.decode(value, { stream: true });

          const lines = buffer.split("\n");
          buffer = lines.pop() || "";

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const jsonData = line.slice(6).trim();

              if (!jsonData) continue;

              try {
                const data = JSON.parse(jsonData);
                yield data;
              } catch (error) {
                console.error("Erro ao processar stream:", error);
              }
            }
          }
        }
      } finally {
        reader.releaseLock();
      }
    },
  };
}

// ✅ EXERCÍCIO 1: Chat de Suporte com Stream
// Recebe: mensagem do utilizador e opcional conversation_id
export async function chatWithStream(message, conversationId = null) {
  const body = {
    message,
  };

  if (conversationId) {
    body.conversation_id = conversationId;
  }

  const response = await fetch(
    `${API_BASE_URL}/exercises/chat`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "text/event-stream",
      },
      body: JSON.stringify(body),
    },
  );

  return createStreamIterator(response, "Erro ao conectar ao chat");
}

// ✅ EXERCÍCIO 2: Parse Task
// Recebe: descrição da tarefa em texto livre
export async function parseTask(text) {
  console.log("EXERCÍCIO 2: Enviando texto para parsear:", text);

  const response = await fetch(`${API_BASE_URL}/exercises/parse-task`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text }),
  });

  console.log("EXERCÍCIO 2: Resposta do backend:", response);

  if (!response.ok) {
    throw new Error("Erro ao fazer parse da tarefa");
  }

  return response.json();
}

// ✅ EXERCÍCIO 3: Meeting Transcribe
// Recebe: notas de texto OU áudio (com base64 e mimeType)
export async function transcribeMeeting(input, projectId = 1) {
  let body;
  const headers = {
    "Content-Type": "application/json",
    Accept: "text/event-stream",
  };

  // Verificar se é áudio (objeto com audio e mimeType) ou texto
  if (typeof input === "object" && input.audio) {
    // Áudio em base64
    body = JSON.stringify({
      audio: input.audio,
      mimeType: input.mimeType || "audio/wav",
      project_id: projectId,
    });
  } else {
    // Texto (notas)
    body = JSON.stringify({
      notes: input,
      project_id: projectId,
    });
  }

  const response = await fetch(
    `${API_BASE_URL}/exercises/meetings/transcribe`,
    {
      method: "POST",
      headers,
      body,
    },
  );

  return createStreamIterator(response, "Erro ao transcrever reunião");
}

// ✅ EXERCÍCIO 4: Bug Triage
// Recebe: relatório de erro do utilizador
export async function triageBug(errorReport) {
  const response = await fetch(`${API_BASE_URL}/exercises/bugs/triage`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ error_report: errorReport }),
  });

  if (!response.ok) {
    throw new Error("Erro no triage do bug");
  }

  return response.json();
}

// ✅ EXERCÍCIO 5: Weekly Planner
// Recebe: tarefas/prioridades da semana do utilizador
export async function planWeekly(tasks) {
  const response = await fetch(`${API_BASE_URL}/exercises/planner/weekly`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "text/event-stream",
    },
    body: JSON.stringify({ tasks }),
  });

  return createStreamIterator(response, "Erro ao planejar semana");
}

// ✅ EXERCÍCIO 6: Sentiment Dashboard
// Recebe: texto com comentários/feedback da equipa
export async function getSentimentDashboard(feedbackText) {
  // Validação defensiva
  if (!feedbackText || typeof feedbackText !== "string" || feedbackText.trim().length === 0) {
    throw new Error("É necessário fornecer feedback ou comentários da equipa.");
  }

  const response = await fetch(
    `${API_BASE_URL}/exercises/dashboard/sentiment`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ feedback: feedbackText.trim() }),
    },
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || "Erro ao obter dashboard de sentimento");
  }

  return response.json();
}

// ✅ EXERCÍCIO 6B: Analisar Últimos 20 Comentários da BD
export async function analyzeLatestComments() {
  const response = await fetch(
    `${API_BASE_URL}/exercises/dashboard/sentiment/latest`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    },
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || "Erro ao analisar últimos comentários");
  }

  return response.json();
}
