# Dzidzo MVP Database Plan

## Scope

This schema is based on the current frontend in this repository, not on the older README claims.

From the frontend pages, the MVP clearly needs content and data for:

- user sign-up and sign-in
- classrooms or courses
- course detail pages with lessons and metadata
- library resources
- team members
- testimonials
- contact form submissions
- newsletter signups
- student enrollments
- admin content management

## How Many Tables The MVP Needs

The MVP needs **10 main tables**:

1. `users`
2. `categories`
3. `courses`
4. `lessons`
5. `enrollments`
6. `library_items`
7. `team_members`
8. `testimonials`
9. `contact_messages`
10. `newsletter_subscribers`

There is also one support table used by the migration process:

11. `schema_migrations`

## Why These Tables Exist

### `users`

Needed because the frontend already has sign-up, sign-in, and role-based redirects.

Fields:

- `id`
- `full_name`
- `email`
- `password_hash`
- `role`
- `is_active`
- `created_at`
- `updated_at`

### `categories`

Needed because the course detail page shows categories, and both courses and library items need grouping.

Fields:

- `id`
- `name`
- `slug`
- `description`
- `display_order`
- `is_active`
- `created_at`
- `updated_at`

### `courses`

Needed because the site has a course or classroom listing page and individual classroom detail pages.

Fields:

- `id`
- `title`
- `slug`
- `summary`
- `description`
- `page_path`
- `image_url`
- `demo_url`
- `category_id`
- `instructor_user_id`
- `instructor_name`
- `rating_average`
- `rating_count`
- `lecture_count`
- `duration_hours`
- `skill_level`
- `language`
- `price_amount`
- `currency_code`
- `course_type`
- `is_published`
- `is_featured`
- `display_order`
- `created_at`
- `updated_at`

### `lessons`

Needed because the course detail page shows lecture counts and implies course content units.

Fields:

- `id`
- `course_id`
- `title`
- `slug`
- `summary`
- `content`
- `media_type`
- `media_url`
- `duration_minutes`
- `display_order`
- `is_published`
- `created_at`
- `updated_at`

### `enrollments`

Needed because the detail page has an `Enroll Now` action, and students need a relation to classrooms or courses.

Fields:

- `id`
- `user_id`
- `course_id`
- `status`
- `progress_percent`
- `enrolled_at`
- `updated_at`

### `library_items`

Needed because the site has a library page and library access messaging.

Fields:

- `id`
- `title`
- `slug`
- `summary`
- `author_name`
- `format`
- `cover_image_url`
- `resource_url`
- `category_id`
- `is_featured`
- `is_published`
- `created_at`
- `updated_at`

### `team_members`

Needed because the team page is a structured content list with names, titles, images, and social links.

Fields:

- `id`
- `full_name`
- `title`
- `bio`
- `image_url`
- `twitter_url`
- `facebook_url`
- `linkedin_url`
- `instagram_url`
- `youtube_url`
- `display_order`
- `is_active`
- `created_at`
- `updated_at`

### `testimonials`

Needed because the testimonial page is a structured carousel of learner feedback.

Fields:

- `id`
- `student_name`
- `student_title`
- `quote`
- `image_url`
- `rating`
- `display_order`
- `is_published`
- `created_at`
- `updated_at`

### `contact_messages`

Needed because the contact page has a real contact form.

Fields:

- `id`
- `full_name`
- `email`
- `subject`
- `message`
- `status`
- `created_at`
- `updated_at`

### `newsletter_subscribers`

Needed because multiple pages include email signup prompts in the footer and library entry areas.

Fields:

- `id`
- `email`
- `source`
- `is_active`
- `subscribed_at`
- `updated_at`

## Frontend Evidence For The Schema

Representative frontend references:

- course list and classroom cards: [course.html](C:/Users/dell/Documents/Dzidzo-Edutech_AR-VR/course.html)
- course detail fields like instructor, rating, lectures, duration, skill level, language, price: [detail.html](C:/Users/dell/Documents/Dzidzo-Edutech_AR-VR/detail.html)
- contact form fields: [contact.html](C:/Users/dell/Documents/Dzidzo-Edutech_AR-VR/contact.html)
- team member cards: [team.html](C:/Users/dell/Documents/Dzidzo-Edutech_AR-VR/team.html)
- testimonial cards: [testimonial.html](C:/Users/dell/Documents/Dzidzo-Edutech_AR-VR/testimonial.html)
- library experience and resource intent: [library.html](C:/Users/dell/Documents/Dzidzo-Edutech_AR-VR/library.html)
- auth flow and roles: [admin src/build/pages/sign-up.html](C:/Users/dell/Documents/Dzidzo-Edutech_AR-VR/admin src/build/pages/sign-up.html), [admin src/build/pages/sign-in.html](C:/Users/dell/Documents/Dzidzo-Edutech_AR-VR/admin src/build/pages/sign-in.html)

## What Is Not Included Yet

The MVP does not need deeper structures yet such as:

- payments
- invoices
- quizzes
- certificates
- live chat persistence
- file storage metadata
- audit logs
- permissions matrix tables

Those can be added later if the product grows beyond the current site behavior.
