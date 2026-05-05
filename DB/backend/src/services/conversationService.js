import { db } from "../db.js";
import { mapConversationDTOResponse } from "../dto/mapDTO.js";

export const getAllConversations = async () => {
  const [conversations] = await db.query("SELECT * FROM conversations");
  return conversations.map(mapConversationDTOResponse);
};

export const getConversationById = async (conversationId) => {
  const [conversations] = await db.query(
    "SELECT * FROM conversations WHERE id = ?",
    [conversationId],
  );
  return conversations[0] ? mapConversationDTOResponse(conversations[0]) : null;
};

export const createConversation = async (data) => {
  const { title } = data;
  const [result] = await db.query(
    "INSERT INTO conversations (title) VALUES (?)",
    [title],
  );
  return mapConversationDTOResponse({
    id: result.insertId,
    title,
    created_at: new Date(),
  });
};

export const updateConversation = async (id, data) => {
  const [result] = await db.query("UPDATE conversations SET ? WHERE id = ?", [
    data,
    id,
  ]);
  return result.affectedRows;
};

export const deleteConversation = async (id) => {
  const [result] = await db.query("DELETE FROM conversations WHERE id = ?", [
    id,
  ]);
  return result.affectedRows;
};
