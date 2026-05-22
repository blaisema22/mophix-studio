# Mophix Studio - Database Schema Documentation
## 12-Table Architecture

---

## Overview
The Mophix Studio database consists of 12 core tables organized into 4 functional groups:

1. **Core Tables** - System foundation
2. **Booking & Gallery Tables** - Service delivery
3. **Content & Engagement Tables** - Marketing and testimonials
4. **Communication Table** - Contact management

---

## Table Directory

### CORE TABLES (4 tables)

#### 1. **users**
Primary system accounts table for all user roles (admin, staff, client).

**Key Fields:**
- `user_id` (INT, PK, AUTO_INCREMENT)
- `email` (VARCHAR(255), UNIQUE, NOT NULL)
- `password_hash` (VARCHAR(255), NOT NULL)
- `first_name`, `last_name` (VARCHAR(100), NOT NULL)
- `role` (ENUM: admin, staff, client)
- `profile_image_url` (VARCHAR(500))
- `bio` (TEXT)
- `is_active` (BOOLEAN, DEFAULT: TRUE)
- `last_login` (DATETIME)
- `created_at`, `updated_at` (TIMESTAMP)

**Indexes:** email, role, is_active

---

#### 2. **clients**
Extended client-specific profile information.

**Key Fields:**
- `client_id` (INT, PK, AUTO_INCREMENT)
- `user_id` (INT, NOT NULL, UNIQUE, FK → users)
- `phone` (VARCHAR(20))
- `address`, `city`, `country` (VARCHAR)
- `date_of_birth` (DATE)
- `preferred_contact_method` (ENUM: email, phone, sms)
- `subscription_status` (ENUM: active, inactive, suspended)
- `created_at`, `updated_at` (TIMESTAMP)

**Relationship:** One-to-One with users (one user can have one client profile)

**Indexes:** user_id, phone

---

#### 3. **categories**
Photography service categories and subcategories.

**Key Fields:**
- `category_id` (INT, PK, AUTO_INCREMENT)
- `name` (VARCHAR(100), UNIQUE, NOT NULL)
- `description` (TEXT)
- `icon_url` (VARCHAR(500))
- `parent_category_id` (INT, FK → categories, self-referential)
- `display_order` (INT, DEFAULT: 0)
- `is_active` (BOOLEAN, DEFAULT: TRUE)
- `created_at`, `updated_at` (TIMESTAMP)

**Features:** 
- Supports hierarchical subcategories
- Self-referential for parent-child relationships

**Example Categories:**
- Wedding
- Graduation
- Family
- Maternity

**Indexes:** name, is_active, parent_category_id

---

#### 4. **services**
Photography packages offered by the studio.

**Key Fields:**
- `service_id` (INT, PK, AUTO_INCREMENT)
- `name` (VARCHAR(150), NOT NULL)
- `description` (TEXT)
- `category_id` (INT, NOT NULL, FK → categories)
- `price` (DECIMAL(10,2), NOT NULL)
- `duration_hours` (INT)
- `cover_image_url` (VARCHAR(500))
- `includes_photos_count` (INT)
- `includes_album` (BOOLEAN, DEFAULT: FALSE)
- `includes_prints` (BOOLEAN, DEFAULT: FALSE)
- `is_active` (BOOLEAN, DEFAULT: TRUE)
- `created_at`, `updated_at` (TIMESTAMP)

**Relationship:** Many services per category

**Indexes:** category_id, is_active, price

---

### BOOKING & GALLERY TABLES (3 tables)

#### 5. **bookings**
Session/event booking requests from clients.

