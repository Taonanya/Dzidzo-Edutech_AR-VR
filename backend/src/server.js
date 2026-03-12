import cors from "cors";
import express from "express";
import { pool } from "./config/db.js";
import { env } from "./config/env.js";
import { adminRouter } from "./routes/admin.js";
import { authRouter } from "./routes/auth.js";
import { protectedRouter } from "./routes/protected.js";
import { publicRouter } from "./routes/public.js";

const app = express();

app.use(
  cors({
    origin: env.frontendOrigin === "*" ? true : env.frontendOrigin
  })
);
app.use(express.json());

app.get("/api/health", async (_req, res) => {
  try {
    await pool.query("SELECT 1");
    return res.json({ status: "ok", database: "connected" });
  } catch (error) {
    return res.status(500).json({ status: "error", database: "disconnected" });
  }
});

app.use("/api/auth", authRouter);
app.use("/api/public", publicRouter);
app.use("/api", protectedRouter);
app.use("/api/admin", adminRouter);

app.use((_req, res) => {
  res.status(404).json({ error: "Not found." });
});

app.listen(env.port, () => {
  console.log(`Dzidzo backend listening on http://localhost:${env.port}`);
});
