import { db } from "../db.js";
import { mapTaskVoteDTOResponse } from "../dto/mapDTO.js";

export const getAllTaskVotes = async () => {
  const [votes] = await db.query("SELECT * FROM task_vote");
  return votes.map(mapTaskVoteDTOResponse);
};
export const getTaskVoteById = async (taskVoteId) => {
  const [taskVotes] = await db.query("SELECT * FROM task_vote WHERE id = ?", [taskVoteId]);
  return taskVotes.length > 0 ? mapTaskVoteDTOResponse(taskVotes[0]) : null;
};
export const createTaskVote = async (data) => {
  const [result] = await db.query(
    "INSERT INTO task_vote (task_id, user_id, vote_type) VALUES (?, ?, ?)",
    [data.task_id, data.user_id, data.vote_type]
  );
  return mapTaskVoteDTOResponse({ id: result.insertId, ...data });
};

export const updateTaskVote = async (id, data) => {
  const [result] = await db.query("UPDATE task_vote SET ? WHERE id = ?", [data, id]);
  return result.affectedRows;
};

export const deleteTaskVote = async (id) => {
  const [result] = await db.query("DELETE FROM task_vote WHERE id = ?", [id]);
  return result.affectedRows;
};


