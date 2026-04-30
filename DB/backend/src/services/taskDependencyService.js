import { db } from "../db.js";
import { mapTaskDependencyDTOResponse } from "../dto/mapDTO.js";

export const getAllTaskDependencies = async () => {
  const [dependencies] = await db.query("SELECT * FROM task_dependency");
  return dependencies.map(mapTaskDependencyDTOResponse);
};
export const getTaskDependencyById = async (taskDependencyId) => {
  const [taskDependencies] = await db.query("SELECT * FROM task_dependency WHERE id = ?", [taskDependencyId]);
  return taskDependencies.length > 0 ? mapTaskDependencyDTOResponse(taskDependencies[0]) : null;
};
export const createTaskDependency = async (data) => {
  const [result] = await db.query(
    "INSERT INTO task_dependency (task_id, depends_on_task_id) VALUES (?, ?)",
    [data.task_id, data.depends_on_task_id]
  );
  return mapTaskDependencyDTOResponse({ id: result.insertId, ...data });
};

export const updateTaskDependency = async (id, data) => {
  const [result] = await db.query("UPDATE task_dependency SET ? WHERE id = ?", [data, id]);
  return result.affectedRows;
};

export const deleteTaskDependency = async (id) => {
  const [result] = await db.query("DELETE FROM task_dependency WHERE id = ?", [id]);
  return result.affectedRows;
};


