import { ThinkingLevel } from "@google/genai";

/*Função utilitária para o ClickBot que analisa a resposta JSON retornada pelo modelo*/
export function parseJsonResponse(text) {
  const trimmed = String(text).trim();
  const jsonMatch = trimmed.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error(`Resposta inválida do modelo: ${trimmed}`);
  }
  return JSON.parse(jsonMatch[0]);
}

/*Função para criar um fallback de breakdown quando o modelo não retorna JSON válido*/
export function createFallbackBreakdown(task) {
  return {
    tasks: [
      {
        title: task,
        description:
          "Tarefa original mantida porque o modelo não retornou JSON válido. Revise manualmente e converta em subtarefas conforme necessário.",
        priority: "media",
      },
    ],
  };
}

/*Função para montar a configuração de pensamento do Gemini com nível ou orçamento*/
export function buildThinkingConfig(options = {}, temp = 0.3) {
  const hasLevel = options.thinkingLevel !== undefined;
  const hasBudget = options.thinkingBudget !== undefined;

  if (hasLevel && hasBudget) {
    throw new Error(
      "thinkingConfig deve usar apenas thinkingLevel ou thinkingBudget, não ambos.",
    );
  }

  const config = { includeThoughts: true };

  if (hasLevel) {
    config.thinkingLevel = options.thinkingLevel;
  } else if (hasBudget) {
    config.thinkingBudget = options.thinkingBudget;
  } else {
    config.thinkingLevel = getThinkingLevel(temp);
  }

  return config;
}

/*Função para construir o conteúdo compatível com Gemini a partir de prompt ou histórico de mensagens*/
export function buildGeminiContents(userPromptOrHistory) {
  if (!Array.isArray(userPromptOrHistory)) {
    return [{ role: "USER", parts: [{ text: userPromptOrHistory }] }];
  }

  return userPromptOrHistory.map((message) => {
    const role = String(message.role || "")
      .trim()
      .toLowerCase();
    const normalizedRole =
      role === "assistant" || role === "model" ? "MODEL" : "USER";

    return {
      role: normalizedRole,
      parts: [{ text: message.parts[0].text }],
    };
  });
}

/*Função para retornar o nível de pensamento com base na temperatura fornecida*/
export function getThinkingLevel(temp) {
  const normalizedTemp = Number(temp);
  return normalizedTemp <= 0.3
    ? ThinkingLevel.LOW
    : normalizedTemp <= 0.7
      ? ThinkingLevel.MEDIUM
      : ThinkingLevel.HIGH;
}
