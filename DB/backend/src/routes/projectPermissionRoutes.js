import express from "express";
import * as projectPermissionController from "../controllers/projectPermissionController.js";

const router = express.Router();

router.get("/", projectPermissionController.getProjectPermissions);
router.get("/:id", projectPermissionController.getProjectPermissionById);
router.post("/", projectPermissionController.createProjectPermission);
router.put("/:id", projectPermissionController.updateProjectPermission);
router.delete("/:id", projectPermissionController.deleteProjectPermission);

export default router;
