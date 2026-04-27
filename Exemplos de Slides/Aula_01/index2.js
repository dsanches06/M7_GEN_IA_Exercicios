import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
dotenv.config({ path: "../.env" });

//agora, vamos criar uma instância do cliente do GenAI usando a chave de API
// que definimos no arquivo .env
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

//exercicio 1 - concatenar variaveis no prompt
async function tradutorComContexto(texto, idiomaDestino) {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: [
      {
        role: "user",
        parts: [
          {
            text: `Age como um tradutor profissional.
             Traduz o seguinte texto para ${idiomaDestino}: ${texto}`,
          },
        ],
      },
    ],
  });
  return response.candidates[0].content.parts[0].text;
}

const result1 = await tradutorComContexto(
  "Tenta traduzir, o meu código tem um bug que não consigo encontrar em opção formal",
  "para alemão",
);

console.log("\n--- Resposta - Exercicio 1 ---");
console.log(result1);

//exercicio 2 - receber dados e transformar em json
async function jsonGenerator(dados) {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: [
      {
        role: "user",
        parts: [
          {
            text: `Transforma esta lista de tarefas num objeto JSON estruturado com os campos 'tarefa' e 'horario'. 
            Devolve APENAS o JSON. ${dados}`,
          },
        ],
      },
    ],
  });

  const textoResposta = response.candidates[0].content.parts[0].text;

  return JSON.parse(textoResposta);
}

const result2 = await jsonGenerator("tenho de comprar ovos, ir ao ginásio às 18h e ligar à mãe");

console.log("\n--- Resposta - Exercicio 2 ---");
console.log(result2[0]);
