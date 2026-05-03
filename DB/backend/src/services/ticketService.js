import { db } from "../db.js";
import { mapTicketDTOResponse } from "../dto/mapDTO.js";

export const getAllTickets = async () => {
  const [tickets] = await db.query("SELECT * FROM tickets");
  return tickets.map(mapTicketDTOResponse);
};

export const getTicketById = async (ticketId) => {
  const [tickets] = await db.query("SELECT * FROM tickets WHERE id = ?", [ticketId]);
  return tickets.length > 0 ? mapTicketDTOResponse(tickets[0]) : null;
};

export const createTicket = async (data) => {
  const { user_report, error_type, severity, fix_suggestion, status } = data;
  const [result] = await db.query(
    "INSERT INTO tickets (user_report, error_type, severity, fix_suggestion, status) VALUES (?, ?, ?, ?, ?)",
    [user_report, error_type, severity, fix_suggestion, status || 'open']
  );
  return mapTicketDTOResponse({ id: result.insertId, user_report, error_type, severity, fix_suggestion, status: status || 'open', created_at: new Date() });
};

export const updateTicket = async (id, data) => {
  const [result] = await db.query("UPDATE tickets SET ? WHERE id = ?", [data, id]);
  return result.affectedRows;
};

export const deleteTicket = async (id) => {
  const [result] = await db.query("DELETE FROM tickets WHERE id = ?", [id]);
  return result.affectedRows;
};
