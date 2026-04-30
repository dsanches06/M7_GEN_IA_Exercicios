import express from "express";
import * as favoriteTaskController from "../controllers/favoriteTaskController.js";

const router = express.Router();

router.get("/", favoriteTaskController.getFavoriteTasks);
router.get("/:id", favoriteTaskController.getFavoriteTaskById);
router.post("/", favoriteTaskController.createFavoriteTask);
router.put("/:id", favoriteTaskController.updateFavoriteTask);
router.delete("/:id", favoriteTaskController.deleteFavoriteTask);

export default router;
