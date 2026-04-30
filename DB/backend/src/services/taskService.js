import { db } from "../db.js";
import { mapTaskDTOResponse, mapTaskStatsDTOResponse } from "../dto/mapDTO.js";

/* Função para buscar todas as tarefas */
export const getAllTasks = async (search, sort) => {
  let query =
    "SELECT t.*, ta.user_id AS assigned_to FROM task t LEFT JOIN task_assignees ta ON t.id = ta.task_id";
  const params = [];

  if (search) {
    query += " WHERE (t.title LIKE ? OR t.description LIKE ?)";
    const searchTerm = `%${search}%`;
    params.push(searchTerm, searchTerm);
  }

  if (sort && (sort === "asc" || sort === "desc")) {
    query += ` ORDER BY title ${sort.toUpperCase()}`;
  }

  const [tasks] = await db.query(query, params);
  return tasks.map(mapTaskDTOResponse);
};

/* Função para buscar tarefas de um projeto específico */
export const getTasksByProjectId = async (projectId, search, sort) => {
  let query =
    "SELECT t.*, ta.user_id AS assigned_to FROM task t LEFT JOIN task_assignees ta ON t.id = ta.task_id WHERE t.project_id = ?";
  const params = [projectId];

  if (search) {
    query += " AND (t.title LIKE ? OR t.description LIKE ?)";
    const searchTerm = `%${search}%`;
    params.push(searchTerm, searchTerm);
  }

  if (sort && (sort === "asc" || sort === "desc")) {
    query += ` ORDER BY t.title ${sort.toUpperCase()}`;
  }

  const [tasks] = await db.query(query, params);
  return tasks.map(mapTaskDTOResponse);
};

/* Função para criar tarefa */
export const createTask = async (data) => {
  const [result] = await db.query(
    "INSERT INTO task (title, description, types_id, status_id, priority_id, category_id, project_id, estimated_hours, due_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
    [
      data.title,
      data.description,
      data.types_id,
      data.status_id,
      data.priority_id,
      data.category_id,
      data.project_id,
      data.estimated_hours,
      data.due_date || null,
    ],
  );
  return mapTaskDTOResponse({ id: result.insertId, ...data });
};

/* Função para alterar o status da tarefa */
export const updateStatus = async (taskId, data) => {
  const [result] = await db.query(
    "UPDATE task SET status_id = ? WHERE id = ?",
    [data.status_id, taskId],
  );
  return result.affectedRows;
};

/* Função para atualizar tarefa */
export const updateTask = async (taskId, data) => {
  // Constrói a query dinamicamente apenas com os campos fornecidos
  const fieldsToUpdate = [];
  const values = [];

  if (data.title !== undefined) {
    fieldsToUpdate.push("title = ?");
    values.push(data.title);
  }
  if (data.description !== undefined) {
    fieldsToUpdate.push("description = ?");
    values.push(data.description);
  }
  if (data.status_id !== undefined) {
    fieldsToUpdate.push("status_id = ?");
    values.push(data.status_id);
  }
  if (data.priority_id !== undefined) {
    fieldsToUpdate.push("priority_id = ?");
    values.push(data.priority_id);
  }
  if (data.category_id !== undefined) {
    fieldsToUpdate.push("category_id = ?");
    values.push(data.category_id);
  }
  if (data.types_id !== undefined) {
    fieldsToUpdate.push("types_id = ?");
    values.push(data.types_id);
  }
  if (data.estimated_hours !== undefined) {
    fieldsToUpdate.push("estimated_hours = ?");
    values.push(data.estimated_hours);
  }
  if (data.due_date !== undefined) {
    fieldsToUpdate.push("due_date = ?");
    values.push(data.due_date);
  }
  if (data.completed_at !== undefined) {
    fieldsToUpdate.push("completed_at = ?");
    values.push(data.completed_at);
  }

  values.push(taskId);

  const [result] = await db.query(
    `UPDATE task SET ${fieldsToUpdate.join(", ")} WHERE id = ?`,
    values,
  );
  return result.affectedRows;
};

/* Função para deletar tarefa */
export const deleteTask = async (taskId) => {
  const [result] = await db.query("DELETE FROM task WHERE id=?", [taskId]);
  return result.affectedRows;
};

/* Função para buscar tarefa por ID */
export const getTaskById = async (taskId) => {
  const [tasks] = await db.query(
    "SELECT t.*, ta.user_id AS assigned_to FROM task t LEFT JOIN task_assignees ta ON t.id = ta.task_id WHERE t.id = ?",
    [taskId],
  );
  return tasks[0] ? mapTaskDTOResponse(tasks[0]) : null;
};

/* Função para adicionar etiqueta à tarefa */
export const addTagToTask = async (taskId, tagId) => {
  // Valida inputs
  if (!taskId || taskId <= 0) {
    throw new Error(`Tarefa ID inválida: ${taskId}`);
  }
  if (!tagId || tagId <= 0) {
    throw new Error(`Etiqueta ID inválida ou não fornecida: ${tagId}`);
  }

  // Valida se a tarefa existe
  const task = await getTaskById(taskId);
  if (!task) {
    throw new Error(`Tarefa com ID ${taskId} não encontrada`);
  }

  // Verifica se a tag já está associada
  const [existing] = await db.query(
    "SELECT * FROM tags_task WHERE task_id = ? AND tag_id = ?",
    [taskId, tagId],
  );

  if (existing && existing.length > 0) {
    throw new Error("Etiqueta já associada à tarefa");
  }

  // Insere a relação
  const [result] = await db.query(
    "INSERT INTO tags_task (task_id, tag_id) VALUES (?, ?)",
    [taskId, tagId],
  );

  return { taskId, tagId, relationId: result.insertId };
};

/* Função para remover etiqueta da tarefa */
export const removeTagFromTask = async (taskId, tagId) => {
  const [result] = await db.query(
    "DELETE FROM tags_task WHERE task_id = ? AND tag_id = ?",
    [taskId, tagId],
  );
  return result.affectedRows;
};

/* Função para buscar etiquetas da tarefa */
export const getTagsByTaskId = async (taskId) => {
  const [relations] = await db.query(
    "SELECT * FROM tags_task WHERE task_id = ?",
    [taskId],
  );
  return relations;
};

export const getTasksByTagId = async (tagId) => {
  const [tasks] = await db.query(
    "SELECT t.* FROM task t INNER JOIN tags_task tt ON t.id = tt.task_id WHERE tt.tag_id = ?",
    [tagId],
  );
  return tasks.map(mapTaskDTOResponse);
};

/* Função para remover etiqueta de todas as tarefas */
export const removeTagFromAllTasks = async (tagId) => {
  const [result] = await db.query("DELETE FROM tags_task WHERE tag_id = ?", [
    tagId,
  ]);
  return result.affectedRows;
};

/* Função para buscar estatísticas das tarefas */
export const getTaskStats = async () => {
  const [result] = await db.query("SELECT COUNT(*) as totalTasks FROM task");
  const totalTasks = result[0].totalTasks;

  const [completedResult] = await db.query(
    "SELECT COUNT(*) as completedTasks FROM task WHERE completed_at IS NOT NULL",
  );
  const completedTasks = completedResult[0].completedTasks;

  const pendingTasks = totalTasks - completedTasks;
  const completedPercentage =
    totalTasks > 0 ? ((completedTasks / totalTasks) * 100).toFixed(2) : "0.00";

  return mapTaskStatsDTOResponse({
    totalTasks,
    completedTasks,
    pendingTasks,
    completedPercentage: completedPercentage + "%",
  });
};
