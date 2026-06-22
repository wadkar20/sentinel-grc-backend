const express = require("express");
const pool = require("../config/db");
const authMiddleware = require("../middleware/auth");

const router = express.Router();
router.use(authMiddleware);

router.get("/", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, framework_key AS key, name, control_count AS controls, region, active FROM frameworks WHERE company_id = $1 ORDER BY id",
      [req.user.companyId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch frameworks" });
  }
});

router.patch("/:id/toggle", async (req, res) => {
  try {
    const result = await pool.query(
      "UPDATE frameworks SET active = NOT active WHERE id = $1 AND company_id = $2 RETURNING id, framework_key AS key, name, control_count AS controls, region, active",
      [req.params.id, req.user.companyId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Framework not found" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to toggle framework" });
  }
});

module.exports = router;
