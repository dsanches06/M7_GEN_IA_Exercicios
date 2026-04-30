import { db } from "../db.js";
import { mapTeamMemberDTOResponse } from "../dto/mapDTO.js";

export const getAllTeamMembers = async () => {
  const [members] = await db.query("SELECT * FROM team_members");
  return members.map(mapTeamMemberDTOResponse);
};
export const getTeamMemberById = async (teamMemberId) => {
  const [teamMembers] = await db.query("SELECT * FROM team_members WHERE id = ?", [teamMemberId]);
  return teamMembers.length > 0 ? mapTeamMemberDTOResponse(teamMembers[0]) : null;
};
export const createTeamMember = async (data) => {
  const [result] = await db.query(
    "INSERT INTO team_members (team_id, user_id, role_id) VALUES (?, ?, ?)",
    [data.team_id, data.user_id, data.role_id]
  );
  return mapTeamMemberDTOResponse({ id: result.insertId, ...data });
};

export const updateTeamMember = async (id, data) => {
  const [result] = await db.query("UPDATE team_members SET ? WHERE id = ?", [data, id]);
  return result.affectedRows;
};

export const deleteTeamMember = async (team_id, user_id) => {
  const [result] = await db.query("DELETE FROM team_members WHERE team_id = ? AND user_id = ?", [team_id, user_id]);
  return result.affectedRows;
};


