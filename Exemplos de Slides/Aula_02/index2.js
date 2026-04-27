import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
dotenv.config({ path: "../.env" });

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

async function main() {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-lite",
    contents: "What is the sum of the first 50 prime numbers?",
    config: {
      temperature: 0.7,
      thinkingConfig: {
        includeThoughts: true,
      },
    },
  });
  for (const part of response.candidates[0].content.parts) {
    if (!part.text) {
      continue;
    } 
    else if (part.thought) {
      console.log("Thoughts summary:");
      console.log(part.text);
    }
     else {
      console.log("Answer:");
      console.log(part.text);
    }
  }
}

await main();
