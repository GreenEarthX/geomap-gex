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

const allowedColumns = [
  'excel_file',
  'excel_sheet',
  'project_name',
  'plant_name',
  'company_name',
  'owner_partner',
  'stakeholders',
  'contact_name',
  'contact_email',
  'country',
  'zip',
  'city',
  'street',
  'website',
  'project_status',
  'status_date',
  'project_stage',
  'project_type',
  'primary_product',
  'secondary_product',
  'product',
  'technology',
  'technology_fate_of_carbon',
  'end_use',
  'capacity_value',
  'capacity_unit',
  'capacity_description',
  'length_km',
  'operating_pressure_bar',
  'repurposed_new',
  'port_code',
  'investment_capex',
  'investment_capex_currency',
  'github_mapper_link',
];

function normalizeKey(key: string) {
  return key.trim().toLowerCase().replace(/\s+/g, '_');
}

async function importFile(filePath: string) {
  const workbook = XLSX.readFile(filePath);
  for (const sheetName of workbook.SheetNames) {
    const sheet = workbook.Sheets[sheetName];
    const rows: Record<string, any>[] = XLSX.utils.sheet_to_json(sheet, { defval: null });
    for (const row of rows) {
      const record: Record<string, any> = {
        excel_file: path.basename(filePath),
        excel_sheet: sheetName,
      };
      for (const key of Object.keys(row)) {
        const norm = normalizeKey(key);
        if (allowedColumns.includes(norm)) {
          record[norm] = row[key];
        }
      }
      const columns = Object.keys(record);
      const values = columns.map((k) => record[k]);
      const placeholders = columns.map((_, i) => `$${i + 1}`).join(', ');
      const query = `INSERT INTO project_data(${columns.join(', ')}) VALUES(${placeholders})`;
      await pool.query(query, values);
    }
  }
}

const file = path.join(process.cwd(), 'Mapdata.xlsm');
importFile(file)
  .then(() => {
    console.log('Import completed');
    pool.end();
  })
  .catch((err) => {
    console.error('Import failed', err);
    pool.end();
  });
