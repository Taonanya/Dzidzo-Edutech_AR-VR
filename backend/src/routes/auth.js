import bcrypt from "bcryptjs";
import express from "express";
import { query } from "../config/db.js";
import { createAuthToken } from "../lib/jwt.js";
import {
  validateSigninPayload,
  validateSignupPayload
} from "../lib/validators.js";

export const authRouter = express.Router();

authRouter.post("/signup", async (req, res) => {
  const parsed = validateSignupPayload(req.body);

  if (!parsed.ok) {
    return res.status(400).json({ error: parsed.message });
  }

  const { fullName, email, password, role } = parsed.value;

  try {
    const existingUser = await query(
      "SELECT id FROM users WHERE email = $1 LIMIT 1",
      [email]
    );

    if (existingUser.rowCount > 0) {
      return res.status(409).json({ error: "An account with this email already exists." });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const result = await query(
      `
        INSERT INTO users (full_name, email, password_hash, role)
        VALUES ($1, $2, $3, $4)
        RETURNING id, full_name, email, role, created_at
      `,
      [fullName, email, passwordHash, role]
    );

    const user = result.rows[0];
    const token = createAuthToken(user);

    return res.status(201).json({
      message: "Account created successfully.",
      token,
      user
    });
  } catch (error) {
    return res.status(500).json({ error: "Failed to create account." });
  }
});

authRouter.post("/signin", async (req, res) => {
  const parsed = validateSigninPayload(req.body);

  if (!parsed.ok) {
    return res.status(400).json({ error: parsed.message });
  }

  const { email, password } = parsed.value;

  try {
    const result = await query(
      `
        SELECT id, full_name, email, password_hash, role, is_active
        FROM users
        WHERE email = $1
        LIMIT 1
      `,
      [email]
    );

    if (result.rowCount === 0) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    const user = result.rows[0];

    if (!user.is_active) {
      return res.status(403).json({ error: "This account is inactive." });
    }

    const passwordMatches = await bcrypt.compare(password, user.password_hash);

    if (!passwordMatches) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    const safeUser = {
      id: user.id,
      full_name: user.full_name,
      email: user.email,
      role: user.role
    };
    const token = createAuthToken(safeUser);

    return res.json({
      message: "Login successful.",
      token,
      user: safeUser
    });
  } catch (error) {
    return res.status(500).json({ error: "Failed to sign in." });
  }
});
