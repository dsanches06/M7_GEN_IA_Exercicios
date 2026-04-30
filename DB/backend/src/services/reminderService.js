import { db } from "../db.js";
import { mapReminderDTOResponse } from "../dto/mapDTO.js";

export const getAllReminders = async () => {
  const [reminders] = await db.query("SELECT * FROM reminder");
  return reminders.map(mapReminderDTOResponse);
};

export const getReminderById = async (reminderId) => {
  const [reminders] = await db.query("SELECT * FROM reminder WHERE id = ?", [reminderId]);
  return reminders.length > 0 ? mapReminderDTOResponse(reminders[0]) : null;
};

export const createReminder = async (data) => {
  const [result] = await db.query(
    "INSERT INTO reminder (task_id, user_id, remind_at) VALUES (?, ?, ?)",
    [data.task_id, data.user_id || null, data.remind_at]
  );
  return mapReminderDTOResponse({ id: result.insertId, ...data });
};

export const updateReminder = async (id, data) => {
  const [result] = await db.query("UPDATE reminder SET ? WHERE id = ?", [data, id]);
  return result.affectedRows;
};

export const deleteReminder = async (id) => {
  const [result] = await db.query("DELETE FROM reminder WHERE id = ?", [id]);
  return result.affectedRows;
};


