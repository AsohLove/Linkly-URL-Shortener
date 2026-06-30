import { pool } from "../db/dbConnect.js";

export async function create({
    code,
    target_url,
    expires_at,
    user_id
}) {
    const { rows } = await pool.query(
        `
        INSERT INTO links
        ( code, target_url, expires_at , user_id ) VALUES
        ( $1, $2, $3, $4
        )
        RETURNING *
        `,
        [ code, target_url, expires_at ?? null , user_id]
    );

    return rows[0];
}


export async function findLinkByCode(code) {
  const { rows } = await pool.query(
    `
    SELECT * 
    FROM links 
    WHERE code = $1
    `, 
      [code]
  );

  return rows[0];
}

export async function clickCount(linkId, referrer, userAgent) {

  const client = await pool.connect();
  try {
      await client.query('BEGIN');

      await client.query(
        ` 
        UPDATE links
        SET click_count = click_count + 1
        WHERE id = $1
      
        `,
          [linkId]
      );

     await client.query(
            `
            INSERT INTO clicks
            ( link_id, referrer, user_agent ) VALUES
            ( $1, $2, $3 )
           
            `,
            [ linkId, referrer, userAgent ]
        );

      await client.query('COMMIT');

  } catch (err) {

      await client.query('ROLLBACK');

      throw err;
    
  } finally {
      client.release();
  }
}


export async function getMetadata(code, user_id) {

  const { rows } = await pool.query(
    `
    SELECT 
      code, target_url, click_count, created_at, expires_at
    FROM links
    WHERE code = $1
    AND user_id = $2
    

    `, [code, user_id]
  );

  return rows[0];
}

export async function remove(code, user_id) {

  const result = await pool.query(
    `
    DELETE FROM links
    WHERE code = $1
    AND user_id = $2
    

    `, [code, user_id]
  );

  return result.rowCount
}


export async function getLinkClicks (code, user_id, after = 0, limit = 10) {

  const { rows } = await pool.query(
    `
    SELECT 
      c.id, c.clicked_at, c.referrer, c.user_agent
    FROM clicks c
    JOIN links l
      ON c.link_id = l.id
    WHERE l.code = $1 AND l.user_id = $2 AND c.id > $3
    ORDER BY c.id
    LIMIT $3
    
    `, [code, after, limit]
  );

  return rows;
}

