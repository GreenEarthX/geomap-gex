import fs from 'fs';
import path from 'path';
import { Pool } from 'pg';
import * as XLSX from 'xlsx';

const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

async function importFile(filePath: string) {
  const workbook = XLSX.readFile(filePath);
  for (const sheetName of workbook.SheetNames) {
    const sheet = workbook.Sheets[sheetName];
    const rows: Record<string, any>[] = XLSX.utils.sheet_to_json(sheet, { defval: null });
    const table = sheetName.toLowerCase().replace(/\s+/g, '_');
    for (const row of rows) {
      // insert columns matching keys
      const columns = Object.keys(row);
      const values = columns.map(k => row[k]);
      const placeholders = columns.map((_, i) => `$${i + 1}`).join(', ');
      const query = `INSERT INTO ${table}(${columns.join(', ')}, recorded_at) VALUES(${placeholders}, NOW())`;
      await pool.query(query, values);
    }
  }
}

const file = path.join(process.cwd(), 'Map Database.xlsx');
importFile(file).then(() => {
  console.log('Import completed');
  pool.end();
}).catch(err => {
  console.error('Import failed', err);
  pool.end();
});
