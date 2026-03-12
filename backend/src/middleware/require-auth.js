import { query } from "../config/db.js";
import { verifyAuthToken } from "../lib/jwt.js";

export async function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization || "";
  const [scheme, token] = authHeader.split(" ");

  if (scheme !== "Bearer" || !token) {
    return res.status(401).json({ error: "Authorization token is required." });
  }

  try {
    const payload = verifyAuthToken(token);
    const result = await query(
      `
        SELECT id, full_name, email, role, is_active
        FROM users
        WHERE id = $1
        LIMIT 1
      `,
      [payload.sub]
    );

    if (result.rowCount === 0) {
      return res.status(401).json({ error: "Invalid token." });
    }

    const user = result.rows[0];

    if (!user.is_active) {
      return res.status(403).json({ error: "This account is inactive." });
    }

    req.user = user;
    return next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid or expired token." });
  }
}
