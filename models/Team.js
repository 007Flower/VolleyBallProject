import pool from "../config/db.js";

class Team {
    constructor(id, name, rank, location) {
        this.id = id;
        this.name = name;
        this.rank = rank;
        this.location = location;
    }

    static async addTeam(name, rank, location) {
        const result = await pool.query(
            "INSERT INTO teams (name, rank, location) VALUES ($1, $2, $3) RETURNING *",
            [name, rank, location]
        );
        return result.rows[0];
    }

    static async deleteTeam(id) {
        await pool.query("DELETE FROM teams WHERE id = $1", [id]);
    }

    static async modifyTeam(id, name, rank, location) {
        const result = await pool.query(
            "UPDATE teams SET name = $1, rank = $2, location = $3 WHERE id = $4 RETURNING *",
            [name, rank, location, id]
        );
        return result.rows[0];
    }

    static async searchTeam(id) {
        const result = await pool.query("SELECT * FROM teams WHERE id = $1", [id]);
        return result.rows[0];
    }

    static async getAllTeams() {
        const result = await pool.query("SELECT * FROM teams ORDER BY rank ASC");
        return result.rows;
    }
}

export default Team;
