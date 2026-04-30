import express from "express";
import * as taskDependencyController from "../controllers/taskDependencyController.js";

const router = express.Router();

router.get("/", taskDependencyController.getTaskDependencies);
router.get("/:id", taskDependencyController.getTaskDependencyById);
router.post("/", taskDependencyController.createTaskDependency);
router.put("/:id", taskDependencyController.updateTaskDependency);
router.delete("/:id", taskDependencyController.deleteTaskDependency);

export default router;
