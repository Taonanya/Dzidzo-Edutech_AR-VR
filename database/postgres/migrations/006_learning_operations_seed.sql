INSERT INTO assignments (course_id, teacher_user_id, title, slug, instructions, due_at, max_score, is_published)
SELECT
  c.id,
  c.instructor_user_id,
  seed.title,
  seed.slug,
  seed.instructions,
  seed.due_at::timestamptz,
  seed.max_score,
  TRUE
FROM courses c
JOIN (
  VALUES
    ('classroom-1', 'Solar-lab observation report', 'solar-lab-observation-report', 'Submit a structured observation report from the solar lab scene with three spatial findings and one misconception corrected.', '2026-04-10 16:00:00+02', 100),
    ('classroom-2', 'Bridge stress redesign brief', 'bridge-stress-redesign-brief', 'Use the VR simulation output to propose one improved bridge design and justify the material choice.', '2026-04-12 16:00:00+02', 100),
    ('business-lobby', 'Stakeholder demo storyboard', 'stakeholder-demo-storyboard', 'Prepare a five-step walkthrough for presenting the business lobby to a school partner.', '2026-04-15 16:00:00+02', 50)
) AS seed(course_slug, title, slug, instructions, due_at, max_score)
  ON seed.course_slug = c.slug
ON CONFLICT (course_id, slug) DO UPDATE
SET
  title = EXCLUDED.title,
  instructions = EXCLUDED.instructions,
  due_at = EXCLUDED.due_at,
  max_score = EXCLUDED.max_score,
  is_published = EXCLUDED.is_published;

INSERT INTO submissions (assignment_id, student_user_id, status, submission_text, artifact_url, score, submitted_at, reviewed_at)
SELECT
  a.id,
  u.id,
  seed.status::assignment_submission_status,
  seed.submission_text,
  seed.artifact_url,
  seed.score,
  seed.submitted_at::timestamptz,
  seed.reviewed_at::timestamptz
FROM (
  VALUES
    ('solar-lab-observation-report', 'rumbidzai.dube@dzidzo.local', 'submitted', 'I identified how orbital distance changes apparent movement and used the VR labels to compare gas giants against terrestrial planets.', 'https://example.com/submissions/rumbidzai-solar-lab', NULL, '2026-04-07 09:10:00+02', NULL),
    ('solar-lab-observation-report', 'tanaka.sibanda@dzidzo.local', 'reviewed', 'The lab clarified scale differences and I corrected my earlier assumption about the asteroid belt position.', 'https://example.com/submissions/tanaka-solar-lab', 93, '2026-04-06 14:00:00+02', '2026-04-07 12:30:00+02'),
    ('bridge-stress-redesign-brief', 'melissa.zhou@dzidzo.local', 'reviewed', 'I reduced span load by changing the beam profile and documented the resulting stress map in the redesign brief.', 'https://example.com/submissions/melissa-bridge-brief', 95, '2026-04-07 15:40:00+02', '2026-04-08 08:00:00+02'),
    ('bridge-stress-redesign-brief', 'rumbidzai.dube@dzidzo.local', 'needs_revision', 'I proposed a redesign but need to justify the material selection more clearly against the simulation data.', 'https://example.com/submissions/rumbidzai-bridge-brief', 67, '2026-04-07 16:10:00+02', '2026-04-08 09:15:00+02')
) AS seed(assignment_slug, student_email, status, submission_text, artifact_url, score, submitted_at, reviewed_at)
JOIN assignments a ON a.slug = seed.assignment_slug
JOIN users u ON u.email = seed.student_email
ON CONFLICT (assignment_id, student_user_id) DO UPDATE
SET
  status = EXCLUDED.status,
  submission_text = EXCLUDED.submission_text,
  artifact_url = EXCLUDED.artifact_url,
  score = EXCLUDED.score,
  submitted_at = EXCLUDED.submitted_at,
  reviewed_at = EXCLUDED.reviewed_at,
  updated_at = NOW();

INSERT INTO reviews (submission_id, reviewer_user_id, feedback, rubric_summary, score, status)
SELECT
  s.id,
  reviewer.id,
  seed.feedback,
  seed.rubric_summary,
  seed.score,
  seed.status::review_status
