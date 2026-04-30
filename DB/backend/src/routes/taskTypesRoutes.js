import express from "express";
import * as taskTypesController from "../controllers/taskTypesController.js";

const router = express.Router();

router.get("/", taskTypesController.getTaskTypes);
router.get("/:id", taskTypesController.getTaskTypeById);
router.post("/", taskTypesController.createTaskType);
router.put("/:id", taskTypesController.updateTaskType);
router.delete("/:id", taskTypesController.deleteTaskType);

export default router;
