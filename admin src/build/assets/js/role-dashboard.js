(function () {
  const API_BASE_URL = (() => {
    const rawBaseUrl = window.DZIDZO_API_BASE_URL || "http://localhost:4000";

    try {
      return new URL(rawBaseUrl).origin;
    } catch (_error) {
      return "http://localhost:4000";
    }
  })();

  function statusClass(status) {
    if (status === "Good") return "status-good";
    if (status === "Pending") return "status-warn";
    return "status-alert";
  }

  function renderStats(items) {
    const root = document.getElementById("dashboard-stats");
    if (!root) return;

    root.innerHTML = (items || [])
      .map((item) => `
        <article class="stat-card">
          <div class="stat-copy">
            <small>${item.label}</small>
            <h3>${item.value}</h3>
          </div>
          <span class="stat-icon" style="background:${item.color || "#6c63ff"}">${item.icon || "D"}</span>
        </article>
      `)
      .join("");
  }

  function renderPeople(items) {
    const root = document.getElementById("dashboard-people");
    if (!root) return;

    root.innerHTML = (items || [])
      .map((item) => `
        <div class="person-row">
          <span class="person-avatar">${item.initials || "DZ"}</span>
          <div class="person-copy">
            <p>${item.name}</p>
            <span>${item.subtitle}</span>
          </div>
          <button class="person-action" type="button">+</button>
        </div>
      `)
      .join("");
  }

  function renderMessages(items) {
    const root = document.getElementById("dashboard-messages");
    if (!root) return;

    root.innerHTML = (items || [])
      .map((item) => `
        <div class="message-row">
          <span class="message-avatar">${item.initials || "DZ"}</span>
          <div class="message-copy">
            <p>${item.name}</p>
            <span>${item.subtitle}</span>
          </div>
          <span class="muted-copy">${item.meta || ""}</span>
        </div>
      `)
      .join("");
  }

  function renderRows(items) {
    const root = document.getElementById("dashboard-table-body");
    if (!root) return;

    root.innerHTML = (items || [])
      .map((row) => `
        <tr>
          <td>${row.c1}</td>
          <td>${row.c2}</td>
          <td>${row.c3}</td>
          <td>${row.c4}</td>
          <td><span class="status-badge ${statusClass(row.status)}">${row.status}</span></td>
        </tr>
      `)
      .join("");
  }

  function applyTitles(model) {
    document.querySelectorAll("[data-dashboard-title]").forEach((node) => {
      node.textContent = model.title;
    });

    document.querySelectorAll("[data-dashboard-date-label]").forEach((node) => {
      node.textContent = model.dateLabel;
    });

    const dateNode = document.getElementById("dashboard-date");
    if (dateNode) {
      dateNode.textContent = new Date().toLocaleDateString(undefined, {
        weekday: "long",
        month: "long",
        day: "numeric"
      });
    }
  }

  async function loadOverview() {
    const token = localStorage.getItem("dzidzoToken");

    if (!token) {
      return;
    }

    const response = await fetch(`${API_BASE_URL}/api/dashboard/overview`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (!response.ok) {
      return;
    }

    const model = await response.json();
    applyTitles(model);
    renderStats(model.stats);
    renderPeople(model.people);
    renderMessages(model.messages);
    renderRows(model.rows);
  }

  loadOverview().catch(() => {});
})();
