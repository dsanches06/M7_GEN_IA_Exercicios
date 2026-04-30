import express from "express";
import * as teamMembersRoleController from "../controllers/teamMembersRoleController.js";

const router = express.Router();

router.get("/", teamMembersRoleController.getTeamMembersRoles);
router.get("/:id", teamMembersRoleController.getRoleById);
router.post("/", teamMembersRoleController.createRole);
router.put("/:id", teamMembersRoleController.updateRole);
router.delete("/:id", teamMembersRoleController.deleteRole);

export default router;
