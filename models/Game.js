import pool from "../config/db.js";

class Game {
    constructor(id, round_id, team1_id, team2_id, winner_id, time) {
        this.id = id;
        this.round_id = round_id;
        this.team1_id = team1_id;
        this.team2_id = team2_id;
        this.winner_id = winner_id;
        this.time = time;
    }

    static async addGame(round_id, team1_id, team2_id, winner_id, time) {
        const result = await pool.query(
            "INSERT INTO games (round_id, team1_id, team2_id, winner_id, time) VALUES ($1, $2, $3, $4, $5) RETURNING *",
            [round_id, team1_id, team2_id, winner_id, time]
        );
        return result.rows[0];
    }

    static async deleteGame(id) {
        await pool.query("DELETE FROM games WHERE id = $1", [id]);
    }

    static async modifyGame(id, round_id, team1_id, team2_id, winner_id, time) {
        const result = await pool.query(
            "UPDATE games SET round_id = $1, team1_id = $2, team2_id = $3, winner_id = $4, time = $5 WHERE id = $6 RETURNING *",
            [round_id, team1_id, team2_id, winner_id, time, id]
        );
        return result.rows[0];
    }

    static async searchGame(id) {
        const result = await pool.query("SELECT * FROM games WHERE id = $1", [id]);
        return result.rows[0];
    }

    static async getGamesByRound(round_id) {
        const result = await pool.query("SELECT * FROM games WHERE round_id = $1 ORDER BY id", [round_id]);
        return result.rows;
    }
}

export default Game;
