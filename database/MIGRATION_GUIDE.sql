-- =====================================================
-- MOPHIX STUDIO - DATA MIGRATION GUIDE
-- Schema v1 (old) → Schema v2 (new - 12 tables)
-- =====================================================

-- This migration script provides SQL templates for migrating
-- existing data from the old schema to the new 12-table schema.
-- 
-- IMPORTANT: Always backup your database before running migration!
-- Test on a staging environment first.

-- =====================================================
-- STEP 1: CREATE NEW TABLES
-- =====================================================
-- Run the entire schema_new.sql file first
-- This creates all 12 tables with proper constraints

-- =====================================================
-- STEP 2: MIGRATE USERS (users table unchanged)
-- =====================================================
-- Users table structure remained mostly the same, just clean up:

INSERT INTO users_new 
SELECT 
    user_id,
    email,
    password_hash,
    first_name,
    last_name,
    role,
    profile_image_url,
    bio,
    is_active,
    last_login,
    created_at,
    updated_at
FROM users_old;

-- =====================================================
-- STEP 3: CREATE CLIENT PROFILES FROM USERS
-- =====================================================
-- For each user with role='client', create a client profile
-- Extract client data from old users table

INSERT INTO clients (user_id, phone, address, city, country, preferred_contact_method)
SELECT 
    u.user_id,
    u.phone,
    u.address,
    u.city,
    u.country,
    'email' AS preferred_contact_method
FROM users_old u
WHERE u.role = 'client'
  AND u.user_id NOT IN (SELECT user_id FROM clients);

-- =====================================================
-- STEP 4: MIGRATE CATEGORIES
-- =====================================================
-- Categories table remained similar, just ensure is_active field

INSERT INTO categories (name, description, icon_url, display_order, is_active)
SELECT 
    name,
    description,
    icon_url,
    display_order,
    TRUE AS is_active
FROM categories_old;

-- =====================================================
-- STEP 5: MIGRATE SERVICES WITH NEW CATEGORY_ID
-- =====================================================
-- Old: services.category (VARCHAR) → New: services.category_id (INT FK)
-- Need to map category names to IDs

INSERT INTO services 
(name, description, category_id, price, duration_hours, includes_photos_count, includes_album, includes_prints, is_active)
SELECT 
    s.name,
    s.description,
    c.category_id,  -- FK instead of string
    s.price,
    s.duration_hours,
    s.includes_photos_count,
    s.includes_album,
    s.includes_prints,
    s.is_active
FROM services_old s
LEFT JOIN categories c ON LOWER(s.category) = LOWER(c.name);

-- =====================================================
-- STEP 6: MIGRATE BOOKINGS (WITH KEY CHANGE)
-- =====================================================
-- OLD: bookings.user_id → NEW: bookings.client_id
-- Must get client_id from users→clients relationship

INSERT INTO bookings 
(client_id, service_id, booking_date, event_date, event_time, event_location, 
 number_of_participants, special_requests, status, total_price, payment_status, notes)
SELECT 
    c.client_id,              -- NEW: client_id instead of user_id
    b.service_id,
    b.booking_date,
    b.event_date,
    b.preferred_time_start AS event_time,
    b.event_location,
    b.number_of_participants,
    b.special_requests,
    b.status,
    b.total_price,
    b.payment_status,
    b.notes
FROM bookings_old b
INNER JOIN clients c ON b.user_id = c.user_id
WHERE b.user_id IN (SELECT user_id FROM clients);

-- =====================================================
-- STEP 7: MIGRATE GALLERIES (WITH NEW LINKS)
-- =====================================================
-- NEW: galleries can link to booking_id and category_id
-- mapping event_type → category

INSERT INTO galleries 
(booking_id, title, description, cover_image_url, category_id, photo_count, 
 is_published, created_by, published_date)
SELECT 
    NULL AS booking_id,  -- May be NULL if no direct booking link
    g.title,
    g.description,
    g.cover_image_path,
    c.category_id,       -- Map event_type to category
    g.photo_count,
    g.is_published,
    g.created_by,
    g.published_date
FROM galleries_old g
LEFT JOIN categories c ON LOWER(g.event_type) = LOWER(c.name);

