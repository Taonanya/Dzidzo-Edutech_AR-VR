import express from "express";
import { requireAuth } from "../middleware/require-auth.js";

export const protectedRouter = express.Router();

protectedRouter.get("/me", requireAuth, (req, res) => {
  res.json({
    user: req.user
  });
});
