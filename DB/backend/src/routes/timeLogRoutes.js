import express from "express";
import * as timeLogController from "../controllers/timeLogController.js";

const router = express.Router();

router.get("/", timeLogController.getTimeLogs);
router.get("/:id", timeLogController.getTimeLogById);
router.post("/", timeLogController.createTimeLog);
router.put("/:id", timeLogController.updateTimeLog);
router.delete("/:id", timeLogController.deleteTimeLog);

export default router;