-- Optional: If you want to link galleries to bookings after migration:
-- UPDATE galleries g
-- SET booking_id = (
--     SELECT b.booking_id FROM bookings b 
--     WHERE b.created_at >= DATE_SUB(g.created_at, INTERVAL 7 DAY)
--     LIMIT 1
-- )
-- WHERE booking_id IS NULL;

-- =====================================================
-- STEP 8: MIGRATE PHOTOS
-- =====================================================
-- Column name changes: file_path → image_url, thumbnail_path → thumbnail_url
-- Remove photographer_name field (not in new schema)

INSERT INTO photos 
(gallery_id, title, description, image_url, thumbnail_url, file_size, 
 image_width, image_height, is_featured, display_order, view_count)
SELECT 
    p.gallery_id,
    p.title,
    p.description,
    p.file_path AS image_url,           -- Renamed column
    p.thumbnail_path AS thumbnail_url,  -- Renamed column
    p.file_size,
    p.image_width,
    p.image_height,
    p.is_featured,
    0 AS display_order,  -- New field (set to 0 for old data)
    p.view_count
FROM photos_old p;

-- =====================================================
-- STEP 9: MIGRATE TESTIMONIALS (WITH KEY CHANGE)
-- =====================================================
-- OLD: testimonials.user_id → NEW: testimonials.client_id
-- NEW: Add service_id for relationship to service

INSERT INTO testimonials 
(client_id, service_id, rating, title, content, client_photo_url, 
 is_approved, approved_by, approved_date, is_featured)
SELECT 
    c.client_id,              -- NEW: client_id instead of user_id
    t.service_id,             -- NEW: link to service
    t.rating,
    t.title,
    t.content,
    t.photo_url AS client_photo_url,
    t.is_approved,
    t.approved_by,
    t.approved_date,
    t.is_featured
FROM testimonials_old t
INNER JOIN clients c ON t.user_id = c.user_id
WHERE t.user_id IN (SELECT user_id FROM clients);

-- =====================================================
-- STEP 10: MIGRATE BLOG POSTS (REMOVE CATEGORY)
-- =====================================================
-- OLD: blog_posts.category_id → categories
-- NEW: blog_posts use tags instead (handled separately)

INSERT INTO blog_posts 
(title, slug, content, featured_image_url, author_id, status, view_count, published_date)
SELECT 
    b.title,
    b.slug,
    b.content,
    b.featured_image_url,
    b.author_id,
    b.status,
    b.view_count,
    b.published_date
FROM blog_posts_old b;

-- =====================================================
-- STEP 11: CREATE TAGS (NEW)
-- =====================================================
-- Create default tags from old blog_categories if needed
-- Otherwise populate with default tags from seed data

INSERT INTO tags (name, slug, description)
VALUES 
    ('Tips', 'tips', 'Photography tips and tricks'),
    ('Behind the Scenes', 'behind-the-scenes', 'Behind the scenes stories'),
    ('Studio News', 'studio-news', 'News and updates from Mophix Studio'),
    ('Client Stories', 'client-stories', 'Stories from our happy clients');

-- =====================================================
-- STEP 12: CREATE BLOG_POST_TAGS (NEW)
-- =====================================================
-- Associate blog posts with tags
-- If you have old blog_categories relationship, map them here

-- Example: Map all posts to a default tag
INSERT INTO blog_post_tags (post_id, tag_id)
SELECT 
    bp.post_id,
    t.tag_id
FROM blog_posts bp
CROSS JOIN tags t
WHERE t.slug = 'studio-news'
  AND bp.post_id NOT IN (
    SELECT post_id FROM blog_post_tags
  );

-- =====================================================
-- STEP 13: MIGRATE CONTACT MESSAGES (RENAMED TABLE)
-- =====================================================
-- OLD: contact_inquiries → NEW: contact_messages
-- Status values changed: 'new', 'in_progress', 'resolved', 'spam' 
--                     → 'new', 'read', 'replied', 'archived'

INSERT INTO contact_messages 
(name, email, phone, subject, message, status, replied_by, reply_message, reply_date)
SELECT 
    ci.name,
    ci.email,
    ci.phone,
    ci.subject,
    ci.message,
    CASE ci.status
        WHEN 'new' THEN 'new'
        WHEN 'in_progress' THEN 'read'
        WHEN 'resolved' THEN 'replied'
        WHEN 'spam' THEN 'archived'
        ELSE 'new'
    END AS status,
    ci.responded_by,
    ci.response_message,
    ci.response_date
