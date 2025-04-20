import pg from "pg";
import dotenv from "dotenv";
import bcrypt from "bcrypt";

dotenv.config();
const { Pool } = pg;

const pool = new Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
});

pool.on("connect", () => {
    console.log("Connected to PostgreSQL database");
});

const initializeDB = async () => {
    try {
        // Users table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                email VARCHAR(100) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                role VARCHAR(20) NOT NULL CHECK (role IN ('Administrator', 'Official', 'General User')),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log("Users table initialized");

        // Tournaments table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS tournaments (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                venue VARCHAR(255),
                start_date DATE,
                end_date DATE,
                organizer VARCHAR(255),
                contact VARCHAR(255),
                status VARCHAR(20) CHECK (status IN ('Upcoming', 'Ongoing', 'Completed')),
                description TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log("Tournaments table initialized");

        // Rounds table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS rounds (
                id SERIAL PRIMARY KEY,
                tournament_id INTEGER REFERENCES tournaments(id) ON DELETE CASCADE,
                name VARCHAR(100) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log("Rounds table initialized");

        // Teams table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS teams (
                id SERIAL PRIMARY KEY,
                name VARCHAR(100) UNIQUE NOT NULL,
                rank INTEGER,
                location VARCHAR(255),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log("Teams table initialized");

        // TournamentTeams join table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS tournament_teams (
                id SERIAL PRIMARY KEY,
                tournament_id INTEGER REFERENCES tournaments(id) ON DELETE CASCADE,
                team_id INTEGER REFERENCES teams(id) ON DELETE CASCADE,
                UNIQUE(tournament_id, team_id)
            );
        `);
        console.log("TournamentTeams join table initialized");

        // Players table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS players (
                id SERIAL PRIMARY KEY,
                team_id INTEGER REFERENCES teams(id) ON DELETE CASCADE,
                name VARCHAR(100) NOT NULL,
                number INTEGER,
                position VARCHAR(100),
                height VARCHAR(50),
                age INTEGER,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log("Players table initialized");

        // Games table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS games (
                id SERIAL PRIMARY KEY,
                round_id INTEGER REFERENCES rounds(id) ON DELETE CASCADE,
                team1_id INTEGER REFERENCES teams(id),
                team2_id INTEGER REFERENCES teams(id),
                winner_id INTEGER REFERENCES teams(id),
                time TIME,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log("Games table initialized");

        // Sets table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS sets (
                id SERIAL PRIMARY KEY,
                game_id INTEGER REFERENCES games(id) ON DELETE CASCADE,
                points1 INTEGER,
                points2 INTEGER,
                winner_id INTEGER REFERENCES teams(id),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log("Sets table initialized");

        // Create default admin user if not exists
        const result = await pool.query("SELECT * FROM users WHERE email = $1", ['admin@bva.org']);
        if (result.rows.length === 0) {
            const hashedPassword = await bcrypt.hash("password", 10);
            await pool.query(
                "INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4)",
                ['Admin', 'admin@bva.org', hashedPassword, 'Administrator']
            );
            console.log("Default Administrator created.");
        }
    } catch (error) {
        console.error("Database initialization error:", error);
    }
};

initializeDB();

export default pool;
