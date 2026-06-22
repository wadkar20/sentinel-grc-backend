const express = require("express");
const pool = require("../config/db");
const authMiddleware = require("../middleware/auth");

const router = express.Router();
router.use(authMiddleware);

router.get("/history", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT role, message, created_at FROM chat_history WHERE company_id = $1 ORDER BY id ASC LIMIT 100",
      [req.user.companyId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch chat history" });
  }
});

router.post("/message", async (req, res) => {
  const { message, contextSummary } = req.body;
  if (!message) return res.status(400).json({ error: "message is required" });

  try {
    await pool.query(
      "INSERT INTO chat_history (company_id, user_id, role, message) VALUES ($1,$2,'user',$3)",
      [req.user.companyId, req.user.userId, message]
    );

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 800,
        system:
          "You are a GRC (Governance, Risk & Compliance) expert specialised in SOC 2, ISO 27001, PCI DSS, HIPAA, DPDP Act 2023, RBI Cyber Security Framework, and CERT-In Guidelines. Give concise, actionable advice in 3-5 sentences unless asked for a longer document.",
        messages: [
          {
            role: "user",
            content: contextSummary ? `Context: ${contextSummary}\n\nQuestion: ${message}` : message,
          },
        ],
      }),
    });

    const data = await response.json();
    const replyText =
      data?.content?.find((b) => b.type === "text")?.text ||
      "Sorry, I couldn't generate a response right now.";

    await pool.query(
      "INSERT INTO chat_history (company_id, user_id, role, message) VALUES ($1,$2,'assistant',$3)",
      [req.user.companyId, req.user.userId, replyText]
    );

    res.json({ reply: replyText });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "AI request failed" });
  }
});

module.exports = router;
