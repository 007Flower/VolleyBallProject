import pool from "../config/db.js";

class Player {
    constructor(id, team_id, name, number, position, height, age) {
        this.id = id;
        this.team_id = team_id;
        this.name = name;
        this.number = number;
        this.position = position;
        this.height = height;
        this.age = age;
    }

    static async addPlayer(team_id, name, number, position, height, age) {
        const result = await pool.query(
            "INSERT INTO players (team_id, name, number, position, height, age) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
            [team_id, name, number, position, height, age]
        );
        return result.rows[0];
    }

    static async deletePlayer(id) {
        await pool.query("DELETE FROM players WHERE id = $1", [id]);
    }

    static async modifyPlayer(id, team_id, name, number, position, height, age) {
        const result = await pool.query(
            "UPDATE players SET team_id = $1, name = $2, number = $3, position = $4, height = $5, age = $6 WHERE id = $7 RETURNING *",
            [team_id, name, number, position, height, age, id]
        );
        return result.rows[0];
    }

    static async searchPlayer(id) {
        const result = await pool.query("SELECT * FROM players WHERE id = $1", [id]);
        return result.rows[0];
    }

    static async getPlayersByTeam(team_id) {
        const result = await pool.query("SELECT * FROM players WHERE team_id = $1 ORDER BY number", [team_id]);
        return result.rows;
    }
}

export default Player;
