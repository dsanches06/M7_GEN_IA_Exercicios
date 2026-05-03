import * as conversationService from "../services/conversationService.js";

/* Função para buscar conversas */
export const getConversations = async (req, res) => {
  try {
    const conversations = await conversationService.getAllConversations();
    res.json(conversations);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar conversas" });
  }
};

export const getConversationById = async (req, res) => {
  try {
    const conversation = await conversationService.getConversationById(
      Number(req.params.id),
    );
    if (!conversation) {
      return res.status(404).json({ message: "Conversa não encontrada" });
    }
    res.json(conversation);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar conversa" });
  }
};

/* Função para criar conversa */
export const createConversation = async (req, res) => {
  try {
    const { title } = req.body;

    if (!title || title.trim().length === 0) {
      return res
        .status(400)
        .json({ message: "O título da conversa não pode ser vazio" });
    }

    const conversation = await conversationService.createConversation(req.body);
    res.status(201).json(conversation);
  } catch (error) {
    res.status(400).json({ message: "Erro ao criar conversa" });
  }
};

/* Função para deletar conversa */
export const deleteConversation = async (req, res) => {
  try {
    const conversation = await conversationService.deleteConversation(
      Number(req.params.id),
    );
    await taskService.removeConversationFromAllTasks(Number(req.params.id));
    res
      .status(200)
      .json({ message: "Conversa deletada com sucesso", conversation });
  } catch (error) {
    res.status(404).json({ message: "Erro ao deletar conversa" });
  }
};

/* Função para atualizar conversa */
export const updateConversation = async (req, res) => {
  try {
    const conversationId = Number(req.params.id);
    const { title } = req.body;

    if (!title || title.trim().length === 0) {
      return res
        .status(400)
        .json({ message: "O título da conversa não pode ser vazio" });
    }

    const conversation = await conversationService.updateConversation(conversationId, req.body);
    if (!conversation) {
      return res.status(404).json({ message: "Conversa não encontrada" });
    }

    res.status(200).json(conversation);
    if (conversationExists) {
      return res
        .status(400)
        .json({ message: "Já existe uma conversa com este nome" });
    }

    const conversation = await conversationService.updateConversation(
      conversationId,
      req.body,
    );
    if (!conversation) {
      return res.status(404).json({ message: "Conversa não encontrada" });
    }

    res.status(200).json(conversation);
  } catch (error) {
    res.status(400).json({ message: "Erro ao atualizar conversa" });
  }
};

/* Função para buscar tarefas da conversa */
export const getConversationTasks = async (req, res) => {
  try {
    const conversationId = Number(req.params.id);
    const conversation =
      await conversationService.getConversationById(conversationId);

    if (!conversation) {
      return res.status(404).json({ error: "Conversa não encontrada" });
    }

    const tasks = await taskService.getTasksByConversationId(conversationId);
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar tarefas da conversa" });
  }
};
