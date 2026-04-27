import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
dotenv.config({ path: "../../.env" });

if (!process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY not found in environment variables");
}

const gemini = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

//Exercício 1 — Função createSystemPrompt()
//Tarefa: Criar uma função JavaScript que devolve o system prompt do ClickBot.
function createSystemPrompt() {
  return 
     `És o ClickBot, um assistente de produtividade integrado com ClickUp.
      Ajudas a organizar tarefas, prioridades(Alta, Média, Baixa) e sprints.
      Responde sempre de forma clara, estruturada e prática.`;
}

//Exercício 2 — Few Shot com classifyPriority()
//Tarefa: Criar função que envia exemplos ao modelo para classificar prioridades.
export async function classifyPriority(text) {
     const prompt = `
        Classifica a prioridade das tarefas:

        Exemplos:
        "site caiu" -> Alta
        "mudar botão" -> Média
        "trocar favicon" -> Baixa

        Agora classifica:
        "${text}" -> 
        `;

  const response = await gemini.generateContent(prompt);
  return response.text();
}

//Exercício 3 — Temperature Lab
//Tarefa: Criar função generateNames(temp).
export async function generateNames(temp) {
  const response = await gemini.generateContent({
    contents: [
        { 
        parts: [
            { text: "Gera nomes criativos para uma app de produtividade" }
        ] 
    }],
    generationConfig: {
      temperature: temp
    }
  });

  return response.text();
}

//Exercício 4 — Chain of Thought
//Tarefa: Criar função planSprint().
export async function planSprint() {
  const prompt = `
            Organiza um sprint de 5 dias para lançar uma landing page.

            Pensa passo a passo e estrutura a resposta:

            - Planeamento
            - Design
            - Desenvolvimento
            - Testes
            - Deploy

            Define prioridades e ordem lógica.
        `;

  const response = await gemini.generateContent(prompt);
  return response.text();
}


//Exercício 5 — Chat com Memória Real
//Objetivo: Fazer o ClickBot lembrar-se de informações ditas anteriormente.
//Problema: A AI esquece tudo entre requests se não enviares histórico.
//Tarefa: Criar um array history e guardar todas as mensagens e enviar essas mensagens para o Gemini.
let history = [];

//Exercício 6 — Sliding Window
//Tarefa: Limitar histórico às últimas 5 mensagens.
function limitHistory() {
  history = history.slice(-5);
}

export async function sendMessage(userInput) {
  history.push({ role: "user", parts: [{ text: userInput }] });

  limitHistory();

  const response = await gemini.generateContent({
    contents: history
  });

  const text = response.response.text();

  history.push({ role: "model", parts: [{ text }] });

  return text;
}

//Exercício 7 — Memory Summary
//Tarefa: Criar função summarizeHistory().
export async function summarizeHistory() {
  const prompt = `
Resume esta conversa de forma curta:

${history.map(m => m.parts[0].text).join("\n")}
`;

  const response = await gemini.generateContent(prompt);

  const summary = response.response.text();

  history = [
    { role: "user", parts: [{ text: "Resumo da conversa até agora:" }] },
    { role: "model", parts: [{ text: summary }] }
  ];
}

export async function generateTaskBreakdown(task) {
  const prompt = `
            Tu és um arquiteto de software.

            Divide a seguinte tarefa em subtarefas organizadas:

            Tarefa:
            "${task}"

            Regras:
            - Não criar subtarefas desnecessárias
            - Máximo 8 subtarefas
            - Cada subtarefa deve ser clara e executável

            Devolve em JSON:

            {
            "tasks": [
                { "title": "", "description": "", "priority": "" }
            ],
            "rules": [],
            "flow": "",
            "edge_cases": []
            }
`;

  const response = await gemini.generateContent({
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: {
      temperature: 0.4
    }
  });

  return response.response.text();
}

export async function callGemini() {
  const response = await gemini.models.generateContent({
    model: "gemini-2.5-flash-lite",
    contents: "",
    config: {
      systemInstruction: createSystemPrompt(),
    },
  });
  return response;
}
