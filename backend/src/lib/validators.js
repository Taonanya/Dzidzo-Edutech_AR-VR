const ROLES = new Set(["admin", "teacher", "student"]);

export function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

export function normalizeRole(role) {
  return String(role || "student").trim().toLowerCase();
}

export function validateSignupPayload(payload) {
  const fullName = String(payload.full_name || payload.fullName || "").trim();
  const email = normalizeEmail(payload.email);
  const password = String(payload.password || "");
  const role = normalizeRole(payload.role);

  if (!fullName) {
    return { ok: false, message: "Full name is required." };
  }

  if (!email) {
    return { ok: false, message: "Email is required." };
  }

  if (password.length < 8) {
    return { ok: false, message: "Password must be at least 8 characters." };
  }

  if (!ROLES.has(role)) {
    return { ok: false, message: "Role must be admin, teacher, or student." };
  }

  return {
    ok: true,
    value: { fullName, email, password, role }
  };
}

export function validateSigninPayload(payload) {
  const email = normalizeEmail(payload.email);
  const password = String(payload.password || "");

  if (!email) {
    return { ok: false, message: "Email is required." };
  }

  if (!password) {
    return { ok: false, message: "Password is required." };
  }

  return {
    ok: true,
    value: { email, password }
  };
}
