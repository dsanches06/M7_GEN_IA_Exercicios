import { db } from "../db.js";
import { mapMeetingSummaryDTOResponse } from "../dto/mapDTO.js";

export const getAllMeetingSummaries = async () => {
  const [summaries] = await db.query("SELECT * FROM meeting_summaries");
  return summaries.map(mapMeetingSummaryDTOResponse);
};

export const getMeetingSummaryById = async (summaryId) => {
  const [summaries] = await db.query(
    "SELECT * FROM meeting_summaries WHERE id = ?",
    [summaryId],
  );
  return summaries[0] ? mapMeetingSummaryDTOResponse(summaries[0]) : null;
};

export const createMeetingSummary = async (data) => {
  const [result] = await db.query(
    "INSERT INTO meeting_summaries (project_id, original_text, summary) VALUES (?, ?, ?)",
    [data.project_id, data.original_text, data.summary],
  );
  return mapMeetingSummaryDTOResponse({
    id: result.insertId,
    ...data,
  });
};

export const updateMeetingSummary = async (id, data) => {
  const [result] = await db.query(
    "UPDATE meeting_summaries SET ? WHERE id = ?",
    [data, id],
  );
  return result.affectedRows;
};

export const deleteMeetingSummary = async (id) => {
  const [result] = await db.query(
    "DELETE FROM meeting_summaries WHERE id = ?",
    [id],
  );
  return result.affectedRows;
};
