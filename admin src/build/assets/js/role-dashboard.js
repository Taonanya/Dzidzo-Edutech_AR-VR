(function () {
  const role = document.body.dataset.dashboardRole || "admin";
  const models = {
    admin: {
      title: "Admin command center",
      dateLabel: "Platform snapshot",
      stats: [
        { label: "Students", value: "932", icon: "S", color: "#6c63ff" },
        { label: "Teachers", value: "754", icon: "T", color: "#ff8c66" },
        { label: "Live courses", value: "40", icon: "C", color: "#f4b740" },
        { label: "Resources", value: "32k", icon: "R", color: "#273c75" }
      ],
      people: [
        ["SW", "Samantha Wilton", "Recent student"],
        ["TS", "Tony Seap", "Course lead"],
        ["KR", "Karme Inope", "Content editor"],
        ["JN", "Jordan Nico", "VR facilitator"],
        ["MA", "Nollia Ajip", "Library curator"]
      ],
      messages: [
        ["SW", "Samantha Wilton", "Course signup issue", "12:45 PM"],
        ["TS", "Tony Seap", "Term schedule edit", "12:43 PM"],
        ["JN", "Jordan Nico", "New lab request", "12:41 PM"]
      ],
      rows: [
        ["Haru", "Programming", "B.Tech", "$3,270", "Good"],
        ["Mila", "English", "B.Tech", "$2,170", "Good"],
        ["Rudo", "History", "A-Level", "$1,870", "Pending"],
        ["Jaxon", "Programming", "B.Com", "$3,127", "Review"]
      ]
    },
    teacher: {
      title: "Teacher teaching desk",
      dateLabel: "Classroom pulse",
      stats: [
        { label: "My learners", value: "186", icon: "L", color: "#5b6cff" },
        { label: "Active lessons", value: "24", icon: "A", color: "#ff9266" },
        { label: "Assignments", value: "12", icon: "W", color: "#20b486" },
        { label: "Attendance", value: "94%", icon: "%", color: "#273c75" }
      ],
      people: [
        ["TM", "Tanaka Moyo", "Needs review"],
        ["RN", "Rumbi Ncube", "Top performer"],
        ["PK", "Prince Kuda", "Submitted today"],
        ["CH", "Chipo Hove", "Lab completed"],
        ["MM", "Musa Moyo", "Needs support"]
      ],
      messages: [
        ["RN", "Rumbi Ncube", "Uploaded assignment", "11:16 AM"],
        ["PK", "Prince Kuda", "Asked for feedback", "10:59 AM"],
        ["CH", "Chipo Hove", "VR scene ready", "10:40 AM"]
      ],
      rows: [
        ["Programming 101", "Lesson review", "4 tasks", "Today", "Good"],
        ["English Form 4", "Feedback batch", "9 tasks", "Today", "Pending"],
        ["History Lab", "AR scene prep", "2 tasks", "Tomorrow", "Good"],
        ["STEM Club", "Progress check", "6 tasks", "Friday", "Review"]
      ]
    },
    student: {
      title: "Student learning studio",
      dateLabel: "Personal progress",
      stats: [
        { label: "Enrolled", value: "8", icon: "E", color: "#22a57d" },
        { label: "Completed", value: "21", icon: "C", color: "#ffb347" },
        { label: "Streak", value: "14d", icon: "S", color: "#5b6cff" },
        { label: "Score", value: "92%", icon: "%", color: "#273c75" }
      ],
      people: [
        ["TM", "Teacher Moyo", "Programming mentor"],
        ["RK", "Rumbi K", "Study group"],
        ["PK", "Prince K", "Project partner"],
        ["CH", "Chipo H", "VR teammate"],
        ["MN", "Munya N", "New in class"]
      ],
      messages: [
        ["TM", "Teacher Moyo", "Lesson feedback posted", "1:12 PM"],
        ["RK", "Rumbi K", "Group invite sent", "12:32 PM"],
        ["PK", "Prince K", "Shared project draft", "11:48 AM"]
      ],
      rows: [
        ["Programming 101", "Module 6", "Arrays and loops", "83%", "Good"],
        ["VR Lab", "Module 2", "Environment setup", "76%", "Pending"],
        ["English", "Module 4", "Essay revision", "91%", "Good"],
        ["History", "Module 3", "Timeline quiz", "68%", "Review"]
      ]
    }
  };

  const model = models[role] || models.admin;

  function renderStats() {
    const root = document.getElementById("dashboard-stats");
    if (!root) {
      return;
    }

    root.innerHTML = model.stats
      .map(
        (item) => `
          <article class="stat-card">
            <div class="stat-copy">
              <small>${item.label}</small>
              <h3>${item.value}</h3>
            </div>
            <span class="stat-icon" style="background:${item.color}">${item.icon}</span>
          </article>
        `
      )
      .join("");
  }

  function renderList(targetId, items, type) {
    const root = document.getElementById(targetId);
    if (!root) {
      return;
    }

    if (type === "people") {
      root.innerHTML = items
        .map(
          (item) => `
            <div class="person-row">
              <span class="person-avatar">${item[0]}</span>
              <div class="person-copy">
                <p>${item[1]}</p>
                <span>${item[2]}</span>
              </div>
              <button class="person-action" type="button">+</button>
            </div>
          `
        )
        .join("");
      return;
    }

    root.innerHTML = items
      .map(
        (item) => `
          <div class="message-row">
            <span class="message-avatar">${item[0]}</span>
            <div class="message-copy">
              <p>${item[1]}</p>
              <span>${item[2]}</span>
            </div>
            <span class="muted-copy">${item[3]}</span>
          </div>
        `
      )
      .join("");
  }

  function renderRows() {
    const root = document.getElementById("dashboard-table-body");
    if (!root) {
      return;
    }

    root.innerHTML = model.rows
      .map((row) => {
        const statusClass = row[4] === "Good"
          ? "status-good"
          : row[4] === "Pending"
            ? "status-warn"
            : "status-alert";

        return `
          <tr>
            <td>${row[0]}</td>
            <td>${row[1]}</td>
            <td>${row[2]}</td>
            <td>${row[3]}</td>
            <td><span class="status-badge ${statusClass}">${row[4]}</span></td>
          </tr>
        `;
      })
      .join("");
  }

  function applyTitles() {
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

  renderStats();
  renderList("dashboard-people", model.people, "people");
  renderList("dashboard-messages", model.messages, "messages");
  renderRows();
  applyTitles();
})();
