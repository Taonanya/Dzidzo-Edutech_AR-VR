INSERT INTO users (full_name, email, password_hash, role, is_active)
VALUES
  ('Admin Operator', 'admin@dzidzo.local', crypt('Password123!', gen_salt('bf')), 'admin', TRUE),
  ('Martha Ncube', 'martha.ncube@dzidzo.local', crypt('Password123!', gen_salt('bf')), 'teacher', TRUE),
  ('Tawanda Moyo', 'tawanda.moyo@dzidzo.local', crypt('Password123!', gen_salt('bf')), 'teacher', TRUE),
  ('Rumbidzai Dube', 'rumbidzai.dube@dzidzo.local', crypt('Password123!', gen_salt('bf')), 'student', TRUE),
  ('Tanaka Sibanda', 'tanaka.sibanda@dzidzo.local', crypt('Password123!', gen_salt('bf')), 'student', TRUE),
  ('Nyasha Chari', 'nyasha.chari@dzidzo.local', crypt('Password123!', gen_salt('bf')), 'student', TRUE),
  ('Melissa Zhou', 'melissa.zhou@dzidzo.local', crypt('Password123!', gen_salt('bf')), 'student', TRUE)
ON CONFLICT (email) DO UPDATE
SET
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  is_active = EXCLUDED.is_active;

INSERT INTO categories (name, slug, description, display_order, is_active)
VALUES
  ('STEM VR Labs', 'stem-vr-labs', 'Practical science and engineering labs delivered through immersive scenes.', 4, TRUE),
  ('Teacher Ops', 'teacher-ops', 'Teacher workflows, rubrics, and classroom planning materials.', 5, TRUE)
ON CONFLICT (slug) DO UPDATE
SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  display_order = EXCLUDED.display_order,
  is_active = EXCLUDED.is_active;

UPDATE courses
SET
  instructor_user_id = u.id,
  instructor_name = u.full_name,
  summary = CASE
    WHEN courses.slug = 'classroom-1' THEN 'A guided immersive classroom for foundational VR learning, onboarding, and practical labs.'
    WHEN courses.slug = 'classroom-2' THEN 'An applied learning studio focused on advanced spatial lessons, problem-solving, and teamwork.'
    ELSE 'A stakeholder-facing VR lobby for demos, orientations, and guided walkthroughs.'
  END,
  description = CASE
    WHEN courses.slug = 'classroom-1' THEN 'Students move through guided orientation, a collaborative solar-system lab, and a reflective assessment inside a structured mixed-reality lesson path.'
    WHEN courses.slug = 'classroom-2' THEN 'This space is designed for teacher-led simulations, peer critique, and VR-based project checkpoints with measurable learner progress.'
    ELSE 'The business lobby supports stakeholder demos, sponsor tours, and platform showcases with embedded learning analytics and guided scenes.'
  END,
  demo_url = CASE
    WHEN courses.slug = 'classroom-1' THEN 'classroom_1.html'
    WHEN courses.slug = 'classroom-2' THEN 'classroom_2.html'
    ELSE 'business_lobby.html'
  END,
  lecture_count = CASE
    WHEN courses.slug = 'classroom-1' THEN 6
    WHEN courses.slug = 'classroom-2' THEN 7
    ELSE 4
  END,
  duration_hours = CASE
    WHEN courses.slug = 'classroom-1' THEN 10.5
    WHEN courses.slug = 'classroom-2' THEN 12.0
    ELSE 3.5
  END,
  skill_level = CASE
    WHEN courses.slug = 'classroom-2' THEN 'Advanced'
    ELSE 'Intermediate'
  END,
  category_id = CASE
    WHEN courses.slug IN ('classroom-1', 'classroom-2') THEN (SELECT id FROM categories WHERE slug = 'stem-vr-labs')
    ELSE (SELECT id FROM categories WHERE slug = 'business-spaces')
  END
FROM users u
WHERE (
  (courses.slug = 'classroom-1' AND u.email = 'martha.ncube@dzidzo.local')
  OR (courses.slug = 'classroom-2' AND u.email = 'tawanda.moyo@dzidzo.local')
  OR (courses.slug = 'business-lobby' AND u.email = 'admin@dzidzo.local')
);

