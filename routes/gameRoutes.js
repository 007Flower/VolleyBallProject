import express from "express";
import {
    getGamesByRound,
    getGameById,
    createGame,
    updateGame,
    deleteGame
} from "../controllers/gameController.js";

const router = express.Router({ mergeParams: true });

router.get("/", getGamesByRound);
router.get("/:id", getGameById);
router.post("/", createGame);
router.post("/:id/update", updateGame);
router.post("/:id/delete", deleteGame);

export default router;
