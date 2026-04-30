import { db } from "../db.js";
import { mapTagTaskDTOResponse } from "../dto/mapDTO.js";

export const getAllTagTasks = async () => {
  const [tagTasks] = await db.query("SELECT * FROM tags_task");
  return tagTasks.map(mapTagTaskDTOResponse);
};

export const getTagTaskById = async (tagTaskId) => {
  const [tagTasks] = await db.query("SELECT * FROM tags_task WHERE task_id = ?", [tagTaskId]);
  return tagTasks.length > 0 ? mapTagTaskDTOResponse(tagTasks[0]) : null;
};

export const createTagTask = async (data) => {
  const [result] = await db.query(
    "INSERT INTO tags_task (task_id, tag_id) VALUES (?, ?)",
    [data.task_id, data.tag_id]
  );
  return mapTagTaskDTOResponse({ id: result.insertId, ...data });
};

export const updateTagTask = async (id, data) => {
  const [result] = await db.query("UPDATE tags_task SET ? WHERE task_id = ?", [data, id]);
  return result.affectedRows;
};

export const deleteTagTask = async (id) => {
  const [result] = await db.query("DELETE FROM tags_task WHERE task_id = ?", [id]);
  return result.affectedRows;
};


