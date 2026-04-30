import { db } from "../db.js";
import { mapProjectPermissionDTOResponse } from "../dto/mapDTO.js";

export const getAllProjectPermissions = async () => {
  const [permissions] = await db.query("SELECT * FROM project_permission");
  return permissions.map(mapProjectPermissionDTOResponse);
};
export const getProjectPermissionById = async (projectPermissionId) => {
  const [projectPermissions] = await db.query("SELECT * FROM project_permission WHERE id = ?", [projectPermissionId]);
  return projectPermissions.length > 0 ? mapProjectPermissionDTOResponse(projectPermissions[0]) : null;
};
export const createProjectPermission = async (data) => {
  const [result] = await db.query(
    "INSERT INTO project_permission (project_id, user_id, permission) VALUES (?, ?, ?)",
    [data.project_id, data.user_id, data.permission]
  );
  return mapProjectPermissionDTOResponse({ id: result.insertId, ...data });
};

export const updateProjectPermission = async (id, data) => {
  const [result] = await db.query("UPDATE project_permission SET ? WHERE id = ?", [data, id]);
  return result.affectedRows;
};

export const deleteProjectPermission = async (id) => {
  const [result] = await db.query("DELETE FROM project_permission WHERE id = ?", [id]);
  return result.affectedRows;
};


