function getApiBaseUrl() {
  const rawBaseUrl = window.DZIDZO_API_BASE_URL || "http://localhost:4000";

  try {
    return new URL(rawBaseUrl).origin;
  } catch (_error) {
    return "http://localhost:4000";
  }
}

const API_BASE_URL = getApiBaseUrl();

const sectionDefinitions = {
  users: {
    label: "Users",
    kicker: "Accounts",
    description: "Manage admin, teacher, and student records.",
    endpoint: "/api/admin/users",
    columns: ["full_name", "email", "role", "is_active", "created_at"],
    searchKeys: ["full_name", "email", "role"],
    fields: [
      { name: "full_name", label: "Full Name", type: "text", required: true },
      { name: "email", label: "Email", type: "email", required: true },
      { name: "role", label: "Role", type: "select", options: ["admin", "teacher", "student"], required: true },
      { name: "is_active", label: "Active", type: "checkbox", defaultValue: true }
    ]
  },
  categories: {
    label: "Categories",
    kicker: "Taxonomy",
    description: "Organize classrooms, business spaces, and library content.",
    endpoint: "/api/admin/categories",
    columns: ["name", "slug", "display_order", "is_active"],
    searchKeys: ["name", "slug", "description"],
    fields: [
      { name: "name", label: "Name", type: "text", required: true },
      { name: "slug", label: "Slug", type: "text", required: true },
      { name: "description", label: "Description", type: "textarea" },
      { name: "display_order", label: "Display Order", type: "number", defaultValue: 0 },
      { name: "is_active", label: "Active", type: "checkbox", defaultValue: true }
    ]
  },
  courses: {
    label: "Courses",
    kicker: "Learning Spaces",
    description: "Manage classrooms, demos, ratings, pricing, and publishing state.",
    endpoint: "/api/admin/courses",
    columns: ["title", "slug", "category_name", "instructor_name", "course_type", "is_published"],
    searchKeys: ["title", "slug", "category_name", "instructor_name", "course_type"],
    fields: [
      { name: "title", label: "Title", type: "text", required: true },
      { name: "slug", label: "Slug", type: "text", required: true },
      { name: "summary", label: "Summary", type: "textarea" },
      { name: "description", label: "Description", type: "textarea" },
      { name: "page_path", label: "Page Path", type: "text" },
      { name: "image_url", label: "Image URL", type: "text" },
      { name: "demo_url", label: "Demo URL", type: "text" },
      { name: "category_id", label: "Category", type: "lookup", lookup: "categories" },
      { name: "instructor_name", label: "Instructor", type: "text" },
      { name: "rating_average", label: "Rating Average", type: "number", step: "0.1", defaultValue: 0 },
      { name: "rating_count", label: "Rating Count", type: "number", defaultValue: 0 },
      { name: "lecture_count", label: "Lecture Count", type: "number", defaultValue: 0 },
      { name: "duration_hours", label: "Duration Hours", type: "number", step: "0.1", defaultValue: 0 },
      { name: "skill_level", label: "Skill Level", type: "text" },
      { name: "language", label: "Language", type: "text", defaultValue: "English" },
      { name: "price_amount", label: "Price Amount", type: "number", step: "0.01", defaultValue: 0 },
      { name: "currency_code", label: "Currency Code", type: "text", defaultValue: "USD" },
      { name: "course_type", label: "Course Type", type: "text", defaultValue: "classroom" },
      { name: "display_order", label: "Display Order", type: "number", defaultValue: 0 },
      { name: "is_published", label: "Published", type: "checkbox", defaultValue: true },
      { name: "is_featured", label: "Featured", type: "checkbox", defaultValue: false }
    ]
  },
  lessons: {
    label: "Lessons",
    kicker: "Curriculum",
    description: "Define lessons inside a course with media references and publish states.",
    endpoint: "/api/admin/lessons",
    columns: ["course_title", "title", "slug", "duration_minutes", "display_order", "is_published"],
    searchKeys: ["course_title", "title", "slug", "summary"],
    fields: [
      { name: "course_id", label: "Course", type: "lookup", lookup: "courses", required: true },
      { name: "title", label: "Title", type: "text", required: true },
      { name: "slug", label: "Slug", type: "text", required: true },
      { name: "summary", label: "Summary", type: "textarea" },
      { name: "content", label: "Content", type: "textarea" },
      { name: "media_type", label: "Media Type", type: "text" },
      { name: "media_url", label: "Media URL", type: "text" },
      { name: "duration_minutes", label: "Duration Minutes", type: "number", defaultValue: 0 },
      { name: "display_order", label: "Display Order", type: "number", defaultValue: 0 },
      { name: "is_published", label: "Published", type: "checkbox", defaultValue: true }
    ]
  },
  libraryItems: {
    label: "Library",
    kicker: "Resources",
    description: "Manage AR books, reading resources, and linked library content.",
    endpoint: "/api/admin/libraryItems",
    columns: ["title", "slug", "author_name", "format", "category_name", "is_published"],
    searchKeys: ["title", "slug", "author_name", "format", "category_name"],
    fields: [
      { name: "title", label: "Title", type: "text", required: true },
      { name: "slug", label: "Slug", type: "text", required: true },
      { name: "summary", label: "Summary", type: "textarea" },
      { name: "author_name", label: "Author Name", type: "text" },
      { name: "format", label: "Format", type: "text" },
      { name: "cover_image_url", label: "Cover Image URL", type: "text" },
      { name: "resource_url", label: "Resource URL", type: "text" },
      { name: "category_id", label: "Category", type: "lookup", lookup: "categories" },
      { name: "is_featured", label: "Featured", type: "checkbox", defaultValue: false },
      { name: "is_published", label: "Published", type: "checkbox", defaultValue: true }
    ]
  },
  teamMembers: {
    label: "Team",
    kicker: "People",
    description: "Manage team bios, ordering, and social links shown on the public site.",
    endpoint: "/api/admin/teamMembers",
    columns: ["full_name", "title", "display_order", "is_active"],
    searchKeys: ["full_name", "title", "bio"],
    fields: [
      { name: "full_name", label: "Full Name", type: "text", required: true },
      { name: "title", label: "Title", type: "text", required: true },
      { name: "bio", label: "Bio", type: "textarea" },
      { name: "image_url", label: "Image URL", type: "text" },
      { name: "twitter_url", label: "Twitter URL", type: "text" },
      { name: "facebook_url", label: "Facebook URL", type: "text" },
      { name: "linkedin_url", label: "LinkedIn URL", type: "text" },
      { name: "instagram_url", label: "Instagram URL", type: "text" },
      { name: "youtube_url", label: "YouTube URL", type: "text" },
      { name: "display_order", label: "Display Order", type: "number", defaultValue: 0 },
      { name: "is_active", label: "Active", type: "checkbox", defaultValue: true }
    ]
  },
  testimonials: {
    label: "Testimonials",
    kicker: "Social Proof",
    description: "Edit student quotes, ratings, and public visibility.",
    endpoint: "/api/admin/testimonials",
    columns: ["student_name", "student_title", "rating", "display_order", "is_published"],
    searchKeys: ["student_name", "student_title", "quote"],
    fields: [
      { name: "student_name", label: "Student Name", type: "text", required: true },
      { name: "student_title", label: "Student Title", type: "text" },
      { name: "quote", label: "Quote", type: "textarea", required: true },
      { name: "image_url", label: "Image URL", type: "text" },
      { name: "rating", label: "Rating", type: "number", step: "0.1" },
      { name: "display_order", label: "Display Order", type: "number", defaultValue: 0 },
      { name: "is_published", label: "Published", type: "checkbox", defaultValue: true }
    ]
  },
  enrollments: {
    label: "Enrollments",
    kicker: "Progress",
    description: "Track who is enrolled in which course and their progress state.",
    endpoint: "/api/admin/enrollments",
    columns: ["user_name", "user_email", "course_title", "status", "progress_percent", "enrolled_at"],
    searchKeys: ["user_name", "user_email", "course_title", "status"],
    fields: [
      { name: "user_id", label: "User", type: "lookup", lookup: "users", required: true },
      { name: "course_id", label: "Course", type: "lookup", lookup: "courses", required: true },
      { name: "status", label: "Status", type: "select", options: ["active", "completed", "paused", "cancelled"], required: true },
      { name: "progress_percent", label: "Progress Percent", type: "number", step: "0.1", defaultValue: 0 }
    ]
  },
  contactMessages: {
    label: "Messages",
    kicker: "Inbox",
    description: "Review and update contact messages coming from the public site.",
    endpoint: "/api/admin/contactMessages",
    columns: ["full_name", "email", "subject", "status", "created_at"],
    searchKeys: ["full_name", "email", "subject", "message", "status"],
    fields: [
      { name: "full_name", label: "Full Name", type: "text", required: true },
      { name: "email", label: "Email", type: "email", required: true },
      { name: "subject", label: "Subject", type: "text", required: true },
      { name: "message", label: "Message", type: "textarea", required: true },
      { name: "status", label: "Status", type: "select", options: ["new", "read", "replied", "archived"], required: true }
    ]
  },
  newsletterSubscribers: {
    label: "Subscribers",
    kicker: "Audience",
    description: "Manage newsletter subscribers captured across the public site.",
    endpoint: "/api/admin/newsletterSubscribers",
    columns: ["email", "source", "is_active", "subscribed_at"],
    searchKeys: ["email", "source"],
    fields: [
      { name: "email", label: "Email", type: "email", required: true },
      { name: "source", label: "Source", type: "text" },
      { name: "is_active", label: "Active", type: "checkbox", defaultValue: true }
    ]
  }
};

