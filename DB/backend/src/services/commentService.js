import { db } from "../db.js";
import { mapTaskCommentDTOResponse } from "../dto/mapDTO.js";
import * as taskService from "./taskService.js";
import * as userService from "./userService.js";

/* Função para buscar comentários de uma tarefa */
export const getCommentsByTaskId = async (taskId) => {
  const [comments] = await db.query(
    "SELECT * FROM comment WHERE task_id = ? ORDER BY created_at DESC",
    [taskId],
  );
  return comments.map(mapTaskCommentDTOResponse);
};

/* Função para criar comentário */
export const createComment = async (taskId, data) => {
  const task = await taskService.getTaskById(taskId);
  if (!task) {
    throw new Error("Task not found");
  }

  const user = await userService.getUserById(Number(data.userId));
  if (!user) {
    throw new Error("User not found");
  }

  const now = new Date();
  const mysqlDateTime = now.toISOString().slice(0, 19).replace("T", " ");

  const [result] = await db.query(
    "INSERT INTO comment (task_id, user_id, content, created_at) VALUES (?, ?, ?, ?)",
    [taskId, data.userId, data.content.trim(), mysqlDateTime],
  );

  return mapTaskCommentDTOResponse({
    id: result.insertId,
    task_id: taskId,
    user_id: data.userId,
    content: data.content.trim(),
    created_at: mysqlDateTime,
  });
};

/* Função para deletar comentário */
export const deleteComment = async (commentId) => {
  const [result] = await db.query("DELETE FROM comment WHERE id = ?", [
    commentId,
  ]);
  return result.affectedRows;
};

/* Função para marcar comentário como resolvido */
export const resolveComment = async (commentId, resolved) => {
  const [result] = await db.query(
    "UPDATE comment SET resolved = ? WHERE id = ?",
    [resolved ? 1 : 0, commentId],
  );

  if (result.affectedRows === 0) {
    throw new Error("Comentário não encontrado");
  }

  const [updated] = await db.query("SELECT * FROM comment WHERE id = ?", [
    commentId,
  ]);

  return updated[0];
};

/* Função para atualizar comentário */
export const updateComment = async (commentId, content) => {
  const now = new Date();
  const editDate = now.toISOString().slice(0, 19).replace("T", " ");

  const [result] = await db.query(
    "UPDATE comment SET content = ?, edited_at = ? WHERE id = ?",
    [content, editDate, commentId],
  );

  if (result.affectedRows === 0) {
    throw new Error("Comentário não encontrado");
  }

  const [updated] = await db.query("SELECT * FROM comment WHERE id = ?", [
    commentId,
  ]);

  return updated[0];
};

/* Função para buscar TODOS os comentários */
export const getAllComments = async () => {
  const [comments] = await db.query(
    "SELECT content FROM comment ORDER BY created_at DESC"
  );
  return comments.map(c => c.content);
};


