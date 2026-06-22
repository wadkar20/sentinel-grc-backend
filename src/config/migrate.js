require("dotenv").config();
const pool = require("./db");

const SQL = `
CREATE TABLE IF NOT EXISTS companies (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  company_id INTEGER REFERENCES companies(id) ON DELETE CASCADE,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255),
  role VARCHAR(50) DEFAULT 'admin',
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS frameworks (
  id SERIAL PRIMARY KEY,
  company_id INTEGER REFERENCES companies(id) ON DELETE CASCADE,
  framework_key VARCHAR(50) NOT NULL,
  name VARCHAR(255) NOT NULL,
  control_count INTEGER DEFAULT 0,
  region VARCHAR(50) DEFAULT 'Global',
  active BOOLEAN DEFAULT false,
  UNIQUE(company_id, framework_key)
);

CREATE TABLE IF NOT EXISTS controls (
  id SERIAL PRIMARY KEY,
  company_id INTEGER REFERENCES companies(id) ON DELETE CASCADE,
  control_code VARCHAR(50) NOT NULL,
  name VARCHAR(255) NOT NULL,
  owner VARCHAR(255),
  frameworks TEXT[],
  evidence BOOLEAN DEFAULT false,
  evidence_notes TEXT,
  due_date DATE,
  status VARCHAR(50) DEFAULT 'In Review',
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS risks (
  id SERIAL PRIMARY KEY,
  company_id INTEGER REFERENCES companies(id) ON DELETE CASCADE,
  risk_code VARCHAR(50) NOT NULL,
  title VARCHAR(255) NOT NULL,
  severity VARCHAR(50),
  likelihood VARCHAR(50),
  impact VARCHAR(50),
  status VARCHAR(50) DEFAULT 'Open',
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS chat_history (
  id SERIAL PRIMARY KEY,
  company_id INTEGER REFERENCES companies(id) ON DELETE CASCADE,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  role VARCHAR(20) NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
`;

async function migrate() {
  try {
    await pool.query(SQL);
    console.log("✅ Migration complete — all tables created.");
    process.exit(0);
  } catch (err) {
    console.error("❌ Migration failed:", err);
    process.exit(1);
  }
}

migrate();