const state = {
  currentSection: "courses",
  currentRecord: null,
  data: {},
  summary: {},
  lookups: {
    categories: [],
    courses: [],
    users: []
  }
};

function getToken() {
  return localStorage.getItem("dzidzoToken");
}

async function api(path, options = {}) {
  const token = getToken();
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...(options.headers || {})
    }
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || "Request failed.");
  }
  return data;
}

function titleCase(value) {
  return String(value || "")
    .replace(/([A-Z])/g, " $1")
    .replace(/_/g, " ")
    .replace(/^./, (m) => m.toUpperCase())
    .trim();
}

function formatValue(value) {
  if (value === null || value === undefined || value === "") return "-";
  if (typeof value === "boolean") return value ? "Yes" : "No";
  return String(value);
}

function buildTabs() {
  const container = document.getElementById("section-tabs");
  container.innerHTML = Object.entries(sectionDefinitions)
    .map(([key, section]) => `
      <button class="nav-pill ${key === state.currentSection ? "active" : "bg-stone-100"}" data-section="${key}">
        <div class="font-semibold">${section.label}</div>
        <div class="text-xs opacity-70">${section.kicker}</div>
      </button>
    `)
    .join("");

  container.querySelectorAll("[data-section]").forEach((button) => {
    button.addEventListener("click", () => {
      state.currentSection = button.dataset.section;
      state.currentRecord = null;
      render();
    });
  });
}

