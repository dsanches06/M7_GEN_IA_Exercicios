import * as teamMemberService from "../services/teamMemberService.js";

/* Função para obter todos os team members */
export const getTeamMembers = async (req, res) => {
  try {
    const teamMembers = await teamMemberService.getAllTeamMembers();
    res.json(teamMembers);
  } catch (error) {
    res.status(500).json({ error: `Error fetching team members` });
  }
};

/* Função para obter team member por ID */
export const getTeamMemberById = async (req, res) => {
  try {
    const teamMember = await teamMemberService.getTeamMemberById(Number(req.params.id));
    if (!teamMember) {
      return res.status(404).json({ error: "Team member not found" });
    }
    res.json(teamMember);
  } catch (error) {
    res.status(500).json({ error: `Error fetching team member` });
  }
};

/* Função para criar team member */
export const createTeamMember = async (req, res) => {
  try {
    const { team_id, user_id } = req.body;
    if (!team_id || !user_id) {
      return res.status(400).json({ error: "team_id and user_id are required" });
    }
    const teamMember = await teamMemberService.createTeamMember(req.body);
    res.status(201).json(teamMember);
  } catch (error) {
    res.status(400).json({ error: `Error creating team member` });
  }
};

/* Função para atualizar team member */
export const updateTeamMember = async (req, res) => {
  try {
    const { id } = req.params;
    const affectedRows = await teamMemberService.updateTeamMember(id, req.body);
    if (affectedRows === 0) {
      return res.status(404).json({ error: "Team member not found" });
    }
    res.json({ message: "Team member updated successfully" });
  } catch (error) {
    res.status(400).json({ error: `Error updating team member` });
  }
};

/* Função para deletar team member */
export const deleteTeamMember = async (req, res) => {
  try {
    const { team_id, user_id } = req.params;
    const affectedRows = await teamMemberService.deleteTeamMember(Number(team_id), Number(user_id));
    if (affectedRows === 0) {
      return res.status(404).json({ error: "Team member not found" });
    }
    res.json({ message: "Team member deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: `Error deleting team member` });
  }
};
