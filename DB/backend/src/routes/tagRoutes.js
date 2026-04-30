import express from "express";
import * as tagController from "../controllers/tagController.js";

const router = express.Router();

// Tags routes
router.get("/", tagController.getTags);
router.get("/:id", tagController.getTagById);
router.post("/", tagController.createTag);
router.put("/:id", tagController.updateTag);
router.delete("/:id", tagController.deleteTag);
router.get("/:id/tasks", tagController.getTagTasks);

export default router;