function renderSummary() {
  const container = document.getElementById("admin-summary");
  container.innerHTML = Object.entries(state.summary).map(([key, value]) => `
    <article class="metric-card">
      <p class="text-xs tracking-[0.25em] uppercase opacity-80">${key.replace(/_/g, " ")}</p>
      <h3 class="mt-3 text-3xl font-black">${value}</h3>
    </article>
  `).join("");
}

function getFilteredItems() {
  const section = sectionDefinitions[state.currentSection];
  const search = document.getElementById("table-search").value.trim().toLowerCase();
  const items = state.data[state.currentSection] || [];

  if (!search) return items;

  return items.filter((item) => section.searchKeys.some((key) => String(item[key] ?? "").toLowerCase().includes(search)));
}

function renderTable() {
  const section = sectionDefinitions[state.currentSection];
  const head = document.getElementById("table-head");
  const body = document.getElementById("table-body");
  const empty = document.getElementById("empty-state");
  const items = getFilteredItems();

  document.getElementById("section-kicker").textContent = section.kicker;
  document.getElementById("section-title").textContent = section.label;
  document.getElementById("section-description").textContent = section.description;

  head.innerHTML = section.columns.map((column) => `<th class="px-4 py-3 text-left">${titleCase(column)}</th>`).join("") + '<th class="px-4 py-3 text-right">Actions</th>';

  if (!items.length) {
    body.innerHTML = "";
    empty.classList.remove("hidden");
    return;
  }

  empty.classList.add("hidden");
  body.innerHTML = items.map((item) => `
    <tr class="border-t border-stone-200/80 hover:bg-stone-50/80">
      ${section.columns.map((column) => `<td class="px-4 py-3 text-sm">${formatValue(item[column])}</td>`).join("")}
      <td class="px-4 py-3">
        <div class="flex justify-end gap-2">
          <button class="row-action edit" data-action="edit" data-id="${item.id}">Edit</button>
          <button class="row-action delete" data-action="delete" data-id="${item.id}">Delete</button>
        </div>
      </td>
    </tr>
  `).join("");

  body.querySelectorAll("[data-action='edit']").forEach((button) => {
    button.addEventListener("click", () => {
      const record = (state.data[state.currentSection] || []).find((item) => item.id === button.dataset.id);
      state.currentRecord = record || null;
      renderEditor();
    });
  });

  body.querySelectorAll("[data-action='delete']").forEach((button) => {
    button.addEventListener("click", async () => {
      const sectionDef = sectionDefinitions[state.currentSection];
      if (!confirm(`Delete this ${sectionDef.label.slice(0, -1).toLowerCase()}?`)) return;
      try {
        await api(`${sectionDef.endpoint}/${button.dataset.id}`, { method: "DELETE" });
        await loadSection(state.currentSection);
      } catch (error) {
        alert(error.message);
      }
    });
  });
}

