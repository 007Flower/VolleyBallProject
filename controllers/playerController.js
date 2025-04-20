import Player from "../models/Player.js";

export const getPlayersByTeam = async (req, res) => {
    try {
        const players = await Player.getPlayersByTeam(req.params.teamId);
        res.render("players", { players, teamId: req.params.teamId, user: req.session.user });
    } catch (error) {
        console.error(error);
        res.status(500).send("Error fetching players");
    }
};

export const getPlayerById = async (req, res) => {
    try {
        const player = await Player.searchPlayer(req.params.id);
        if (!player) {
            return res.status(404).render("404");
        }
        res.render("playerDetail", { player, user: req.session.user });
    } catch (error) {
        console.error(error);
        res.status(500).send("Error fetching player");
    }
};

export const createPlayer = async (req, res) => {
    try {
        const { teamId } = req.params;
        const { name, number, position, height, age } = req.body;
        await Player.addPlayer(teamId, name, number, position, height, age);
        res.redirect("/teams/" + teamId + "/players");
    } catch (error) {
        console.error(error);
        res.status(500).send("Error creating player");
    }
};

export const renderEditPlayer = async (req, res) => {
    try {
        const player = await Player.searchPlayer(req.params.playerId);
        if (!player) {
            return res.status(404).render("404");
        }
        res.render("editPlayer", { player, user: req.session.user });
    } catch (error) {
        console.error(error);
        res.status(500).send("Error loading edit form");
    }
};

export const updatePlayer = async (req, res) => {
    try {
        const { playerId, teamId } = req.params;
        const { name, number, position, height, age } = req.body;
        await Player.modifyPlayer(playerId, teamId, name, number, position, height, age);
        res.redirect("/teams/" + teamId);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error updating player");
    }
};

export const deletePlayer = async (req, res) => {
    try {
        const { id } = req.params;
        const { team_id } = req.body;
        await Player.deletePlayer(id);
        res.redirect("/teams/" + team_id + "/players");
    } catch (error) {
        console.error(error);
        res.status(500).send("Error deleting player");
    }
};
