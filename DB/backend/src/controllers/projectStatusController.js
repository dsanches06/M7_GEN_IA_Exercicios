import * as projectStatusService from "../services/projectStatusService.js";


/* Função para obter todos os status de projeto */
export const getProjectStatuses = async (req, res) => {
  try {
    const projectStatuses = await projectStatusService.getAllProjectStatuses();
    res.json(projectStatuses);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar status de projeto" });
  }
};


/* Função para obter status de projeto por ID */
export const getProjectStatusById = async (req, res) => {
  try {
    const projectStatus = await projectStatusService.getProjectStatusById(Number(req.params.id));
    if (!projectStatus) {
      return res.status(404).json({ error: "Status de projeto não encontrado" });
    }
    res.json(projectStatus);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar status de projeto" });
  }
};


/* Função para criar status de projeto */
export const createProjectStatus = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name || name.trim().length === 0) {
      return res.status(400).json({ error: "O nome do status não pode ser vazio" });
    }
    const projectStatus = await projectStatusService.createProjectStatus(req.body);
    res.status(201).json(projectStatus);
  } catch (error) {
    res.status(400).json({ error: "Erro ao criar status de projeto" });
  }
};


/* Função para atualizar status de projeto */
export const updateProjectStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const affectedRows = await projectStatusService.updateProjectStatus(id, req.body);
    if (affectedRows === 0) {
      return res.status(404).json({ error: "Status de projeto não encontrado" });
    }
    res.json({ message: "Status de projeto atualizado com sucesso" });
  } catch (error) {
    res.status(400).json({ error: "Erro ao atualizar status de projeto" });
  }
};


/* Função para deletar status de projeto */
export const deleteProjectStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const affectedRows = await projectStatusService.deleteProjectStatus(id);
    if (affectedRows === 0) {
      return res.status(404).json({ error: "Status de projeto não encontrado" });
    }
    res.json({ message: "Status de projeto deletado com sucesso" });
  } catch (error) {
    res.status(400).json({ error: "Erro ao deletar status de projeto" });
  }
};
