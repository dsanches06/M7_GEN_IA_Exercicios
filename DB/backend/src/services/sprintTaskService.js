import { db } from "../db.js";
import { mapSprintTaskDTOResponse } from "../dto/mapDTO.js";

export const getAllSprintTasks = async () => {
  const [tasks] = await db.query("SELECT * FROM sprint_tasks");
  return tasks.map(mapSprintTaskDTOResponse);
};

export const getSprintTasksBySprint = async (sprintId) => {
  const [tasks] = await db.query(
    "SELECT * FROM sprint_tasks WHERE sprint_id = ?",
    [sprintId]
  );
  return tasks.map(mapSprintTaskDTOResponse);
};

export const getSprintTaskById = async (sprintTaskId) => {
  const [sprintTasks] = await db.query(
    "SELECT * FROM sprint_tasks WHERE sprint_id = ? OR task_id = ? LIMIT 1",
    [sprintTaskId, sprintTaskId],
  );
  return sprintTasks.length > 0 ? mapSprintTaskDTOResponse(sprintTasks[0]) : null;
};
export const createSprintTask = async (data) => {
  await db.query(
    "INSERT INTO sprint_tasks (sprint_id, task_id) VALUES (?, ?)",
    [data.sprint_id, data.task_id],
  );
  return mapSprintTaskDTOResponse(data);
};

export const updateSprintTask = async (id, data) => {
  const [result] = await db.query("UPDATE sprint_tasks SET ? WHERE id = ?", [data, id]);
  return result.affectedRows;
};

export const deleteSprintTask = async (sprintId, taskId) => {
  const [result] = await db.query("DELETE FROM sprint_tasks WHERE sprint_id = ? AND task_id = ?", [sprintId, taskId]);
  return result.affectedRows;
};


