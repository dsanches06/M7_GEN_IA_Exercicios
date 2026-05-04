/**
 * 🔌 API Service - ClickBot Gemini Backend
 * Comunicação com endpoints REST do backend
 */

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000";

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

// ✅ EXERCÍCIO 1: Chat de Suporte com Stream (Gemini)
export async function chatWithStream(message, conversationId = null) {
  const params = new URLSearchParams({
    message,
  });

  if (conversationId) {
    params.set("conversation_id", String(conversationId));
  }

  const response = await fetch(
    `${API_BASE_URL}/exercises/chat?${params.toString()}`,
    {
      method: "GET",
      headers: {
        Accept: "text/event-stream",
      },
    }
  );

  return createStreamIterator(response, "Erro ao conectar ao chat Gemini");
}

// ✅ EXERCÍCIO 2: Parse Task (NLP para JSON)
export async function parseTask(text) {
  const response = await fetch(
    `${API_BASE_URL}/exercises/parse-task`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text }),
    }
  );

  if (!response.ok) {
    throw new Error("Erro ao fazer parse da tarefa");
  }

  return response.json();
}

// ✅ EXERCÍCIO 3: Meeting Transcribe (Stream)
export async function transcribeMeeting(notes, projectId = 1) {
  const response = await fetch(
    `${API_BASE_URL}/exercises/meetings/transcribe`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "text/event-stream",
      },
      body: JSON.stringify({
        notes,
        project_id: projectId,
      }),
    }
  );

  return createStreamIterator(
    response,
    "Erro ao transcrever reunião"
  );
}

// ✅ EXERCÍCIO 4: Bug Triage
export async function triageBug(errorReport) {
  const response = await fetch(
    `${API_BASE_URL}/exercises/bugs/triage`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        error_report: errorReport,
      }),
    }
  );

  if (!response.ok) {
    throw new Error("Erro no triage do bug");
  }

  return response.json();
}

// ✅ EXERCÍCIO 5: Weekly Planner (Stream)
export async function planWeekly(tasks) {
  const response = await fetch(
    `${API_BASE_URL}/exercises/planner/weekly`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "text/event-stream",
      },
      body: JSON.stringify({ tasks }),
    }
  );

  return createStreamIterator(
    response,
    "Erro ao planejar semana"
  );
}

// ✅ EXERCÍCIO 6: Sentiment Dashboard
export async function getSentimentDashboard() {
  const response = await fetch(
    `${API_BASE_URL}/exercises/dashboard/sentiment`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error("Erro ao obter sentimento");
  }

  return response.json();
}
