import * as sprintService from "../services/sprintService.js";

/* Função para obter todas as sprints */
export const getSprints = async (req, res) => {
  try {
    const { sort, search } = req.query;
    const sprints = await sprintService.getAllSprints(search, sort);
    res.json(sprints);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar sprints" });
  }
};

/* Função para obter uma sprint por ID */
export const getSprintById = async (req, res) => {
  try {
    const sprint = await sprintService.getSprintById(Number(req.params.id));
    if (!sprint) {
      return res.status(404).json({ error: "Sprint não encontrada" });
    }
    res.json(sprint);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar sprint" });
  }
};

/* Função para criar sprint */
export const createSprint = async (req, res) => {
  try {
    const { name, start_date, end_date } = req.body;

    if (!name || name.trim().length === 0) {
      return res.status(400).json({ error: "O nome da sprint não pode ser vazio" });
    }

    if (name.length < 3) {
      return res.status(400).json({ error: "O nome da sprint deve ter pelo menos 3 caracteres" });
    }

    if (!start_date) {
      return res.status(400).json({ error: "Data de início é obrigatória" });
    }

    if (!end_date) {
      return res.status(400).json({ error: "Data de término é obrigatória" });
    }

    const sprint = await sprintService.createSprint(req.body);
    res.status(201).json(sprint);
  } catch (error) {
    res.status(400).json({ error: "Erro ao criar sprint" });
  }
};

/* Função para atualizar parcialmente sprint (PATCH) - para datas, descrição, etc */
export const partialUpdateSprint = async (req, res) => {
  try {
    const { name, description, start_date, end_date, status_id } = req.body;

    // Validar nome se fornecido
    if (name !== undefined && name.trim().length === 0) {
      return res.status(400).json({ error: "O nome da sprint não pode ser vazio" });
    }

    if (name !== undefined && name.length < 3) {
      return res.status(400).json({ error: "O nome da sprint deve ter pelo menos 3 caracteres" });
    }

    const affectedRows = await sprintService.updateSprint(Number(req.params.id), {
      name,
      description,
      start_date,
      end_date,
      status_id,
    });

    if (affectedRows === 0) {
      return res.status(404).json({ error: "Sprint não encontrada" });
    }
    res.json({ message: "Sprint atualizada com sucesso" });
  } catch (error) {
    res.status(400).json({ error: "Erro ao atualizar sprint" });
  }
};

/* Função para atualizar sprint */
export const updateSprint = async (req, res) => {
  try {
    const { name } = req.body;

    if (name !== undefined && name.trim().length === 0) {
      return res.status(400).json({ error: "O nome da sprint não pode ser vazio" });
    }

    if (name !== undefined && name.length < 3) {
      return res.status(400).json({ error: "O nome da sprint deve ter pelo menos 3 caracteres" });
    }

    const affectedRows = await sprintService.updateSprint(Number(req.params.id), req.body);
    if (affectedRows === 0) {
      return res.status(404).json({ error: "Sprint não encontrada" });
    }
    res.json({ message: "Sprint atualizada com sucesso" });
  } catch (error) {
    res.status(400).json({ error: "Erro ao atualizar sprint" });
  }
};

/* Função para deletar sprint */
export const deleteSprint = async (req, res) => {
  try {
    const affectedRows = await sprintService.deleteSprint(Number(req.params.id));
    if (affectedRows === 0) {
      return res.status(404).json({ error: "Sprint não encontrada" });
    }
    res.status(200).json({ message: "Sprint deletada com sucesso" });
  } catch (error) {
    res.status(404).json({ error: "Erro ao deletar sprint" });
  }
};

/* Função para obter estatísticas globais de sprints */
export const getSprintsStats = async (req, res) => {
  try {
    const stats = await sprintService.getSprintsStats();
    res.json([stats]);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar estatísticas de sprints" });
  }
};

/* Função para obter estatísticas de sprints */
export const getSprintStats = async (req, res) => {
  try {
    const { id } = req.params;
    const stats = await sprintService.getSprintStats(Number(id));
    res.json([stats]);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar estatísticas de sprints" });
  }
};

