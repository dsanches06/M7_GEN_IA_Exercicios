import { db } from "../db.js";
import { mapTeamDTOResponse, mapTeamStatsDTOResponse } from "../dto/mapDTO.js";

export const getAllTeams = async () => {
  const [teams] = await db.query("SELECT * FROM teams");
  return teams.map(mapTeamDTOResponse);
};

export const getTeamById = async (teamId) => {
  const [teams] = await db.query("SELECT * FROM teams WHERE id = ?", [teamId]);
  return teams.length > 0 ? mapTeamDTOResponse(teams[0]) : null;
};

export const createTeam = async (data) => {
  const [result] = await db.query(
    "INSERT INTO teams (name, description) VALUES (?, ?)",
    [data.name, data.description]
  );
  return mapTeamDTOResponse({ id: result.insertId, ...data });
};

export const updateTeam = async (id, data) => {
  const [result] = await db.query("UPDATE teams SET ? WHERE id = ?", [data, id]);
  return result.affectedRows;
};

export const deleteTeam = async (id) => {
  const [result] = await db.query("DELETE FROM teams WHERE id = ?", [id]);
  return result.affectedRows;
};

export const getTeamsStats = async () => {
  const [result] = await db.query("SELECT COUNT(*) as totalTeams FROM teams");
  return mapTeamStatsDTOResponse(result[0]);
};

export const getTeamStats = async (teamId) => {
  const [result] = await db.query(`
    SELECT COUNT(*) as totalMembers
    FROM team_members
    WHERE team_id = ?
  `, [teamId]);
  
  const stats = result[0];
  return mapTeamStatsDTOResponse(stats);
};