**Key Fields:**
- `booking_id` (INT, PK, AUTO_INCREMENT)
- `client_id` (INT, NOT NULL, FK → clients)
- `service_id` (INT, NOT NULL, FK → services)
- `booking_date` (DATETIME, NOT NULL)
- `event_date` (DATE, NOT NULL)
- `event_time` (TIME)
- `event_location` (VARCHAR(255))
- `number_of_participants` (INT)
- `special_requests` (TEXT)
- `status` (ENUM: pending, confirmed, completed, cancelled, DEFAULT: pending)
- `total_price` (DECIMAL(10,2))
- `payment_status` (ENUM: unpaid, paid, partial, DEFAULT: unpaid)
- `notes` (TEXT)
- `created_at`, `updated_at` (TIMESTAMP)

**Workflow:**
1. Client makes booking → status: pending
2. Admin confirms → status: confirmed
3. Event happens → status: completed
4. Client can cancel → status: cancelled

**Indexes:** client_id, service_id, status, event_date, booking_date

---

#### 6. **galleries**
Photo albums created after sessions, linked to bookings.

**Key Fields:**
- `gallery_id` (INT, PK, AUTO_INCREMENT)
- `booking_id` (INT, FK → bookings, nullable)
- `title` (VARCHAR(200), NOT NULL)
- `description` (TEXT)
- `cover_image_url` (VARCHAR(500))
- `category_id` (INT, FK → categories, nullable)
- `photo_count` (INT, DEFAULT: 0)
- `is_published` (BOOLEAN, DEFAULT: FALSE)
- `created_by` (INT, NOT NULL, FK → users)
- `published_date` (DATETIME)
- `created_at`, `updated_at` (TIMESTAMP)

**Relationships:**
- Optional link to booking (gallery may exist without booking)
- Optional link to category (custom categorization)
- Mandatory creator (staff/admin)

**Indexes:** booking_id, category_id, is_published, created_by

---

#### 7. **photos**
Individual photo records within galleries.

**Key Fields:**
- `photo_id` (INT, PK, AUTO_INCREMENT)
- `gallery_id` (INT, NOT NULL, FK → galleries, CASCADE)
- `title` (VARCHAR(200))
- `description` (TEXT)
- `image_url` (VARCHAR(500), NOT NULL)
- `thumbnail_url` (VARCHAR(500))
- `file_size` (INT)
- `image_width`, `image_height` (INT)
- `is_featured` (BOOLEAN, DEFAULT: FALSE)
- `display_order` (INT, DEFAULT: 0)
- `view_count` (INT, DEFAULT: 0)
- `created_at` (TIMESTAMP)

**Features:**
- Cascading delete with gallery
- Featured photo selection
- Customizable display order
- View tracking

**Indexes:** gallery_id, is_featured, display_order

---

### CONTENT & ENGAGEMENT TABLES (4 tables)

#### 8. **testimonials**
Client reviews and ratings (pending admin approval).

**Key Fields:**
- `testimonial_id` (INT, PK, AUTO_INCREMENT)
- `client_id` (INT, NOT NULL, FK → clients)
- `service_id` (INT, FK → services, nullable)
- `rating` (INT, CHECK: 1-5)
- `title` (VARCHAR(200))
- `content` (TEXT, NOT NULL)
- `client_photo_url` (VARCHAR(500))
- `is_approved` (BOOLEAN, DEFAULT: FALSE)
- `approved_by` (INT, FK → users, nullable)
- `approved_date` (DATETIME)
- `is_featured` (BOOLEAN, DEFAULT: FALSE)
- `created_at`, `updated_at` (TIMESTAMP)

**Workflow:**
1. Client submits testimonial → is_approved: FALSE
2. Admin reviews and approves → is_approved: TRUE, approved_by set
3. Can be featured on homepage → is_featured: TRUE

**Indexes:** client_id, is_approved, is_featured, rating

---

#### 9. **blog_posts**
Articles and photography stories/guides.

**Key Fields:**
- `post_id` (INT, PK, AUTO_INCREMENT)
- `title` (VARCHAR(255), NOT NULL)
- `slug` (VARCHAR(255), UNIQUE, NOT NULL)
- `content` (LONGTEXT, NOT NULL)
- `featured_image_url` (VARCHAR(500))
- `author_id` (INT, NOT NULL, FK → users)
- `status` (ENUM: draft, published, archived, DEFAULT: draft)
- `view_count` (INT, DEFAULT: 0)
- `published_date` (DATETIME)
- `created_at`, `updated_at` (TIMESTAMP)

