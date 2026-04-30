import { db } from "../db.js";
import { mapProjectDTOResponse, mapProjectStatsDTOResponse } from "../dto/mapDTO.js";

/* Função para buscar todos os projetos */
export const getAllProjects = async (search, sort) => {
  let query = "SELECT * FROM project";
  const params = [];

  if (search) {
    query += " WHERE (name LIKE ? OR description LIKE ?)";
    const searchTerm = `%${search}%`;
    params.push(searchTerm, searchTerm);
  }

  if (sort && (sort === "asc" || sort === "desc")) {
    query += ` ORDER BY name ${sort.toUpperCase()}`;
  }

  const [projects] = await db.query(query, params);
  return projects.map(mapProjectDTOResponse);
};

/* Função para buscar um projeto por ID */
export const getProjectById = async (projectId) => {
  const [projects] = await db.query("SELECT * FROM project WHERE id = ?", [projectId]);
  return projects.length > 0 ? mapProjectDTOResponse(projects[0]) : null;
};

/* Função para criar novo projeto */
export const createProject = async (data) => {
  const [result] = await db.query(
    "INSERT INTO project (name, description, start_date, end_date_expected) VALUES (?, ?, ?, ?)",
    [data.name, data.description, data.start_date, data.end_date_expected],
  );
  return mapProjectDTOResponse({ id: result.insertId, ...data });
};

/* Função para atualizar projeto */
export const updateProject = async (projectId, data) => {
  // Constrói a query dinamicamente apenas com os campos fornecidos
  const fieldsToUpdate = [];
  const values = [];

  if (data.name !== undefined) {
    fieldsToUpdate.push("name = ?");
    values.push(data.name);
  }
  if (data.description !== undefined) {
    fieldsToUpdate.push("description = ?");
    values.push(data.description);
  }
  if (data.project_status_id !== undefined) {
    fieldsToUpdate.push("project_status_id = ?");
    values.push(data.project_status_id);
  }
  if (data.start_date !== undefined) {
    fieldsToUpdate.push("start_date = ?");
    values.push(data.start_date);
  }
  if (data.end_date_expected !== undefined) {
    fieldsToUpdate.push("end_date_expected = ?");
    values.push(data.end_date_expected);
  }

  values.push(projectId);

  const [result] = await db.query(
    `UPDATE project SET ${fieldsToUpdate.join(", ")} WHERE id = ?`,
    values,
  );
  return result.affectedRows;
};

/* Função para deletar projeto */
export const deleteProject = async (projectId) => {
  const [result] = await db.query("DELETE FROM project WHERE id=?", [projectId]);
  return result.affectedRows;
};

/* Função para obter estatísticas globais de projetos */
export const getProjectsStats = async () => {
  const [result] = await db.query(`
    SELECT 
      COUNT(*) as totalProjects,
      COALESCE(SUM(CASE WHEN project_status_id = 1 THEN 1 ELSE 0 END), 0) as activeProjects,
      COALESCE(SUM(CASE WHEN project_status_id = 3 THEN 1 ELSE 0 END), 0) as finishedProjects,
      COALESCE(SUM(CASE WHEN project_status_id = 2 THEN 1 ELSE 0 END), 0) as inDevelopmentProjects
    FROM project
  `);
  
  const stats = result[0];
  const total = stats.totalProjects || 1;
  
  const statsWithPercentage = {
    ...stats,
    activePercentage: ((stats.activeProjects / total) * 100).toFixed(2) + '%',
    finishedPercentage: ((stats.finishedProjects / total) * 100).toFixed(2) + '%'
  };
  
  return mapProjectStatsDTOResponse(statsWithPercentage);
};

/* Função para obter estatísticas de projetos */
export const getProjectStats = async (projectId) => {
  const [result] = await db.query(`
    SELECT 
      COUNT(*) as totalTasks,
      COALESCE(SUM(CASE WHEN status_id = 4 THEN 1 ELSE 0 END), 0) as completedTasks,
      COALESCE(SUM(CASE WHEN status_id != 4 THEN 1 ELSE 0 END), 0) as pendingTasks
    FROM task
    WHERE project_id = ?
  `, [projectId]);
  
  const stats = result[0];
  const total = stats.totalTasks || 1;
  
  const statsWithPercentage = {
    ...stats,
    completedPercentage: ((stats.completedTasks / total) * 100).toFixed(2) + '%',
    pendingPercentage: ((stats.pendingTasks / total) * 100).toFixed(2) + '%'
  };
  
  return mapProjectStatsDTOResponse(statsWithPercentage);
};


