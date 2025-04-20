import express from "express";
import {
    getPlayersByTeam,
    getPlayerById,
    createPlayer,
    updatePlayer,
    deletePlayer
} from "../controllers/playerController.js";

const router = express.Router({ mergeParams: true });

router.get("/", getPlayersByTeam);
router.get("/:id", getPlayerById);
router.post("/", createPlayer);
router.post("/:id/update", updatePlayer);
router.post("/:id/delete", deletePlayer);

export default router;
