import { db } from "../db.js";
import { mapTaskAssigneeDTOResponse } from "../dto/mapDTO.js";

export const getAllTaskAssignees = async () => {
  const [assignees] = await db.query("SELECT * FROM task_assignees");
  return assignees.map(mapTaskAssigneeDTOResponse);
};

export const getTaskAssigneeById = async (id) => {
  const [assignees] = await db.query("SELECT * FROM task_assignees WHERE id = ?", [id]);
  return assignees.length > 0 ? mapTaskAssigneeDTOResponse(assignees[0]) : null;
};

export const getTaskAssigneeByUserId = async (userId) => {
  const [assignees] = await db.query("SELECT * FROM task_assignees WHERE user_id = ?", [userId]);
  return assignees.map(mapTaskAssigneeDTOResponse);
};

export const createTaskAssignee = async (data) => {
  const [existing] = await db.query(
    "SELECT * FROM task_assignees WHERE task_id = ?",
    [data.task_id]
  );

  if (existing.length > 0) {
    throw new Error("Esta tarefa já está atribuída a outro utilizador.");
  }

  const [result] = await db.query(
    "INSERT INTO task_assignees (task_id, user_id) VALUES (?, ?)",
    [data.task_id, data.user_id]
  );

  return mapTaskAssigneeDTOResponse({ id: result.insertId, ...data });
};

export const updateTaskAssignee = async (id, data) => {
  const [result] = await db.query("UPDATE task_assignees SET ? WHERE id = ?", [data, id]);
  return result.affectedRows;
};

export const deleteTaskAssignee = async (id) => {
  const [result] = await db.query("DELETE FROM task_assignees WHERE id = ?", [id]);
  return result.affectedRows;
};


