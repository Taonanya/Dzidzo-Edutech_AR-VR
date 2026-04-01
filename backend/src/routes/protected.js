import express from "express";
import { asyncHandler } from "../lib/http.js";
import { requireAuth } from "../middleware/require-auth.js";

export const protectedRouter = express.Router();

protectedRouter.get("/me", requireAuth, asyncHandler(async (req, res) => {
  res.json({
    user: req.user
  });
}));
