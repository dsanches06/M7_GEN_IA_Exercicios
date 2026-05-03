import { db } from "../db.js";
import { mapMeetingSummarieDTOResponse } from "../dto/mapDTO.js";

export const getAllMeetingSummaries = async () => {
  const [summaries] = await db.query("SELECT * FROM meeting_summaries");
  return summaries.map(mapMeetingSummarieDTOResponse);
};

export const getMeetingSummaryById = async (summaryId) => {
  const [summaries] = await db.query("SELECT * FROM meeting_summaries WHERE id = ?", [summaryId]);
  return summaries.length > 0 ? mapMeetingSummarieDTOResponse(summaries[0]) : null;
};

export const createMeetingSummary = async (data) => {
  const { project_id, original_text, summary } = data;
  const [result] = await db.query(
    "INSERT INTO meeting_summaries (project_id, original_text, summary) VALUES (?, ?, ?)",
    [project_id, original_text, summary]
  );
  return mapMeetingSummarieDTOResponse({ id: result.insertId, project_id, original_text, summary, created_at: new Date() });
};

export const updateMeetingSummary = async (id, data) => {
  const [result] = await db.query("UPDATE meeting_summaries SET ? WHERE id = ?", [data, id]);
  return result.affectedRows;
};

export const deleteMeetingSummary = async (id) => {
  const [result] = await db.query("DELETE FROM meeting_summaries WHERE id = ?", [id]);
  return result.affectedRows;
};
