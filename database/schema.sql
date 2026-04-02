-- ============================================================
-- PARKING MANAGEMENT SYSTEM - Database Schema
-- ============================================================

CREATE DATABASE IF NOT EXISTS parking_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE parking_db;

CREATE TABLE IF NOT EXISTS users (
    id            INT AUTO_INCREMENT PRIMARY KEY,
    full_name     VARCHAR(100) NOT NULL,
    email         VARCHAR(150) NOT NULL UNIQUE,
    phone         VARCHAR(15),
    password_hash VARCHAR(255) NOT NULL,
    role          ENUM('admin','driver') NOT NULL DEFAULT 'driver',
    is_active     BOOLEAN NOT NULL DEFAULT TRUE,
    created_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS vehicles (
    id           INT AUTO_INCREMENT PRIMARY KEY,
    user_id      INT NOT NULL,
    plate_number VARCHAR(20) NOT NULL UNIQUE,
    vehicle_type ENUM('car','bike','bicycle','ev') NOT NULL,
    vehicle_name VARCHAR(100) NOT NULL,
    created_at   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS parking_slots (
    id           INT AUTO_INCREMENT PRIMARY KEY,
    slot_code    VARCHAR(10) NOT NULL UNIQUE,
    vehicle_type ENUM('car','bike','bicycle','ev') NOT NULL,
    slot_type    ENUM('normal','vip') NOT NULL DEFAULT 'normal',
    is_occupied  BOOLEAN NOT NULL DEFAULT FALSE,
    floor        TINYINT NOT NULL DEFAULT 1,
    created_at   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS pricing (
    id            INT AUTO_INCREMENT PRIMARY KEY,
    vehicle_type  ENUM('car','bike','bicycle','ev') NOT NULL UNIQUE,
    rate_per_hour DECIMAL(8,2) NOT NULL,
    vip_surcharge DECIMAL(8,2) NOT NULL DEFAULT 0.00,
    updated_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS coupons (
    id             INT AUTO_INCREMENT PRIMARY KEY,
    code           VARCHAR(20) NOT NULL UNIQUE,
    discount_flat  DECIMAL(8,2) NOT NULL DEFAULT 0.00,
    discount_pct   DECIMAL(5,2) NOT NULL DEFAULT 0.00,
    is_active      BOOLEAN NOT NULL DEFAULT TRUE,
    usage_limit    INT NOT NULL DEFAULT 1,
    times_used     INT NOT NULL DEFAULT 0,
    expires_at     DATETIME,
    created_at     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS bookings (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    vehicle_id      INT NOT NULL,
    slot_id         INT NOT NULL,
    user_id         INT NOT NULL,
    coupon_id       INT,
    status          ENUM('active','completed','cancelled') NOT NULL DEFAULT 'active',
    in_time         DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    out_time        DATETIME,
    duration_hours  DECIMAL(8,2),
    base_amount     DECIMAL(10,2),
    discount_amount DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    total_amount    DECIMAL(10,2),
    created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (vehicle_id) REFERENCES vehicles(id),
    FOREIGN KEY (slot_id)    REFERENCES parking_slots(id),
    FOREIGN KEY (user_id)    REFERENCES users(id),
    FOREIGN KEY (coupon_id)  REFERENCES coupons(id)
);

CREATE TABLE IF NOT EXISTS transactions (
    id             INT AUTO_INCREMENT PRIMARY KEY,
    booking_id     INT NOT NULL UNIQUE,
    amount         DECIMAL(10,2) NOT NULL,
    payment_method ENUM('cash','card','upi') NOT NULL DEFAULT 'cash',
    status         ENUM('pending','success','failed') NOT NULL DEFAULT 'success',
    paid_at        DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (booking_id) REFERENCES bookings(id)
);

-- Seed admin (password: Admin@123)
INSERT INTO users (full_name, email, phone, password_hash, role) VALUES
('System Admin', 'admin@parking.com', '9999999999',
 '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMbCdXblk8P0eqM5dViQ7Qlmkm', 'admin');

INSERT INTO pricing (vehicle_type, rate_per_hour, vip_surcharge) VALUES
('car', 50.00, 30.00), ('bike', 20.00, 15.00),
('bicycle', 10.00, 5.00), ('ev', 100.00, 50.00);

INSERT INTO coupons (code, discount_flat, discount_pct, usage_limit) VALUES
('AWXFGH128', 20.00, 0, 100), ('SDVHRA555', 40.00, 0, 100),
('VGFYHH363', 25.00, 0, 100), ('SAVE10PCT', 0.00, 10, 200),
('SAVE20PCT', 0.00, 20, 100), ('WELCOME50', 50.00, 0, 50);