INSERT INTO lessons (course_id, title, slug, summary, content, media_type, media_url, duration_minutes, display_order, is_published)
SELECT c.id, seed.title, seed.slug, seed.summary, seed.content, seed.media_type, seed.media_url, seed.duration_minutes, seed.display_order, TRUE
FROM courses c
JOIN (
  VALUES
    ('classroom-1', 'VR Orientation', 'vr-orientation', 'Start with controls, movement, and classroom expectations.', 'Learners calibrate head tracking, audio, and movement before entering the first immersive room.', 'vr', 'classroom_1.html#orientation', 15, 1),
    ('classroom-1', 'Solar Lab', 'solar-lab', 'Inspect planets, scale, and orbital spacing through guided interaction.', 'Students walk through a narrated solar-system scene and complete a short observation worksheet.', 'immersive_scene', 'classroom_1.html#solar-lab', 35, 2),
    ('classroom-1', 'Reflection Checkpoint', 'reflection-checkpoint', 'Capture observations and answer scenario prompts.', 'A teacher-led checkpoint converts the spatial activity into written understanding and peer discussion.', 'assessment', 'classroom_1.html#reflection', 20, 3),
    ('classroom-2', 'Engineering Briefing', 'engineering-briefing', 'Review the project brief and safety constraints for the simulation.', 'Teams enter the design studio, inspect the environment, and assign responsibilities.', 'vr', 'classroom_2.html#briefing', 20, 1),
    ('classroom-2', 'Bridge Stress Simulation', 'bridge-stress-simulation', 'Manipulate load, span, and material choices in real time.', 'Learners iterate through structural design choices and compare resulting stress maps.', 'immersive_scene', 'classroom_2.html#bridge-lab', 40, 2),
    ('classroom-2', 'Peer Critique Review', 'peer-critique-review', 'Review build choices and submit improvement recommendations.', 'The class records observations, feedback, and the next design action to complete.', 'review', 'classroom_2.html#critique', 25, 3),
    ('business-lobby', 'Stakeholder Walkthrough', 'stakeholder-walkthrough', 'Navigate the virtual lobby and present the learning proposition clearly.', 'This guided scene helps staff rehearse sponsor demos and partnership onboarding.', '360-tour', 'business_lobby.html#walkthrough', 18, 1)
) AS seed(course_slug, title, slug, summary, content, media_type, media_url, duration_minutes, display_order)
  ON seed.course_slug = c.slug
ON CONFLICT (course_id, slug) DO UPDATE
SET
  title = EXCLUDED.title,
  summary = EXCLUDED.summary,
  content = EXCLUDED.content,
  media_type = EXCLUDED.media_type,
  media_url = EXCLUDED.media_url,
  duration_minutes = EXCLUDED.duration_minutes,
  display_order = EXCLUDED.display_order,
  is_published = EXCLUDED.is_published;

INSERT INTO enrollments (user_id, course_id, status, progress_percent)
SELECT u.id, c.id, seed.status::enrollment_status, seed.progress_percent
FROM (
  VALUES
    ('rumbidzai.dube@dzidzo.local', 'classroom-1', 'active', 82.0),
    ('rumbidzai.dube@dzidzo.local', 'classroom-2', 'active', 61.0),
    ('tanaka.sibanda@dzidzo.local', 'classroom-1', 'completed', 100.0),
    ('tanaka.sibanda@dzidzo.local', 'classroom-2', 'active', 74.0),
    ('nyasha.chari@dzidzo.local', 'classroom-1', 'active', 48.0),
    ('melissa.zhou@dzidzo.local', 'classroom-2', 'active', 89.0)
) AS seed(user_email, course_slug, status, progress_percent)
JOIN users u ON u.email = seed.user_email
JOIN courses c ON c.slug = seed.course_slug
ON CONFLICT (user_id, course_id) DO UPDATE
SET
  status = EXCLUDED.status,
  progress_percent = EXCLUDED.progress_percent,
  updated_at = NOW();

