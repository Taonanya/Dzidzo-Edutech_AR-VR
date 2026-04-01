function getApiBaseUrl() {
  const rawBaseUrl = window.DZIDZO_API_BASE_URL || "http://localhost:4000";

  try {
    return new URL(rawBaseUrl).origin;
  } catch (_error) {
    return "http://localhost:4000";
  }
}

const API_BASE_URL = getApiBaseUrl();

function redirectToSignin() {
  window.location.href = "../pages/sign-in.html";
}

function updateText(target, value) {
  if (!target || value === undefined || value === null) {
    return;
  }

  target.textContent = value;
}

function updateAll(selector, value) {
  document.querySelectorAll(selector).forEach((node) => {
    updateText(node, value);
  });
}

function getInitials(name) {
  if (!name) {
    return "DZ";
  }

  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}

function formatRole(role) {
  if (!role) {
    return "";
  }

  return role.charAt(0).toUpperCase() + role.slice(1);
}

async function loadCurrentUser() {
  const token = localStorage.getItem("dzidzoToken");

  if (!token) {
    redirectToSignin();
    return;
  }

  const response = await fetch(`${API_BASE_URL}/api/me`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  if (!response.ok) {
    localStorage.removeItem("dzidzoToken");
    localStorage.removeItem("dzidzoUser");
    redirectToSignin();
    return;
  }

  const result = await response.json();
  const user = result.user;
  const nameNode = document.getElementById("dzidzo-user-name");
  const emailNode = document.getElementById("dzidzo-user-email");
  const roleNode = document.getElementById("dzidzo-user-role");
  const logoutButton = document.getElementById("dzidzo-logout");

  updateText(nameNode, user.full_name);
  updateText(emailNode, user.email);
  updateText(roleNode, user.role);

  updateAll("[data-dzidzo-name]", user.full_name);
  updateAll("[data-dzidzo-email]", user.email);
  updateAll("[data-dzidzo-role]", formatRole(user.role));
  updateAll("[data-dzidzo-role-raw]", user.role);
  updateAll("[data-dzidzo-initials]", getInitials(user.full_name));

  document.body.dataset.userRole = user.role;
  localStorage.setItem("dzidzoUser", JSON.stringify(user));

  logoutButton?.addEventListener("click", () => {
    localStorage.removeItem("dzidzoToken");
    localStorage.removeItem("dzidzoUser");
    redirectToSignin();
  });
}

loadCurrentUser();
