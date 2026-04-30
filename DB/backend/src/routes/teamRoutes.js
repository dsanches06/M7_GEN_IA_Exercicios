import express from "express";
import * as teamController from "../controllers/teamController.js";
import * as teamMemberController from "../controllers/teamMemberController.js";

const router = express.Router();

//Teams routes
router.get("/", teamController.getTeams);
router.get("/stats", teamController.getTeamsStats);
router.get("/:id/stats", teamController.getTeamStats);
router.get("/:id", teamController.getTeamById);
router.post("/", teamController.createTeam);
router.put("/:id", teamController.updateTeam);
router.delete("/:id", teamController.deleteTeam);

//Team Members routes
router.get("/:id/members", teamMemberController.getTeamMembers);
router.get("/:id/members/:user_id", teamMemberController.getTeamMemberById);
router.post("/:id/members", teamMemberController.createTeamMember);
router.put("/:id/members/:user_id", teamMemberController.updateTeamMember);
router.delete("/:id/members/:user_id", teamMemberController.deleteTeamMember);

export default router;
