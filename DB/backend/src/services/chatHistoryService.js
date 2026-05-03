import { db } from "../db.js";
import { mapChatHistoryDTOResponse } from "../dto/mapDTO.js";

export const getAllChatHistory = async () => {
  const [chatHistory] = await db.query("SELECT * FROM chat_history");
  return chatHistory.map(mapChatHistoryDTOResponse);
};

export const getChatHistoryById = async (chatHistoryId) => {
  const [chatHistories] = await db.query("SELECT * FROM chat_history WHERE id = ?", [chatHistoryId]);
  return chatHistories.length > 0 ? mapChatHistoryDTOResponse(chatHistories[0]) : null;
};

export const createChatHistory = async (data) => {
  const { conversation_id, role_id, content } = data;
  const [result] = await db.query(
    "INSERT INTO chat_history (conversation_id, role_id, content) VALUES (?, ?, ?)",
    [conversation_id, role_id, content]
  );
  return mapChatHistoryDTOResponse({ id: result.insertId, conversation_id, role_id, content, sent_at: new Date() });
};

export const updateChatHistory = async (id, data) => {
  const [result] = await db.query("UPDATE chat_history SET ? WHERE id = ?", [data, id]);
  return result.affectedRows;
};

export const deleteChatHistory = async (id) => {
  const [result] = await db.query("DELETE FROM chat_history WHERE id = ?", [id]);
  return result.affectedRows;
};
