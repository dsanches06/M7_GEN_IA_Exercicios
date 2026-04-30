import express from "express";
import * as projectStatusController from "../controllers/projectStatusController.js";

const router = express.Router();

router.get("/", projectStatusController.getProjectStatuses);
router.get("/:id", projectStatusController.getProjectStatusById);
router.post("/", projectStatusController.createProjectStatus);
router.put("/:id", projectStatusController.updateProjectStatus);
router.delete("/:id", projectStatusController.deleteProjectStatus);

export default router;
