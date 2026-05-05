// Corrigido: Agora importa o serviço correto de tiquetes
import * as ticketService from "../services/ticketService.js";
// Adicionado: Necessário para a função removeTicketFromAllTasks no delete
import * as taskService from "../services/taskService.js";

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
    if (!ticket) return res.status(404).json({ message: "Tiquete não encontrado" });
    res.json(ticket);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar tiquete" });
  }
};

export const createTicket = async (req, res) => {
  try {
    const { user_report, error_type } = req.body;
    if (!user_report || !error_type) {
      return res.status(400).json({ message: "Campos obrigatórios em falta" });
    }
    const ticket = await ticketService.createTicket(req.body);
    res.status(201).json(ticket);
  } catch (error) {
    res.status(400).json({ message: "Erro ao criar tiquete" });
  }
};

export const updateTicket = async (req, res) => {
  try {
    const ticket = await ticketService.updateTicket(Number(req.params.id), req.body);
    if (!ticket) return res.status(404).json({ message: "Tiquete não encontrado" });
    res.status(200).json({ message: "Atualizado com sucesso" });
  } catch (error) {
    res.status(400).json({ message: "Erro ao atualizar tiquete" });
  }
};

export const deleteTicket = async (req, res) => {
  try {
    const id = Number(req.params.id);
    await ticketService.deleteTicket(id);
    // Agora o taskService está importado e isto não vai falhar
    await taskService.removeTicketFromAllTasks(id); 
    res.status(200).json({ message: "Tiquete deletado com sucesso" });
  } catch (error) {
    res.status(404).json({ message: "Erro ao deletar tiquete" });
  }
};
