import express from "express";
import * as userController from "../controllers/userController.js";
import { checkUserExists } from "../middlewares/checkUserExists.js";
import { validateUserData } from "../middlewares/validateUserData.js";

const router = express.Router();

//middleware para executar em todos os routes
router.use(checkUserExists);

//Users routes - STATIC ROUTES BEFORE DYNAMIC
router.get("/", userController.getUsers);
router.get("/stats", userController.getStats);

//notifications routes under users (MORE SPECIFIC BEFORE GENERAL)
router.get("/:id/notifications/unread", userController.getUnreadNotifications);
router.get("/:id/notifications", userController.getNotificationsByUser);
router.patch("/:id/notifications/:notificationId", userController.markAsRead);

//Users DYNAMIC routes (MUST BE LAST)
router.get("/:id", userController.getUserById);
router.post("/", validateUserData, userController.createUser);
router.put("/:id", validateUserData, userController.updateUser);
router.patch("/:id", userController.toggleUserActive);
router.delete("/:id", userController.deleteUser);

export default router;
