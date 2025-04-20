import Team from "../models/Team.js";
import Player from "../models/Player.js";

export const getAllTeams = async (req, res) => {
    try {
        const teams = await Team.getAllTeams();
        res.render("teams", { teams, user: req.session.user });
    } catch (error) {
        console.error(error);
        res.status(500).send("Error fetching teams");
    }
};

export const getTeamById = async (req, res) => {
    try {
        const team = await Team.searchTeam(req.params.id);
        if (!team) {
            return res.status(404).render("404");
        }
        const players = await Player.getPlayersByTeam(req.params.id);
        res.render("teamDetail", { team, players, user: req.session.user });
    } catch (error) {
        console.error(error);
        res.status(500).send("Error fetching team");
    }
};

export const renderNewTeam = (req, res) => {
    res.render("newTeam", { user: req.session.user });
};

export const createTeam = async (req, res) => {
    try {
        if (!req.session.user) {
            return res.status(403).send("Access denied");
        }
        const { name, rank, location } = req.body;
        await Team.addTeam(name, rank, location);
        res.redirect("/teams");
    } catch (error) {
        console.error(error);
        res.status(500).send("Error creating team");
    }
};

export const updateTeam = async (req, res) => {
    try {
        if (!req.session.user) {
            return res.status(403).send("Access denied");
        }
        const { id } = req.params;
        const { name, rank, location } = req.body;
        await Team.modifyTeam(id, name, rank, location);
        res.redirect("/teams/" + id);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error updating team");
    }
};

export const deleteTeam = async (req, res) => {
    try {
        if (!req.session.user || (req.session.user.role !== 'official' && req.session.user.role !== 'admin')) {
            return res.status(403).send("Access denied");
        }
        const { id } = req.params;
        await Team.deleteTeam(id);
        res.redirect("/teams");
    } catch (error) {
        console.error(error);
        res.status(500).send("Error deleting team");
    }
};

export const renderEditTeam = async (req, res) => {
    try {
        const team = await Team.searchTeam(req.params.id);
        if (!team) {
            return res.status(404).render("404");
        }
        res.render("editTeam", { team, user: req.session.user });
    } catch (error) {
        console.error(error);
        res.status(500).send("Error loading edit form");
    }
};

export const addPlayerToTeam = async (req, res) => {
    try {
        const teamId = req.params.id;
        const { name, number, position, height, age } = req.body;

        const players = await Player.getPlayersByTeam(teamId);
        if (players.length >= 8) {
            return res.status(400).send("Maximum of 8 players allowed per team");
        }

        await Player.addPlayer(teamId, name, number, position, height, age);
        res.redirect(`/teams/${teamId}`);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error adding player");
    }
};

export const removePlayerFromTeam = async (req, res) => {
    try {
        const teamId = req.params.id;
        const playerId = req.body.playerId;
        await Player.deletePlayer(playerId);
        res.redirect(`/teams/${teamId}`);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error removing player");
    }
};
