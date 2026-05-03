import express from "express";
import * as meetingSummaryController from "../controllers/meetingSummaryController.js";

const router = express.Router();

router.get("/", meetingSummaryController.getMeetingSummaries);
router.get("/:id", meetingSummaryController.getMeetingSummaryById);
router.post("/", meetingSummaryController.createMeetingSummary);
router.put("/:id", meetingSummaryController.updateMeetingSummary);
router.delete("/:id", meetingSummaryController.deleteMeetingSummary);

export default router;
