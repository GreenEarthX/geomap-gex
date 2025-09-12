import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const type = url.searchParams.get('type');
  const client = await pool.connect();
  try {
    const base = `SELECT DISTINCT ON (data->>'project_name') id, internal_no, excel_file, excel_sheet, data, recorded_at FROM project_data`;
    const order = ` ORDER BY data->>'project_name', recorded_at DESC`;
    if (type) {
      const { rows } = await client.query(
        base + ` WHERE data->>'project_type' = $1` + order,
        [type]
      );
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
  if (!record || !record.data) {
    return NextResponse.json({ error: 'invalid payload' }, { status: 400 });
  }
  const query = `INSERT INTO project_data(internal_no, excel_file, excel_sheet, data, recorded_at) VALUES($1, $2, $3, $4, NOW()) RETURNING *`;
  const values = [record.internal_no, record.excel_file, record.excel_sheet, JSON.stringify(record.data)];
  const { rows } = await pool.query(query, values);
  return NextResponse.json(rows[0]);
}
