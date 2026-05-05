import * as chatHistoryService from "../services/chatHistoryService.js";

/* Função para buscar histórico de chat */
export const getChatHistories = async (req, res) => {
  try {
    const chatHistory = await chatHistoryService.getAllChatHistory();
    res.json(chatHistory);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar histórico de chat" });
  }
};

export const getChatHistoryById = async (req, res) => {
  try {
    const chatHistory = await chatHistoryService.getChatHistoryById(Number(req.params.id));
    if (!chatHistory) {
      return res.status(404).json({ message: "Mensagem de chat não encontrada" });
    }
    res.json(chatHistory);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar mensagem de chat" });
  }
};

export const getChatHistoryByConversationId = async (req, res) => {
  try {
    const conversationId = Number(req.params.conversationId);
    const chatHistories = await chatHistoryService.getChatHistoryByConversationId(conversationId);
    res.json(chatHistories);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar histórico da conversa" });
  }
};

export const createChatHistory = async (req, res) => {
  try {
    const { conversation_id, role_id, content } = req.body;

    if (!conversation_id || !role_id || !content || content.trim().length === 0) {
      return res.status(400).json({ message: "conversation_id, role_id e content são obrigatórios" });
    }

    const chatMessage = await chatHistoryService.createChatHistory(req.body);
    res.status(201).json(chatMessage);
  } catch (error) {
    res.status(400).json({ message: "Erro ao criar mensagem de chat" });
  }
};



/* Função para deletar mensagem de chat */
export const deleteChatHistory = async (req, res) => {
  try {
    const chatHistory = await chatHistoryService.deleteChatHistory(Number(req.params.id));
    res.status(200).json({ message: "Mensagem de chat deletada com sucesso", chatHistory });
  } catch (error) {
    res.status(404).json({ message: "Erro ao deletar papel" });
  }
};

/* Função para atualizar mensagem de chat */
export const updateChatHistory = async (req, res) => {
  try {
    const chatHistoryId = Number(req.params.id);
    const { content } = req.body;

    if (!content || content.trim().length === 0) {
      return res.status(400).json({ message: "O conteúdo da mensagem de chat não pode ser vazio" });
    }

    const chatHistory = await chatHistoryService.updateChatHistory(chatHistoryId, req.body);
    if (!chatHistory) {
      return res.status(404).json({ message: "Mensagem de chat não encontrada" });
    }

    res.status(200).json(chatHistory);
  } catch (error) {
    res.status(400).json({ message: "Erro ao atualizar mensagem de chat" });
  }
};
