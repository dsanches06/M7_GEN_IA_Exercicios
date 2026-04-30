import { db } from "../db.js";
import { mapTaskTypesDTOResponse } from "../dto/mapDTO.js";

export const getAllTaskTypes = async () => {
  const [taskTypes] = await db.query("SELECT * FROM task_types");
  return taskTypes.map(mapTaskTypesDTOResponse);
};

export const getTaskTypeById = async (taskTypeId) => {
  const [taskTypes] = await db.query("SELECT * FROM task_types WHERE id = ?", [taskTypeId]);
  return taskTypes.length > 0 ? mapTaskTypesDTOResponse(taskTypes[0]) : null;
};

export const createTaskType = async (data) => {
  const [result] = await db.query(
    "INSERT INTO task_types (name, flow_order) VALUES (?, ?)",
    [data.name, data.flow_order ?? 0],
  );
  return mapTaskTypesDTOResponse({ id: result.insertId, ...data });
};

export const updateTaskType = async (id, data) => {
  const [result] = await db.query("UPDATE task_types SET ? WHERE id = ?", [data, id]);
  return result.affectedRows;
};

export const deleteTaskType = async (id) => {
  const [result] = await db.query("DELETE FROM task_types WHERE id = ?", [id]);
  return result.affectedRows;
};