INSERT INTO library_items (title, slug, summary, author_name, format, cover_image_url, resource_url, category_id, is_featured, is_published)
VALUES
  (
    'Teacher VR Facilitation Playbook',
    'teacher-vr-facilitation-playbook',
    'Operational guidance for setting up headsets, moderating sessions, and collecting learner evidence.',
    'Dzidzo Faculty Studio',
    'Playbook',
    'img/courses-3.jpg',
    'library.html',
    (SELECT id FROM categories WHERE slug = 'teacher-ops'),
    TRUE,
    TRUE
  ),
  (
    'Bridge Design Studio Workbook',
    'bridge-design-studio-workbook',
    'A printable companion for the bridge-stress simulation with reflection prompts and scoring rubrics.',
    'Dzidzo Faculty Studio',
    'Workbook',
    'img/courses-4.jpg',
    'library.html',
    (SELECT id FROM categories WHERE slug = 'stem-vr-labs'),
    TRUE,
    TRUE
  ),
  (
    'Solar System Observation Pack',
    'solar-system-observation-pack',
    'Observation sheets and extension tasks mapped to the solar lab learning objectives.',
    'Dzidzo Faculty Studio',
    'Lesson Pack',
    'img/courses-6.jpg',
    'library.html',
    (SELECT id FROM categories WHERE slug = 'stem-vr-labs'),
    FALSE,
    TRUE
  )
ON CONFLICT (slug) DO UPDATE
SET
  summary = EXCLUDED.summary,
  author_name = EXCLUDED.author_name,
  format = EXCLUDED.format,
  cover_image_url = EXCLUDED.cover_image_url,
  resource_url = EXCLUDED.resource_url,
  category_id = EXCLUDED.category_id,
  is_featured = EXCLUDED.is_featured,
  is_published = EXCLUDED.is_published;

INSERT INTO team_members (full_name, title, bio, image_url, twitter_url, facebook_url, linkedin_url, instagram_url, youtube_url, display_order, is_active)
VALUES
  ('Martha Ncube', 'Lead VR Learning Designer', 'Designs learner journeys, teaching packs, and assessment flows for immersive classrooms.', 'img/team-1.jpg', '#', '#', '#', '#', '#', 5, TRUE),
  ('Tawanda Moyo', 'Simulation Systems Teacher', 'Leads applied VR problem-solving sessions and classroom data review.', 'img/team-2.jpg', '#', '#', '#', '#', '#', 6, TRUE)
ON CONFLICT DO NOTHING;

INSERT INTO testimonials (student_name, student_title, quote, image_url, rating, display_order, is_published)
VALUES
  ('Rumbidzai Dube', 'STEM VR Learner', 'The bridge simulation finally made structural forces click for me. I could see mistakes before I wrote the explanation.', 'img/testimonial-1.jpg', 4.90, 3, TRUE),
  ('Tanaka Sibanda', 'AR Classroom Student', 'The platform feels like a proper school workspace, not just a demo. I can move from lesson, to library, to review without guessing.', 'img/testimonial-2.jpg', 5.00, 4, TRUE)
ON CONFLICT DO NOTHING;

INSERT INTO contact_messages (full_name, email, subject, message, status)
VALUES
  ('Farai School Trust', 'partnerships@faraischool.org', 'Pilot request', 'We want to run a six-week pilot for two VR classrooms and one teacher onboarding sequence.', 'new'),
  ('Mercy Gono', 'mercy.gono@example.com', 'Teacher onboarding', 'Please share the recommended onboarding path for new teachers before we buy additional headsets.', 'read'),
  ('Patrick M.', 'patrick@example.com', 'Library access', 'Our learners need the bridge workbook and the solar lab pack added to the main library view.', 'replied')
ON CONFLICT DO NOTHING;

INSERT INTO newsletter_subscribers (email, source, is_active)
VALUES
  ('updates@faraischool.org', 'homepage-hero', TRUE),
  ('principal@makombe.edu', 'footer-signup', TRUE),
  ('innovation@dzidzo.local', 'admin-studio', TRUE)
ON CONFLICT (email) DO UPDATE
SET
  source = EXCLUDED.source,
  is_active = EXCLUDED.is_active,
  updated_at = NOW();
