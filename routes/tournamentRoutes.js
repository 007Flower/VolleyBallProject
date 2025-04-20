import express from "express";
import {
    getAllTournaments,
    getTournamentById,
    createTournament,
    updateTournament,
    deleteTournament,
    renderNewTournament,
    renderEditTournament,
    addTeamToTournament,
    removeTeamFromTournament
} from "../controllers/tournamentController.js";

const router = express.Router();

router.get("/", getAllTournaments);
router.get("/new", renderNewTournament);
router.get("/:id", getTournamentById);
router.get("/:id/edit", renderEditTournament);
router.post("/", createTournament);
router.post("/:id/update", updateTournament);
router.post("/:id/delete", deleteTournament);
router.post("/:id/addTeam", addTeamToTournament);
router.post("/:id/removeTeam", removeTeamFromTournament);

export default router;
