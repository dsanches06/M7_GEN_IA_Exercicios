import * as sprintTaskService from "../services/sprintTaskService.js";


/* Função para obter todas as tarefas de sprint ou tarefas de um sprint específico */
export const getSprintTasks = async (req, res) => {
  try {
    const { id } = req.params; // ID do sprint
    const sprintTasks = id
      ? await sprintTaskService.getSprintTasksBySprint(Number(id))
      : await sprintTaskService.getAllSprintTasks();
    res.json(sprintTasks);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar tarefas de sprint" });
  }
};


/* Função para obter tarefa de sprint por ID */
export const getSprintTaskById = async (req, res) => {
  try {
    const sprintTask = await sprintTaskService.getSprintTaskById(Number(req.params.id));
    if (!sprintTask) {
      return res.status(404).json({ error: "Tarefa de sprint não encontrada" });
    }
    res.json(sprintTask);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar tarefa de sprint" });
  }
};


/* Função para criar tarefa de sprint */
export const createSprintTask = async (req, res) => {
  try {
    const { sprint_id, task_id } = req.body;
    if (!sprint_id || !task_id) {
      return res.status(400).json({ error: "sprint_id e task_id são obrigatórios" });
    }
    const sprintTask = await sprintTaskService.createSprintTask(req.body);
    res.status(201).json(sprintTask);
  } catch (error) {
    res.status(400).json({ error: "Erro ao criar tarefa de sprint" });
  }
};


/* Função para atualizar tarefa de sprint */
export const updateSprintTask = async (req, res) => {
  try {
    const { id } = req.params;
    const affectedRows = await sprintTaskService.updateSprintTask(id, req.body);
    if (affectedRows === 0) {
      return res.status(404).json({ error: "Tarefa de sprint não encontrada" });
    }
    res.json({ message: "Tarefa de sprint atualizada com sucesso" });
  } catch (error) {
    res.status(400).json({ error: "Erro ao atualizar tarefa de sprint" });
  }
};


/* Função para deletar tarefa de sprint */
export const deleteSprintTask = async (req, res) => {
  try {
    const { sprint_id, task_id } = req.query;
    if (!sprint_id || !task_id) {
      return res.status(400).json({ error: "sprint_id e task_id são obrigatórios" });
    }
    const affectedRows = await sprintTaskService.deleteSprintTask(Number(sprint_id), Number(task_id));
    if (affectedRows === 0) {
      return res.status(404).json({ error: "Tarefa de sprint não encontrada" });
    }
    res.json({ message: "Tarefa de sprint deletada com sucesso" });
  } catch (error) {
    res.status(400).json({ error: "Erro ao deletar tarefa de sprint" });
  }
};
