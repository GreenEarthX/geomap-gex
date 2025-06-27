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

function normalizeKey(key: string) {
  return key.trim().toLowerCase().replace(/\s+/g, '_');
}

async function importFile(filePath: string) {
  const workbook = XLSX.readFile(filePath);
  for (const sheetName of workbook.SheetNames) {
    const sheet = workbook.Sheets[sheetName];
    const rows: Record<string, any>[] = XLSX.utils.sheet_to_json(sheet, { defval: null });
    let counter = 1;
    for (const row of rows) {
      const data: Record<string, any> = {};
      for (const key of Object.keys(row)) {
        data[normalizeKey(key)] = row[key];
      }
      const query = `INSERT INTO project_data(internal_no, excel_file, excel_sheet, data) VALUES($1, $2, $3, $4)`;
      await pool.query(query, [
        counter++,
        path.basename(filePath),
        sheetName,
        JSON.stringify(data),
      ]);
    }
  }
}

const file = path.join(process.cwd(), 'Map Database.xlsx');
importFile(file)
  .then(() => {
    console.log('Import completed');
    pool.end();
  })
  .catch((err) => {
    console.error('Import failed', err);
    pool.end();
  });
