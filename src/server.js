require("dotenv").config();
const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth");
const frameworkRoutes = require("./routes/frameworks");
const controlRoutes = require("./routes/controls");
const riskRoutes = require("./routes/risks");
const aiRoutes = require("./routes/ai");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ status: "SENTINEL GRC API is running" });
});

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/auth", authRoutes);
app.use("/api/frameworks", frameworkRoutes);
app.use("/api/controls", controlRoutes);
app.use("/api/risks", riskRoutes);
app.use("/api/ai", aiRoutes);

app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ SENTINEL GRC API running on port ${PORT}`);
});
