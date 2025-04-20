import Tournament from "../models/Tournament.js";
import Team from "../models/Team.js";
import TournamentTeam from "../models/TournamentTeam.js";

export const getAllTournaments = async (req, res) => {
    try {
        let tournaments = await Tournament.getAllTournaments();

        // Filter tournaments by status if query param provided
        const statusFilter = req.query.status;
        if (statusFilter) {
            tournaments = tournaments.filter(t => t.status.toLowerCase() === statusFilter.toLowerCase());
        }

        // Remove unused TournamentTeam import warning by referencing it here
        void TournamentTeam;

        res.render("tournaments", { tournaments, user: req.session.user });
    } catch (error) {
        console.error(error);
        res.status(500).send("Error fetching tournaments");
    }
};

export const getTournamentById = async (req, res) => {
    try {
        const tournament = await Tournament.searchTournament(req.params.id);
        if (!tournament) {
            return res.status(404).render("404");
        }
        const teams = await TournamentTeam.getTeamsByTournament(req.params.id);
        const allTeams = await Team.getAllTeams();
        res.render("tournamentDetail", { tournament, teams, allTeams, user: req.session.user });
    } catch (error) {
        console.error(error);
        res.status(500).send("Error fetching tournament");
    }
};

export const renderNewTournament = (req, res) => {
    res.render("newTournament", { user: req.session.user });
};

const allowedStatuses = ['Scheduled', 'Ongoing', 'Completed', 'Cancelled'];

export const createTournament = async (req, res) => {
    try {
        const { name, venue, start_date, end_date, organizer, contact, status, description } = req.body;

        if (!allowedStatuses.includes(status)) {
            return res.status(400).send("Invalid status value");
        }

        await Tournament.addTournament(name, venue, start_date, end_date, organizer, contact, status, description);
        res.redirect("/tournaments");
    } catch (error) {
        console.error(error);
        res.status(500).send("Error creating tournament");
    }
};

export const updateTournament = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, venue, start_date, end_date, organizer, contact, status, description } = req.body;

        if (!allowedStatuses.includes(status)) {
            return res.status(400).send("Invalid status value");
        }

        await Tournament.modifyTournament(id, name, venue, start_date, end_date, organizer, contact, status, description);
        res.redirect("/tournaments/" + id);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error updating tournament");
    }
};

export const deleteTournament = async (req, res) => {
    try {
        const { id } = req.params;
        await Tournament.deleteTournament(id);
        res.redirect("/tournaments");
    } catch (error) {
        console.error(error);
        res.status(500).send("Error deleting tournament");
    }
};

export const renderEditTournament = async (req, res) => {
    try {
        const tournament = await Tournament.searchTournament(req.params.id);
        if (!tournament) {
            return res.status(404).render("404");
        }
        res.render("editTournament", { tournament, user: req.session.user });
    } catch (error) {
        console.error(error);
        res.status(500).send("Error loading edit form");
    }
};

export const addTeamToTournament = async (req, res) => {
    try {
        const tournamentId = req.params.id;
        const teamId = req.body.teamId;

        const count = await TournamentTeam.countTeamsInTournament(tournamentId);
        if (count >= 10) {
            return res.status(400).send("Maximum of 10 teams allowed per tournament");
        }

        await TournamentTeam.addTeamToTournament(tournamentId, teamId);
        res.redirect(`/tournaments/${tournamentId}`);
    } catch (error) {
        console.error(error);
        res.status(500).send("Server error");
    }
};

export const removeTeamFromTournament = async (req, res) => {
    try {
        const tournamentId = req.params.id;
        const teamId = req.body.teamId;
        await TournamentTeam.removeTeamFromTournament(tournamentId, teamId);
        res.redirect(`/tournaments/${tournamentId}`);
    } catch (error) {
        console.error(error);
        res.status(500).send("Server error");
    }
};
