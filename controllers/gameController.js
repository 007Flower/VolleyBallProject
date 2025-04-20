import Game from "../models/Game.js";

export const getGamesByRound = async (req, res) => {
    try {
        const games = await Game.getGamesByRound(req.params.roundId);
        res.render("games", { games, roundId: req.params.roundId, user: req.session.user });
    } catch (error) {
        console.error(error);
        res.status(500).send("Error fetching games");
    }
};

export const getGameById = async (req, res) => {
    try {
        const game = await Game.searchGame(req.params.id);
        if (!game) {
            return res.status(404).render("404");
        }
        res.render("gameDetail", { game, user: req.session.user });
    } catch (error) {
        console.error(error);
        res.status(500).send("Error fetching game");
    }
};

export const createGame = async (req, res) => {
    try {
        const { roundId } = req.params;
        const { team1_id, team2_id, winner_id, time } = req.body;
        await Game.addGame(roundId, team1_id, team2_id, winner_id, time);
        res.redirect("/rounds/" + roundId + "/games");
    } catch (error) {
        console.error(error);
        res.status(500).send("Error creating game");
    }
};

export const updateGame = async (req, res) => {
    try {
        const { id } = req.params;
        const { round_id, team1_id, team2_id, winner_id, time } = req.body;
        await Game.modifyGame(id, round_id, team1_id, team2_id, winner_id, time);
        res.redirect("/games/" + id);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error updating game");
    }
};

export const deleteGame = async (req, res) => {
    try {
        const { id } = req.params;
        const { round_id } = req.body;
        await Game.deleteGame(id);
        res.redirect("/rounds/" + round_id + "/games");
    } catch (error) {
        console.error(error);
        res.status(500).send("Error deleting game");
    }
};