FROM (
  VALUES
    ('tanaka.sibanda@dzidzo.local', 'solar-lab-observation-report', 'martha.ncube@dzidzo.local', 'Strong evidence capture. Expand the explanation of why orbital spacing changes perceived travel time.', 'Accurate observations, clear structure, minor extension needed.', 93, 'approved'),
    ('melissa.zhou@dzidzo.local', 'bridge-stress-redesign-brief', 'tawanda.moyo@dzidzo.local', 'Excellent redesign logic. The use of stress maps and material rationale is precise and easy to follow.', 'High-quality simulation reasoning and concise reporting.', 95, 'approved'),
    ('rumbidzai.dube@dzidzo.local', 'bridge-stress-redesign-brief', 'tawanda.moyo@dzidzo.local', 'You identified the right weak point, but the brief still needs stronger evidence for the new material recommendation.', 'Good simulation reading; revise the justification section.', 67, 'revision_requested')
) AS seed(student_email, assignment_slug, reviewer_email, feedback, rubric_summary, score, status)
JOIN assignments a ON a.slug = seed.assignment_slug
JOIN users student ON student.email = seed.student_email
JOIN submissions s ON s.assignment_id = a.id AND s.student_user_id = student.id
JOIN users reviewer ON reviewer.email = seed.reviewer_email
ON CONFLICT (submission_id) DO UPDATE
SET
  reviewer_user_id = EXCLUDED.reviewer_user_id,
  feedback = EXCLUDED.feedback,
  rubric_summary = EXCLUDED.rubric_summary,
  score = EXCLUDED.score,
  status = EXCLUDED.status,
  updated_at = NOW();

INSERT INTO attendance_sessions (course_id, title, session_date, mode, notes)
SELECT
  c.id,
  seed.title,
  seed.session_date::date,
  seed.mode,
  seed.notes
FROM courses c
JOIN (
  VALUES
    ('classroom-1', 'VR onboarding session', '2026-04-05', 'in-world', 'Headset fit, orientation, and first-room navigation.'),
    ('classroom-2', 'Bridge lab attendance', '2026-04-06', 'in-world', 'Attendance captured before the bridge stress simulation opens.'),
    ('business-lobby', 'Partner demo attendance', '2026-04-07', 'hybrid', 'Demo guests and internal staff attendance.')
) AS seed(course_slug, title, session_date, mode, notes)
  ON seed.course_slug = c.slug
ON CONFLICT DO NOTHING;

INSERT INTO attendance_records (session_id, student_user_id, attendance_status, check_in_at, notes)
SELECT
  s.id,
  u.id,
  seed.attendance_status::attendance_status,
  seed.check_in_at::timestamptz,
  seed.notes
FROM (
  VALUES
    ('VR onboarding session', 'rumbidzai.dube@dzidzo.local', 'present', '2026-04-05 08:04:00+02', 'Joined from the headset lab.'),
    ('VR onboarding session', 'tanaka.sibanda@dzidzo.local', 'present', '2026-04-05 08:02:00+02', 'Ready before session start.'),
    ('VR onboarding session', 'nyasha.chari@dzidzo.local', 'late', '2026-04-05 08:17:00+02', 'Audio setup delay.'),
    ('Bridge lab attendance', 'rumbidzai.dube@dzidzo.local', 'present', '2026-04-06 10:01:00+02', 'Completed safety check.'),
    ('Bridge lab attendance', 'melissa.zhou@dzidzo.local', 'present', '2026-04-06 10:00:00+02', 'Early arrival.'),
    ('Bridge lab attendance', 'tanaka.sibanda@dzidzo.local', 'excused', NULL, 'Attached to an external robotics event.')
) AS seed(session_title, student_email, attendance_status, check_in_at, notes)
JOIN attendance_sessions s ON s.title = seed.session_title
JOIN users u ON u.email = seed.student_email
ON CONFLICT (session_id, student_user_id) DO UPDATE
SET
  attendance_status = EXCLUDED.attendance_status,
  check_in_at = EXCLUDED.check_in_at,
  notes = EXCLUDED.notes,
  updated_at = NOW();
