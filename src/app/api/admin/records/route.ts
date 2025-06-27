import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const type = url.searchParams.get('type');
  if (!type) {
    return NextResponse.json({ error: 'type missing' }, { status: 400 });
  }
  const client = await pool.connect();
  try {
    const query = `SELECT DISTINCT ON (project_name) * FROM ${type} ORDER BY project_name, recorded_at DESC`;
    const { rows } = await client.query(query);
    return NextResponse.json(rows);
  } finally {
    client.release();
  }
}

export async function POST(req: NextRequest) {
  const data = await req.json();
  const { type, record } = data;
  if (!type || !record) {
    return NextResponse.json({ error: 'invalid payload' }, { status: 400 });
  }
  const columns = Object.keys(record);
  const values = columns.map(k => record[k]);
  const placeholders = columns.map((_, i) => `$${i + 1}`).join(', ');
  const query = `INSERT INTO ${type}(${columns.join(', ')}, recorded_at) VALUES(${placeholders}, NOW()) RETURNING *`;
  const { rows } = await pool.query(query, values);
  return NextResponse.json(rows[0]);
}
