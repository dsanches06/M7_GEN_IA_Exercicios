import * as taskAssigneesService from "../services/taskAssigneesService.js";


/* Função para obter todos os responsáveis por tarefas */
export const getTaskAssignees = async (req, res) => {
  try {
    const taskAssignees = await taskAssigneesService.getAllTaskAssignees();
    res.json(taskAssignees);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar responsáveis por tarefas" });
  }
};


/* Função para obter responsável por tarefa pelo ID do usuário */
export const getTaskAssigneeByUserId = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({ error: "ID é obrigatório" });
    }
    
    const taskAssignee = await taskAssigneesService.getTaskAssigneeByUserId(Number(id));
    if (!taskAssignee || taskAssignee.length === 0) {
      return res.status(404).json({ error: "Responsável por tarefa não encontrado" });
    }
    res.json(taskAssignee);
  } catch (error) {
    res.status(400).json({ error: "Erro ao buscar responsável por tarefa" });
  }
};


/* Função para criar responsável por tarefa */
export const createTaskAssignee = async (req, res) => {
  try {
    const { task_id, user_id } = req.body;
    if (!task_id || !user_id) {
      return res.status(400).json({ error: "task_id e user_id são obrigatórios" });
    }
    const taskAssignee = await taskAssigneesService.createTaskAssignee(req.body);
    res.status(201).json(taskAssignee);
  } catch (error) {
    res.status(400).json({ error: "Erro ao criar responsável por tarefa" });
  }
};


/* Função para atualizar responsável por tarefa */
export const updateTaskAssignee = async (req, res) => {
  try {
    const { id } = req.params;
    const affectedRows = await taskAssigneesService.updateTaskAssignee(id, req.body);
    if (affectedRows === 0) {
      return res.status(404).json({ error: "Responsável por tarefa não encontrado" });
    }
    res.json({ message: "Responsável por tarefa atualizado com sucesso" });
  } catch (error) {
    res.status(400).json({ error: "Erro ao atualizar responsável por tarefa" });
  }
};


/* Função para deletar responsável por tarefa */
export const deleteTaskAssignee = async (req, res) => {
  try {
    const { id } = req.params;
    const affectedRows = await taskAssigneesService.deleteTaskAssignee(id);
    if (affectedRows === 0) {
      return res.status(404).json({ error: "Responsável por tarefa não encontrado" });
    }
    res.json({ message: "Responsável por tarefa deletado com sucesso" });
  } catch (error) {
    res.status(400).json({ error: "Erro ao deletar responsável por tarefa" });
  }
};
