-- Combined normalized table for all project data
CREATE TABLE project_data (
    id SERIAL PRIMARY KEY,
    internal_no INTEGER NOT NULL,
    excel_file TEXT NOT NULL,
    excel_sheet TEXT NOT NULL,
    data JSONB NOT NULL,
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
