import Groq from "groq-sdk";
import dotenv from "dotenv";
dotenv.config({ path: "../.env" });

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function main(){
    const chatCompletion = await getGroqChatCompletion();
    console.log(chatCompletion.choices[0]?.message?.content || "");
}

export async function getGroqChatCompletion() {
    return await groq.chat.completions.create({
        model: "openai/gpt-oss-20b",
        messages: [
            {
                role: "user",
                content: "Explain the importance of fast language models"
            }
        ]
    });
}

main();
