-- Smart Appointment Platform Database
-- Tables will be created in Phase 2-- ================================================
-- Smart Appointment Platform - Database Schema
-- ================================================

-- UUID extension enable karo
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ================================================
-- 1. USERS TABLE
-- ================================================
CREATE TABLE users (
    id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name          VARCHAR(100) NOT NULL,
    email         VARCHAR(150) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role          VARCHAR(20) NOT NULL DEFAULT 'customer'
                  CHECK (role IN ('customer', 'admin')),
    phone         VARCHAR(20),
    created_at    TIMESTAMP DEFAULT NOW(),
    updated_at    TIMESTAMP DEFAULT NOW()
);

-- ================================================
-- 2. SERVICES TABLE
-- ================================================
CREATE TABLE services (
    id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name             VARCHAR(100) NOT NULL,
    description      TEXT,
    duration_minutes INT NOT NULL DEFAULT 30,
    price            DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    category         VARCHAR(50),
    is_active        BOOLEAN DEFAULT TRUE,
    created_at       TIMESTAMP DEFAULT NOW(),
    updated_at       TIMESTAMP DEFAULT NOW()
);

-- ================================================
-- 3. APPOINTMENTS TABLE
-- ================================================
CREATE TABLE appointments (
    id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id          UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    service_id       UUID NOT NULL REFERENCES services(id) ON DELETE CASCADE,
    appointment_date DATE NOT NULL,
    appointment_time TIME NOT NULL,
    status           VARCHAR(20) NOT NULL DEFAULT 'pending'
                     CHECK (status IN ('pending','confirmed','cancelled','completed','rescheduled')),
    notes            TEXT,
    created_at       TIMESTAMP DEFAULT NOW(),
    updated_at       TIMESTAMP DEFAULT NOW()
);

-- ================================================
-- 4. REVIEWS TABLE
-- ================================================
CREATE TABLE reviews (
    id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id        UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    appointment_id UUID NOT NULL REFERENCES appointments(id) ON DELETE CASCADE,
    rating         INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment        TEXT,
    created_at     TIMESTAMP DEFAULT NOW(),
    UNIQUE(appointment_id)
);

-- ================================================
-- 5. RECOMMENDATION HISTORY TABLE
-- ================================================
CREATE TABLE recommendation_history (
    id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id        UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    service_id     UUID NOT NULL REFERENCES services(id) ON DELETE CASCADE,
    preferred_day  VARCHAR(10),
    preferred_time VARCHAR(20),
    score          INT DEFAULT 0,
    created_at     TIMESTAMP DEFAULT NOW()
);

-- ================================================
-- INDEXES (query fast karne ke liye)
-- ================================================
CREATE INDEX idx_appointments_user    ON appointments(user_id);
CREATE INDEX idx_appointments_date    ON appointments(appointment_date);
CREATE INDEX idx_appointments_status  ON appointments(status);
CREATE INDEX idx_reviews_user         ON reviews(user_id);
CREATE INDEX idx_recommendations_user ON recommendation_history(user_id);