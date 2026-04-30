import express from "express";
import * as sprintController from "../controllers/sprintController.js";
import * as sprintTaskController from "../controllers/sprintTaskController.js";

const router = express.Router();

// Rotas estáticas e específicas DEVEM VIR PRIMEIRO
router.get("/stats", sprintController.getSprintsStats);
router.get("/tasks", sprintTaskController.getSprintTasks); // GET ALL sprint tasks

// Rotas com ID de sprint (/:id)
router.get("/:id/stats", sprintController.getSprintStats);
router.get("/:id/tasks/:task_id", sprintTaskController.getSprintTaskById);
router.post("/:id/tasks", sprintTaskController.createSprintTask);
router.put("/:id/tasks/:task_id", sprintTaskController.updateSprintTask);
router.delete("/:id/tasks/:task_id", sprintTaskController.deleteSprintTask);
router.get("/:id/tasks", sprintTaskController.getSprintTasks); // GET tasks of specific sprint

// Rotas base (DEVEM VIR POR ÚLTIMO)
router.get("/", sprintController.getSprints);
router.post("/", sprintController.createSprint);
router.patch("/:id", sprintController.partialUpdateSprint);
router.put("/:id", sprintController.updateSprint);
router.delete("/:id", sprintController.deleteSprint);
router.get("/:id", sprintController.getSprintById);

export default router;