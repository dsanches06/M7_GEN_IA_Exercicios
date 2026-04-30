import * as taskDependencyService from "../services/taskDependencyService.js";


/* Função para obter todas as dependências de tarefa */
export const getTaskDependencies = async (req, res) => {
  try {
    const taskDependencies = await taskDependencyService.getAllTaskDependencies();
    res.json(taskDependencies);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar dependências de tarefa" });
  }
};


/* Função para obter dependência de tarefa por ID */
export const getTaskDependencyById = async (req, res) => {
  try {
    const taskDependency = await taskDependencyService.getTaskDependencyById(Number(req.params.id));
    if (!taskDependency) {
      return res.status(404).json({ error: "Dependência de tarefa não encontrada" });
    }
    res.json(taskDependency);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar dependência de tarefa" });
  }
};


/* Função para criar dependência de tarefa */
export const createTaskDependency = async (req, res) => {
  try {
    const { task_id, depends_on_task_id } = req.body;
    if (!task_id || !depends_on_task_id) {
      return res.status(400).json({ error: "task_id e depends_on_task_id são obrigatórios" });
    }
    const taskDependency = await taskDependencyService.createTaskDependency(req.body);
    res.status(201).json(taskDependency);
  } catch (error) {
    res.status(400).json({ error: "Erro ao criar dependência de tarefa" });
  }
};


/* Função para atualizar dependência de tarefa */
export const updateTaskDependency = async (req, res) => {
  try {
    const { id } = req.params;
    const affectedRows = await taskDependencyService.updateTaskDependency(id, req.body);
    if (affectedRows === 0) {
      return res.status(404).json({ error: "Dependência de tarefa não encontrada" });
    }
    res.json({ message: "Dependência de tarefa atualizada com sucesso" });
  } catch (error) {
    res.status(400).json({ error: "Erro ao atualizar dependência de tarefa" });
  }
};


/* Função para deletar dependência de tarefa */
export const deleteTaskDependency = async (req, res) => {
  try {
    const { id } = req.params;
    const affectedRows = await taskDependencyService.deleteTaskDependency(id);
    if (affectedRows === 0) {
      return res.status(404).json({ error: "Dependência de tarefa não encontrada" });
    }
    res.json({ message: "Dependência de tarefa deletada com sucesso" });
  } catch (error) {
    res.status(400).json({ error: "Erro ao deletar dependência de tarefa" });
  }
};
