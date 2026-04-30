import * as mentionService from "../services/mentionService.js";


/* Função para obter todas as menções */
export const getMentions = async (req, res) => {
  try {
    const mentions = await mentionService.getAllMentions();
    res.json(mentions);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar menções" });
  }
};


/* Função para obter menção por ID */
export const getMentionById = async (req, res) => {
  try {
    const mention = await mentionService.getMentionById(Number(req.params.id));
    if (!mention) {
      return res.status(404).json({ error: "Menção não encontrada" });
    }
    res.json(mention);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar menção" });
  }
};


/* Função para criar menção */
export const createMention = async (req, res) => {
  try {
    const { comment_id, mentioned_user_id } = req.body;
    if (!comment_id || !mentioned_user_id) {
      return res.status(400).json({ error: "comment_id e mentioned_user_id são obrigatórios" });
    }
    const mention = await mentionService.createMention(req.body);
    res.status(201).json(mention);
  } catch (error) {
    res.status(400).json({ error: "Erro ao criar menção" });
  }
};


/* Função para atualizar menção */
export const updateMention = async (req, res) => {
  try {
    const { id } = req.params;
    const affectedRows = await mentionService.updateMention(id, req.body);
    if (affectedRows === 0) {
      return res.status(404).json({ error: "Menção não encontrada" });
    }
    res.json({ message: "Menção atualizada com sucesso" });
  } catch (error) {
    res.status(400).json({ error: "Erro ao atualizar menção" });
  }
};


/* Função para deletar menção */
export const deleteMention = async (req, res) => {
  try {
    const { id } = req.params;
    const affectedRows = await mentionService.deleteMention(id);
    if (affectedRows === 0) {
      return res.status(404).json({ error: "Menção não encontrada" });
    }
    res.json({ message: "Menção deletada com sucesso" });
  } catch (error) {
    res.status(400).json({ error: "Erro ao deletar menção" });
  }
};
