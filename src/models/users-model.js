import { pool } from "../db/dbConnect.js";

export async function create(email, hashedPassword) {
    const { rows } = await pool.query(
        `
        INSERT INTO users
            (email, password_hash)
        VALUES 
            ($1, $2)
        RETURNING id, email, created_at

        `, [email, hashedPassword]
    );

    return rows[0];
}