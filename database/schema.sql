-- MOPHIX STUDIO - DATABASE SCHEMA
-NT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),- Compatible with MySQL 8.0+ and PostgreSQL 12+
-- Created: 2024

-- =====================================================
-- DROP EXISTING TABLES (Careful in production!)
-- =====================================================

-- SET FOREIGN_KEY_CHECKS = 0; -- MySQL
-- CASCADE ALL; -- PostgreSQL

-- =====================================================
-- 1. USERS TABLE
-- =====================================================

CREATE TABLE users (
    user_id I
    role ENUM('admin', 'staff', 'client') DEFAULT 'client',
    profile_image_url VARCHAR(500),
    bio TEXT,
    address VARCHAR(255),
    city VARCHAR(100),
    country VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    last_login DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_email (email),
    INDEX idx_role (role),
    INDEX idx_is_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 2. CATEGORIES TABLE
-- =====================================================

CREATE TABLE categories (
    category_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    icon_url VARCHAR(500),
    display_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 3. SERVICES TABLE
-- =====================================================

CREATE TABLE services (
    service_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(150) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    price DECIMAL(10, 2) NOT NULL,
    duration_hours INT,
    includes_photos_count INT,
    includes_album BOOLEAN DEFAULT FALSE,
    includes_prints BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_is_active (is_active),
    INDEX idx_category (category)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 4. GALLERIES TABLE
-- =====================================================

CREATE TABLE galleries (
    gallery_id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    cover_image_path VARCHAR(500),
    event_type VARCHAR(100),
    photo_count INT DEFAULT 0,
    is_published BOOLEAN DEFAULT FALSE,
    created_by INT NOT NULL,
    published_date DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (created_by) REFERENCES users(user_id) ON DELETE RESTRICT,
    INDEX idx_is_published (is_published),
    INDEX idx_event_type (event_type),
    INDEX idx_created_by (created_by)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 5. PHOTOS TABLE
-- =====================================================

CREATE TABLE photos (
    photo_id INT PRIMARY KEY AUTO_INCREMENT,
    gallery_id INT NOT NULL,
    title VARCHAR(200),
    description TEXT,
    file_path VARCHAR(500) NOT NULL,
    thumbnail_path VARCHAR(500),
    file_size INT,
    image_width INT,
    image_height INT,
    upload_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    photographer_name VARCHAR(100),
    is_featured BOOLEAN DEFAULT FALSE,
    view_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (gallery_id) REFERENCES galleries(gallery_id) ON DELETE CASCADE,
    INDEX idx_gallery_id (gallery_id),
    INDEX idx_is_featured (is_featured),
    INDEX idx_upload_date (upload_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 6. GALLERY_SERVICE (Many-to-Many) TABLE
-- =====================================================

CREATE TABLE gallery_service (
    gallery_service_id INT PRIMARY KEY AUTO_INCREMENT,
    gallery_id INT NOT NULL,
    service_id INT NOT NULL,
    
    FOREIGN KEY (gallery_id) REFERENCES galleries(gallery_id) ON DELETE CASCADE,
    FOREIGN KEY (service_id) REFERENCES services(service_id) ON DELETE CASCADE,
    UNIQUE KEY unique_gallery_service (gallery_id, service_id),
    INDEX idx_service_id (service_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 7. PHOTO_CATEGORY (Many-to-Many) TABLE
-- =====================================================

CREATE TABLE photo_category (
    photo_category_id INT PRIMARY KEY AUTO_INCREMENT,
    photo_id INT NOT NULL,
    category_id INT NOT NULL,
    
    FOREIGN KEY (photo_id) REFERENCES photos(photo_id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(category_id) ON DELETE CASCADE,
    UNIQUE KEY unique_photo_category (photo_id, category_id),
    INDEX idx_category_id (category_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 8. BOOKINGS TABLE
-- =====================================================

CREATE TABLE bookings (
    booking_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    service_id INT NOT NULL,
    booking_date DATETIME NOT NULL,
    preferred_time_start TIME,
    preferred_time_end TIME,
    event_date DATE NOT NULL,
    event_location VARCHAR(255),
    number_of_participants INT,
    special_requests TEXT,
    status ENUM('pending', 'confirmed', 'completed', 'cancelled') DEFAULT 'pending',
    total_price DECIMAL(10, 2),
    payment_status ENUM('unpaid', 'paid', 'partial') DEFAULT 'unpaid',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (service_id) REFERENCES services(service_id) ON DELETE RESTRICT,
    INDEX idx_user_id (user_id),
    INDEX idx_service_id (service_id),
    INDEX idx_status (status),
    INDEX idx_event_date (event_date),
    INDEX idx_booking_date (booking_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 9. TESTIMONIALS TABLE
-- =====================================================

CREATE TABLE testimonials (
    testimonial_id INT PRIMARY KEY AUTO_INCREMENT,
    booking_id INT,
    user_id INT NOT NULL,
    rating INT CHECK (rating >= 1 AND rating <= 5),
    title VARCHAR(200),
    content TEXT NOT NULL,
    photo_url VARCHAR(500),
    is_approved BOOLEAN DEFAULT FALSE,
    approved_by INT,
    approved_date DATETIME,
    is_featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (booking_id) REFERENCES bookings(booking_id) ON DELETE SET NULL,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (approved_by) REFERENCES users(user_id) ON DELETE SET NULL,
    INDEX idx_user_id (user_id),
    INDEX idx_is_approved (is_approved),
    INDEX idx_is_featured (is_featured),
    INDEX idx_rating (rating)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 10. CONTACT_INQUIRIES TABLE
-- =====================================================

CREATE TABLE contact_inquiries (
    inquiry_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(150) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    subject VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    inquiry_type ENUM('general', 'booking', 'feedback', 'complaint') DEFAULT 'general',
    status ENUM('new', 'in_progress', 'resolved', 'spam') DEFAULT 'new',
    responded_by INT,
    response_message TEXT,
    response_date DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (responded_by) REFERENCES users(user_id) ON DELETE SET NULL,
    INDEX idx_email (email),
    INDEX idx_status (status),
    INDEX idx_inquiry_type (inquiry_type),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 11. BLOG_CATEGORIES TABLE
-- =====================================================

CREATE TABLE blog_categories (
    blog_category_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) UNIQUE NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    display_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 12. BLOG_POSTS TABLE
-- =====================================================

CREATE TABLE blog_posts (
    post_id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    content LONGTEXT NOT NULL,
    featured_image_url VARCHAR(500),
    category_id INT,
    author_id INT NOT NULL,
    status ENUM('draft', 'published', 'archived') DEFAULT 'draft',
    view_count INT DEFAULT 0,
    published_date DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (category_id) REFERENCES blog_categories(blog_category_id) ON DELETE SET NULL,
    FOREIGN KEY (author_id) REFERENCES users(user_id) ON DELETE RESTRICT,
    INDEX idx_status (status),
    INDEX idx_published_date (published_date),
    INDEX idx_category_id (category_id),
    INDEX idx_author_id (author_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 13. INVOICES TABLE
-- =====================================================

CREATE TABLE invoices (
    invoice_id INT PRIMARY KEY AUTO_INCREMENT,
    booking_id INT NOT NULL,
    invoice_number VARCHAR(50) UNIQUE NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    tax_amount DECIMAL(10, 2) DEFAULT 0,
    total_amount DECIMAL(10, 2) NOT NULL,
    payment_method VARCHAR(50),
    status ENUM('pending', 'paid', 'overdue', 'cancelled') DEFAULT 'pending',
    issued_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    due_date DATETIME,
    paid_date DATETIME,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (booking_id) REFERENCES bookings(booking_id) ON DELETE RESTRICT,
    INDEX idx_booking_id (booking_id),
    INDEX idx_status (status),
    INDEX idx_invoice_number (invoice_number)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 14. ACTIVITY_LOGS TABLE
-- =====================================================

CREATE TABLE activity_logs (
    log_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    action VARCHAR(50) NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id INT,
    description TEXT,
    ip_address VARCHAR(45),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE SET NULL,
    INDEX idx_user_id (user_id),
    INDEX idx_entity_type (entity_type),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 15. SETTINGS TABLE
-- =====================================================

CREATE TABLE settings (
    setting_id INT PRIMARY KEY AUTO_INCREMENT,
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value LONGTEXT,
    setting_type ENUM('string', 'integer', 'boolean', 'json') DEFAULT 'string',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_setting_key (setting_key)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- SEED DATA - Initial System Setup
-- =====================================================

-- Insert Categories
INSERT INTO categories (name, description, display_order) VALUES
('Wedding', 'Wedding photography', 1),
('Pregnancy', 'Maternity and pregnancy photoshoots', 2),
('Family', 'Family portrait sessions', 3),
('Graduation', 'Graduation photography', 4),
('Studio', 'Studio photography sessions', 5),
('Outdoor', 'Outdoor photography sessions', 6);

-- Insert Services
INSERT INTO services (name, description, category, price, duration_hours, includes_photos_count) VALUES
('Wedding Photography', 'Full day wedding photography coverage', 'Wedding', 500.00, 8, 300),
('Pregnancy Photoshoot', 'Professional maternity photography session', 'Pregnancy', 150.00, 2, 50),
('Family Portrait', 'Family group photography session', 'Family', 120.00, 1.5, 40),
('Graduation Photography', 'Graduation day photography and portraits', 'Graduation', 180.00, 3, 80),
('Studio Session', 'Indoor studio photography session', 'Studio', 100.00, 1, 30),
('Outdoor Session', 'Outdoor location photography session', 'Outdoor', 100.00, 1.5, 40);

-- Insert Blog Categories
INSERT INTO blog_categories (name, slug, description, display_order) VALUES
('Photography Tips', 'photography-tips', 'Tips and tricks for photography', 1),
('Studio News', 'studio-news', 'News and updates from Mophix Studio', 2),
('Client Stories', 'client-stories', 'Stories and experiences from our clients', 3);

-- Insert Settings
INSERT INTO settings (setting_key, setting_value, setting_type) VALUES
('site_name', 'Mophix Studio', 'string'),
('site_email', 'info@mophix.com', 'string'),
('site_phone', '+250788242290', 'string'),
('site_address', 'KG Kaserenge, Kigali, Rwanda', 'string'),
('booking_buffer_days', '3', 'integer'),
('admin_notification_email', 'admin@mophix.com', 'string');

-- =====================================================
-- END OF SCHEMA
-- =====================================================
