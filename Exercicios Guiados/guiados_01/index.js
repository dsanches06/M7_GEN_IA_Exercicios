import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
dotenv.config({ path: "../.env" });

//agora, vamos criar uma instância do cliente do GenAI usando a chave de API
// que definimos no arquivo .env
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

//Exercício 1 — Criador de Tarefas Inteligente
async function createTaskFromText(dados) {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: [
      {
        role: "user",
        parts: [
          {
            text: `Transforma esta lista de tarefas num objeto JSON estruturado com os campos
            'title' e 'description', 'priority' e 'tags'. 
            Devolve APENAS o JSON. ${dados}`,
          },
        ],
      },
    ],
  });

  return response.candidates[0].content.parts[0].text;
}

const result1 = await createTaskFromText(
  "Preciso de corrigir o bug do login que está a falhar para vários utilizadores e é urgente",
);

console.log("\n--- Resposta - Exercicio 1 Guiados ---");
console.log(JSON.parse(result1));

/* -------------------------------------------------   ---------------------------------------------- */

//Exercício 2 — Melhoria Inteligente de Tarefas
async function refineTask(task) {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: [
      {
        role: "user",
        parts: [
          {
            text: `Melhore a seguinte tarefa,
            tornando-a mais clara e profissional.
            mantenha os mesmos campos, mas reformule o título e a 
            descrição para serem mais específicos e orientados para a ação.
            Devolve APENAS o JSON. ${task}`,
          },
        ],
      },
    ],
  });

  return response.candidates[0].content.parts[0].text;
}

const result2 = await refineTask(result1);

console.log("\n--- Resposta - Exercicio 2 Guiados ---");
console.log(JSON.parse(result2));
