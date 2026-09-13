import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

export interface Rsvp {
  id?: number;
  name: string;
  email?: string;
  status: string;
  created_at?: string;
}

export async function getRsvps(): Promise<Rsvp[]> {
  const result = await pool.query('SELECT * FROM rsvps ORDER BY created_at DESC');
  return result.rows;
}

export async function addRsvp(data: { name: string; email?: string; status: string }): Promise<Rsvp> {
  const query = `
    INSERT INTO rsvps (name, email, status)
    VALUES ($1, $2, $3)
    RETURNING *;
  `;
  const values = [data.name, data.email || null, data.status];
  const result = await pool.query(query, values);
  return result.rows[0];
}
