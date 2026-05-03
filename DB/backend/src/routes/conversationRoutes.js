import express from "express";
import * as conversationController from "../controllers/conversationController.js";

const router = express.Router();

router.get("/", conversationController.getConversations);
router.get("/:id", conversationController.getConversationById);
router.post("/", conversationController.createConversation);
router.put("/:id", conversationController.updateConversation);
router.delete("/:id", conversationController.deleteConversation);

export default router;
