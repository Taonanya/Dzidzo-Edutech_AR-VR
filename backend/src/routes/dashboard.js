import express from "express";
import { query } from "../config/db.js";
import { asyncHandler } from "../lib/http.js";
import { requireAuth } from "../middleware/require-auth.js";

export const dashboardRouter = express.Router();

dashboardRouter.use(requireAuth);

function initials(name) {
  return String(name || "DZ")
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("") || "DZ";
}

function statusFromProgress(progress) {
  const value = Number(progress || 0);

  if (value >= 80) return "Good";
  if (value >= 50) return "Pending";
  return "Review";
}

dashboardRouter.get(
  "/overview",
  asyncHandler(async (req, res) => {
    if (req.user.role === "admin") {
      const [userCounts, courseCounts, resourceCounts, vrCounts, recentUsers, contactMessages, enrollments] = await Promise.all([
        query(`
          SELECT
            COUNT(*) FILTER (WHERE role = 'student')::int AS students,
            COUNT(*) FILTER (WHERE role = 'teacher')::int AS teachers,
            COUNT(*) FILTER (WHERE role = 'admin')::int AS admins
          FROM users
          WHERE is_active = TRUE
        `),
        query(`
          SELECT
            COUNT(*) FILTER (WHERE is_published = TRUE)::int AS live_courses,
            COUNT(*) FILTER (WHERE is_featured = TRUE)::int AS featured_courses
          FROM courses
        `),
        query(`
          SELECT
            COUNT(*) FILTER (WHERE is_published = TRUE)::int AS resources,
            COUNT(*) FILTER (WHERE is_featured = TRUE)::int AS featured_resources
          FROM library_items
        `),
        query(`
          SELECT COUNT(*)::int AS vr_labs
          FROM lessons
          WHERE is_published = TRUE
            AND media_type IN ('vr', 'ar', 'immersive_scene', '360-tour')
        `),
        query(`
          SELECT full_name, role, created_at
          FROM users
          WHERE is_active = TRUE
          ORDER BY created_at DESC
          LIMIT 5
        `),
        query(`
          SELECT full_name, subject, status, created_at
          FROM contact_messages
          ORDER BY created_at DESC
          LIMIT 4
        `),
        query(`
          SELECT u.full_name, c.title AS course_title, u.role, e.progress_percent, e.status
          FROM enrollments e
          JOIN users u ON u.id = e.user_id
          JOIN courses c ON c.id = e.course_id
          ORDER BY e.updated_at DESC
          LIMIT 6
        `)
      ]);

      return res.json({
        role: "admin",
        title: "Admin command center",
        dateLabel: "Platform snapshot",
        stats: [
          { label: "Students", value: userCounts.rows[0].students, icon: "S", color: "#6c63ff" },
          { label: "Teachers", value: userCounts.rows[0].teachers, icon: "T", color: "#ff8c66" },
          { label: "Live courses", value: courseCounts.rows[0].live_courses, icon: "C", color: "#f4b740" },
          { label: "VR labs", value: vrCounts.rows[0].vr_labs, icon: "V", color: "#273c75" }
        ],
        people: recentUsers.rows.map((row) => ({
          initials: initials(row.full_name),
          name: row.full_name,
          subtitle: `${row.role} joined ${new Date(row.created_at).toLocaleDateString()}`
        })),
        messages: contactMessages.rows.map((row) => ({
          initials: initials(row.full_name),
          name: row.full_name,
          subtitle: `${row.subject} • ${row.status}`,
          meta: new Date(row.created_at).toLocaleDateString()
        })),
        rows: enrollments.rows.map((row) => ({
          c1: row.full_name,
          c2: row.course_title,
          c3: row.role,
          c4: `${Number(row.progress_percent || 0).toFixed(0)}%`,
          status: statusFromProgress(row.progress_percent)
        })),
        highlights: {
          featured_courses: courseCounts.rows[0].featured_courses,
          library_items: resourceCounts.rows[0].resources,
          featured_resources: resourceCounts.rows[0].featured_resources,
          admins: userCounts.rows[0].admins
        }
      });
    }

    if (req.user.role === "teacher") {
      const [teacherCourses, learners, lessonCounts, messageRows] = await Promise.all([
        query(`
          SELECT id, title, skill_level, lecture_count, duration_hours
          FROM courses
          WHERE instructor_user_id = $1
          ORDER BY display_order ASC, title ASC
        `, [req.user.id]),
        query(`
          SELECT
            u.full_name,
            c.title AS course_title,
            e.progress_percent,
            e.status
          FROM enrollments e
          JOIN users u ON u.id = e.user_id
          JOIN courses c ON c.id = e.course_id
          WHERE c.instructor_user_id = $1
          ORDER BY e.progress_percent DESC, e.updated_at DESC
          LIMIT 6
        `, [req.user.id]),
        query(`
          SELECT
            COUNT(*) FILTER (WHERE l.is_published = TRUE)::int AS active_lessons,
            COUNT(*) FILTER (WHERE l.media_type IN ('vr', 'ar', 'immersive_scene', '360-tour'))::int AS vr_sessions,
            COALESCE(AVG(e.progress_percent), 0)::numeric(5,2) AS average_progress
          FROM courses c
          LEFT JOIN lessons l ON l.course_id = c.id
          LEFT JOIN enrollments e ON e.course_id = c.id
          WHERE c.instructor_user_id = $1
        `, [req.user.id]),
        query(`
          SELECT l.title, c.title AS course_title, l.media_type, l.updated_at
          FROM lessons l
          JOIN courses c ON c.id = l.course_id
          WHERE c.instructor_user_id = $1
          ORDER BY l.updated_at DESC
          LIMIT 4
        `, [req.user.id])
      ]);

      const learnerCount = learners.rows.length;

      return res.json({
        role: "teacher",
        title: "Teacher teaching desk",
        dateLabel: "Classroom pulse",
        stats: [
          { label: "My learners", value: learnerCount, icon: "L", color: "#5b6cff" },
          { label: "Active lessons", value: lessonCounts.rows[0].active_lessons, icon: "A", color: "#ff9266" },
          { label: "VR sessions", value: lessonCounts.rows[0].vr_sessions, icon: "V", color: "#20b486" },
          { label: "Avg progress", value: `${Number(lessonCounts.rows[0].average_progress || 0).toFixed(0)}%`, icon: "%", color: "#273c75" }
        ],
        people: learners.rows.map((row) => ({
          initials: initials(row.full_name),
          name: row.full_name,
          subtitle: `${row.course_title} • ${Number(row.progress_percent || 0).toFixed(0)}%`
        })),
        messages: messageRows.rows.map((row) => ({
          initials: initials(row.title),
          name: row.title,
          subtitle: `${row.course_title} • ${row.media_type || "lesson"}`,
          meta: new Date(row.updated_at).toLocaleDateString()
        })),
        rows: teacherCourses.rows.map((row) => ({
          c1: row.title,
          c2: row.skill_level || "All Levels",
          c3: `${row.lecture_count || 0} lessons`,
          c4: `${Number(row.duration_hours || 0).toFixed(1)} hrs`,
          status: "Good"
        }))
      });
    }

    const [enrollments, peerRows, lessonRows] = await Promise.all([
      query(`
        SELECT
          c.title AS course_title,
          COALESCE(l.title, 'Orientation') AS lesson_title,
          COALESCE(l.summary, c.summary, 'Continue your immersive learning path.') AS focus,
          e.progress_percent,
          e.status,
          c.instructor_name
        FROM enrollments e
        JOIN courses c ON c.id = e.course_id
        LEFT JOIN LATERAL (
          SELECT title, summary
          FROM lessons
          WHERE course_id = c.id
          ORDER BY display_order ASC
          LIMIT 1
        ) l ON TRUE
        WHERE e.user_id = $1
        ORDER BY e.updated_at DESC
        LIMIT 6
      `, [req.user.id]),
      query(`
        SELECT DISTINCT
          u.full_name,
          c.title AS course_title
        FROM enrollments mine
        JOIN enrollments peers ON peers.course_id = mine.course_id AND peers.user_id <> mine.user_id
        JOIN users u ON u.id = peers.user_id
        JOIN courses c ON c.id = mine.course_id
        WHERE mine.user_id = $1
        ORDER BY u.full_name ASC
        LIMIT 5
      `, [req.user.id]),
      query(`
        SELECT
          c.title AS course_title,
          l.title,
          l.media_type,
          l.updated_at
        FROM enrollments e
        JOIN courses c ON c.id = e.course_id
        JOIN lessons l ON l.course_id = c.id
        WHERE e.user_id = $1
        ORDER BY l.display_order ASC, l.updated_at DESC
        LIMIT 4
      `, [req.user.id])
    ]);

    const completed = enrollments.rows.filter((row) => row.status === "completed").length;
    const averageProgress = enrollments.rows.length
      ? enrollments.rows.reduce((sum, row) => sum + Number(row.progress_percent || 0), 0) / enrollments.rows.length
      : 0;
    const vrLabs = lessonRows.rows.filter((row) => ["vr", "ar", "immersive_scene", "360-tour"].includes(row.media_type)).length;

    return res.json({
      role: "student",
      title: "Student learning studio",
      dateLabel: "Personal progress",
      stats: [
        { label: "Enrolled", value: enrollments.rows.length, icon: "E", color: "#22a57d" },
        { label: "Completed", value: completed, icon: "C", color: "#ffb347" },
        { label: "Avg score", value: `${averageProgress.toFixed(0)}%`, icon: "%", color: "#5b6cff" },
        { label: "VR labs", value: vrLabs, icon: "V", color: "#273c75" }
      ],
      people: peerRows.rows.map((row) => ({
        initials: initials(row.full_name),
        name: row.full_name,
        subtitle: `Peer in ${row.course_title}`
      })),
      messages: lessonRows.rows.map((row) => ({
        initials: initials(row.title),
        name: row.title,
        subtitle: `${row.course_title} • ${row.media_type || "lesson"}`,
        meta: new Date(row.updated_at).toLocaleDateString()
      })),
      rows: enrollments.rows.map((row) => ({
        c1: row.course_title,
        c2: row.lesson_title,
        c3: row.focus,
        c4: `${Number(row.progress_percent || 0).toFixed(0)}%`,
        status: statusFromProgress(row.progress_percent)
      }))
    });
  })
);
