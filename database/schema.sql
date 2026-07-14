-- Create database
CREATE DATABASE IF NOT EXISTS bus_tracker_db;
USE bus_tracker_db;

-- Student table
CREATE TABLE student (
    student_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    roll_no VARCHAR(20) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    department VARCHAR(50),
    year INT,
    bus_pass_number VARCHAR(20),
    route_id BIGINT,
    bus_id BIGINT,
    photo_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Driver table
CREATE TABLE driver (
    driver_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(15) UNIQUE NOT NULL,
    license VARCHAR(20) UNIQUE NOT NULL,
    status ENUM('AVAILABLE', 'OFFLINE', 'ON_ROUTE') DEFAULT 'AVAILABLE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bus table
CREATE TABLE bus (
    bus_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    bus_no VARCHAR(20) UNIQUE NOT NULL,
    registration_number VARCHAR(20) UNIQUE NOT NULL,
    capacity INT NOT NULL DEFAULT 50,
    current_lat DECIMAL(10, 8),
    current_lng DECIMAL(11, 8),
    status ENUM('ACTIVE', 'MAINTENANCE', 'INACTIVE') DEFAULT 'ACTIVE',
    driver_id BIGINT,
    route_id BIGINT,
    speed DECIMAL(5, 2),
    current_stop VARCHAR(100),
    next_stop VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (driver_id) REFERENCES driver(driver_id)
);

-- Route table
CREATE TABLE route (
    route_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    route_name VARCHAR(100) NOT NULL,
    route_code VARCHAR(20) UNIQUE NOT NULL,
    start_point VARCHAR(100) NOT NULL,
    end_point VARCHAR(100) NOT NULL,
    distance DECIMAL(10, 2),
    expected_time INT, -- in minutes
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Stops table
CREATE TABLE stops (
    stop_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    route_id BIGINT NOT NULL,
    stop_name VARCHAR(100) NOT NULL,
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    sequence INT NOT NULL,
    is_major_stop BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (route_id) REFERENCES route(route_id),
    UNIQUE KEY unique_route_sequence (route_id, sequence)
);

-- Bus Location table
CREATE TABLE bus_location (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    bus_id BIGINT NOT NULL,
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    speed DECIMAL(5, 2),
    heading DECIMAL(5, 2),
    accuracy DECIMAL(5, 2),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (bus_id) REFERENCES bus(bus_id)
);

-- Bus Occupancy table
CREATE TABLE bus_occupancy (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    bus_id BIGINT NOT NULL,
    occupied INT DEFAULT 0,
    available INT DEFAULT 50,
    occupancy_percentage DECIMAL(5, 2),
    crowd_level ENUM('LOW', 'MEDIUM', 'HIGH'),
    updated_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (bus_id) REFERENCES bus(bus_id)
);

-- Student Bus Assignment table
CREATE TABLE student_bus_assignment (
    assignment_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    student_id BIGINT NOT NULL,
    bus_id BIGINT NOT NULL,
    route_id BIGINT NOT NULL,
    assigned_date DATE NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES student(student_id),
    FOREIGN KEY (bus_id) REFERENCES bus(bus_id),
    FOREIGN KEY (route_id) REFERENCES route(route_id),
    UNIQUE KEY unique_active_assignment (student_id, is_active)
);

-- Notification table
CREATE TABLE notification (
    notification_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    student_id BIGINT,
    bus_id BIGINT,
    title VARCHAR(100) NOT NULL,
    message TEXT NOT NULL,
    type ENUM('ARRIVAL', 'DELAY', 'FULL', 'ALTERNATIVE', 'GENERAL'),
    status ENUM('PENDING', 'SENT', 'READ') DEFAULT 'PENDING',
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    read_at TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES student(student_id),
    FOREIGN KEY (bus_id) REFERENCES bus(bus_id)
);

-- Bus Delay table
CREATE TABLE bus_delay (
    delay_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    bus_id BIGINT NOT NULL,
    reason VARCHAR(200) NOT NULL,
    delay_minutes INT,
    status ENUM('PENDING', 'RESOLVED', 'CANCELLED') DEFAULT 'PENDING',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP,
    FOREIGN KEY (bus_id) REFERENCES bus(bus_id)
);

-- Attendance table (QR Scan)
CREATE TABLE attendance (
    attendance_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    student_id BIGINT NOT NULL,
    bus_id BIGINT NOT NULL,
    scan_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    scan_type ENUM('BOARDING', 'ALIGHTING'),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES student(student_id),
    FOREIGN KEY (bus_id) REFERENCES bus(bus_id)
);

-- Admin table
CREATE TABLE admin (
    admin_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    role ENUM('SUPER_ADMIN', 'BUS_INCHARGE') DEFAULT 'BUS_INCHARGE',
    full_name VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample admin
INSERT INTO admin (username, password, email, role, full_name) 
VALUES ('admin', '$2a$10$YourHashedPassword', 'admin@college.edu', 'SUPER_ADMIN', 'System Admin');

-- Create indexes for performance
CREATE INDEX idx_bus_location_bus_id ON bus_location(bus_id);
CREATE INDEX idx_bus_location_timestamp ON bus_location(timestamp);
CREATE INDEX idx_notification_student_id ON notification(student_id);
CREATE INDEX idx_occupancy_bus_id ON bus_occupancy(bus_id);
CREATE INDEX idx_student_bus_assignment_student ON student_bus_assignment(student_id);

-- Complaint table
CREATE TABLE complaint (
    complaint_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    student_id BIGINT NOT NULL,
    title VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    image_url VARCHAR(255),
    status ENUM('PENDING', 'IN_PROGRESS', 'RESOLVED') DEFAULT 'PENDING',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP,
    resolved_by BIGINT,
    FOREIGN KEY (student_id) REFERENCES student(student_id),
    FOREIGN KEY (resolved_by) REFERENCES admin(admin_id)
);
