import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const type = url.searchParams.get('type');
  const client = await pool.connect();
  try {
    const base = `SELECT DISTINCT ON (project_name) * FROM project_data`;
    const order = ` ORDER BY project_name, recorded_at DESC`;
    if (type) {
      const { rows } = await client.query(base + ' WHERE project_type = $1' + order, [type]);
      return NextResponse.json(rows);
    } else {
      const { rows } = await client.query(base + order);
      return NextResponse.json(rows);
    }
  } finally {
    client.release();
  }
}

export async function POST(req: NextRequest) {
  const data = await req.json();
  const { record } = data;
  if (!record) {
    return NextResponse.json({ error: 'invalid payload' }, { status: 400 });
  }
  const columns = Object.keys(record);
  const values = columns.map((k) => record[k]);
  const placeholders = columns.map((_, i) => `$${i + 1}`).join(', ');
  const query = `INSERT INTO project_data(${columns.join(', ')}, recorded_at) VALUES(${placeholders}, NOW()) RETURNING *`;
  const { rows } = await pool.query(query, values);
  return NextResponse.json(rows[0]);
}
