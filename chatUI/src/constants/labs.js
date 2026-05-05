import {
  chatWithStream,
  parseTask,
  transcribeMeeting,
  triageBug,
  planWeekly,
  getSentimentDashboard,
  analyzeLatestComments,
  /*,
  classifyPriority,
  generateNames,
  planSprint,
  sendMessage,
  limitHistory,
  summarizeHistory,
  generateTaskBreakdown,
  postChatEndpoint,
  createTaskFromText,
  refineTask,
  createTaskEndpoint,
  refineTaskEndpoint,
  summarizeTaskEndpoint,
  suggestTagsEndpoint,*/
} from "@/services/apiService";

export const LABS_DATA = {
  "Lab 01 - AI Task System: Fundamentos": [
    {
      parte01: [
        {
          id: 1,
          title: "Criador de Tarefas Inteligente",
          badge: "Estruturação",
          description: "Transforma texto livre em tarefas JSON",
          placeholder: "Ex: Preciso de corrigir o bug do login...",
          //action: createTaskFromText,
        },
        {
          id: 2,
          title: "Melhoria de Tarefas",
          badge: "Refinement",
          description: "Torna as tarefas mais claras e profissionais",
          placeholder: "Insere uma tarefa básica para melhorar...",
          //action: refineTask,
        },
      ],
      parte02: [
        {
          id: 3,
          title: "Endpoint: Criar Tarefa",
          badge: "POST",
          description: "Simula a criação de tarefa via API no ClickUp",
          placeholder: "Enviar payload para /api/tasks/create...",
          //action: createTaskEndpoint,
        },
        {
          id: 4,
          title: "Endpoint: Refinar Tarefa",
          badge: "POST",
          description: "Melhora tarefas existentes via API",
          placeholder: "Enviar payload para /api/tasks/refine...",
          //action: refineTaskEndpoint,
        },
        {
          id: 5,
          title: "Endpoint: Resumir Descrição",
          badge: "POST",
          description: "Gera resumos objetivos para leitura rápida",
          placeholder: "Enviar descrição longa...",
          //action: summarizeTaskEndpoint,
        },
        {
          id: 6,
          title: "Endpoint: Sugerir Tags",
          badge: "POST",
          description: "Sugere etiquetas baseadas no contexto",
          placeholder: "Analisar tarefa para tags...",
          //action: suggestTagsEndpoint,
        },
      ],
    },
  ], // Corrigido: fechamento do Lab 01
  "Lab 02 - Prompt Engineering: Workshop Prático": [
    {
      parte01: [
        {
          id: 1,
          title: "System Prompt",
          badge: "Config",
          description: "Configura a identidade do ClickBot",
          placeholder: "Escreve o prompt de sistema...",
          //action: createSystemPrompt,
        },
        {
          id: 2,
          title: "Classificador (Few-Shot)",
          badge: "Lógica",
          description: "Classifica prioridades com exemplos",
          placeholder: "Ex: O site foi abaixo!",
          //action: classifyPriority,
        },
        {
          id: 3,
          title: "Laboratório de Temperatura",
          badge: "Criatividade",
          description: "Gera nomes com diferentes graus de variação",
          placeholder: "Indica a temperatura (0.2 a 1.2)",
          //action: generateNames,
        },
        {
          id: 4,
          title: "Chain of Thought",
          badge: "Raciocínio",
          description: "Planeamento passo a passo de Sprints",
          placeholder: "Ex: Sprint para landing page",
          //action: planSprint,
        },
      ],
      parte02: [
        {
          id: 5,
          title: "Chat com Memória",
          badge: "Histórico",
          description: "Conversa com retenção de contexto",
          placeholder: "Diz o teu nome...",
          //action: sendMessage,
        },
        {
          id: 6,
          title: "Sliding Window",
          badge: "Otimização",
          description: "Limita o histórico às últimas 5 mensagens",
          placeholder: "A testar limite de tokens...",
          //action: limitHistory,
        },
        {
          id: 7,
          title: "Memory Summary",
          badge: "Resumo",
          description: "Compacta o histórico em pontos chave",
          placeholder: "A gerar resumo da conversa...",
          //action: summarizeHistory,
        },
      ],
      parte03: [
        {
          id: 8,
          title: "Thinking Mode",
          badge: "Arquitetura",
          description: "Decompõe tarefas complexas (Auto-Split)",
          placeholder: "Ex: Criar sistema de login completo",
          //action: generateTaskBreakdown,
        },
        {
          id: 9,
          title: "Endpoint de Integração",
          badge: "API",
          description: "Testa o endpoint final do ClickBot",
          placeholder: "Envia payload JSON...",
          //action: postChatEndpoint,
        },
      ],
    },
  ], // Corrigido: fechamento do Lab 02
  "Lab 03 - ClickBot Builder: Workshop Prático GenAI": [
    {
      lab01: [
        {
          id: 1,
          title: "Chat de Suporte",
          badge: "Streaming",
          description: "Obtenha ajuda sobre o ClickUp",
          placeholder: "...",
          action: chatWithStream,
        },
      ],
      lab02: [
        {
          id: 2,
          title: "Smart Task Parser",
          badge: "JSON",
          description: "Transforme mensagens em tarefas",
          placeholder: "...",
          action: parseTask,
        },
      ],
      lab03: [
        {
          id: 3,
          title: "Transcritor de Reuniões",
          badge: "Streaming",
          description: "Gere sumários de reuniões",
          placeholder: "...",
          action: transcribeMeeting,
        },
      ],
      lab04: [
        {
          id: 4,
          title: "Triage de Bugs",
          badge: "JSON",
          description: "Classifique bugs automaticamente",
          placeholder: "...",
          action: triageBug,
        },
      ],
      lab05: [
        {
          id: 5,
          title: "Smart Planner Semanal",
          badge: "Streaming",
          description: "Organize a sua semana",
          placeholder: "...",
          action: planWeekly,
        },
      ],
      lab06: [
        {
          id: 6,
          title: "Dashboard de Sentimento",
          badge: "JSON",
          description: "Analise os 20 últimos comentários da equipa",
          placeholder: "Clique para analisar os últimos 20 comentários...",
          action: analyzeLatestComments,
        },
      ],
    },
  ],
};
