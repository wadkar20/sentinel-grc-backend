const express = require("express");
const pool = require("../config/db");
const authMiddleware = require("../middleware/auth");

const router = express.Router();
router.use(authMiddleware);

router.get("/", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, risk_code AS code, title, severity, likelihood, impact, status
       FROM risks WHERE company_id = $1 ORDER BY id`,
      [req.user.companyId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch risks" });
  }
});

router.post("/", async (req, res) => {
  const { title, severity, likelihood, impact } = req.body;
  if (!title) return res.status(400).json({ error: "title is required" });
  try {
    const code = `RISK-${Math.floor(Math.random() * 90 + 10)}`;
    const result = await pool.query(
      `INSERT INTO risks (company_id, risk_code, title, severity, likelihood, impact, status)
       VALUES ($1,$2,$3,$4,$5,$6,'Open') RETURNING *`,
      [req.user.companyId, code, title, severity || "Medium", likelihood || "Medium", impact || "Medium"]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create risk" });
  }
});

router.patch("/:id/status", async (req, res) => {
  const { status } = req.body;
  try {
    const result = await pool.query(
      "UPDATE risks SET status = $1 WHERE id = $2 AND company_id = $3 RETURNING *",
      [status, req.params.id, req.user.companyId]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: "Risk not found" });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update risk" });
  }
});

module.exports = router;
