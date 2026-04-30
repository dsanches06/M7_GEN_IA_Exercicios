import { db } from "../db.js";
import { mapTaskStatusDTOResponse } from "../dto/mapDTO.js";

export const getAllTaskStatuses = async () => {
  const [statuses] = await db.query("SELECT * FROM task_status");
  return statuses.map(mapTaskStatusDTOResponse);
};
export const getTaskStatusById = async (taskStatusId) => {
  const [taskStatuses] = await db.query(
    "SELECT * FROM task_status WHERE id = ?",
    [taskStatusId],
  );
  return taskStatuses.length > 0
    ? mapTaskStatusDTOResponse(taskStatuses[0])
    : null;
};
export const createTaskStatus = async (data) => {
  const [result] = await db.query(
    "INSERT INTO task_status (name, flow_order) VALUES (?, ?)",
    [data.name, data.flow_order ?? 0],
  );
  return mapTaskStatusDTOResponse({ id: result.insertId, ...data });
};

export const updateTaskStatus = async (id, data) => {
  const [result] = await db.query("UPDATE task_status SET ? WHERE id = ?", [
    data,
    id,
  ]);
  return result.affectedRows;
};

export const deleteTaskStatus = async (id) => {
  const [result] = await db.query("DELETE FROM task_status WHERE id = ?", [id]);
  return result.affectedRows;
};
