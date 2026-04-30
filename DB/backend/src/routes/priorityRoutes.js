import express from "express";
import * as priorityController from "../controllers/priorityController.js";

const router = express.Router();

router.get("/", priorityController.getPriorities);
router.get("/:id", priorityController.getPriorityById);
router.post("/", priorityController.createPriority);
router.put("/:id", priorityController.updatePriority);
router.delete("/:id", priorityController.deletePriority);

export default router;
