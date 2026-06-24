-- ================================================
-- Sample Data
-- ================================================

-- Admin user (password: admin123)
INSERT INTO users (name, email, password_hash, role) VALUES
('Admin User',    'admin@appointments.com',
 '$2a$10$xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', 'admin');

-- Sample services
INSERT INTO services (name, description, duration_minutes, price, category) VALUES
('General Consultation', 'Basic health checkup',        30,  500.00, 'medical'),
('Dental Checkup',       'Teeth cleaning and checkup',  45,  800.00, 'dental'),
('Eye Examination',      'Complete eye test',            30,  600.00, 'optical'),
('Physiotherapy',        'Physical therapy session',     60, 1200.00, 'therapy'),
('Hair Treatment',       'Hair care and treatment',      90,  1500.00, 'beauty');