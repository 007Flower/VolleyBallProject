import pool from "../config/db.js";
import bcrypt from "bcrypt";

class User {
    constructor(id, name, email, password, role) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.password = password;
        this.role = role;
    }

    static async addUser(name, email, password, role) {
        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await pool.query(
            "INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING *",
            [name, email, hashedPassword, role]
        );
        return result.rows[0];
    }

    static async deleteUser(id) {
        await pool.query("DELETE FROM users WHERE id = $1", [id]);
    }

    static async modifyUser(id, name, email, password, role) {
        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await pool.query(
            "UPDATE users SET name = $1, email = $2, password = $3, role = $4 WHERE id = $5 RETURNING *",
            [name, email, hashedPassword, role, id]
        );
        return result.rows[0];
    }

    static async searchUser(id) {
        const result = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
        return result.rows[0];
    }

    static async findByEmail(email) {
        const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
        return result.rows[0];
    }
}

export default User;
