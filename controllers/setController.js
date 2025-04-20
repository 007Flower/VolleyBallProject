import Set from "../models/Set.js";

export const getSetsByGame = async (req, res) => {
    try {
        const sets = await Set.getSetsByGame(req.params.gameId);
        res.render("sets", { sets, gameId: req.params.gameId, user: req.session.user });
    } catch (error) {
        console.error(error);
        res.status(500).send("Error fetching sets");
    }
};

export const getSetById = async (req, res) => {
    try {
        const set = await Set.searchSet(req.params.id);
        if (!set) {
            return res.status(404).render("404");
        }
        res.render("setDetail", { set, user: req.session.user });
    } catch (error) {
        console.error(error);
        res.status(500).send("Error fetching set");
    }
};

export const createSet = async (req, res) => {
    try {
        const { gameId } = req.params;
        const { points1, points2, winner_id } = req.body;
        await Set.addSet(gameId, points1, points2, winner_id);
        res.redirect("/games/" + gameId + "/sets");
    } catch (error) {
        console.error(error);
        res.status(500).send("Error creating set");
    }
};

export const updateSet = async (req, res) => {
    try {
        const { id } = req.params;
        const { game_id, points1, points2, winner_id } = req.body;
        await Set.modifySet(id, game_id, points1, points2, winner_id);
        res.redirect("/sets/" + id);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error updating set");
    }
};

export const deleteSet = async (req, res) => {
    try {
        const { id } = req.params;
        const { game_id } = req.body;
        await Set.deleteSet(id);
        res.redirect("/games/" + game_id + "/sets");
    } catch (error) {
        console.error(error);
        res.status(500).send("Error deleting set");
    }
};
