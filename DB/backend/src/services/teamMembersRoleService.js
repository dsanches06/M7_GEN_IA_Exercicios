import { db } from "../db.js";
import { mapTeamMemberRolesDTOResponse } from "../dto/mapDTO.js";

export const getAllRoles = async () => {
  const [teamMembersRoles] = await db.query("SELECT * FROM team_members_roles");
  return teamMembersRoles.map(mapTeamMemberRolesDTOResponse);
};

export const getRoleById = async (roleId) => {
  const [teamMembersRoles] = await db.query("SELECT * FROM team_members_roles WHERE id = ?", [roleId]);
  return teamMembersRoles.length > 0 ? mapTeamMemberRolesDTOResponse(teamMembersRoles[0]) : null;
};

export const createRole = async (data) => {
  const [result] = await db.query(
    "INSERT INTO team_members_roles (name, flow_order) VALUES (?, ?)",
    [data.name, data.flow_order ?? 0]
  );
  return mapTeamMemberRolesDTOResponse({ id: result.insertId, ...data });
};

export const updateRole = async (id, data) => {
  const [result] = await db.query("UPDATE team_members_roles SET ? WHERE id = ?", [data, id]);
  return result.affectedRows;
};

export const deleteRole = async (id) => {
  const [result] = await db.query("DELETE FROM team_members_roles WHERE id = ?", [id]);
  return result.affectedRows;
};
