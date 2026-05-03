import express from "express";
import * as chatHistoryController from "../controllers/chatHistoryController.js";

const router = express.Router();

router.get("/", chatHistoryController.getChatHistories);
router.get("/:id", chatHistoryController.getChatHistoryById);
router.post("/", chatHistoryController.createChatHistory);
router.put("/:id", chatHistoryController.updateChatHistory);
router.delete("/:id", chatHistoryController.deleteChatHistory);

export default router;
