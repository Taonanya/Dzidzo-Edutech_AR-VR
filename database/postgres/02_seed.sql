INSERT INTO users (full_name, email, password_hash, role)
VALUES
    (
        'Dzidzo Admin',
        'admin@dzidzo.local',
        '$2b$10$replace.with.a.real.bcrypt.hash.for.admin.user',
        'admin'
    ),
    (
        'Dzidzo Teacher',
        'teacher@dzidzo.local',
        '$2b$10$replace.with.a.real.bcrypt.hash.for.teacher.user',
        'teacher'
    ),
    (
        'Dzidzo Student',
        'student@dzidzo.local',
        '$2b$10$replace.with.a.real.bcrypt.hash.for.student.user',
        'student'
    )
ON CONFLICT (email) DO NOTHING;
