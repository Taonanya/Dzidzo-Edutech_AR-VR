DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_type WHERE typname = 'assignment_submission_status'
    ) THEN
        CREATE TYPE assignment_submission_status AS ENUM ('draft', 'submitted', 'reviewed', 'needs_revision');
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_type WHERE typname = 'review_status'
    ) THEN
        CREATE TYPE review_status AS ENUM ('pending', 'returned', 'approved', 'revision_requested');
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_type WHERE typname = 'attendance_status'
    ) THEN
        CREATE TYPE attendance_status AS ENUM ('present', 'late', 'absent', 'excused');
    END IF;
END $$;

CREATE TABLE IF NOT EXISTS assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    teacher_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    title VARCHAR(180) NOT NULL,
    slug VARCHAR(200) NOT NULL,
    instructions TEXT,
    due_at TIMESTAMPTZ,
    max_score NUMERIC(6,2) NOT NULL DEFAULT 100,
    is_published BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (course_id, slug)
);

DROP TRIGGER IF EXISTS trg_assignments_set_updated_at ON assignments;
CREATE TRIGGER trg_assignments_set_updated_at
BEFORE UPDATE ON assignments
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

CREATE TABLE IF NOT EXISTS submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    assignment_id UUID NOT NULL REFERENCES assignments(id) ON DELETE CASCADE,
    student_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    status assignment_submission_status NOT NULL DEFAULT 'draft',
    submission_text TEXT,
    artifact_url VARCHAR(500),
    score NUMERIC(6,2),
    submitted_at TIMESTAMPTZ,
    reviewed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (assignment_id, student_user_id)
);

DROP TRIGGER IF EXISTS trg_submissions_set_updated_at ON submissions;
CREATE TRIGGER trg_submissions_set_updated_at
BEFORE UPDATE ON submissions
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

CREATE TABLE IF NOT EXISTS reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    submission_id UUID NOT NULL UNIQUE REFERENCES submissions(id) ON DELETE CASCADE,
    reviewer_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    feedback TEXT,
    rubric_summary TEXT,
    score NUMERIC(6,2),
    status review_status NOT NULL DEFAULT 'pending',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

DROP TRIGGER IF EXISTS trg_reviews_set_updated_at ON reviews;
CREATE TRIGGER trg_reviews_set_updated_at
BEFORE UPDATE ON reviews
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

CREATE TABLE IF NOT EXISTS attendance_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    title VARCHAR(180) NOT NULL,
    session_date DATE NOT NULL,
    mode VARCHAR(80) DEFAULT 'in-world',
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

DROP TRIGGER IF EXISTS trg_attendance_sessions_set_updated_at ON attendance_sessions;
CREATE TRIGGER trg_attendance_sessions_set_updated_at
BEFORE UPDATE ON attendance_sessions
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

CREATE TABLE IF NOT EXISTS attendance_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID NOT NULL REFERENCES attendance_sessions(id) ON DELETE CASCADE,
    student_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    attendance_status attendance_status NOT NULL DEFAULT 'present',
    check_in_at TIMESTAMPTZ,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (session_id, student_user_id)
);

DROP TRIGGER IF EXISTS trg_attendance_records_set_updated_at ON attendance_records;
CREATE TRIGGER trg_attendance_records_set_updated_at
BEFORE UPDATE ON attendance_records
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();
