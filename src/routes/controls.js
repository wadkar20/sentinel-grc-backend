const express = require("express");
const pool = require("../config/db");
const authMiddleware = require("../middleware/auth");

const router = express.Router();
router.use(authMiddleware);

router.get("/", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, control_code AS code, name, owner, frameworks, evidence, evidence_notes, 
              due_date, status 
       FROM controls WHERE company_id = $1 ORDER BY id`,
      [req.user.companyId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch controls" });
  }
});

router.post("/", async (req, res) => {
  const { name, owner, frameworks, dueDate } = req.body;
  if (!name || !owner) {
    return res.status(400).json({ error: "name and owner are required" });
  }
  try {
    const code = `CM-${Math.floor(Math.random() * 900 + 100)}`;
    const result = await pool.query(
      `INSERT INTO controls (company_id, control_code, name, owner, frameworks, evidence, due_date, status)
       VALUES ($1,$2,$3,$4,$5,false,$6,'In Review') RETURNING *`,
      [req.user.companyId, code, name, owner, frameworks || [], dueDate || null]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create control" });
  }
});

router.patch("/:id/status", async (req, res) => {
  const { status } = req.body;
  try {
    const result = await pool.query(
      "UPDATE controls SET status = $1 WHERE id = $2 AND company_id = $3 RETURNING *",
      [status, req.params.id, req.user.companyId]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: "Control not found" });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update status" });
  }
});

router.patch("/:id/evidence", async (req, res) => {
  try {
    const result = await pool.query(
      "UPDATE controls SET evidence = NOT evidence WHERE id = $1 AND company_id = $2 RETURNING *",
      [req.params.id, req.user.companyId]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: "Control not found" });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to toggle evidence" });
  }
});

router.patch("/:id/notes", async (req, res) => {
  const { notes } = req.body;
  try {
    const result = await pool.query(
      "UPDATE controls SET evidence_notes = $1 WHERE id = $2 AND company_id = $3 RETURNING *",
      [notes, req.params.id, req.user.companyId]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: "Control not found" });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update notes" });
  }
});

module.exports = router;
