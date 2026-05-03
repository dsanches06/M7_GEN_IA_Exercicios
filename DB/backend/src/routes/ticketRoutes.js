import express from "express";
import * as ticketController from "../controllers/ticketController.js";

const router = express.Router();

// CRUD Padrão
router.get("/list", ticketController.getTickets);
router.get("/:id", ticketController.getTicketById);
router.post("/save", ticketController.createTicket);
router.put("/:id", ticketController.updateTicket);
router.delete("/:id", ticketController.deleteTicket);

export default router;
