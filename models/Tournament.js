import pool from "../config/db.js";

import TournamentTeam from "./TournamentTeam.js";

class Tournament {
    constructor(id, name, venue, start_date, end_date, organizer, contact, status, description) {
        this.id = id;
        this.name = name;
        this.venue = venue;
        this.start_date = start_date;
        this.end_date = end_date;
        this.organizer = organizer;
        this.contact = contact;
        this.status = status;
        this.description = description;
    }

    static async addTournament(name, venue, start_date, end_date, organizer, contact, status, description) {
        const result = await pool.query(
            "INSERT INTO tournaments (name, venue, start_date, end_date, organizer, contact, status, description) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *",
            [name, venue, start_date, end_date, organizer, contact, status, description]
        );
        return result.rows[0];
    }

    static async getTeamsForTournament(tournamentId) {
        const result = await pool.query(
            `SELECT t.* FROM teams t
             JOIN tournament_teams tt ON t.id = tt.team_id
             WHERE tt.tournament_id = $1`,
            [tournamentId]
        );
        return result.rows;
    }

    static async deleteTournament(id) {
        await pool.query("DELETE FROM tournaments WHERE id = $1", [id]);
    }

    static async modifyTournament(id, name, venue, start_date, end_date, organizer, contact, status, description) {
        const result = await pool.query(
            "UPDATE tournaments SET name = $1, venue = $2, start_date = $3, end_date = $4, organizer = $5, contact = $6, status = $7, description = $8 WHERE id = $9 RETURNING *",
            [name, venue, start_date, end_date, organizer, contact, status, description, id]
        );
        return result.rows[0];
    }

    static async searchTournament(id) {
        const result = await pool.query("SELECT * FROM tournaments WHERE id = $1", [id]);
        return result.rows[0];
    }

    static async getAllTournaments() {
        const result = await pool.query("SELECT * FROM tournaments ORDER BY start_date DESC");
        return result.rows;
    }
}

export default Tournament;
