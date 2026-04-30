import express from "express";
import * as tagTaskController from "../controllers/tagTaskController.js";

const router = express.Router();

router.get("/", tagTaskController.getTagTasks);
router.get("/:id", tagTaskController.getTagTaskById);
router.post("/", tagTaskController.createTagTask);
router.put("/:id", tagTaskController.updateTagTask);
router.delete("/:id", tagTaskController.deleteTagTask);

export default router;
