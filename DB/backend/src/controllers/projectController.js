import * as projectService from "../services/projectService.js";

/* Função para obter todos os projetos */
export const getProjects = async (req, res) => {
  try {
    const { sort, search } = req.query;
    const projects = await projectService.getAllProjects(search, sort);
    res.json(projects);
  } catch (error) {
    console.error("Error in getProjects:", error);
    res.status(500).json({ error: "Erro ao buscar projetos" });
  }
};

/* Função para obter um projeto por ID */
export const getProjectById = async (req, res) => {
  try {
    const project = await projectService.getProjectById(Number(req.params.id));
    if (!project) {
      return res.status(404).json({ error: "Projeto não encontrado" });
    }
    res.json(project);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar projeto" });
  }
};

/* Função para criar projeto */
export const createProject = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name || name.trim().length === 0) {
      return res.status(400).json({ error: "O nome do projeto não pode ser vazio" });
    }

    if (name.length < 3) {
      return res.status(400).json({ error: "O nome do projeto deve ter pelo menos 3 caracteres" });
    }

    const project = await projectService.createProject(req.body);
    res.status(201).json(project);
  } catch (error) {
    res.status(400).json({ error: "Erro ao criar projeto" });
  }
};

/* Função para atualizar parcialmente projeto (PATCH) - para datas, descrição, etc */
export const partialUpdateProject = async (req, res) => {
  try {
    const { name, description, start_date, end_date_expected, project_status_id } = req.body;

    // Validar nome se fornecido
    if (name !== undefined && name.trim().length === 0) {
      return res.status(400).json({ error: "O nome do projeto não pode ser vazio" });
    }

    if (name !== undefined && name.length < 3) {
      return res.status(400).json({ error: "O nome do projeto deve ter pelo menos 3 caracteres" });
    }

    const affectedRows = await projectService.updateProject(Number(req.params.id), {
      name,
      description,
      start_date,
      end_date_expected,
      project_status_id,
    });

    if (affectedRows === 0) {
      return res.status(404).json({ error: "Projeto não encontrado" });
    }
    res.json({ message: "Projeto atualizado com sucesso" });
  } catch (error) {
    res.status(400).json({ error: "Erro ao atualizar projeto" });
  }
};

/* Função para atualizar projeto */
export const updateProject = async (req, res) => {
  try {
    const { name } = req.body;

    if (name !== undefined && name.trim().length === 0) {
      return res.status(400).json({ error: "O nome do projeto não pode ser vazio" });
    }

    if (name !== undefined && name.length < 3) {
      return res.status(400).json({ error: "O nome do projeto deve ter pelo menos 3 caracteres" });
    }

    const affectedRows = await projectService.updateProject(Number(req.params.id), req.body);
    if (affectedRows === 0) {
      return res.status(404).json({ error: "Projeto não encontrado" });
    }
    res.json({ message: "Projeto atualizado com sucesso" });
  } catch (error) {
    res.status(400).json({ error: "Erro ao atualizar projeto" });
  }
};

/* Função para deletar projeto */
export const deleteProject = async (req, res) => {
  try {
    const affectedRows = await projectService.deleteProject(Number(req.params.id));
    if (affectedRows === 0) {
      return res.status(404).json({ error: "Projeto não encontrado" });
    }
    res.status(200).json({ message: "Projeto deletado com sucesso" });
  } catch (error) {
    res.status(404).json({ error: "Erro ao deletar projeto" });
  }
};

/* Função para obter estatísticas globais de projetos */
export const getProjectsStats = async (req, res) => {
  try {
    const stats = await projectService.getProjectsStats();
    res.json([stats]);
  } catch (error) {
    console.error("Error in getProjectsStats:", error);
    res.status(500).json({ error: "Erro ao buscar estatísticas de projetos" });
  }
};

/* Função para obter estatísticas de projetos */
export const getProjectStats = async (req, res) => {
  try {
    const { id } = req.params;
    const stats = await projectService.getProjectStats(Number(id));
    res.json([stats]);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar estatísticas de projetos" });
  }
};
