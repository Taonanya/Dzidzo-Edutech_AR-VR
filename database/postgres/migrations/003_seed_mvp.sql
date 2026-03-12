INSERT INTO categories (name, slug, description, display_order)
VALUES
    ('AR Classrooms', 'ar-classrooms', 'Immersive classroom experiences and virtual labs.', 1),
    ('Business Spaces', 'business-spaces', 'Virtual business lobbies and meeting spaces.', 2),
    ('Library', 'library', 'Reading, books, and AR-enhanced learning resources.', 3)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO courses (
    title,
    slug,
    summary,
    description,
    page_path,
    image_url,
    instructor_name,
    rating_average,
    rating_count,
    lecture_count,
    duration_hours,
    skill_level,
    language,
    price_amount,
    currency_code,
    course_type,
    is_published,
    is_featured,
    display_order,
    category_id
)
SELECT *
FROM (
    SELECT
        'Classroom 1',
        'classroom-1',
        'Interactive classroom with immersive AR/VR learning.',
        'Experience a guided AR classroom led by Dzidzo instructors.',
        'classroom_1.html',
        'img/courses-1.jpg',
        'Shoko',
        4.20,
        254,
        12,
        8.50,
        'Intermediate',
        'English',
        0,
        'USD',
        'classroom',
        TRUE,
        TRUE,
        1,
        (SELECT id FROM categories WHERE slug = 'ar-classrooms')
    UNION ALL
    SELECT
        'Classroom 2',
        'classroom-2',
        'Advanced virtual classroom for applied immersive learning.',
        'A deeper classroom experience with interactive course modules.',
        'classroom_2.html',
        'img/courses-2.jpg',
        'Nature_',
        4.40,
        38,
        10,
        7.00,
        'Advanced',
        'English',
        0,
        'USD',
        'classroom',
        TRUE,
        TRUE,
        2,
        (SELECT id FROM categories WHERE slug = 'ar-classrooms')
    UNION ALL
    SELECT
        'Business Lobby',
        'business-lobby',
        'Virtual business lobby for immersive networking and presentation.',
        'A virtual lobby environment suitable for business showcases and meetings.',
        'business_lobby.html',
        'img/courses-5.jpg',
        'T.Shoko',
        0,
        0,
        4,
        2.50,
        'All Levels',
        'English',
        0,
        'USD',
        'business_lobby',
        TRUE,
        TRUE,
        3,
        (SELECT id FROM categories WHERE slug = 'business-spaces')
) AS seed_data (
    title,
    slug,
    summary,
    description,
    page_path,
    image_url,
    instructor_name,
    rating_average,
    rating_count,
    lecture_count,
    duration_hours,
    skill_level,
    language,
    price_amount,
    currency_code,
    course_type,
    is_published,
    is_featured,
    display_order,
    category_id
)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO lessons (course_id, title, slug, summary, content, media_type, media_url, duration_minutes, display_order)
SELECT c.id, 'Orientation', 'orientation', 'Course introduction and navigation.', 'Start here to understand the classroom structure and learning flow.', 'html', c.page_path, 20, 1
FROM courses c
WHERE c.slug IN ('classroom-1', 'classroom-2', 'business-lobby')
ON CONFLICT (course_id, slug) DO NOTHING;

INSERT INTO library_items (title, slug, summary, author_name, format, cover_image_url, resource_url, category_id, is_featured)
VALUES
    (
        'African History in AR',
        'african-history-in-ar',
        'An immersive reading resource focused on African history.',
        'Dzidzo Editorial',
        'AR Book',
        'img/courses-1.jpg',
        'library.html',
        (SELECT id FROM categories WHERE slug = 'library'),
        TRUE
    ),
    (
        'Science Concepts Visualized',
        'science-concepts-visualized',
        'Interactive resource with AR-supported science explanations.',
        'Dzidzo Editorial',
        'Interactive Guide',
        'img/courses-2.jpg',
        'library.html',
        (SELECT id FROM categories WHERE slug = 'library'),
        TRUE
    )
ON CONFLICT (slug) DO NOTHING;

INSERT INTO team_members (
    full_name,
    title,
    bio,
    image_url,
    twitter_url,
    facebook_url,
    linkedin_url,
    instagram_url,
    youtube_url,
    display_order
)
VALUES
    (
        'Taonanyasha Shoko',
        'Founder & CEO of Dzidzo EduTech',
        'Founder focused on education transformation through immersive learning.',
        'img/team-2.jpg',
        '#', '#', '#', '#', '#',
        1
    ),
    (
        'Viola Mverechena',
        'Co-founder & Chief Information Officer',
        'Co-founder helping shape product and information strategy.',
        'img/team-3.jpg',
        '#', '#', '#', '#', '#',
        2
    ),
    (
        'Hermish Paunganwa',
        'Chief Operations Officer',
        'Operations lead supporting execution and delivery.',
        'img/team-4.jpg',
        '#', '#', '#', '#', '#',
        3
    ),
    (
        'Mark Nature Chindudzi',
        'CTIO & Founding Engineer',
        'Founding engineer focused on immersive product development.',
        'img/team-1.jpg',
        '#', '#', '#', '#', '#',
        4
    )
ON CONFLICT DO NOTHING;

INSERT INTO testimonials (student_name, student_title, quote, image_url, rating, display_order)
VALUES
    (
        'Dzidzo Student',
        'AR Learner',
        'Dzidzo has completely transformed the way I learn. The AR and VR classrooms make complex topics easier to understand.',
        'img/testimonial-2.jpg',
        4.80,
        1
    ),
    (
        'Student Name',
        'Web Design',
        'The platform makes learning feel immersive and practical instead of passive.',
        'img/testimonial-1.jpg',
        4.60,
        2
    )
ON CONFLICT DO NOTHING;
