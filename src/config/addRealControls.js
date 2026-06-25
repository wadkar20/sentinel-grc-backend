// ============================================================
// One-time script: adds REAL framework-mapped controls
// to all existing companies in the database.
// Run with: node src/config/addRealControls.js
// ============================================================
require("dotenv").config();
const pool = require("./db");
const { REAL_CONTROLS } = require("./realControls");

const STATUSES = ["Compliant", "In Review", "Non-Compliant"];

function randomStatus(i) {
  // Deterministic-ish spread so the demo looks realistic:
  // ~60% Compliant, ~25% In Review, ~15% Non-Compliant
  const r = i % 10;
  if (r < 6) return "Compliant";
  if (r < 9) return "In Review";
  return "Non-Compliant";
}

function randomDueDate(i) {
  const base = new Date("2026-07-01");
  base.setDate(base.getDate() + (i % 30));
  return base.toISOString().slice(0, 10);
}

async function run() {
  const client = await pool.connect();
  try {
    const companies = await client.query("SELECT id, name FROM companies");
    console.log(`Found ${companies.rows.length} company(ies).`);

    for (const company of companies.rows) {
      console.log(`\nProcessing company: ${company.name} (id=${company.id})`);

      // Avoid duplicate inserts if this script is run twice
      const existing = await client.query(
        "SELECT control_code FROM controls WHERE company_id = $1",
        [company.id]
      );
      const existingCodes = new Set(existing.rows.map((r) => r.control_code));

      let inserted = 0;
      for (let i = 0; i < REAL_CONTROLS.length; i++) {
        const c = REAL_CONTROLS[i];
        if (existingCodes.has(c.code)) continue;

        await client.query(
          `INSERT INTO controls (company_id, control_code, name, owner, frameworks, evidence, due_date, status)
           VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
          [
            company.id,
            c.code,
            c.name,
            c.owner,
            c.frameworks,
            i % 3 === 0, // every 3rd control marked as having evidence
            randomDueDate(i),
            randomStatus(i),
          ]
        );
        inserted++;
      }
      console.log(`  → Inserted ${inserted} new real controls.`);
    }

    console.log("\n✅ Done — real framework controls added.");
    process.exit(0);
  } catch (err) {
    console.error("❌ Failed:", err);
    process.exit(1);
  } finally {
    client.release();
  }
}

run();
