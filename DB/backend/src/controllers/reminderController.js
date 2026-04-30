import * as reminderService from "../services/reminderService.js";


/* Função para obter todos os lembretes */
export const getReminders = async (req, res) => {
  try {
    const reminders = await reminderService.getAllReminders();
    res.json(reminders);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar lembretes" });
  }
};


/* Função para obter lembrete por ID */
export const getReminderById = async (req, res) => {
  try {
    const reminder = await reminderService.getReminderById(Number(req.params.id));
    if (!reminder) {
      return res.status(404).json({ error: "Lembrete não encontrado" });
    }
    res.json(reminder);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar lembrete" });
  }
};


/* Função para criar lembrete */
export const createReminder = async (req, res) => {
  try {
    const { task_id, remind_at } = req.body;
    if (!task_id || !remind_at) {
      return res.status(400).json({ error: "task_id e remind_at são obrigatórios" });
    }
    const reminder = await reminderService.createReminder(req.body);
    res.status(201).json(reminder);
  } catch (error) {
    res.status(400).json({ error: "Erro ao criar lembrete" });
  }
};


/* Função para atualizar lembrete */
export const updateReminder = async (req, res) => {
  try {
    const { id } = req.params;
    const affectedRows = await reminderService.updateReminder(id, req.body);
    if (affectedRows === 0) {
      return res.status(404).json({ error: "Lembrete não encontrado" });
    }
    res.json({ message: "Lembrete atualizado com sucesso" });
  } catch (error) {
    res.status(400).json({ error: "Erro ao atualizar lembrete" });
  }
};


/* Função para deletar lembrete */
export const deleteReminder = async (req, res) => {
  try {
    const { id } = req.params;
    const affectedRows = await reminderService.deleteReminder(id);
    if (affectedRows === 0) {
      return res.status(404).json({ error: "Lembrete não encontrado" });
    }
    res.json({ message: "Lembrete deletado com sucesso" });
  } catch (error) {
    res.status(400).json({ error: "Erro ao deletar lembrete" });
  }
};
