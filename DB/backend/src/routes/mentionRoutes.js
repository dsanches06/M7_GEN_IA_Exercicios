import express from "express";
import * as mentionController from "../controllers/mentionController.js";

const router = express.Router();

router.get("/", mentionController.getMentions);
router.get("/:id", mentionController.getMentionById);
router.post("/", mentionController.createMention);
router.put("/:id", mentionController.updateMention);
router.delete("/:id", mentionController.deleteMention);

export default router;