**Features:**
- SEO-friendly slugs
- Multiple status management
- View tracking
- Author attribution

**Indexes:** status, published_date, author_id, slug

---

#### 10. **tags**
Short labels for blog posts (Tips, Behind-the-Scenes, etc.).

**Key Fields:**
- `tag_id` (INT, PK, AUTO_INCREMENT)
- `name` (VARCHAR(50), UNIQUE, NOT NULL)
- `slug` (VARCHAR(50), UNIQUE, NOT NULL)
- `description` (TEXT)
- `created_at` (TIMESTAMP)

**Example Tags:**
- Tips
- Behind the Scenes
- Studio News
- Client Stories

**Indexes:** name, slug

---

#### 11. **blog_post_tags** (Many-to-Many Junction)
Linking blog posts to multiple tags.

**Key Fields:**
- `blog_post_tag_id` (INT, PK, AUTO_INCREMENT)
- `post_id` (INT, NOT NULL, FK → blog_posts, CASCADE)
- `tag_id` (INT, NOT NULL, FK → tags, CASCADE)
- `created_at` (TIMESTAMP)

**Constraints:** UNIQUE(post_id, tag_id)

**Purpose:** Solves many-to-many relationship (blog posts ↔ tags)

---

### COMMUNICATION TABLE (1 table)

#### 12. **contact_messages**
Public contact form submissions.

**Key Fields:**
- `message_id` (INT, PK, AUTO_INCREMENT)
- `name` (VARCHAR(150), NOT NULL)
- `email` (VARCHAR(255), NOT NULL)
- `phone` (VARCHAR(20))
- `subject` (VARCHAR(255), NOT NULL)
- `message` (TEXT, NOT NULL)
- `status` (ENUM: new, read, replied, archived, DEFAULT: new)
- `replied_by` (INT, FK → users, nullable)
- `reply_message` (TEXT)
- `reply_date` (DATETIME)
- `created_at`, `updated_at` (TIMESTAMP)

**Workflow:**
1. Public visitor submits form → status: new
2. Admin reads → status: read
3. Admin replies → status: replied, reply fields populated
4. Can be archived → status: archived

**Indexes:** email, status, created_at

---

## Relationship Diagram

```
                         ┌─────────────────┐
                         │     users       │
                         │   (all roles)   │
                         └────────┬────────┘
                                  │
                    ┌─────────────┼─────────────┐
                    │             │             │
                    ↓             ↓             ↓
            ┌──────────────┐  ┌────────┐  ┌───────────────┐
            │   clients    │  │ gallery│  │  blog_posts   │
            │   (profiles) │  │        │  │   (articles)  │
            └──────┬───────┘  └────┬───┘  └────────┬──────┘
                   │               │               │
            ┌──────┴────┐      ┌───┴──┐       ┌────┴──┬──────┐
            │            │      │      │       │       │      │
            ↓            ↓      ↓      ↓       ↓       ↓      ↓
       ┌─────────┐  ┌────────┐ ┌───┐ ┌─┐   (tags) ┌─────────────┐
       │ bookings│  │galleries│ │ photo(service) │blog_post_tags│
       └─────────┘  └────────┘ └───┘ └─┘         └─────────────┘
            │            │            │               │
            └────┬──┬────┘      ┌─────┴──────┐        ↓
                 ↓  ↓           ↓            ↓       tags
           ┌────────────┐  ┌───────────┐┌──────────┐
           │ categories │  │testimonial││services  │
           └────────────┘  └───────────┘└──────────┘
                 ▲
                 │ (parent)
                 │
            categories
           (self-ref)

contact_messages (standalone)
```

---

## Access Patterns by Role

