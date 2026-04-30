import express from "express";
import * as taskStatusHistoryController from "../controllers/taskStatusHistoryController.js";

const router = express.Router();

router.get("/", taskStatusHistoryController.getTaskStatusHistories);
router.get("/:id", taskStatusHistoryController.getTaskStatusHistoryById);
router.post("/", taskStatusHistoryController.createTaskStatusHistory);
router.put("/:id", taskStatusHistoryController.updateTaskStatusHistory);
router.delete("/:id", taskStatusHistoryController.deleteTaskStatusHistory);

export default router;
