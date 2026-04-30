import * as favoriteTaskService from "../services/favoriteTaskService.js";


/* Função para obter todas as tarefas favoritas */
export const getFavoriteTasks = async (req, res) => {
  try {
    const favoriteTasks = await favoriteTaskService.getAllFavoriteTasks();
    res.json(favoriteTasks);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar tarefas favoritas" });
  }
};


/* Função para obter tarefa favorita por ID */
export const getFavoriteTaskById = async (req, res) => {
  try {
    const favoriteTask = await favoriteTaskService.getFavoriteTaskById(Number(req.params.id));
    if (!favoriteTask) {
      return res.status(404).json({ error: "Tarefa favorita não encontrada" });
    }
    res.json(favoriteTask);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar tarefa favorita" });
  }
};


/* Função para criar tarefa favorita */
export const createFavoriteTask = async (req, res) => {
  try {
    const { task_id, user_id } = req.body;
    if (!task_id || !user_id) {
      return res.status(400).json({ error: "task_id e user_id são obrigatórios" });
    }
    const favoriteTask = await favoriteTaskService.createFavoriteTask(req.body);
    res.status(201).json(favoriteTask);
  } catch (error) {
    res.status(400).json({ error: "Erro ao criar tarefa favorita" });
  }
};


/* Função para atualizar tarefa favorita */
export const updateFavoriteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const affectedRows = await favoriteTaskService.updateFavoriteTask(id, req.body);
    if (affectedRows === 0) {
      return res.status(404).json({ error: "Tarefa favorita não encontrada" });
    }
    res.json({ message: "Tarefa favorita atualizada com sucesso" });
  } catch (error) {
    res.status(400).json({ error: "Erro ao atualizar tarefa favorita" });
  }
};


/* Função para deletar tarefa favorita */
export const deleteFavoriteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const affectedRows = await favoriteTaskService.deleteFavoriteTask(id);
    if (affectedRows === 0) {
      return res.status(404).json({ error: "Tarefa favorita não encontrada" });
    }
    res.json({ message: "Tarefa favorita deletada com sucesso" });
  } catch (error) {
    res.status(400).json({ error: "Erro ao deletar tarefa favorita" });
  }
};