function buildField(field, record = {}) {
  const value = record[field.name];

  if (field.type === "checkbox") {
    return `
      <label class="flex items-center gap-3 px-4 py-3 border rounded-2xl bg-stone-50">
        <input type="checkbox" name="${field.name}" ${value === undefined ? (field.defaultValue ? "checked" : "") : (value ? "checked" : "")}>
        <span>${field.label}</span>
      </label>
    `;
  }

  if (field.type === "textarea") {
    return `<div class="field"><label>${field.label}</label><textarea name="${field.name}" ${field.required ? "required" : ""}>${value ?? field.defaultValue ?? ""}</textarea></div>`;
  }

  if (field.type === "select") {
    return `<div class="field"><label>${field.label}</label><select name="${field.name}" ${field.required ? "required" : ""}>${field.options.map((option) => `<option value="${option}" ${(value ?? field.defaultValue) === option ? "selected" : ""}>${titleCase(option)}</option>`).join("")}</select></div>`;
  }

  if (field.type === "lookup") {
    const options = state.lookups[field.lookup] || [];
    const labelKey = field.lookup === "users" ? "full_name" : (field.lookup === "courses" ? "title" : "name");
    return `<div class="field"><label>${field.label}</label><select name="${field.name}" ${field.required ? "required" : ""}><option value="">Select ${field.label}</option>${options.map((option) => `<option value="${option.id}" ${String(value ?? "") === String(option.id) ? "selected" : ""}>${option[labelKey]}${option.email ? ` (${option.email})` : ""}</option>`).join("")}</select></div>`;
  }

  return `<div class="field"><label>${field.label}</label><input name="${field.name}" type="${field.type || "text"}" value="${value ?? field.defaultValue ?? ""}" ${field.step ? `step="${field.step}"` : ""} ${field.required ? "required" : ""}></div>`;
}

