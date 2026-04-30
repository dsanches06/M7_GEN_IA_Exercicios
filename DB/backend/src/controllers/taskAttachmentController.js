import * as taskAttachmentService from "../services/taskAttachmentService.js";


/* Função para obter todos os anexos de tarefa */
export const getTaskAttachments = async (req, res) => {
  try {
    const taskAttachments = await taskAttachmentService.getAllTaskAttachments();
    res.json(taskAttachments);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar anexos de tarefa" });
  }
};


/* Função para obter anexo de tarefa por ID */
export const getTaskAttachmentById = async (req, res) => {
  try {
    const taskAttachment = await taskAttachmentService.getTaskAttachmentById(Number(req.params.id));
    if (!taskAttachment) {
      return res.status(404).json({ error: "Anexo de tarefa não encontrado" });
    }
    res.json(taskAttachment);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar anexo de tarefa" });
  }
};


/* Função para criar anexo de tarefa */
export const createTaskAttachment = async (req, res) => {
  try {
    const { task_id, file_name, file_path } = req.body;
    if (!task_id || !file_name || !file_path) {
      return res.status(400).json({ error: "task_id, file_name e file_path são obrigatórios" });
    }
    const taskAttachment = await taskAttachmentService.createTaskAttachment(req.body);
    res.status(201).json(taskAttachment);
  } catch (error) {
    res.status(400).json({ error: "Erro ao criar anexo de tarefa" });
  }
};


/* Função para atualizar anexo de tarefa */
export const updateTaskAttachment = async (req, res) => {
  try {
    const { id } = req.params;
    const affectedRows = await taskAttachmentService.updateTaskAttachment(id, req.body);
    if (affectedRows === 0) {
      return res.status(404).json({ error: "Anexo de tarefa não encontrado" });
    }
    res.json({ message: "Anexo de tarefa atualizado com sucesso" });
  } catch (error) {
    res.status(400).json({ error: "Erro ao atualizar anexo de tarefa" });
  }
};


/* Função para deletar anexo de tarefa */
export const deleteTaskAttachment = async (req, res) => {
  try {
    const { id } = req.params;
    const affectedRows = await taskAttachmentService.deleteTaskAttachment(id);
    if (affectedRows === 0) {
      return res.status(404).json({ error: "Anexo de tarefa não encontrado" });
    }
    res.json({ message: "Anexo de tarefa deletado com sucesso" });
  } catch (error) {
    res.status(400).json({ error: "Erro ao deletar anexo de tarefa" });
  }
};
