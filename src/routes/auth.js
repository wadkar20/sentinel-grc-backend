const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../config/db");
const { REAL_CONTROLS } = require("../config/realControls");

const router = express.Router();

const DEFAULT_FRAMEWORKS = [
  { key: "SOC2", name: "SOC 2 Type II", controls: 64, region: "Global", active: true },
  { key: "ISO", name: "ISO 27001:2022", controls: 93, region: "Global", active: true },
  { key: "PCI", name: "PCI DSS v4.0", controls: 243, region: "Global", active: false },
  { key: "HIPAA", name: "HIPAA Security Rule", controls: 45, region: "Global", active: false },
  { key: "DPDP", name: "DPDP Act 2023", controls: 38, region: "India", active: true },
  { key: "RBI", name: "RBI Cyber Security Framework", controls: 52, region: "India", active: false },
  { key: "CERT", name: "CERT-In Guidelines", controls: 28, region: "India", active: false },
];

function statusForIndex(i) {
  const r = i % 10;
  if (r < 6) return "Compliant";
  if (r < 9) return "In Review";
  return "Non-Compliant";
}

function dueDateForIndex(i) {
  const base = new Date("2026-07-01");
  base.setDate(base.getDate() + (i % 30));
  return base.toISOString().slice(0, 10);
}

const DEFAULT_RISKS = [
  ["RISK-01", "Unencrypted backup snapshots", "Critical", "Medium", "High", "Open"],
  ["RISK-02", "No formal vendor risk review", "High", "High", "Medium", "Open"],
  ["RISK-03", "Delayed breach notification SOP", "High", "Low", "High", "In Review"],
  ["RISK-04", "Stale vulnerability scan results", "Medium", "Medium", "Medium", "Open"],
];

router.post("/signup", async (req, res) => {
  const { companyName, email, password, name } = req.body;
  if (!companyName || !email || !password) {
    return res.status(400).json({ error: "companyName, email, and password are required" });
  }

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const existing = await client.query("SELECT id FROM users WHERE email = $1", [email]);
    if (existing.rows.length > 0) {
      await client.query("ROLLBACK");
      return res.status(409).json({ error: "Email already registered" });
    }

    const companyResult = await client.query(
      "INSERT INTO companies (name) VALUES ($1) RETURNING id",
      [companyName]
    );
    const companyId = companyResult.rows[0].id;

    const passwordHash = await bcrypt.hash(password, 10);
    const userResult = await client.query(
      "INSERT INTO users (company_id, email, password_hash, name, role) VALUES ($1, $2, $3, $4, 'admin') RETURNING id, email, name, role",
      [companyId, email, passwordHash, name || email]
    );

    for (const fw of DEFAULT_FRAMEWORKS) {
      await client.query(
        "INSERT INTO frameworks (company_id, framework_key, name, control_count, region, active) VALUES ($1,$2,$3,$4,$5,$6)",
        [companyId, fw.key, fw.name, fw.controls, fw.region, fw.active]
      );
    }

    for (let i = 0; i < REAL_CONTROLS.length; i++) {
      const c = REAL_CONTROLS[i];
      await client.query(
        "INSERT INTO controls (company_id, control_code, name, owner, frameworks, evidence, due_date, status) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)",
        [
          companyId,
          c.code,
          c.name,
          c.owner,
          c.frameworks,
          i % 3 === 0,
          dueDateForIndex(i),
          statusForIndex(i),
        ]
      );
    }

    for (const r of DEFAULT_RISKS) {
      await client.query(
        "INSERT INTO risks (company_id, risk_code, title, severity, likelihood, impact, status) VALUES ($1,$2,$3,$4,$5,$6,$7)",
        [companyId, r[0], r[1], r[2], r[3], r[4], r[5]]
      );
    }

    await client.query("COMMIT");

    const token = jwt.sign(
      { userId: userResult.rows[0].id, companyId, email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({ token, user: userResult.rows[0], companyId });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error(err);
    res.status(500).json({ error: "Signup failed" });
  } finally {
    client.release();
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "email and password are required" });
  }

  try {
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (result.rows.length === 0) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const user = result.rows[0];
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const token = jwt.sign(
      { userId: user.id, companyId: user.company_id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
      companyId: user.company_id,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Login failed" });
  }
});

module.exports = router;
