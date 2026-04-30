import { db } from "../db.js";
import { mapTaskAttachmentDTOResponse } from "../dto/mapDTO.js";

export const getAllTaskAttachments = async () => {
  const [attachments] = await db.query("SELECT * FROM task_attachment");
  return attachments.map(mapTaskAttachmentDTOResponse);
};
export const getTaskAttachmentById = async (taskAttachmentId) => {
  const [taskAttachments] = await db.query("SELECT * FROM task_attachment WHERE id = ?", [taskAttachmentId]);
  return taskAttachments.length > 0 ? mapTaskAttachmentDTOResponse(taskAttachments[0]) : null;
};
export const createTaskAttachment = async (data) => {
  const [result] = await db.query(
    "INSERT INTO task_attachment (task_id, file_name, file_path) VALUES (?, ?, ?)",
    [data.task_id, data.file_name, data.file_path]
  );
  return mapTaskAttachmentDTOResponse({ id: result.insertId, ...data });
};

export const updateTaskAttachment = async (id, data) => {
  const [result] = await db.query("UPDATE task_attachment SET ? WHERE id = ?", [data, id]);
  return result.affectedRows;
};

export const deleteTaskAttachment = async (id) => {
  const [result] = await db.query("DELETE FROM task_attachment WHERE id = ?", [id]);
  return result.affectedRows;
};


