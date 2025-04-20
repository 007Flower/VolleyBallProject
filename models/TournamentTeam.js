import pool from "../config/db.js";

class TournamentTeam {
  constructor(id, tournament_id, team_id) {
    this.id = id;
    this.tournament_id = tournament_id;
    this.team_id = team_id;
  }

  static async addTeamToTournament(tournament_id, team_id) {
    const query = `
      INSERT INTO tournament_teams (tournament_id, team_id)
      VALUES ($1, $2)
      ON CONFLICT (tournament_id, team_id) DO NOTHING
      RETURNING *;
    `;
    const values = [tournament_id, team_id];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async removeTeamFromTournament(tournament_id, team_id) {
    const query = `
      DELETE FROM tournament_teams
      WHERE tournament_id = $1 AND team_id = $2;
    `;
    const values = [tournament_id, team_id];
    await pool.query(query, values);
  }

  static async getTeamsByTournament(tournament_id) {
    const query = `
      SELECT t.*
      FROM teams t
      JOIN tournament_teams tt ON t.id = tt.team_id
      WHERE tt.tournament_id = $1;
    `;
    const values = [tournament_id];
    const result = await pool.query(query, values);
    return result.rows;
  }

  static async countTeamsInTournament(tournament_id) {
    const query = `
      SELECT COUNT(*) AS count
      FROM tournament_teams
      WHERE tournament_id = $1;
    `;
    const values = [tournament_id];
    const result = await pool.query(query, values);
    return parseInt(result.rows[0].count, 10);
  }
}

export default TournamentTeam;
