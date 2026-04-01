function getApiBaseUrl() {
  const rawBaseUrl = window.DZIDZO_API_BASE_URL || "http://localhost:4000";

  try {
    return new URL(rawBaseUrl).origin;
  } catch (_error) {
    return "http://localhost:4000";
  }
}

const API_BASE_URL = getApiBaseUrl();

function setButtonState(button, busy, idleText, busyText) {
  if (!button) return;
  button.disabled = busy;
  button.textContent = busy ? busyText : idleText;
  button.classList.toggle("opacity-70", busy);
  button.classList.toggle("cursor-not-allowed", busy);
}

function redirectForRole(role) {
  if (role === "admin") {
    window.location.href = "../pages/admin-dashboard.html";
    return;
  }

  if (role === "teacher") {
    window.location.href = "../pages/teacher-dashboard.html";
    return;
  }

  window.location.href = "../pages/student-dashboard.html";
}

async function handleSignup(event) {
  event.preventDefault();

  const form = event.currentTarget;
  const submitButton = form.querySelector('button[type="submit"]');
  const fullName = form.querySelector("#name")?.value.trim() || "";
  const email = form.querySelector("#email")?.value.trim() || "";
  const role = form.querySelector("#role")?.value.trim().toLowerCase() || "";
  const password = form.querySelector("#password")?.value || "";

  if (!fullName || !email || !role || !password) {
    alert("Please complete all registration fields.");
    return;
  }

  if (password.length < 8) {
    alert("Password must be at least 8 characters.");
    return;
  }

  setButtonState(submitButton, true, "Create account", "Creating account...");

  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        full_name: fullName,
        email,
        role,
        password
      })
    });

    const result = await response.json();

    if (!response.ok) {
      alert(result.error || "Could not create account.");
      return;
    }

    localStorage.setItem("dzidzoToken", result.token);
    localStorage.setItem("dzidzoUser", JSON.stringify(result.user));
    alert("Account created successfully. You can now sign in.");
    window.location.href = "../pages/sign-in.html";
  } finally {
    setButtonState(submitButton, false, "Create account", "Creating account...");
  }
}

async function handleSignin(event) {
  event.preventDefault();

  const form = event.currentTarget;
  const submitButton = form.querySelector('button[type="submit"]');
  const email = form.querySelector("#signinEmail")?.value.trim() || "";
  const password = form.querySelector("#signinPassword")?.value || "";

  if (!email || !password) {
    alert("Enter your email and password.");
    return;
  }

  setButtonState(submitButton, true, "Sign in", "Signing in...");

  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/signin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email,
        password
      })
    });

    const result = await response.json();

    if (!response.ok) {
      alert(result.error || "Could not sign in.");
      return;
    }

    localStorage.setItem("dzidzoToken", result.token);
    localStorage.setItem("dzidzoUser", JSON.stringify(result.user));
    alert(`Welcome back, ${result.user.full_name}!`);
    redirectForRole(result.user.role);
  } finally {
    setButtonState(submitButton, false, "Sign in", "Signing in...");
  }
}

document.getElementById("signupForm")?.addEventListener("submit", handleSignup);
document.getElementById("signinForm")?.addEventListener("submit", handleSignin);