### Admin / Staff
**Tables:** users, clients, categories, services, bookings, galleries, photos, testimonials, blog_posts, tags, blog_post_tags, contact_messages

**Common Queries:**
- View all bookings and manage status
- Approve/reject testimonials and blog posts
- Manage galleries and photos
- Reply to contact messages
- Create and edit blog content

---

### Client
**Tables:** users, clients, bookings, galleries, photos, testimonials, services, categories

**Common Queries:**
- View personal booking history
- View galleries from completed bookings
- Submit testimonials
- Browse all services and categories
- View published galleries and photos

---

### Public Visitor
**Tables:** services, categories, galleries, photos, testimonials, blog_posts, tags, contact_messages

**Common Queries:**
- Browse services and categories
- View public galleries and photos
- Read testimonials and reviews
- Read published blog posts
- Submit contact form messages

---

## Key Design Features

### 1. **Client Profile Separation**
- `users` table stores authentication (common to all roles)
- `clients` table stores client-specific data
- One-to-one relationship ensures data integrity

### 2. **Hierarchical Categories**
- Self-referential `parent_category_id` enables subcategories
- Example: Photography → Wedding → Traditional Wedding

### 3. **Gallery-to-Booking Link**
- Galleries can optionally link to bookings
- Supports galleries created outside booking workflow
- Galleries independently categorizable

### 4. **Testimonial Workflow**
- Approval state prevents spam/inappropriate reviews
- Admin review before publication
- Can be featured on homepage

### 5. **Blog-Tag Relationship**
- Many-to-many relationship through junction table
- Single tag can apply to multiple posts
- Single post can have multiple tags

### 6. **Contact Message Lifecycle**
- Tracks message status and reply history
- Ties replies to admin users
- Supports message archiving

---

## Constraints & Validations

### Foreign Keys
- **ON DELETE CASCADE:** photos → gallery, blog_post_tags → blog_posts/tags
- **ON DELETE RESTRICT:** services (referenced by bookings), users (blog post authors)
- **ON DELETE SET NULL:** bookings → galleries, categories → services

### Unique Constraints
- Email in users
- Category name
- Service name per category
- Blog post slug
- Tag name and slug
- One client profile per user

### Check Constraints
- Testimonial rating: 1-5

---

## Indexes for Performance

**High-Volume Queries:**
- `users.email` - Authentication
- `bookings.status` - Booking management
- `galleries.is_published` - Public gallery listing
- `blog_posts.status` - Content publishing
- `testimonials.is_approved` - Review workflow
- `contact_messages.status` - Message management

---

## Seed Data

### Default Categories
- Wedding
- Graduation
- Family
- Maternity

### Default Services
- Wedding Photography (Wedding, $500/8hrs, 300 photos)
- Graduation Photography (Graduation, $180/3hrs, 80 photos)
- Family Portrait (Family, $120/1.5hrs, 40 photos)
- Maternity Shoot (Maternity, $150/2hrs, 50 photos)

### Default Tags
- Tips
- Behind the Scenes
- Studio News
- Client Stories

---

## Migration Path from Old Schema

If migrating from the previous schema:

1. **Add new tables:** clients, tags, blog_post_tags, contact_messages
2. **Migrate user data:** users → clients (one-to-one for client role users)
3. **Update services:** Add category_id foreign key, remove old category field
4. **Update bookings:** Change user_id to client_id
5. **Update galleries:** Add booking_id and category_id links
6. **Update testimonials:** Change user_id to client_id, add service_id
7. **Update blog:** Remove blog_categories, add tags system
8. **Rename table:** contact_inquiries → contact_messages
9. **Archive tables:** invoices, activity_logs, settings (if no longer needed)

---

## Notes

- All timestamps use MySQL DEFAULT CURRENT_TIMESTAMP
- CHARSET is utf8mb4 for full Unicode support
- InnoDB engine for ACID compliance
- Cascade deletions are strategic to prevent orphaned records
- All tables use timezone-aware DATETIME fields
