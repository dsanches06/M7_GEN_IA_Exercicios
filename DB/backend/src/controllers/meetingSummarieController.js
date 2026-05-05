import * as meetingSummarieService from "../services/meetingSummaryService.js";

/* Função para buscar resumos de reuniões */
export const getMeetingSummaries = async (req, res) => {
  try {
    const meetingSummaries = await meetingSummarieService.getAllMeetingSummaries();

    res.json(meetingSummaries);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar resumos de reuniões" });
  }
};

export const getMeetingSummaryById = async (req, res) => {
  try {
    const meetingSummary = await meetingSummarieService.getMeetingSummaryById(Number(req.params.id));
    if (!meetingSummary) {
      return res.status(404).json({ message: "Resumo de reunião não encontrado" });
    }
    res.json(meetingSummary);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar resumo de reunião" });
  }
};

/* Função para criar resumo de reunião */
export const createMeetingSummary = async (req, res) => {
  try {
    const { project_id, original_text, summary } = req.body;

    if (!project_id || !original_text || original_text.trim().length === 0) {
      return res.status(400).json({ message: "project_id e original_text são obrigatórios" });
    }

    const meetingSummary = await meetingSummarieService.createMeetingSummary(req.body);
    res.status(201).json(meetingSummary);
  } catch (error) {
    res.status(400).json({ message: "Erro ao criar resumo de reunião" });
  }
};

/* Função para deletar resumo de reunião */
export const deleteMeetingSummary = async (req, res) => {
  try {
    const meetingSummary = await meetingSummarieService.deleteMeetingSummary(Number(req.params.id));
    await taskService.removeMeetingSummaryFromAllTasks(Number(req.params.id));
    res.status(200).json({ message: "Resumo de reunião deletado com sucesso", meetingSummary });
  } catch (error) {
    res.status(404).json({ message: "Erro ao deletar resumo de reunião" });
  }
};

/* Função para atualizar resumo de reunião */
export const updateMeetingSummary = async (req, res) => {
  try {
    const meetingSummaryId = Number(req.params.id);
    const { project_id, original_text, summary } = req.body;

    if (!project_id || !original_text || original_text.trim().length === 0) {
      return res.status(400).json({ message: "project_id e original_text são obrigatórios" });
    }

    const meetingSummary = await meetingSummarieService.updateMeetingSummary(meetingSummaryId, req.body);
    if (!meetingSummary) {
      return res.status(404).json({ message: "Resumo de reunião não encontrado" });
    }

    res.status(200).json(meetingSummary);
  } catch (error) {
    res.status(400).json({ message: "Erro ao atualizar resumo de reunião" });
  }
};

/* Função para buscar tarefas do resumo de reunião */
export const getMeetingSummaryTasks = async (req, res) => {
  try {
    const meetingSummaryId = Number(req.params.id);
    const meetingSummary = await meetingSummarieService.getMeetingSummaryById(meetingSummaryId);

    if (!meetingSummary) {
      return res.status(404).json({ error: "Resumo de reunião não encontrado" });
    }

    const tasks = await taskService.getTasksByMeetingSummaryId(meetingSummaryId);
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar tarefas do resumo de reunião" });
  }
};
