import { db } from "../db.js";
import { mapChatHistoryDTOResponse } from "../dto/mapDTO.js";

export const getAllChatHistory = async () => {
  const [chatHistory] = await db.query("SELECT * FROM chat_history");
  return chatHistory.map(mapChatHistoryDTOResponse);
};

export const getChatMessageById = async (chatMessageId) => {
  const [chatMessages] = await db.query("SELECT * FROM chat_history WHERE id = ?", [chatMessageId]);
  return chatMessages.length > 0 ? mapChatHistoryDTOResponse(chatMessages[0]) : null;
};

export const createChatMessage = async (data) => {
  const { conversation_id, role_id, content } = data;
  const [result] = await db.query(
    "INSERT INTO chat_history (conversation_id, role_id, content) VALUES (?, ?, ?)",
    [conversation_id, role_id, content]
  );
  return mapChatHistoryDTOResponse({ id: result.insertId, conversation_id, role_id, content, sent_at: new Date() });
};

export const updateChatMessage = async (id, data) => {
  const [result] = await db.query("UPDATE chat_history SET ? WHERE id = ?", [data, id]);
  return result.affectedRows;
};

export const deleteChatMessage = async (id) => {
  const [result] = await db.query("DELETE FROM chat_history WHERE id = ?", [id]);
  return result.affectedRows;
};
