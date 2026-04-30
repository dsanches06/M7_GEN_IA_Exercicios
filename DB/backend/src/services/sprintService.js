import { db } from "../db.js";
import { mapSprintDTOResponse, mapSprintStatsDTOResponse } from "../dto/mapDTO.js";

/* Função para buscar todas as sprints */
export const getAllSprints = async (search, sort) => {
  let [sprints] = await db.query("SELECT * FROM sprints");

  if (search) {
    sprints = sprints.filter(
      (s) => s.name.toLowerCase().includes(search.toLowerCase()),
    );
  }

  if (sort && (sort === "asc" || sort === "desc")) {
    sprints.sort((a, b) => {
      const nameA = a.name.toLowerCase();
      const nameB = b.name.toLowerCase();

      if (sort === "asc") {
        return nameA.localeCompare(nameB);
      } else {
        return nameB.localeCompare(nameA);
      }
    });
  }

  return sprints.map(mapSprintDTOResponse);
};

/* Função para buscar uma sprint por ID */
export const getSprintById = async (sprintId) => {
  const [sprints] = await db.query("SELECT * FROM sprints WHERE id = ?", [sprintId]);
  return sprints.length > 0 ? mapSprintDTOResponse(sprints[0]) : null;
};

/* Função para criar sprint */
export const createSprint = async (data) => {
  const [result] = await db.query(
    "INSERT INTO sprints (project_id, name, description, start_date, end_date, status_id) VALUES (?, ?, ?, ?, ?, ?)",
    [data.project_id, data.name, data.description, data.start_date, data.end_date, data.status_id],
  );
  return mapSprintDTOResponse({ id: result.insertId, ...data });
};

/* Função para atualizar sprint */
export const updateSprint = async (sprintId, data) => {
  const { project_id, name, description, start_date, end_date, status_id } = data;
  const [result] = await db.query(
    "UPDATE sprints SET project_id=?, name=?, description=?, start_date=?, end_date=?, status_id=? WHERE id=?",
    [project_id, name, description, start_date, end_date, status_id, sprintId],
  );
  return result.affectedRows;
};

/* Função para deletar sprint */
export const deleteSprint = async (sprintId) => {
  const [result] = await db.query("DELETE FROM sprints WHERE id=?", [sprintId]);
  return result.affectedRows;
};

/* Função para obter estatísticas globais de sprints */
export const getSprintsStats = async () => {
  const [result] = await db.query("SELECT COUNT(*) as totalSprints FROM sprints");
  return mapSprintStatsDTOResponse(result[0]);
};

/* Função para obter estatísticas de sprints */
export const getSprintStats = async (sprintId) => {
  const [result] = await db.query(`
    SELECT 
      COUNT(*) as totalTasks,
      COALESCE(SUM(CASE WHEN t.status_id = 4 THEN 1 ELSE 0 END), 0) as completedTasks,
      COALESCE(SUM(CASE WHEN t.status_id != 4 THEN 1 ELSE 0 END), 0) as pendingTasks
    FROM sprint_tasks st
    JOIN task t ON st.task_id = t.id
    WHERE st.sprint_id = ?
  `, [sprintId]);
  
  const stats = result[0];
  return mapSprintStatsDTOResponse(stats);
};


