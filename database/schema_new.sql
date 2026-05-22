-- =====================================================
-- MOPHIX STUDIO - DATABASE SCHEMA (12 TABLES)
-- =====================================================
-- Compatible with MySQL 8.0+ and PostgreSQL 12+
-- Last Updated: May 2026
-- 
-- Database Structure:
-- Core Tables: users, clients, categories, services
-- Booking & Gallery Tables: bookings, galleries, photos
-- Content & Engagement: testimonials, blog_posts, tags, blog_post_tags
-- Communication: contact_messages
-- =====================================================

-- SET FOREIGN_KEY_CHECKS = 0; -- MySQL
-- CASCADE ALL; -- PostgreSQL

-- =====================================================
-- 1. USERS TABLE
-- Stores all system accounts — admin, staff, and clients
-- =====================================================

CREATE TABLE users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    role ENUM('admin', 'staff', 'client') DEFAULT 'client',
    profile_image_url VARCHAR(500),
    bio TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    last_login DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_email (email),
    INDEX idx_role (role),
    INDEX idx_is_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 2. CLIENTS TABLE
-- Extended profile for users with client role
-- Stores phone, address, date of birth
-- =====================================================

CREATE TABLE clients (
    client_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL UNIQUE,
    phone VARCHAR(20),
    address VARCHAR(255),
    city VARCHAR(100),
    country VARCHAR(100),
    date_of_birth DATE,
    preferred_contact_method ENUM('email', 'phone', 'sms') DEFAULT 'email',
    subscription_status ENUM('active', 'inactive', 'suspended') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_phone (phone)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 3. CATEGORIES TABLE
-- Labels like Wedding, Graduation, Family
-- Organize services and galleries. Can have subcategories
-- =====================================================

CREATE TABLE categories (
    category_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    icon_url VARCHAR(500),
    parent_category_id INT,
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (parent_category_id) REFERENCES categories(category_id) ON DELETE SET NULL,
    INDEX idx_name (name),
    INDEX idx_is_active (is_active),
    INDEX idx_parent_category_id (parent_category_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 4. SERVICES TABLE
-- All photography packages the studio offers
-- Title, price, duration, cover image
-- =====================================================

CREATE TABLE services (
    service_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(150) NOT NULL,
    description TEXT,
    category_id INT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    duration_hours INT,
    cover_image_url VARCHAR(500),
    includes_photos_count INT,
    includes_album BOOLEAN DEFAULT FALSE,
    includes_prints BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (category_id) REFERENCES categories(category_id) ON DELETE RESTRICT,
    INDEX idx_category_id (category_id),
    INDEX idx_is_active (is_active),
    INDEX idx_price (price)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 5. BOOKINGS TABLE
-- Session requests from clients
-- Date, time, chosen service, payment, status tracking
-- =====================================================

CREATE TABLE bookings (
    booking_id INT PRIMARY KEY AUTO_INCREMENT,
    client_id INT NOT NULL,
    service_id INT NOT NULL,
    booking_date DATETIME NOT NULL,
    event_date DATE NOT NULL,
    event_time TIME,
    event_location VARCHAR(255),
    number_of_participants INT,
    special_requests TEXT,
    status ENUM('pending', 'confirmed', 'completed', 'cancelled') DEFAULT 'pending',
    total_price DECIMAL(10, 2),
    payment_status ENUM('unpaid', 'paid', 'partial') DEFAULT 'unpaid',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (client_id) REFERENCES clients(client_id) ON DELETE CASCADE,
    FOREIGN KEY (service_id) REFERENCES services(service_id) ON DELETE RESTRICT,
    INDEX idx_client_id (client_id),
    INDEX idx_service_id (service_id),
    INDEX idx_status (status),
    INDEX idx_event_date (event_date),
    INDEX idx_booking_date (booking_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 6. GALLERIES TABLE
-- Photo albums created after a session
-- Linked to a booking and a category
-- =====================================================

CREATE TABLE galleries (
    gallery_id INT PRIMARY KEY AUTO_INCREMENT,
    booking_id INT,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    cover_image_url VARCHAR(500),
    category_id INT,
    photo_count INT DEFAULT 0,
    is_published BOOLEAN DEFAULT FALSE,
    created_by INT NOT NULL,
    published_date DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (booking_id) REFERENCES bookings(booking_id) ON DELETE SET NULL,
    FOREIGN KEY (category_id) REFERENCES categories(category_id) ON DELETE SET NULL,
    FOREIGN KEY (created_by) REFERENCES users(user_id) ON DELETE RESTRICT,
    INDEX idx_booking_id (booking_id),
    INDEX idx_category_id (category_id),
    INDEX idx_is_published (is_published),
    INDEX idx_created_by (created_by)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 7. PHOTOS TABLE
-- Individual photo records inside a gallery
-- Image URL, thumbnail, featured flag, ordering
-- =====================================================

CREATE TABLE photos (
    photo_id INT PRIMARY KEY AUTO_INCREMENT,
    gallery_id INT NOT NULL,
    title VARCHAR(200),
    description TEXT,
    image_url VARCHAR(500) NOT NULL,
    thumbnail_url VARCHAR(500),
    file_size INT,
    image_width INT,
    image_height INT,
    is_featured BOOLEAN DEFAULT FALSE,
    display_order INT DEFAULT 0,
    view_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (gallery_id) REFERENCES galleries(gallery_id) ON DELETE CASCADE,
    INDEX idx_gallery_id (gallery_id),
    INDEX idx_is_featured (is_featured),
    INDEX idx_display_order (display_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 8. TESTIMONIALS TABLE
-- Client reviews and star ratings
-- Held in pending until admin approves
-- =====================================================

CREATE TABLE testimonials (
    testimonial_id INT PRIMARY KEY AUTO_INCREMENT,
    client_id INT NOT NULL,
    service_id INT,
    rating INT CHECK (rating >= 1 AND rating <= 5),
    title VARCHAR(200),
    content TEXT NOT NULL,
    client_photo_url VARCHAR(500),
    is_approved BOOLEAN DEFAULT FALSE,
    approved_by INT,
    approved_date DATETIME,
    is_featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (client_id) REFERENCES clients(client_id) ON DELETE CASCADE,
    FOREIGN KEY (service_id) REFERENCES services(service_id) ON DELETE SET NULL,
    FOREIGN KEY (approved_by) REFERENCES users(user_id) ON DELETE SET NULL,
    INDEX idx_client_id (client_id),
    INDEX idx_is_approved (is_approved),
    INDEX idx_is_featured (is_featured),
    INDEX idx_rating (rating)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 9. BLOG_POSTS TABLE
-- Articles and photography stories
-- Title, body, author, status, publish date
-- =====================================================

CREATE TABLE blog_posts (
    post_id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    content LONGTEXT NOT NULL,
    featured_image_url VARCHAR(500),
    author_id INT NOT NULL,
    status ENUM('draft', 'published', 'archived') DEFAULT 'draft',
    view_count INT DEFAULT 0,
    published_date DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (author_id) REFERENCES users(user_id) ON DELETE RESTRICT,
    INDEX idx_status (status),
    INDEX idx_published_date (published_date),
    INDEX idx_author_id (author_id),
    INDEX idx_slug (slug)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 10. TAGS TABLE
-- Short labels like "Tips" or "Behind the Scenes"
-- Attached to blog posts
-- =====================================================

CREATE TABLE tags (
    tag_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) UNIQUE NOT NULL,
    slug VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_name (name),
    INDEX idx_slug (slug)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 11. BLOG_POST_TAGS TABLE (Many-to-Many)
-- Junction table linking blog posts to tags
-- Solves the many-to-many relationship
-- =====================================================

CREATE TABLE blog_post_tags (
    blog_post_tag_id INT PRIMARY KEY AUTO_INCREMENT,
    post_id INT NOT NULL,
    tag_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (post_id) REFERENCES blog_posts(post_id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES tags(tag_id) ON DELETE CASCADE,
    UNIQUE KEY unique_post_tag (post_id, tag_id),
    INDEX idx_tag_id (tag_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 12. CONTACT_MESSAGES TABLE
-- All submissions from the public contact form
-- Name, email, message, reply status
-- =====================================================

CREATE TABLE contact_messages (
    message_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(150) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    subject VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    status ENUM('new', 'read', 'replied', 'archived') DEFAULT 'new',
    replied_by INT,
    reply_message TEXT,
    reply_date DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (replied_by) REFERENCES users(user_id) ON DELETE SET NULL,
    INDEX idx_email (email),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- SEED DATA - Initial System Setup
-- =====================================================

-- Insert Categories
INSERT INTO categories (name, description, display_order, is_active) VALUES
('Wedding', 'Wedding photography services', 1, TRUE),
('Graduation', 'Graduation photography and portraits', 2, TRUE),
('Family', 'Family portrait sessions', 3, TRUE),
('Maternity', 'Pregnancy and maternity photoshoots', 4, TRUE);

-- Insert Services
INSERT INTO services (name, description, category_id, price, duration_hours, includes_photos_count, is_active) VALUES
('Wedding Photography', 'Full day wedding photography coverage', 1, 500.00, 8, 300, TRUE),
('Graduation Photography', 'Graduation day photography and portraits', 2, 180.00, 3, 80, TRUE),
('Family Portrait', 'Family group photography session', 3, 120.00, 1.5, 40, TRUE),
('Maternity Shoot', 'Professional maternity photography session', 4, 150.00, 2, 50, TRUE);

-- Insert Tags
INSERT INTO tags (name, slug, description) VALUES
('Tips', 'tips', 'Photography tips and tricks'),
('Behind the Scenes', 'behind-the-scenes', 'Behind the scenes stories'),
('Studio News', 'studio-news', 'News and updates from Mophix Studio'),
('Client Stories', 'client-stories', 'Stories from our happy clients');

-- =====================================================
-- END OF SCHEMA (12 TABLES)
-- =====================================================
