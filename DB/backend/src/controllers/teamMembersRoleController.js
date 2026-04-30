import * as teamMembersRoleService from "../services/teamMembersRoleService.js";

/* Função para obter todos os team members roles */
export const getTeamMembersRoles = async (req, res) => {
  try {
    const teamMembersRoles = await teamMembersRoleService.getAllRoles();
    res.json(teamMembersRoles);
  } catch (error) {
    res.status(500).json({ error: `Error fetching team members roles` });
  }
};

/* Função para obter team members role por ID */
export const getRoleById = async (req, res) => {
  try {
    const role = await teamMembersRoleService.getRoleById(Number(req.params.id));
    if (!role) {
      return res.status(404).json({ error: "Team members role not found" });
    }
    res.json(role);
  } catch (error) {
    res.status(500).json({ error: `Error fetching team members role` });
  }
};

/* Função para criar team members role */
export const createRole = async (req, res) => {
  try {
    const { name, flow_order } = req.body;
    if (!name) {
      return res.status(400).json({ error: "name is required" });
    }
    const role = await teamMembersRoleService.createRole(req.body);
    res.status(201).json(role);
  } catch (error) {
    res.status(400).json({ error: `Error creating team members role` });
  }
};

/* Função para atualizar team members role */
export const updateRole = async (req, res) => {
  try {
    const { id } = req.params;
    const affectedRows = await teamMembersRoleService.updateRole(id, req.body);
    if (affectedRows === 0) {
      return res.status(404).json({ error: "Team members role not found" });
    }
    res.json({ message: "Team members role updated successfully" });
  } catch (error) {
    res.status(400).json({ error: `Error updating team members role` });
  }
};

/* Função para deletar team members role */
export const deleteRole = async (req, res) => {
  try {
    const { id } = req.params;
    const affectedRows = await teamMembersRoleService.deleteRole(id);
    if (affectedRows === 0) {
      return res.status(404).json({ error: "Team members role not found" });
    }
    res.json({ message: "Team members role deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: `Error deleting team members role` });
  }
};
