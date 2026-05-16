-- Subject Registration System Schema

-- Students Table
CREATE TABLE IF NOT EXISTS students (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    usn VARCHAR(20) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Subjects Table
CREATE TABLE IF NOT EXISTS subjects (
    id SERIAL PRIMARY KEY,
    subject_code VARCHAR(20) UNIQUE NOT NULL,
    subject_name VARCHAR(100) NOT NULL,
    credits INTEGER NOT NULL,
    schedule VARCHAR(100) NOT NULL
);

-- Registrations Table
CREATE TABLE IF NOT EXISTS registrations (
    id SERIAL PRIMARY KEY,
    student_id INTEGER REFERENCES students(id) ON DELETE CASCADE,
    subject_id INTEGER REFERENCES subjects(id) ON DELETE CASCADE,
    semester VARCHAR(20) NOT NULL,
    academic_year VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(student_id, subject_id, semester, academic_year)
);

-- History Table
CREATE TABLE IF NOT EXISTS history (
    id SERIAL PRIMARY KEY,
    student_id INTEGER REFERENCES students(id) ON DELETE CASCADE,
    subject_id INTEGER REFERENCES subjects(id) ON DELETE SET NULL,
    subject_code VARCHAR(20),
    subject_name VARCHAR(100),
    action_type VARCHAR(20) NOT NULL, -- Added, Modified, Deleted
    old_value TEXT,
    new_value TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert Sample Subjects
INSERT INTO subjects (subject_code, subject_name, credits, schedule) VALUES
('CS101', 'Introduction to Computer Science', 3, 'Mon/Wed 09:00 AM'),
('MATH101', 'Calculus I', 4, 'Tue/Thu 10:30 AM'),
('PHY101', 'Physics I', 4, 'Mon/Wed 02:00 PM'),
('ENG101', 'English Composition', 3, 'Fri 09:00 AM'),
('DBMS201', 'Database Management Systems', 4, 'Tue/Thu 01:00 PM'),
('ADA202', 'Algorithm Design and Analysis', 4, 'Wed/Fri 11:00 AM'),
('OS301', 'Operating Systems', 4, 'Mon/Wed 10:00 AM'),
('CN302', 'Computer Networks', 4, 'Tue/Thu 09:00 AM'),
('SE303', 'Software Engineering', 3, 'Fri 02:00 PM')
ON CONFLICT (subject_code) DO NOTHING;
