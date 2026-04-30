import * as taskStatusHistoryService from "../services/taskStatusHistoryService.js";


/* Função para obter todo o histórico de status de tarefas */
export const getTaskStatusHistories = async (req, res) => {
  try {
    const taskStatusHistories = await taskStatusHistoryService.getAllTaskStatusHistories();
    res.json(taskStatusHistories);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar histórico de status de tarefas" });
  }
};


/* Função para obter histórico de status de tarefa por ID */
export const getTaskStatusHistoryById = async (req, res) => {
  try {
    const taskStatusHistory = await taskStatusHistoryService.getTaskStatusHistoryById(Number(req.params.id));
    if (!taskStatusHistory) {
      return res.status(404).json({ error: "Histórico de status de tarefa não encontrado" });
    }
    res.json(taskStatusHistory);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar histórico de status de tarefa" });
  }
};


/* Função para criar histórico de status de tarefa */
export const createTaskStatusHistory = async (req, res) => {
  try {
    const { task_id, status_id } = req.body;
    if (!task_id || !status_id) {
      return res.status(400).json({ error: "task_id e status_id são obrigatórios" });
    }
    const taskStatusHistory = await taskStatusHistoryService.createTaskStatusHistory(req.body);
    res.status(201).json(taskStatusHistory);
  } catch (error) {
    res.status(400).json({ error: "Erro ao criar histórico de status de tarefa" });
  }
};


/* Função para atualizar histórico de status de tarefa */
export const updateTaskStatusHistory = async (req, res) => {
  try {
    const { id } = req.params;
    const affectedRows = await taskStatusHistoryService.updateTaskStatusHistory(id, req.body);
    if (affectedRows === 0) {
      return res.status(404).json({ error: "Histórico de status de tarefa não encontrado" });
    }
    res.json({ message: "Histórico de status de tarefa atualizado com sucesso" });
  } catch (error) {
    res.status(400).json({ error: "Erro ao atualizar histórico de status de tarefa" });
  }
};


/* Função para deletar histórico de status de tarefa */
export const deleteTaskStatusHistory = async (req, res) => {
  try {
    const { id } = req.params;
    const affectedRows = await taskStatusHistoryService.deleteTaskStatusHistory(id);
    if (affectedRows === 0) {
      return res.status(404).json({ error: "Histórico de status de tarefa não encontrado" });
    }
    res.json({ message: "Histórico de status de tarefa deletado com sucesso" });
  } catch (error) {
    res.status(400).json({ error: "Erro ao deletar histórico de status de tarefa" });
  }
};
