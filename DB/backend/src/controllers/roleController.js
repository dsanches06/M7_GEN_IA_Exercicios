import * as roleService from "../services/taskService.js";

/* Função para buscar papéis */
export const getRoles = async (req, res) => {
  try {
    const roles = await roleService.getAllRoles();
    res.json(roles);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar papéis" });
  }
};

export const getRoleById = async (req, res) => {
  try {
    const role = await roleService.getRoleById(Number(req.params.id));
    if (!role) {
      return res.status(404).json({ message: "Papel não encontrado" });
    }
    res.json(role);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar papel" });
  }
};

/* Função para criar papel */
export const createRole = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name || name.trim().length === 0) {
      return res.status(400).json({ message: "O nome do papel não pode ser vazio" });
    }

    if (name.trim().length < 2) {
      return res.status(400).json({ message: "O nome do papel deve ter pelo menos 2 caracteres" });
    }

    const roleExists = await roleService.roleNameExists(name.trim());
    if (roleExists) {
      return res.status(400).json({ message: "Já existe um papel com este nome" });
    }

    const role = await roleService.createRole(req.body);
    res.status(201).json(role);
  } catch (error) {
    res.status(400).json({ message: "Erro ao criar papel" });
  }
};

/* Função para deletar papel */
export const deleteRole = async (req, res) => {
  try {
    const role = await roleService.deleteRole(Number(req.params.id));
    await taskService.removeRoleFromAllTasks(Number(req.params.id));
    res.status(200).json({ message: "Papel deletado com sucesso", role });
  } catch (error) {
    res.status(404).json({ message: "Erro ao deletar papel" });
  }
};

/* Função para atualizar papel */
export const updateRole = async (req, res) => {
  try {
    const roleId = Number(req.params.id);
    const { name } = req.body;

    if (!name || name.trim().length === 0) {
      return res.status(400).json({ message: "O nome do papel não pode ser vazio" });
    }

    if (name.trim().length < 2) {
      return res.status(400).json({ message: "O nome do papel deve ter pelo menos 2 caracteres" });
    }

    const roleExists = await roleService.roleNameExists(name.trim(), roleId);
    if (roleExists) {
      return res.status(400).json({ message: "Já existe um papel com este nome" });
    }

    const role = await roleService.updateRole(roleId, req.body);
    if (!role) {
      return res.status(404).json({ message: "Papel não encontrado" });
    }

    res.status(200).json(role);
  } catch (error) {
    res.status(400).json({ message: "Erro ao atualizar papel" });
  }
};

/* Função para buscar tarefas do papel */
export const getRoleTasks = async (req, res) => {
  try {
    const roleId = Number(req.params.id);
    const role = await roleService.getRoleById(roleId);

    if (!role) {
      return res.status(404).json({ error: "Papel não encontrado" });
    }

    const tasks = await taskService.getTasksByRoleId(roleId);
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar tarefas do papel" });
  }
};
