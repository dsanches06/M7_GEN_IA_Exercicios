import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
dotenv.config({ path: "../.env" });

//agora, vamos criar uma instância do cliente do GenAI usando a chave de API que definimos no arquivo .env
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

async function main() {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: "Explain how AI works in a few words in portuguese",
  });
  console.log("\n--- Answer ---");
  console.log(response.text);
}

await main();
