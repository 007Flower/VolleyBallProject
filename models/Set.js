import pool from "../config/db.js";

class Set {
    constructor(id, game_id, points1, points2, winner_id) {
        this.id = id;
        this.game_id = game_id;
        this.points1 = points1;
        this.points2 = points2;
        this.winner_id = winner_id;
    }

    static async addSet(game_id, points1, points2, winner_id) {
        const result = await pool.query(
            "INSERT INTO sets (game_id, points1, points2, winner_id) VALUES ($1, $2, $3, $4) RETURNING *",
            [game_id, points1, points2, winner_id]
        );
        return result.rows[0];
    }

    static async deleteSet(id) {
        await pool.query("DELETE FROM sets WHERE id = $1", [id]);
    }

    static async modifySet(id, game_id, points1, points2, winner_id) {
        const result = await pool.query(
            "UPDATE sets SET game_id = $1, points1 = $2, points2 = $3, winner_id = $4 WHERE id = $5 RETURNING *",
            [game_id, points1, points2, winner_id, id]
        );
        return result.rows[0];
    }

    static async searchSet(id) {
        const result = await pool.query("SELECT * FROM sets WHERE id = $1", [id]);
        return result.rows[0];
    }

    static async getSetsByGame(game_id) {
        const result = await pool.query("SELECT * FROM sets WHERE game_id = $1 ORDER BY id", [game_id]);
        return result.rows;
    }
}

export default Set;
