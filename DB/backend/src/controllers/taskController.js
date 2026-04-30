import * as taskService from "../services/taskService.js";
import * as tagService from "../services/tagService.js";
import * as commentService from "../services/commentService.js";

/* Função para buscar tarefas */
export const getTasks = async (req, res) => {
  try {
    const { sort, search } = req.query;
    const tasks = await taskService.getAllTasks(search, sort);
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar tarefas" });
  }
};

/* Função para buscar tarefas de um projeto específico */
export const getTasksByProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { sort, search } = req.query;
    const tasks = await taskService.getTasksByProjectId(
      Number(projectId),
      search,
      sort,
    );
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar tarefas do projeto" });
  }
};

/* Função para buscar tarefa por ID */
export const getTaskById = async (req, res) => {
  try {
    const task = await taskService.getTaskById(Number(req.params.id));
    if (!task) {
      return res.status(404).json({ error: "Tarefa não encontrada" });
    }
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar tarefa" });
  }
};

/* Função para criar tarefa */
export const createTask = async (req, res) => {
  try {
    const task = await taskService.createTask(req.body);
    res.status(201).json(task);
  } catch (error) {
    res.status(400).json({ error: "Erro ao criar tarefa" });
  }
};

/* Função para atualizar tarefa */
export const updateTask = async (req, res) => {
  try {
    const result = await taskService.updateTask(
      Number(req.params.id),
      req.body,
    );
    if (result === 0) {
      return res
        .status(404)
        .json({ message: "Tarefa não encontrada ou sem alterações" });
    }
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: "Erro ao atualizar tarefa" });
  }
};

/* Função para atualizar parcialmente tarefa (PATCH) - para datas, descrição, etc */
export const partialUpdateTask = async (req, res) => {
  try {
    const result = await taskService.updateTask(
      Number(req.params.id),
      req.body,
    );
    if (result === 0) {
      return res.status(404).json({ error: "Tarefa não encontrada" });
    }
    res.json({ message: "Tarefa atualizada com sucesso" });
  } catch (error) {
    res.status(400).json({ error: "Erro ao atualizar tarefa" });
  }
};

/* Função para marcar tarefa como concluída */
export const updateStatus = async (req, res) => {
  try {
    const task = await taskService.updateStatus(
      Number(req.params.id),
      req.body,
    );
    res.json({ message: "Status da tarefa atualizado com sucesso", task });
  } catch (error) {
    res.status(400).json({
      error: `Erro ao atualizar status da tarefa: ${error.message}`,
    });
  }
};

/* Função para deletar tarefa */
export const deleteTask = async (req, res) => {
  try {
    await taskService.deleteTask(Number(req.params.id));
    res.status(200).json({ message: "Tarefa deletada com sucesso" });
  } catch (error) {
    res
      .status(404)
      .json({ message: `Erro ao deletar tarefa: ${error.message}` });
  }
};

/* Função para buscar estatísticas das tarefas */
export const getStats = async (req, res) => {
  try {
    const stats = await taskService.getTaskStats();
    res.json(stats);
  } catch (error) {
    res
      .status(500)
      .json({ message: `Erro ao buscar estatísticas: ${error.message}` });
  }
};

/* Função para adicionar etiqueta à tarefa */
export const addTagToTask = async (req, res) => {
  try {
    const taskId = Number(req.params.id);
    const tagId = Number(req.body?.tagId || 0);

    const relation = await taskService.addTagToTask(taskId, tagId);
    res.status(201).json(relation);
  } catch (error) {
    res.status(400).json({
      message: `Erro ao adicionar etiqueta à tarefa: ${error.message}`,
    });
  }
};

/* Função para remover etiqueta da tarefa */
export const removeTagFromTask = async (req, res) => {
  try {
    const taskId = Number(req.params.id);
    const tagId = Number(req.params.tagId);

    if (!tagId) {
      return res
        .status(400)
        .json({ message: "O ID da etiqueta é obrigatório" });
    }

    const relation = await taskService.removeTagFromTask(taskId, tagId);
    res
      .status(200)
      .json({ message: "Etiqueta removida da tarefa com sucesso", relation });
  } catch (error) {
    res.status(400).json({
      message: `Erro ao remover etiqueta da tarefa: ${error.message}`,
    });
  }
};

