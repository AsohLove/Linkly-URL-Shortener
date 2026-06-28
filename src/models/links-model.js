import { pool } from "../db/dbConnect.js";

export async function create({
    code,
    target_url,
    expires_at
}) {
    const { rows } = await pool.query(
        `
        INSERT INTO links
        (
            code,
            target_url,
            expires_at
        )
        VALUES
        (
            $1,
            $2,
            $3
        )
        RETURNING *
        `,
        [
            code,
            target_url,
            expires_at ?? null
        ]
    );

    return rows[0];
}