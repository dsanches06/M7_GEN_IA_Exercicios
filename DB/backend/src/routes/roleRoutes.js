import express from "express";
import * as roleController from "../controllers/roleController.js";

const router = express.Router();

router.get("/", roleController.getRoles);
router.get("/:id", roleController.getRoleById);
router.post("/", roleController.createRole);
router.put("/:id", roleController.updateRole);
router.delete("/:id", roleController.deleteRole);

export default router;