FROM contact_inquiries_old ci;

-- =====================================================
-- STEP 14: VERIFY MIGRATION INTEGRITY
-- =====================================================

-- Check row counts
SELECT 'users' as table_name, COUNT(*) as count FROM users
UNION ALL
SELECT 'clients', COUNT(*) FROM clients
UNION ALL
SELECT 'categories', COUNT(*) FROM categories
UNION ALL
SELECT 'services', COUNT(*) FROM services
UNION ALL
SELECT 'bookings', COUNT(*) FROM bookings
UNION ALL
SELECT 'galleries', COUNT(*) FROM galleries
UNION ALL
SELECT 'photos', COUNT(*) FROM photos
UNION ALL
SELECT 'testimonials', COUNT(*) FROM testimonials
UNION ALL
SELECT 'blog_posts', COUNT(*) FROM blog_posts
UNION ALL
SELECT 'tags', COUNT(*) FROM tags
UNION ALL
SELECT 'blog_post_tags', COUNT(*) FROM blog_post_tags
UNION ALL
SELECT 'contact_messages', COUNT(*) FROM contact_messages;

-- Check for orphaned records
-- Bookings with invalid client_id
SELECT COUNT(*) as orphaned_bookings
FROM bookings b
WHERE b.client_id NOT IN (SELECT client_id FROM clients);

-- Galleries with invalid booking_id (should be few or zero)
SELECT COUNT(*) as galleries_no_booking
FROM galleries
WHERE booking_id IS NULL;

-- Testimonials with invalid client_id
SELECT COUNT(*) as orphaned_testimonials
FROM testimonials t
WHERE t.client_id NOT IN (SELECT client_id FROM clients);

-- Photos with invalid gallery_id
SELECT COUNT(*) as orphaned_photos
FROM photos p
WHERE p.gallery_id NOT IN (SELECT gallery_id FROM galleries);

-- =====================================================
-- STEP 15: CLEANUP (AFTER VERIFICATION)
-- =====================================================
-- Only run after confirming all data migrated correctly!
-- Rename old tables for archive

-- ALTER TABLE users RENAME TO users_old_archived;
-- ALTER TABLE categories RENAME TO categories_old_archived;
-- ALTER TABLE services RENAME TO services_old_archived;
-- ALTER TABLE bookings RENAME TO bookings_old_archived;
-- ALTER TABLE galleries RENAME TO galleries_old_archived;
-- ALTER TABLE photos RENAME TO photos_old_archived;
-- ALTER TABLE testimonials RENAME TO testimonials_old_archived;
-- ALTER TABLE blog_posts RENAME TO blog_posts_old_archived;
-- ALTER TABLE contact_inquiries RENAME TO contact_inquiries_old_archived;

-- =====================================================
-- ROLLBACK PROCEDURE (if needed)
-- =====================================================
-- Restore tables from backup or run this:

-- DELETE FROM contact_messages;
-- DELETE FROM blog_post_tags;
-- DELETE FROM blog_posts;
-- DELETE FROM tags;
-- DELETE FROM testimonials;
-- DELETE FROM photos;
-- DELETE FROM galleries;
-- DELETE FROM bookings;
-- DELETE FROM services;
-- DELETE FROM categories;
-- DELETE FROM clients;
-- Restore users if needed

-- Then rename old tables back:
-- ALTER TABLE users_old_archived RENAME TO users;
-- ALTER TABLE categories_old_archived RENAME TO categories;
-- etc.

-- =====================================================
-- NOTES
-- =====================================================
-- 1. Always run on staging first
-- 2. Backup before and after migration
-- 3. Verify data integrity at each step
-- 4. Check for foreign key constraint violations
-- 5. Test application functionality after migration
-- 6. Monitor for any orphaned records
-- 7. Performance: Migration of large tables may take time
-- 8. Consider disabling foreign key checks during bulk inserts:
--    SET FOREIGN_KEY_CHECKS=0;  (before migration)
--    SET FOREIGN_KEY_CHECKS=1;  (after migration)
-- 9. Update application code to use new schema simultaneously

-- =====================================================
-- END OF MIGRATION GUIDE
-- =====================================================
