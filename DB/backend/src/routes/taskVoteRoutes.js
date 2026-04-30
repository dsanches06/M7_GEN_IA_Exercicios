import express from "express";
import * as taskVoteController from "../controllers/taskVoteController.js";

const router = express.Router();

router.get("/", taskVoteController.getTaskVotes);
router.get("/:id", taskVoteController.getTaskVoteById);
router.post("/", taskVoteController.createTaskVote);
router.put("/:id", taskVoteController.updateTaskVote);
router.delete("/:id", taskVoteController.deleteTaskVote);

export default router;
