import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

import {
  parseJsonResponse,
  buildThinkingConfig,
  buildGeminiContents,
  getThinkingLevel,
  createFallbackBreakdown,
} from "./utils.js";

dotenv.config({ path: "../../.env" });

if (!process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY not found in environment variables");
}

const gemini = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

//Exercício 1 — Configuração e Endpoint Básico
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
export async function generateNames(temp = 0.3) {
  const temperature = Number.isFinite(Number(temp)) ? Number(temp) : 0.3;

  const prompt = `Gera nomes claros e criativos para um projeto ou funcionalidade.
                 Retorna apenas um objeto JSON com o nome gerado no formato:
                 { "nome": "nomegerado" }.
                 Sem markdown, sem blocos de código, sem texto adicional.`;

  const response = await callGemini(prompt, temperature);
  return parseJsonResponse(response);
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

  const text = await callGemini(history);

  history.push({ role: "assistant", parts: [{ text }] });

  return history;
}

//Exercício 7 — Memory Summary
//Tarefa: Criar função summarizeHistory().
export async function summarizeHistory() {
  const summaryPrompt = `
Resume esta conversa de forma curta, clara e objetiva.

Retorna apenas o resumo em texto simples, sem markdown.`;

  const response = await callGemini([
    ...history,
    { role: "user", parts: [{ text: summaryPrompt }] },
  ]);

  const summary = response.trim();

  history = [
    { role: "user", parts: [{ text: "Resumo da conversa até agora:" }] },
    { role: "assistant", parts: [{ text: summary }] },
  ];

  return history;
}

//Exercício 8 — Thinking Mode (Planeamento de Feature Real)
export async function generateTaskBreakdown(task) {
  const normalizedTask = String(task || "").trim();
  if (!normalizedTask) {
    throw new Error("Task must not be empty");
  }

  const prompt = `
            Tu és o arquiteto de produto do ClickBot.
            Usa o modo de pensamento e pensa passo a passo antes de responder.
            Analisa a tarefa para decidir se deve ser dividida em subtarefas ou mantida como uma única tarefa executável.

            Regras principais:
            - Define regras claras para dividir tarefas grandes ou multi-fase.
            - Evita o over-splitting; máximo 5 subtarefas.
            - Tarefas curtas, simples ou vagas devem ser devolvidas como uma única tarefa clara.
            - Cada subtarefa deve ser executável e conter título, descrição e prioridade.
            - Prioridade deve ser: alta, media ou baixa.
            - Quando fizer sentido, alinha o breakdown ao fluxo frontend → backend → AI.

            Estrutura JSON exigida:
            {
              "tasks": [
                {
                  "title": "Título curto e objetivo",
                  "description": "Descrição clara e limitada",
                  "priority": "alta|media|baixa"
                }
              ]
            }

            Responde apenas JSON válido, sem markdown nem texto adicional.

            Tarefa:
            "${normalizedTask}"
  `;

  const response = await callGemini(prompt, 0.5, true, {
    thinkingBudget: 1024,
  });

  try {
    return parseJsonResponse(response);
  } catch (error) {
    console.warn(
      "Resposta inválida do modelo para generateTaskBreakdown:",
      error,
    );
    return createFallbackBreakdown(normalizedTask);
  }
}

//Função auxiliar para chamar o Gemini com histórico e opções de pensamento.
export async function callGemini(
  userPromptOrHistory,
  temp = 0.3,
  thinking = false,
  thinkingOptions = {},
) {
  //Constrói o conteúdo para o Gemini, adaptando o
  // formato do prompt ou do histórico conforme necessário.
  const contents = buildGeminiContents(userPromptOrHistory);

  const response = await gemini.models.generateContent({
    model: "gemini-2.5-flash-lite",
    contents,
    config: {
      systemInstruction: createSystemPrompt(),
      temperature: temp,
      ...(thinking && {
        thinkingConfig: buildThinkingConfig(thinkingOptions, temp),
      }),
    },
  });

  //Extrai a resposta do modelo, lidando com possíveis formatos de resposta.
  const parts = response.candidates[0].content.parts;
  const thoughtParts = parts.filter((part) => part.text && part.thought);

  if (thinking && thoughtParts.length > 0) {
    console.log("Thoughts summary:");
    for (const thought of thoughtParts) {
      console.log(thought.text);
    }
  }

  const answerPart = parts.find((part) => part.text && !part.thought);
  return answerPart
    ? answerPart.text
    : parts.map((part) => part.text).join("\n");
}
