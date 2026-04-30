import * as projectPermissionService from "../services/projectPermissionService.js";


/* Função para obter todas as permissões de projeto */
export const getProjectPermissions = async (req, res) => {
  try {
    const projectPermissions = await projectPermissionService.getAllProjectPermissions();
    res.json(projectPermissions);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar permissões de projeto" });
  }
};


/* Função para obter permissão de projeto por ID */
export const getProjectPermissionById = async (req, res) => {
  try {
    const projectPermission = await projectPermissionService.getProjectPermissionById(Number(req.params.id));
    if (!projectPermission) {
      return res.status(404).json({ error: "Permissão de projeto não encontrada" });
    }
    res.json(projectPermission);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar permissão de projeto" });
  }
};


/* Função para criar permissão de projeto */
export const createProjectPermission = async (req, res) => {
  try {
    const { project_id, user_id, permission } = req.body;
    if (!project_id || !user_id || !permission) {
      return res.status(400).json({ error: "project_id, user_id e permission são obrigatórios" });
    }
    const projectPermission = await projectPermissionService.createProjectPermission(req.body);
    res.status(201).json(projectPermission);
  } catch (error) {
    res.status(400).json({ error: "Erro ao criar permissão de projeto" });
  }
};


/* Função para atualizar permissão de projeto */
export const updateProjectPermission = async (req, res) => {
  try {
    const { id } = req.params;
    const affectedRows = await projectPermissionService.updateProjectPermission(id, req.body);
    if (affectedRows === 0) {
      return res.status(404).json({ error: "Permissão de projeto não encontrada" });
    }
    res.json({ message: "Permissão de projeto atualizada com sucesso" });
  } catch (error) {
    res.status(400).json({ error: "Erro ao atualizar permissão de projeto" });
  }
};


/* Função para deletar permissão de projeto */
export const deleteProjectPermission = async (req, res) => {
  try {
    const { id } = req.params;
    const affectedRows = await projectPermissionService.deleteProjectPermission(id);
    if (affectedRows === 0) {
      return res.status(404).json({ error: "Permissão de projeto não encontrada" });
    }
    res.json({ message: "Permissão de projeto deletada com sucesso" });
  } catch (error) {
    res.status(400).json({ error: "Erro ao deletar permissão de projeto" });
  }
};
