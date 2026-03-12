import express from "express";
import { query } from "../config/db.js";

export const publicRouter = express.Router();

publicRouter.get("/categories", async (_req, res) => {
  const result = await query(`
    SELECT id, name, slug, description, display_order
    FROM categories
    WHERE is_active = TRUE
    ORDER BY display_order ASC, name ASC
  `);
  res.json({ items: result.rows });
});

publicRouter.get("/courses", async (req, res) => {
  const limit = Math.min(Number(req.query.limit || 20), 100);
  const result = await query(
    `
      SELECT c.id, c.title, c.slug, c.summary, c.description, c.page_path, c.image_url,
             c.instructor_name, c.rating_average, c.rating_count, c.lecture_count,
             c.duration_hours, c.skill_level, c.language, c.price_amount, c.currency_code,
             c.course_type, c.is_featured, c.display_order, cat.name AS category_name
      FROM courses c
      LEFT JOIN categories cat ON cat.id = c.category_id
      WHERE c.is_published = TRUE
      ORDER BY c.is_featured DESC, c.display_order ASC, c.title ASC
      LIMIT $1
    `,
    [limit]
  );

  res.json({ items: result.rows });
});

publicRouter.get("/courses/by-page", async (req, res) => {
  const pagePath = String(req.query.page_path || "").trim();

  if (!pagePath) {
    return res.status(400).json({ error: "page_path is required." });
  }

  const result = await query(
    `
      SELECT c.id, c.title, c.slug, c.summary, c.description, c.page_path, c.image_url,
             c.instructor_name, c.rating_average, c.rating_count, c.lecture_count,
             c.duration_hours, c.skill_level, c.language, c.price_amount, c.currency_code,
             c.course_type, c.is_featured, c.display_order, cat.name AS category_name
      FROM courses c
      LEFT JOIN categories cat ON cat.id = c.category_id
      WHERE c.page_path = $1
      LIMIT 1
    `,
    [pagePath]
  );

  if (result.rowCount === 0) {
    return res.status(404).json({ error: "Course not found." });
  }

  return res.json({ item: result.rows[0] });
});

publicRouter.get("/team-members", async (_req, res) => {
  const result = await query(`
    SELECT full_name, title, bio, image_url, twitter_url, facebook_url,
           linkedin_url, instagram_url, youtube_url, display_order
    FROM team_members
    WHERE is_active = TRUE
    ORDER BY display_order ASC, full_name ASC
  `);
  res.json({ items: result.rows });
});

publicRouter.get("/testimonials", async (_req, res) => {
  const result = await query(`
    SELECT student_name, student_title, quote, image_url, rating, display_order
    FROM testimonials
    WHERE is_published = TRUE
    ORDER BY display_order ASC, student_name ASC
  `);
  res.json({ items: result.rows });
});

publicRouter.get("/library-items", async (req, res) => {
  const limit = Math.min(Number(req.query.limit || 20), 100);
  const result = await query(
    `
      SELECT li.title, li.slug, li.summary, li.author_name, li.format, li.cover_image_url,
             li.resource_url, li.is_featured, cat.name AS category_name
      FROM library_items li
      LEFT JOIN categories cat ON cat.id = li.category_id
      WHERE li.is_published = TRUE
      ORDER BY li.is_featured DESC, li.title ASC
      LIMIT $1
    `,
    [limit]
  );
  res.json({ items: result.rows });
});

publicRouter.post("/contact-messages", async (req, res) => {
  const fullName = String(req.body.full_name || "").trim();
  const email = String(req.body.email || "").trim().toLowerCase();
  const subject = String(req.body.subject || "").trim();
  const message = String(req.body.message || "").trim();

  if (!fullName || !email || !subject || !message) {
    return res.status(400).json({ error: "Full name, email, subject, and message are required." });
  }

  const result = await query(
    `
      INSERT INTO contact_messages (full_name, email, subject, message)
      VALUES ($1, $2, $3, $4)
      RETURNING id, full_name, email, subject, status, created_at
    `,
    [fullName, email, subject, message]
  );

  res.status(201).json({
    message: "Message sent successfully.",
    item: result.rows[0]
  });
});

publicRouter.post("/newsletter-subscriptions", async (req, res) => {
  const email = String(req.body.email || "").trim().toLowerCase();
  const source = String(req.body.source || "site-footer").trim();

  if (!email) {
    return res.status(400).json({ error: "Email is required." });
  }

  const result = await query(
    `
      INSERT INTO newsletter_subscribers (email, source, is_active)
      VALUES ($1, $2, TRUE)
      ON CONFLICT (email)
      DO UPDATE SET source = EXCLUDED.source, is_active = TRUE, updated_at = NOW()
      RETURNING id, email, source, is_active, subscribed_at
    `,
    [email, source]
  );

  res.status(201).json({
    message: "Subscription saved successfully.",
    item: result.rows[0]
  });
});
