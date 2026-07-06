import { pool } from "../src/db/dbConnect.js";

async function reset() {

    try {

        await pool.query(`
            TRUNCATE
                clicks,
                links,
                users
            RESTART IDENTITY
            CASCADE;
        `);

        console.log("✓ Test database reset.");

    } catch (err) {

        console.error(err);

    } finally {

        await pool.end();

    }

}

reset();