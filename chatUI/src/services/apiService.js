/**
 * 🔌 API Service - ClickBot GenAI Backend
 * Comunicação com endpoints REST do backend
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

// ✅ EXERCÍCIO 1: Chat de Suporte com Stream
export async function chatWithStream(message) {
  const response = await fetch(
    `${API_BASE_URL}/exercises/chat?message=${encodeURIComponent(message)}`
  );

  if (!response.ok) throw new Error("Erro ao conectar chat");

  const reader = response.body.getReader();
  const decoder = new TextDecoder();

  return {
    async *[Symbol.asyncIterator]() {
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split("\n");

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              try {
                const data = JSON.parse(line.slice(6));
                yield data;
              } catch (e) {
                // Ignorar linhas inválidas
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

// ✅ EXERCÍCIO 2: Parse Task (NLP para JSON)
export async function parseTask(text) {
  const response = await fetch(`${API_BASE_URL}/exercises/parse-task`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });

  if (!response.ok) throw new Error("Erro ao fazer parse da tarefa");
  return response.json();
}

// ✅ EXERCÍCIO 3: Meeting Transcribe (Stream)
export async function transcribeMeeting(notes, projectId = 1) {
  const response = await fetch(
    `${API_BASE_URL}/exercises/meetings/transcribe`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ notes, project_id: projectId }),
    }
  );

  if (!response.ok) throw new Error("Erro ao transcrever reunião");

  const reader = response.body.getReader();
  const decoder = new TextDecoder();

  return {
    async *[Symbol.asyncIterator]() {
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split("\n");

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              try {
                const data = JSON.parse(line.slice(6));
                yield data;
              } catch (e) {
                // Ignorar
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

// ✅ EXERCÍCIO 4: Bug Triage
export async function triageBug(errorReport) {
  const response = await fetch(`${API_BASE_URL}/exercises/bugs/triage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ error_report: errorReport }),
  });

  if (!response.ok) throw new Error("Erro no triage do bug");
  return response.json();
}

// ✅ EXERCÍCIO 5: Weekly Planner (Stream)
export async function planWeekly(tasks) {
  const response = await fetch(
    `${API_BASE_URL}/exercises/planner/weekly`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tasks }),
    }
  );

  if (!response.ok) throw new Error("Erro ao planejar semana");

  const reader = response.body.getReader();
  const decoder = new TextDecoder();

  return {
    async *[Symbol.asyncIterator]() {
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split("\n");

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              try {
                const data = JSON.parse(line.slice(6));
                yield data;
              } catch (e) {
                // Ignorar
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

// ✅ EXERCÍCIO 6: Sentiment Dashboard
export async function getSentimentDashboard() {
  const response = await fetch(
    `${API_BASE_URL}/exercises/dashboard/sentiment`
  );

  if (!response.ok) throw new Error("Erro ao obter sentimento");
  return response.json();
}