function renderEditor() {
  const section = sectionDefinitions[state.currentSection];
  const form = document.getElementById("editor-form");
  const record = state.currentRecord || {};
  const mode = state.currentRecord ? "Edit" : "Create";

  document.getElementById("editor-title").textContent = `${mode} ${section.label.slice(0, -1)}`;
  document.getElementById("editor-subtitle").textContent = state.currentRecord ? "Update the selected record and save changes back to PostgreSQL." : "Fill in the fields below to create a new record in this section.";
  document.getElementById("editor-badge").textContent = state.currentRecord ? "Editing" : "Creating";
  document.getElementById("editor-meta").innerHTML = state.currentRecord ? Object.entries(record)
    .filter(([key]) => ["id", "created_at", "updated_at", "enrolled_at", "subscribed_at"].includes(key))
    .map(([key, value]) => `<div><strong>${titleCase(key)}:</strong> ${formatValue(value)}</div>`)
    .join("") : "Choose a row from the current tab to edit it, or create a fresh record.";

  form.innerHTML = section.fields.map((field) => buildField(field, record)).join("");
}

async function loadLookups() {
  const [categories, courses, users] = await Promise.all([
    api("/api/admin/lookups/categories"),
    api("/api/admin/lookups/courses"),
    api("/api/admin/lookups/users")
  ]);
  state.lookups.categories = categories.items;
  state.lookups.courses = courses.items;
  state.lookups.users = users.items;
}

async function loadSection(sectionKey) {
  const section = sectionDefinitions[sectionKey];
  const result = await api(section.endpoint);
  state.data[sectionKey] = result.items;
  if (sectionKey === state.currentSection) {
    renderTable();
    renderEditor();
  }
}

async function loadSummary() {
  const result = await api("/api/admin/summary");
  state.summary = result.summary;
  renderSummary();
}

async function loadAll() {
  await loadLookups();
  await Promise.all(Object.keys(sectionDefinitions).map(loadSection));
  await loadSummary();
}

function formPayload(form) {
  const section = sectionDefinitions[state.currentSection];
  const payload = {};
  section.fields.forEach((field) => {
    const input = form.elements[field.name];
    if (!input) return;
    if (field.type === "checkbox") {
      payload[field.name] = input.checked;
      return;
    }
    payload[field.name] = input.value;
  });
  return payload;
}

async function saveCurrentRecord(event) {
  event.preventDefault();
  const section = sectionDefinitions[state.currentSection];
  const form = document.getElementById("editor-form");
  const payload = formPayload(form);

  try {
    if (state.currentRecord) {
      await api(`${section.endpoint}/${state.currentRecord.id}`, {
        method: "PUT",
        body: JSON.stringify(payload)
      });
    } else {
      await api(section.endpoint, {
        method: "POST",
        body: JSON.stringify(payload)
      });
    }

    state.currentRecord = null;
    await loadLookups();
    await loadSection(state.currentSection);
    await loadSummary();
  } catch (error) {
    alert(error.message);
  }
}

function render() {
  buildTabs();
  renderSummary();
  renderTable();
  renderEditor();
}

async function boot() {
  const token = getToken();
  const user = JSON.parse(localStorage.getItem("dzidzoUser") || "null");

  if (!token || !user || user.role !== "admin") {
    window.location.href = "../pages/sign-in.html";
    return;
  }

  document.getElementById("admin-user-name").textContent = user.full_name || user.name || "Admin";
  document.getElementById("admin-logout").addEventListener("click", () => {
    localStorage.removeItem("dzidzoToken");
    localStorage.removeItem("dzidzoUser");
    window.location.href = "../pages/sign-in.html";
  });
  document.getElementById("reset-editor").addEventListener("click", () => {
    state.currentRecord = null;
    renderEditor();
  });
  document.getElementById("create-record").addEventListener("click", () => {
    state.currentRecord = null;
    renderEditor();
  });
  document.getElementById("table-search").addEventListener("input", renderTable);
  document.getElementById("save-record").addEventListener("click", saveCurrentRecord);

  try {
    await loadAll();
    render();
  } catch (error) {
    alert(error.message);
  }
}

boot();
