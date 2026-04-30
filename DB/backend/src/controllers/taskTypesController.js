import * as taskTypesService from "../services/taskTypesService.js";

export const getTaskTypes = async (req, res) => {
  try {
    const taskTypes = await taskTypesService.getAllTaskTypes();
    res.json(taskTypes);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar tipos de tarefa" });
  }
};

export const getTaskTypeById = async (req, res) => {
  try {
    const taskType = await taskTypesService.getTaskTypeById(Number(req.params.id));
    if (!taskType) {
      return res.status(404).json({ error: "Tipo de tarefa não encontrado" });
    }
    res.json(taskType);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar tipo de tarefa" });
  }
};

export const createTaskType = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name || name.trim().length === 0) {
      return res.status(400).json({ message: "O nome do tipo de tarefa não pode ser vazio" });
    }
    const taskType = await taskTypesService.createTaskType(req.body);
    res.status(201).json(taskType);
  } catch (error) {
    res.status(400).json({ message: "Erro ao criar tipo de tarefa" });
  }
};

export const updateTaskType = async (req, res) => {
  try {
    const { id } = req.params;
    const affectedRows = await taskTypesService.updateTaskType(id, req.body);
    if (affectedRows === 0) {
      return res.status(404).json({ message: "Tipo de tarefa não encontrado" });
    }
    res.json({ message: "Tipo de tarefa atualizado com sucesso" });
  } catch (error) {
    res.status(400).json({ message: "Erro ao atualizar tipo de tarefa" });
  }
};

export const deleteTaskType = async (req, res) => {
  try {
    const { id } = req.params;
    const affectedRows = await taskTypesService.deleteTaskType(id);
    if (affectedRows === 0) {
      return res.status(404).json({ message: "Tipo de tarefa não encontrado" });
    }
    res.json({ message: "Tipo de tarefa deletado com sucesso" });
  } catch (error) {
    res.status(400).json({ message: "Erro ao deletar tipo de tarefa" });
  }
};
