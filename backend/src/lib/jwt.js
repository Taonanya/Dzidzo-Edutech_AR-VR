import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

if (!env.jwtSecret) {
  throw new Error("JWT_SECRET is required.");
}

export function createAuthToken(user) {
  return jwt.sign(
    {
      sub: user.id,
      email: user.email,
      role: user.role
    },
    env.jwtSecret,
    {
      expiresIn: "12h"
    }
  );
}

export function verifyAuthToken(token) {
  return jwt.verify(token, env.jwtSecret);
}
