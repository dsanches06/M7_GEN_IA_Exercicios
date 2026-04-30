import { db } from "../db.js";
import { mapPriorityDTOResponse } from "../dto/mapDTO.js";

export const getAllPriorities = async () => {
  const [priorities] = await db.query("SELECT * FROM priorities");
  return priorities.map(mapPriorityDTOResponse);
};

export const getPriorityById = async (priorityId) => {
  const [priorities] = await db.query("SELECT * FROM priorities WHERE id = ?", [priorityId]);
  return priorities.length > 0 ? mapPriorityDTOResponse(priorities[0]) : null;
};

export const createPriority = async (data) => {
  const [result] = await db.query(
    "INSERT INTO priorities (name, flow_order) VALUES (?, ?)",
    [data.name, data.flow_order ?? 0]
  );
  return mapPriorityDTOResponse({ id: result.insertId, ...data });
};

export const updatePriority = async (id, data) => {
  const [result] = await db.query("UPDATE priorities SET ? WHERE id = ?", [data, id]);
  return result.affectedRows;
};

export const deletePriority = async (id) => {
  const [result] = await db.query("DELETE FROM priorities WHERE id = ?", [id]);
  return result.affectedRows;
};


