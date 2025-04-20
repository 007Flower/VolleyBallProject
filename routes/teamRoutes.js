import express from "express";
import {
    getAllTeams,
    getTeamById,
    createTeam,
    updateTeam,
    deleteTeam,
    renderNewTeam,
    renderEditTeam,
    addPlayerToTeam,
    removePlayerFromTeam
} from "../controllers/teamController.js";

import {
    renderEditPlayer,
    updatePlayer
} from "../controllers/playerController.js";

const router = express.Router();

router.get("/", getAllTeams);
router.get("/new", renderNewTeam);
router.get("/:id", getTeamById);
router.get("/:id/edit", renderEditTeam);
router.post("/", createTeam);
router.post("/:id/update", updateTeam);
router.post("/:id/delete", deleteTeam);
router.post("/:id/addPlayer", addPlayerToTeam);
router.post("/:id/removePlayer", removePlayerFromTeam);
router.get("/:teamId/players/:playerId/edit", renderEditPlayer);
router.post("/:teamId/players/:playerId/update", updatePlayer);

export default router;
