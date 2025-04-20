import pool from "../config/db.js";

class Round {
    constructor(id, tournament_id, name) {
        this.id = id;
        this.tournament_id = tournament_id;
        this.name = name;
    }

    static async addRound(tournament_id, name) {
        const result = await pool.query(
            "INSERT INTO rounds (tournament_id, name) VALUES ($1, $2) RETURNING *",
            [tournament_id, name]
        );
        return result.rows[0];
    }

    static async deleteRound(id) {
        await pool.query("DELETE FROM rounds WHERE id = $1", [id]);
    }

    static async modifyRound(id, tournament_id, name) {
        const result = await pool.query(
            "UPDATE rounds SET tournament_id = $1, name = $2 WHERE id = $3 RETURNING *",
            [tournament_id, name, id]
        );
        return result.rows[0];
    }

    static async searchRound(id) {
        const result = await pool.query("SELECT * FROM rounds WHERE id = $1", [id]);
        return result.rows[0];
    }

    static async getRoundsByTournament(tournament_id) {
        const result = await pool.query("SELECT * FROM rounds WHERE tournament_id = $1 ORDER BY id", [tournament_id]);
        return result.rows;
    }
}

export default Round;
