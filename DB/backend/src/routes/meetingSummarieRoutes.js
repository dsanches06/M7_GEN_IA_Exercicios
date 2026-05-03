import express from "express";
import * as meetingSummaryController from "../controllers/meetingSummarieController.js";

const router = express.Router();

// CRUD Padrão
router.get("/list", meetingSummaryController.getMeetingSummaries);
router.get("/:id", meetingSummaryController.getMeetingSummaryById);
router.post("/save", meetingSummaryController.createMeetingSummary);
router.put("/:id", meetingSummaryController.updateMeetingSummary);
router.delete("/:id", meetingSummaryController.deleteMeetingSummary);

export default router;
