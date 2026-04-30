import { db } from "../db.js";
import { mapMentionDTOResponse } from "../dto/mapDTO.js";

export const getAllMentions = async () => {
  const [mentions] = await db.query("SELECT * FROM mentions");
  return mentions.map(mapMentionDTOResponse);
};

export const getMentionById = async (mentionId) => {
  const [mentions] = await db.query("SELECT * FROM mentions WHERE id = ?", [mentionId]);
  return mentions.length > 0 ? mapMentionDTOResponse(mentions[0]) : null;
};

export const createMention = async (data) => {
  const [result] = await db.query(
    "INSERT INTO mentions (comment_id, mentioned_user_id) VALUES (?, ?)",
    [data.comment_id, data.mentioned_user_id]
  );
  return mapMentionDTOResponse({ id: result.insertId, ...data });
};

export const updateMention = async (id, data) => {
  const [result] = await db.query("UPDATE mentions SET ? WHERE id = ?", [data, id]);
  return result.affectedRows;
};

export const deleteMention = async (id) => {
  const [result] = await db.query("DELETE FROM mentions WHERE id = ?", [id]);
  return result.affectedRows;
};


