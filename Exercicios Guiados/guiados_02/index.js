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
  const prompt = `És o ClickBot, um assistente integrado com ClickUp.
                  Ajudas a organizar tarefas, prioridades (alta, media, baixa), sprints e ideias.
                  Responde sempre de forma clara, estruturada e concisa.
                  Não uses markdown nem blocos de código nas respostas.
                  Se o pedido for para retornar JSON, devolve apenas JSON válido, sem texto adicional.
                  Para pedidos de conversa, resumo ou planeamento, responde com texto claro e direto.
                  Para classificar prioridade, usa apenas:
                  { "priority": "alta" }, { "priority": "media" } ou { "priority": "baixa" }.
                  Para gerar nomes, responde apenas com JSON no formato:
                  { "nome": "nomegerado" }.
                  `;
  return prompt;
}

//Exercício 2 — Few Shot com classifyPriority()
//Tarefa: Criar função que envia exemplos ao modelo para classificar prioridades.
export async function classifyPriority(text) {
  const prompt = `
        Classifica a prioridade desta tarefa usando apenas os exemplos abaixo.

        Exemplos:
        "site caiu" -> alta
        "mudar botão" -> media
        "trocar favicon" -> baixa

        Retorna apenas JSON válido, sem markdown ou texto adicional.
        O formato exato deve ser:
        { "priority": "baixa" }

        Usa somente os valores: alta, media, baixa.
        Não inclua nenhum outro texto ou explicação.

        Tarefa:
        "${text}"

        Resposta:
        `;

  const response = await callGemini(prompt);
  return JSON.parse(response.trim());
}

//Exercício 3 — Temperature Lab
//Tarefa: Criar função generateNames(temp).
export async function generateNames(temp) {
  const prompt = `Gera nomes claros e criativos para um projeto ou funcionalidade.
                 Retorna apenas um objeto JSON com o nome gerado no formato:
                 { "nome": "" }.
                 Sem markdown, sem blocos de código.`;

  const response = await callGemini(prompt, temp);
  return JSON.parse(response.trim());
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
            Responde em texto claro, direto e sem markdown.`;

  const response = await callGemini(prompt);
  return response.trim();
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

//Exercício 5 — Chat com Memória Real
//Objetivo: Fazer o ClickBot lembrar-se de informações ditas anteriormente.
export async function sendMessage(userInput) {
  history.push({ role: "user", parts: [{ text: userInput }] });

  limitHistory();

  const prompt = history
    .map((message) => `${message.role}: ${message.parts[0].text}`)
    .join("\n");

  const text = await callGemini(prompt);

  history.push({ role: "model", parts: [{ text }] });

  return text;
}

//Exercício 7 — Memory Summary
//Tarefa: Criar função summarizeHistory().
export async function summarizeHistory() {
  const prompt = `
Resume esta conversa de forma curta, clara e objetiva:

${history.map((m) => m.parts[0].text).join("\n")}

Retorna apenas o resumo em texto simples, sem markdown.`;

  const response = await callGemini(prompt);

  const summary = response.trim();

  history = [
    { role: "user", parts: [{ text: "Resumo da conversa até agora:" }] },
    { role: "model", parts: [{ text: summary }] },
  ];

  return history;
}

//Exercício 8 — Thinking Mode (Planeamento de Feature Real)
export async function generateTaskBreakdown(task) {
  const prompt = `
            Tu és um arquiteto de software.

            Divide a seguinte tarefa em subtarefas organizadas:

            Tarefa:
            "${task}"

            Regras:
            - Não criar subtarefas desnecessárias
            - Máximo 3 subtarefas
            - Cada subtarefa deve ser clara e executável

            Devolve apenas JSON válido, sem markdown ou texto adicional:
            {
              "tasks": [
                { "title": "", "description": "", "priority": "" }
              ]
            }
`;

  const response = await callGemini(prompt);
  return response.trim();
}

//Função auxiliar para chamar o Gemini com o prompt e obter a resposta.
export async function callGemini(userPrompt, temp = 0.3) {
  const response = await gemini.models.generateContent({
    model: "gemini-2.5-flash-lite",
    contents: [{ parts: [{ text: userPrompt }] }],
    config: {
      systemInstruction: createSystemPrompt(),
      temperature: temp,
    },
  });

  return response.candidates[0].content.parts[0].text;
}
