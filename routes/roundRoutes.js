import express from "express";
import {
    getRoundsByTournament,
    getRoundById,
    createRound,
    updateRound,
    deleteRound
} from "../controllers/roundController.js";

const router = express.Router({ mergeParams: true });

router.get("/", getRoundsByTournament);
router.get("/:id", getRoundById);
router.post("/", createRound);
router.post("/:id/update", updateRound);
router.post("/:id/delete", deleteRound);

export default router;
