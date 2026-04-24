import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
dotenv.config({ path: "../../.env" });

// Verify API key is loaded
if (!process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY not found in environment variables");
}

//agora, vamos criar uma instância do cliente do GenAI usando a chave de API
// que definimos no arquivo .env
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

//Exercício 1 — Criador de Tarefas Inteligente
async function createTaskFromText(dados) {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-lite",
    contents: [
      {
        role: "user",
        parts: [
          {
            text: `Transforma esta lista de tarefas num objeto JSON estruturado com os campos
            'title' e 'description', 'priority' e 'tags'. 
            Devolve APENAS o JSON. ${JSON.stringify(dados)}`,
          },
        ],
      },
    ],
  });

  return JSON.parse(response.candidates[0].content.parts[0].text);
}

//Exercício 2 — Melhoria Inteligente de Tarefas
async function refineTask(task) {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-lite",
    contents: [
      {
        role: "user",
        parts: [
          {
            text: `Melhore a seguinte tarefa, tornando-a mais clara e profissional.
            Mantenha os mesmos campos, mas reformule o título e a descrição
            para serem mais específicos e orientados para a ação. 
            IMPORTANTE: Responda APENAS com JSON válido, 
            sem nenhuma formatação markdown, sem code blocks, 
            sem backticks, sem asteriscos. 
            Apenas JSON puro. ${JSON.stringify(task)}`,
          },
        ],
      },
    ],
  });

  return JSON.parse(response.candidates[0].content.parts[0].text);
}

//função para resumir uma tarefa,
async function summarizeTask(task) {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-lite",
    contents: [
      {
        role: "user",
        parts: [
          {
            text: `Resuma a seguinte tarefa num título curto e uma descrição concisa, 
            mantendo as informações essenciais. IMPORTANTE: Responda APENAS com JSON válido,
            sem nenhuma formatação markdown, sem code blocks, sem backticks, sem asteriscos.
            Apenas JSON puro. ${JSON.stringify(task)}`,
          },
        ],
      },
    ],
  });

  return JSON.parse(response.candidates[0].content.parts[0].text);
}

//função para sugerir tags relevantes para uma tarefa
async function suggestTagsForTask(task) {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-lite",
    contents: [
      {
        role: "user",
        parts: [
          {
            text: `Sugira tags relevantes para a seguinte tarefa, com base no seu conteúdo e prioridade. 
            Devolve apenas um array JSON com as tags. IMPORTANTE: Responda APENAS com JSON válido, 
            sem nenhuma formatação markdown, sem code blocks, sem backticks, sem asteriscos.
            Apenas JSON puro. ${JSON.stringify(task)}`,
          },
        ],
      },
    ],
  });
  return JSON.parse(response.candidates[0].content.parts[0].text);
}

// Exports for server
export { createTaskFromText, refineTask, summarizeTask, suggestTagsForTask };
