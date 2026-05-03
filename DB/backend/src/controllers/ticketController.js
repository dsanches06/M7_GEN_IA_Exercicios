import * as ticketService from "../services/taskService.js";

/* Função para buscar tiquetes */
export const getTickets = async (req, res) => {
  try {
    const tickets = await ticketService.getAllTickets();
    res.json(tickets);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar tiquetes" });
  }
};

export const getTicketById = async (req, res) => {
  try {
    const ticket = await ticketService.getTicketById(Number(req.params.id));
    if (!ticket) {
      return res.status(404).json({ message: "Tiquete não encontrado" });
    }
    res.json(ticket);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar tiquete" });
  }
};

/* Função para criar tiquete */
export const createTicket = async (req, res) => {
  try {
    const { user_report, error_type, severity } = req.body;

    if (!user_report || user_report.trim().length === 0) {
      return res.status(400).json({ message: "user_report é obrigatório" });
    }

    if (!error_type || error_type.trim().length === 0) {
      return res.status(400).json({ message: "error_type é obrigatório" });
    }

    if (severity && (severity < 1 || severity > 10)) {
      return res.status(400).json({ message: "severity deve estar entre 1 e 10" });
    }

    const ticket = await ticketService.createTicket(req.body);
    res.status(201).json(ticket);
  } catch (error) {
    res.status(400).json({ message: "Erro ao criar tiquete" });
  }
};

/* Função para deletar tiquete */
export const deleteTicket = async (req, res) => {
  try {
    const ticket = await ticketService.deleteTicket(Number(req.params.id));
    await taskService.removeTicketFromAllTasks(Number(req.params.id));
    res.status(200).json({ message: "Tiquete deletado com sucesso", ticket });
  } catch (error) {
    res.status(404).json({ message: "Erro ao deletar tiquete" });
  }
};

/* Função para atualizar tiquete */
export const updateTicket = async (req, res) => {
  try {
    const ticketId = Number(req.params.id);
    const { user_report, error_type, severity } = req.body;

    if (user_report && user_report.trim().length === 0) {
      return res.status(400).json({ message: "user_report não pode ser vazio" });
    }

    if (severity && (severity < 1 || severity > 10)) {
      return res.status(400).json({ message: "severity deve estar entre 1 e 10" });
    }

    const ticket = await ticketService.updateTicket(ticketId, req.body);
    if (!ticket) {
      return res.status(404).json({ message: "Tiquete não encontrado" });
    }

    res.status(200).json(ticket);
  } catch (error) {
    res.status(400).json({ message: "Erro ao atualizar tiquete" });
  }
};

/* Função para buscar tarefas do tiquete */
export const getTicketTasks = async (req, res) => {
  try {
    const ticketId = Number(req.params.id);
    const ticket = await ticketService.getTicketById(ticketId);

    if (!ticket) {
      return res.status(404).json({ error: "Tiquete não encontrado" });
    }

    const tasks = await taskService.getTasksByTicketId(ticketId);
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar tarefas do tiquete" });
  }
};
