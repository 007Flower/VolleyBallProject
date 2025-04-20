import Round from "../models/Round.js";

export const getRoundsByTournament = async (req, res) => {
    try {
        const rounds = await Round.getRoundsByTournament(req.params.tournamentId);
        res.render("rounds", { rounds, tournamentId: req.params.tournamentId, user: req.session.user });
    } catch (error) {
        console.error(error);
        res.status(500).send("Error fetching rounds");
    }
};

export const getRoundById = async (req, res) => {
    try {
        const round = await Round.searchRound(req.params.id);
        if (!round) {
            return res.status(404).render("404");
        }
        res.render("roundDetail", { round, user: req.session.user });
    } catch (error) {
        console.error(error);
        res.status(500).send("Error fetching round");
    }
};

export const createRound = async (req, res) => {
    try {
        const { tournamentId } = req.params;
        const { name } = req.body;
        await Round.addRound(tournamentId, name);
        res.redirect("/tournaments/" + tournamentId + "/rounds");
    } catch (error) {
        console.error(error);
        res.status(500).send("Error creating round");
    }
};

export const updateRound = async (req, res) => {
    try {
        const { id } = req.params;
        const { tournamentId } = req.body;
        const { name } = req.body;
        await Round.modifyRound(id, tournamentId, name);
        res.redirect("/tournaments/" + tournamentId + "/rounds/" + id);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error updating round");
    }
};

export const deleteRound = async (req, res) => {
    try {
        const { id } = req.params;
        const { tournamentId } = req.body;
        await Round.deleteRound(id);
        res.redirect("/tournaments/" + tournamentId + "/rounds");
    } catch (error) {
        console.error(error);
        res.status(500).send("Error deleting round");
    }
};
