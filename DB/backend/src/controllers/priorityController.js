import * as priorityService from "../services/priorityService.js";


/* Função para obter todas as prioridades */
export const getPriorities = async (req, res) => {
  try {
    const priorities = await priorityService.getAllPriorities();
    res.json(priorities);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar prioridades" });
  }
};


/* Função para obter prioridade por ID */
export const getPriorityById = async (req, res) => {
  try {
    const priority = await priorityService.getPriorityById(Number(req.params.id));
    if (!priority) {
      return res.status(404).json({ error: "Prioridade não encontrada" });
    }
    res.json(priority);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar prioridade" });
  }
};


/* Função para criar prioridade */
export const createPriority = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name || name.trim().length === 0) {
      return res.status(400).json({ error: "O nome da prioridade não pode ser vazio" });
    }
    const priority = await priorityService.createPriority(req.body);
    res.status(201).json(priority);
  } catch (error) {
    res.status(400).json({ error: "Erro ao criar prioridade" });
  }
};


/* Função para atualizar prioridade */
export const updatePriority = async (req, res) => {
  try {
    const { id } = req.params;
    const affectedRows = await priorityService.updatePriority(id, req.body);
    if (affectedRows === 0) {
      return res.status(404).json({ error: "Prioridade não encontrada" });
    }
    res.json({ message: "Prioridade atualizada com sucesso" });
  } catch (error) {
    res.status(400).json({ error: "Erro ao atualizar prioridade" });
  }
};


/* Função para deletar prioridade */
export const deletePriority = async (req, res) => {
  try {
    const { id } = req.params;
    const affectedRows = await priorityService.deletePriority(id);
    if (affectedRows === 0) {
      return res.status(404).json({ error: "Prioridade não encontrada" });
    }
    res.json({ message: "Prioridade deletada com sucesso" });
  } catch (error) {
    res.status(400).json({ error: "Erro ao deletar prioridade" });
  }
};
