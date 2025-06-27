'use client';
import { useEffect, useState } from 'react';

interface RecordData {
  [key: string]: any;
}

export default function AdminPage() {
  const [type, setType] = useState('');
  const [records, setRecords] = useState<RecordData[]>([]);
  const [editing, setEditing] = useState<RecordData | null>(null);

  const load = async () => {
    const url = type ? `/api/admin/records?type=${type}` : '/api/admin/records';
    const res = await fetch(url);
    const data = await res.json();
    setRecords(data);
  };

  useEffect(() => {
    load();
  }, [type]);

  const save = async (rec: RecordData) => {
    await fetch('/api/admin/records', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ record: rec }),
    });
    setEditing(null);
    load();
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Admin</h1>
      <input
        placeholder="project_type filter"
        value={type}
        onChange={(e) => setType(e.target.value)}
      />
      <button onClick={() => setEditing({})}>Add</button>
      <table border={1} cellPadding={4} style={{ marginTop: 20 }}>
        <thead>
          <tr>
            {records[0] && Object.keys(records[0]).map((k) => <th key={k}>{k}</th>)}
          </tr>
        </thead>
        <tbody>
          {records.map((r, i) => (
            <tr key={i} onClick={() => setEditing(r)}>
              {Object.keys(r).map((k) => (
                <td key={k}>{String(r[k])}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {editing && (
        <div style={{ marginTop: 20 }}>
          {Object.keys(records[0] || {}).map((k) => (
            <div key={k}>
              <label>{k}</label>
              <input
                value={editing[k] || ''}
                onChange={(e) => setEditing({ ...editing, [k]: e.target.value })}
              />
            </div>
          ))}
          <button onClick={() => save(editing)}>Save</button>
          <button onClick={() => setEditing(null)}>Cancel</button>
        </div>
      )}
    </div>
  );
}
