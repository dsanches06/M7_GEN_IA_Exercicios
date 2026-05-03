import express from "express";
import * as conversationController from "../controllers/conversationController.js";

const router = express.Router();

// CRUD Padrão
router.get("/list", conversationController.getConversations);
router.get("/:id", conversationController.getConversationById);
router.post("/save", conversationController.createConversation);
router.put("/:id", conversationController.updateConversation);
router.delete("/:id", conversationController.deleteConversation);

export default router;
