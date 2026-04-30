import * as timeLogService from "../services/timeLogService.js";

/* Função para obter todos os time logs */
export const getTimeLogs = async (req, res) => {
  try {
    const timeLogs = await timeLogService.getAllTimeLogs();
    res.json(timeLogs);
  } catch (error) {
    res.status(500).json({ error: `Error fetching time logs` });
  }
};

/* Função para obter time log por ID */
export const getTimeLogById = async (req, res) => {
  try {
    const timeLog = await timeLogService.getTimeLogById(Number(req.params.id));
    if (!timeLog) {
      return res.status(404).json({ error: "Time log not found" });
    }
    res.json(timeLog);
  } catch (error) {
    res.status(500).json({ error: `Error fetching time log` });
  }
};

/* Função para criar time log */
export const createTimeLog = async (req, res) => {
  try {
    const { task_id, user_id, hours } = req.body;
    if (!task_id || !user_id || !hours) {
      return res
        .status(400)
        .json({ error: "task_id, user_id, and hours are required" });
    }
    const timeLog = await timeLogService.createTimeLog(req.body);
    res.status(201).json(timeLog);
  } catch (error) {
    res.status(400).json({ error: `Error creating time log` });
  }
};

/* Função para atualizar time log */
export const updateTimeLog = async (req, res) => {
  try {
    const { id } = req.params;
    const affectedRows = await timeLogService.updateTimeLog(id, req.body);
    if (affectedRows === 0) {
      return res.status(404).json({ error: "Time log not found" });
    }
    res.json({ message: "Time log updated successfully" });
  } catch (error) {
    res.status(400).json({ error: `Error updating time log` });
  }
};

/* Função para deletar time log */
export const deleteTimeLog = async (req, res) => {
  try {
    const { id } = req.params;
    const affectedRows = await timeLogService.deleteTimeLog(id);
    if (affectedRows === 0) {
      return res.status(404).json({ error: "Time log not found" });
    }
    res.json({ message: "Time log deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: `Error deleting time log` });
  }
};