/* Função para buscar etiquetas da tarefa */
export const getTaskTags = async (req, res) => {
  try {
    const taskId = Number(req.params.id);
    const tags = await taskService.getTagsByTaskId(taskId);

    const tagDetails = await Promise.all(
      tags.map((relation) => tagService.getTagById(relation.tag_id)),
    );
    res.json(tagDetails);
  } catch (error) {
    res.status(500).json({
      message: `Erro ao buscar etiquetas da tarefa: ${error.message}`,
    });
  }
};

/* Função para criar comentário */
export const createComment = async (req, res) => {
  try {
    const taskId = Number(req.params.id);

    if (!req.body.content || req.body.content.trim().length === 0) {
      return res
        .status(400)
        .json({ message: "O conteúdo do comentário não pode estar vazio" });
    }

    if (!req.body.userId) {
      return res.status(400).json({ message: "userId é obrigatório" });
    }

    const comment = await commentService.createComment(taskId, req.body);
    res.status(201).json(comment);
  } catch (error) {
    res
      .status(400)
      .json({ message: `Erro ao criar comentário: ${error.message}` });
  }
};

/* Função para buscar comentários */
export const getComments = async (req, res) => {
  try {
    const taskId = Number(req.params.id);
    const comments = await commentService.getCommentsByTaskId(taskId);
    res.json(comments);
  } catch (error) {
    res
      .status(500)
      .json({ message: `Erro ao buscar comentários: ${error.message}` });
  }
};

/* Função para deletar comentário */
export const deleteComment = async (req, res) => {
  try {
    const commentId = Number(req.params.commentId);
    const comment = await commentService.deleteComment(commentId);
    res.json({ message: "Comentário deletado com sucesso", comment });
  } catch (error) {
    res
      .status(404)
      .json({ message: `Erro ao deletar comentário: ${error.message}` });
  }
};

/* Função para marcar comentário como resolvido */
export const resolveComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    let { resolved } = req.body;

    if (!commentId) {
      return res
        .status(400)
        .json({ message: "O ID do comentário é obrigatório" });
    }

    if (resolved === undefined || resolved === null) {
      return res
        .status(400)
        .json({ message: "O campo 'resolved' é obrigatório" });
    }

    // Convert various formats to boolean
    if (typeof resolved === "string") {
      resolved = resolved.toLowerCase() === "true" || resolved === "1";
    } else if (typeof resolved === "number") {
      resolved = Boolean(resolved);
    } else if (typeof resolved !== "boolean") {
      return res
        .status(400)
        .json({ message: "O campo 'resolved' deve ser um booleano válido" });
    }

    const comment = await commentService.resolveComment(
      Number(commentId),
      resolved,
    );
    res.json({
      message: `Comentário marcado como ${resolved ? "resolvido" : "não resolvido"}`,
      comment,
    });
  } catch (error) {
    res
      .status(400)
      .json({ message: `Erro ao resolver comentário: ${error.message}` });
  }
};

/* Função para atualizar comentário */
export const updateComment = async (req, res) => {
  try {
    console.log("[DEBUG] updateComment called with params:", req.params);
    console.log("[DEBUG] updateComment body:", req.body);
    const { commentId } = req.params;
    const { content } = req.body;
    if (!commentId) {
      return res
        .status(400)
        .json({ message: "O ID do comentário é obrigatório" });
    }
    if (!content || content.trim().length === 0) {
      return res
        .status(400)
        .json({ message: "O conteúdo do comentário não pode estar vazio" });
    }

    const comment = await commentService.updateComment(
      Number(commentId),
      content.trim(),
    );
    res.json({ message: "Comentário atualizado com sucesso", comment });
  } catch (error) {
    console.error("[DEBUG] updateComment error:", error.message);
    res
      .status(400)
      .json({ message: `Erro ao atualizar comentário: ${error.message}` });
  }
};
