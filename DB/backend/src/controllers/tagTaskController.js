import * as tagTaskService from "../services/tagTaskService.js";


/* Função para obter todas as tarefas de etiqueta */
export const getTagTasks = async (req, res) => {
  try {
    const tagTasks = await tagTaskService.getAllTagTasks();
    res.json(tagTasks);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar tarefas de etiqueta" });
  }
};


/* Função para obter tarefa de etiqueta por ID */
export const getTagTaskById = async (req, res) => {
  try {
    const tagTask = await tagTaskService.getTagTaskById(Number(req.params.id));
    if (!tagTask) {
      return res.status(404).json({ error: "Tarefa de etiqueta não encontrada" });
    }
    res.json(tagTask);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar tarefa de etiqueta" });
  }
};


/* Função para criar tarefa de etiqueta */
export const createTagTask = async (req, res) => {
  try {
    const { task_id, tag_id } = req.body;
    if (!task_id || !tag_id) {
      return res.status(400).json({ error: "task_id e tag_id são obrigatórios" });
    }
    const tagTask = await tagTaskService.createTagTask(req.body);
    res.status(201).json(tagTask);
  } catch (error) {
    res.status(400).json({ error: "Erro ao criar tarefa de etiqueta" });
  }
};


/* Função para atualizar tarefa de etiqueta */
export const updateTagTask = async (req, res) => {
  try {
    const { id } = req.params;
    const affectedRows = await tagTaskService.updateTagTask(id, req.body);
    if (affectedRows === 0) {
      return res.status(404).json({ error: "Tarefa de etiqueta não encontrada" });
    }
    res.json({ message: "Tarefa de etiqueta atualizada com sucesso" });
  } catch (error) {
    res.status(400).json({ error: "Erro ao atualizar tarefa de etiqueta" });
  }
};


/* Função para deletar tarefa de etiqueta */
export const deleteTagTask = async (req, res) => {
  try {
    const { id } = req.params;
    const affectedRows = await tagTaskService.deleteTagTask(id);
    if (affectedRows === 0) {
      return res.status(404).json({ error: "Tarefa de etiqueta não encontrada" });
    }
    res.json({ message: "Tarefa de etiqueta deletada com sucesso" });
  } catch (error) {
    res.status(400).json({ error: "Erro ao deletar tarefa de etiqueta" });
  }
};
