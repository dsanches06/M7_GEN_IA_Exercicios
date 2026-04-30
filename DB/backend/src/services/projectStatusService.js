import { db } from "../db.js";
import { mapProjectStatusDTOResponse } from "../dto/mapDTO.js";

export const getAllProjectStatuses = async () => {
  const [statuses] = await db.query("SELECT * FROM project_status");
  return statuses.map(mapProjectStatusDTOResponse);
};
export const getProjectStatusById = async (projectStatusId) => {
  const [projectStatuses] = await db.query("SELECT * FROM project_status WHERE id = ?", [projectStatusId]);
  return projectStatuses.length > 0 ? mapProjectStatusDTOResponse(projectStatuses[0]) : null;
};
export const createProjectStatus = async (data) => {
  const [result] = await db.query(
    "INSERT INTO project_status (name, flow_order) VALUES (?, ?)",
    [data.name, data.flow_order]
  );
  return mapProjectStatusDTOResponse({ id: result.insertId, ...data });
};

export const updateProjectStatus = async (id, data) => {
  const [result] = await db.query("UPDATE project_status SET ? WHERE id = ?", [data, id]);
  return result.affectedRows;
};

export const deleteProjectStatus = async (id) => {
  const [result] = await db.query("DELETE FROM project_status WHERE id = ?", [id]);
  return result.affectedRows;
};


