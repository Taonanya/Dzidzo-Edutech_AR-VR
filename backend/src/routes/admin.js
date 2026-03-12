import express from "express";
import { query } from "../config/db.js";
import { requireAuth } from "../middleware/require-auth.js";
import { requireRole } from "../middleware/require-role.js";

export const adminRouter = express.Router();

adminRouter.use(requireAuth, requireRole("admin"));

function bool(value, defaultValue = false) {
  if (value === undefined || value === null || value === "") {
    return defaultValue;
  }

  return value === true || value === "true" || value === 1 || value === "1" || value === "on";
}

function num(value, defaultValue = 0) {
  if (value === null || value === undefined || value === "") {
    return defaultValue;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : defaultValue;
}

function nullable(value) {
  if (value === undefined || value === null || value === "") {
    return null;
  }

  return String(value).trim();
}

const resourceConfig = {
  users: {
    listSql: `
      SELECT id, full_name, email, role, is_active, created_at, updated_at
      FROM users
      ORDER BY created_at DESC
    `,
    insertSql: `
      INSERT INTO users (full_name, email, password_hash, role, is_active)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, full_name, email, role, is_active, created_at, updated_at
    `,
    updateSql: `
      UPDATE users
      SET full_name = $2, email = $3, role = $4, is_active = $5
      WHERE id = $1
      RETURNING id, full_name, email, role, is_active, created_at, updated_at
    `,
    deleteSql: `DELETE FROM users WHERE id = $1 RETURNING id`,
    serializeCreate(body) {
      return [body.full_name, body.email, body.password_hash || '$2b$10$temporary.hash.replace.me.for.real.user.seed', body.role || 'student', bool(body.is_active, true)];
    },
    serializeUpdate(id, body) {
      return [id, body.full_name, body.email, body.role || 'student', bool(body.is_active, true)];
    }
  },
  categories: {
    listSql: `
      SELECT id, name, slug, description, display_order, is_active, created_at, updated_at
      FROM categories
      ORDER BY display_order ASC, name ASC
    `,
    insertSql: `
      INSERT INTO categories (name, slug, description, display_order, is_active)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `,
    updateSql: `
      UPDATE categories
      SET name = $2, slug = $3, description = $4, display_order = $5, is_active = $6
      WHERE id = $1
      RETURNING *
    `,
    deleteSql: `DELETE FROM categories WHERE id = $1 RETURNING id`,
    serializeCreate(body) {
      return [body.name, body.slug, nullable(body.description), num(body.display_order, 0), bool(body.is_active, true)];
    },
    serializeUpdate(id, body) {
      return [id, body.name, body.slug, nullable(body.description), num(body.display_order, 0), bool(body.is_active, true)];
    }
  },
  courses: {
    listSql: `
      SELECT c.id, c.title, c.slug, c.summary, c.description, c.page_path, c.image_url, c.demo_url,
             c.category_id, cat.name AS category_name, c.instructor_name, c.rating_average, c.rating_count,
             c.lecture_count, c.duration_hours, c.skill_level, c.language, c.price_amount, c.currency_code,
             c.course_type, c.is_published, c.is_featured, c.display_order, c.created_at, c.updated_at
      FROM courses c
      LEFT JOIN categories cat ON cat.id = c.category_id
      ORDER BY c.display_order ASC, c.title ASC
    `,
    insertSql: `
      INSERT INTO courses (
        title, slug, summary, description, page_path, image_url, demo_url, category_id, instructor_name,
        rating_average, rating_count, lecture_count, duration_hours, skill_level, language, price_amount,
        currency_code, course_type, is_published, is_featured, display_order
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21)
      RETURNING *
    `,
    updateSql: `
      UPDATE courses
      SET title = $2, slug = $3, summary = $4, description = $5, page_path = $6, image_url = $7, demo_url = $8,
          category_id = $9, instructor_name = $10, rating_average = $11, rating_count = $12, lecture_count = $13,
          duration_hours = $14, skill_level = $15, language = $16, price_amount = $17, currency_code = $18,
          course_type = $19, is_published = $20, is_featured = $21, display_order = $22
      WHERE id = $1
      RETURNING *
    `,
    deleteSql: `DELETE FROM courses WHERE id = $1 RETURNING id`,
    serializeCreate(body) {
      return [
        body.title,
        body.slug,
        nullable(body.summary),
        nullable(body.description),
        nullable(body.page_path),
        nullable(body.image_url),
        nullable(body.demo_url),
        nullable(body.category_id),
        nullable(body.instructor_name),
        num(body.rating_average, 0),
        num(body.rating_count, 0),
        num(body.lecture_count, 0),
        num(body.duration_hours, 0),
        nullable(body.skill_level),
        body.language || 'English',
        num(body.price_amount, 0),
        body.currency_code || 'USD',
        body.course_type || 'classroom',
        bool(body.is_published, true),
        bool(body.is_featured, false),
        num(body.display_order, 0)
      ];
    },
    serializeUpdate(id, body) {
      return [id, ...this.serializeCreate(body)];
    }
  },
  lessons: {
    listSql: `
      SELECT l.id, l.course_id, c.title AS course_title, l.title, l.slug, l.summary, l.content, l.media_type,
             l.media_url, l.duration_minutes, l.display_order, l.is_published, l.created_at, l.updated_at
      FROM lessons l
      JOIN courses c ON c.id = l.course_id
      ORDER BY c.title ASC, l.display_order ASC
    `,
    insertSql: `
      INSERT INTO lessons (course_id, title, slug, summary, content, media_type, media_url, duration_minutes, display_order, is_published)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
      RETURNING *
    `,
    updateSql: `
      UPDATE lessons
      SET course_id = $2, title = $3, slug = $4, summary = $5, content = $6, media_type = $7, media_url = $8,
          duration_minutes = $9, display_order = $10, is_published = $11
      WHERE id = $1
      RETURNING *
    `,
    deleteSql: `DELETE FROM lessons WHERE id = $1 RETURNING id`,
    serializeCreate(body) {
      return [nullable(body.course_id), body.title, body.slug, nullable(body.summary), nullable(body.content), nullable(body.media_type), nullable(body.media_url), num(body.duration_minutes, 0), num(body.display_order, 0), bool(body.is_published, true)];
    },
    serializeUpdate(id, body) {
      return [id, ...this.serializeCreate(body)];
    }
  },
  libraryItems: {
    listSql: `
      SELECT li.id, li.title, li.slug, li.summary, li.author_name, li.format, li.cover_image_url, li.resource_url,
             li.category_id, cat.name AS category_name, li.is_featured, li.is_published, li.created_at, li.updated_at
      FROM library_items li
      LEFT JOIN categories cat ON cat.id = li.category_id
      ORDER BY li.title ASC
    `,
    insertSql: `
      INSERT INTO library_items (title, slug, summary, author_name, format, cover_image_url, resource_url, category_id, is_featured, is_published)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
      RETURNING *
    `,
    updateSql: `
      UPDATE library_items
      SET title = $2, slug = $3, summary = $4, author_name = $5, format = $6, cover_image_url = $7,
          resource_url = $8, category_id = $9, is_featured = $10, is_published = $11
      WHERE id = $1
      RETURNING *
    `,
    deleteSql: `DELETE FROM library_items WHERE id = $1 RETURNING id`,
    serializeCreate(body) {
      return [body.title, body.slug, nullable(body.summary), nullable(body.author_name), nullable(body.format), nullable(body.cover_image_url), nullable(body.resource_url), nullable(body.category_id), bool(body.is_featured, false), bool(body.is_published, true)];
    },
    serializeUpdate(id, body) {
      return [id, ...this.serializeCreate(body)];
    }
  },
  teamMembers: {
    listSql: `
      SELECT id, full_name, title, bio, image_url, twitter_url, facebook_url, linkedin_url, instagram_url, youtube_url,
             display_order, is_active, created_at, updated_at
      FROM team_members
      ORDER BY display_order ASC, full_name ASC
    `,
    insertSql: `
      INSERT INTO team_members (full_name, title, bio, image_url, twitter_url, facebook_url, linkedin_url, instagram_url, youtube_url, display_order, is_active)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
      RETURNING *
    `,
    updateSql: `
      UPDATE team_members
      SET full_name = $2, title = $3, bio = $4, image_url = $5, twitter_url = $6, facebook_url = $7,
          linkedin_url = $8, instagram_url = $9, youtube_url = $10, display_order = $11, is_active = $12
      WHERE id = $1
      RETURNING *
    `,
    deleteSql: `DELETE FROM team_members WHERE id = $1 RETURNING id`,
    serializeCreate(body) {
      return [body.full_name, body.title, nullable(body.bio), nullable(body.image_url), nullable(body.twitter_url), nullable(body.facebook_url), nullable(body.linkedin_url), nullable(body.instagram_url), nullable(body.youtube_url), num(body.display_order, 0), bool(body.is_active, true)];
    },
    serializeUpdate(id, body) {
      return [id, ...this.serializeCreate(body)];
    }
  },
  testimonials: {
    listSql: `
      SELECT id, student_name, student_title, quote, image_url, rating, display_order, is_published, created_at, updated_at
      FROM testimonials
      ORDER BY display_order ASC, student_name ASC
    `,
    insertSql: `
      INSERT INTO testimonials (student_name, student_title, quote, image_url, rating, display_order, is_published)
      VALUES ($1,$2,$3,$4,$5,$6,$7)
      RETURNING *
    `,
    updateSql: `
      UPDATE testimonials
      SET student_name = $2, student_title = $3, quote = $4, image_url = $5, rating = $6, display_order = $7, is_published = $8
      WHERE id = $1
      RETURNING *
    `,
    deleteSql: `DELETE FROM testimonials WHERE id = $1 RETURNING id`,
    serializeCreate(body) {
      return [body.student_name, nullable(body.student_title), body.quote, nullable(body.image_url), body.rating === null || body.rating === undefined || body.rating === '' ? null : num(body.rating, 0), num(body.display_order, 0), bool(body.is_published, true)];
    },
    serializeUpdate(id, body) {
      return [id, ...this.serializeCreate(body)];
    }
  },
  contactMessages: {
    listSql: `
      SELECT id, full_name, email, subject, message, status, created_at, updated_at
      FROM contact_messages
      ORDER BY created_at DESC
    `,
    updateSql: `
      UPDATE contact_messages
      SET full_name = $2, email = $3, subject = $4, message = $5, status = $6
      WHERE id = $1
      RETURNING *
    `,
    deleteSql: `DELETE FROM contact_messages WHERE id = $1 RETURNING id`,
    serializeUpdate(id, body) {
      return [id, body.full_name, body.email, body.subject, body.message, body.status || 'new'];
    }
  },
  newsletterSubscribers: {
    listSql: `
      SELECT id, email, source, is_active, subscribed_at, updated_at
      FROM newsletter_subscribers
      ORDER BY subscribed_at DESC
    `,
    updateSql: `
      UPDATE newsletter_subscribers
      SET email = $2, source = $3, is_active = $4
      WHERE id = $1
      RETURNING *
    `,
    deleteSql: `DELETE FROM newsletter_subscribers WHERE id = $1 RETURNING id`,
    serializeUpdate(id, body) {
      return [id, body.email, nullable(body.source), bool(body.is_active, true)];
    }
  },
  enrollments: {
    listSql: `
      SELECT e.id, e.user_id, u.full_name AS user_name, u.email AS user_email, e.course_id, c.title AS course_title,
             e.status, e.progress_percent, e.enrolled_at, e.updated_at
      FROM enrollments e
      JOIN users u ON u.id = e.user_id
      JOIN courses c ON c.id = e.course_id
      ORDER BY e.enrolled_at DESC
    `,
    insertSql: `
      INSERT INTO enrollments (user_id, course_id, status, progress_percent)
      VALUES ($1,$2,$3,$4)
      RETURNING *
    `,
    updateSql: `
      UPDATE enrollments
      SET user_id = $2, course_id = $3, status = $4, progress_percent = $5
      WHERE id = $1
      RETURNING *
    `,
    deleteSql: `DELETE FROM enrollments WHERE id = $1 RETURNING id`,
    serializeCreate(body) {
      return [nullable(body.user_id), nullable(body.course_id), body.status || 'active', num(body.progress_percent, 0)];
    },
    serializeUpdate(id, body) {
      return [id, ...this.serializeCreate(body)];
    }
  }
};

adminRouter.get('/summary', async (_req, res) => {
  const summaryKeys = ['users', 'categories', 'courses', 'lessons', 'library_items', 'team_members', 'testimonials', 'contact_messages', 'newsletter_subscribers', 'enrollments'];
  const summary = {};

  for (const tableName of summaryKeys) {
    const result = await query(`SELECT COUNT(*)::int AS count FROM ${tableName}`);
    summary[tableName] = result.rows[0].count;
  }

  res.json({ summary });
});

adminRouter.get('/lookups/categories', async (_req, res) => {
  const result = await query(`SELECT id, name FROM categories WHERE is_active = TRUE ORDER BY display_order ASC, name ASC`);
  res.json({ items: result.rows });
});

adminRouter.get('/lookups/courses', async (_req, res) => {
  const result = await query(`SELECT id, title FROM courses ORDER BY display_order ASC, title ASC`);
  res.json({ items: result.rows });
});

adminRouter.get('/lookups/users', async (_req, res) => {
  const result = await query(`SELECT id, full_name, email FROM users ORDER BY created_at DESC`);
  res.json({ items: result.rows });
});

for (const [resourceName, config] of Object.entries(resourceConfig)) {
  const basePath = `/${resourceName}`;

  adminRouter.get(basePath, async (_req, res) => {
    const result = await query(config.listSql);
    res.json({ items: result.rows });
  });

  if (config.insertSql) {
    adminRouter.post(basePath, async (req, res) => {
      const result = await query(config.insertSql, config.serializeCreate(req.body));
      res.status(201).json({ item: result.rows[0] });
    });
  }

  if (config.updateSql) {
    adminRouter.put(`${basePath}/:id`, async (req, res) => {
      const result = await query(config.updateSql, config.serializeUpdate(req.params.id, req.body));
      if (result.rowCount === 0) {
        return res.status(404).json({ error: `${resourceName} item not found.` });
      }
      return res.json({ item: result.rows[0] });
    });
  }

  if (config.deleteSql) {
    adminRouter.delete(`${basePath}/:id`, async (req, res) => {
      const result = await query(config.deleteSql, [req.params.id]);
      if (result.rowCount === 0) {
        return res.status(404).json({ error: `${resourceName} item not found.` });
      }
      return res.json({ success: true });
    });
  }
}
