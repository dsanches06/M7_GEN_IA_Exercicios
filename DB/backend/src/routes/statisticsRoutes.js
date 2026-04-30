import express from "express";
import * as statistics from "../controllers/statisticsController.js";

const router = express.Router();

//Statistics routes
router.get("/morehours", statistics.getRankingMoreHours);
router.get("/increasedhours", statistics.getRankingIncreasedHours);
router.get("/aboveaverage", statistics.getRankingAboveAverage);

export default router;
