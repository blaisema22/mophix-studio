// Database Models - Sequelize ORM Definitions
// Updated to align with 12-table schema

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const bcrypt = require('bcryptjs');

// =====================================================
// USER MODEL
// =====================================================

const User = sequelize.define('User', {
    user_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    password_hash: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    first_name: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    last_name: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    phone: {
        type: DataTypes.STRING(20)
    },
    role: {
        type: DataTypes.ENUM('admin', 'staff', 'client'),
        defaultValue: 'client'
    },
    profile_image_url: {
        type: DataTypes.STRING(500)
    },
    bio: {
        type: DataTypes.TEXT
    },
    address: {
        type: DataTypes.STRING(255)
    },
    city: {
        type: DataTypes.STRING(100)
    },
    country: {
        type: DataTypes.STRING(100)
    },
    is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    last_login: {
        type: DataTypes.DATE
    }
}, {
    tableName: 'users',
    timestamps: true,
    hooks: {
        beforeCreate: async(user) => {
            if (user.password_hash) {
                const salt = await bcrypt.genSalt(10);
                user.password_hash = await bcrypt.hash(user.password_hash, salt);
            }
        },
        beforeUpdate: async(user) => {
            if (user.changed('password_hash')) {
                const salt = await bcrypt.genSalt(10);
                user.password_hash = await bcrypt.hash(user.password_hash, salt);
            }
        }
    }
});

User.prototype.comparePassword = async function(password) {
    return bcrypt.compare(password, this.password_hash);
};

User.prototype.toJSON = function() {
    const values = Object.assign({}, this.get());
    delete values.password_hash;
    return values;
};

// =====================================================
// CATEGORY MODEL
// =====================================================

const Category = sequelize.define('Category', {
    category_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true
    },
    description: {
        type: DataTypes.TEXT
    },
    icon_url: {
        type: DataTypes.STRING(500)
    },
    display_order: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    }
}, {
    tableName: 'categories',
    timestamps: true
});

// =====================================================
// SERVICE MODEL
// =====================================================

const Service = sequelize.define('Service', {
    service_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING(150),
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT
    },
    category: {
        type: DataTypes.STRING(100)
    },
    price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    duration_hours: {
        type: DataTypes.INTEGER
    },
    includes_photos_count: {
        type: DataTypes.INTEGER
    },
    includes_album: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    includes_prints: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
}, {
    tableName: 'services',
    timestamps: true
});

// =====================================================
// GALLERY MODEL
// =====================================================

const Gallery = sequelize.define('Gallery', {
    gallery_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    title: {
        type: DataTypes.STRING(200),
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT
    },
    cover_image_path: {
        type: DataTypes.STRING(500)
    },
    event_type: {
        type: DataTypes.STRING(100)
    },
    photo_count: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    is_published: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    created_by: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'user_id'
        }
    },
    published_date: {
        type: DataTypes.DATE
    }
}, {
    tableName: 'galleries',
    timestamps: true
});

// =====================================================
// PHOTO MODEL
// =====================================================

const Photo = sequelize.define('Photo', {
    photo_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    gallery_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Gallery,
            key: 'gallery_id'
        }
    },
    title: {
        type: DataTypes.STRING(200)
    },
    description: {
        type: DataTypes.TEXT
    },
    file_path: {
        type: DataTypes.STRING(500),
        allowNull: false
    },
    thumbnail_path: {
        type: DataTypes.STRING(500)
    },
    file_size: {
        type: DataTypes.INTEGER
    },
    image_width: {
        type: DataTypes.INTEGER
    },
    image_height: {
        type: DataTypes.INTEGER
    },
    upload_date: {
        type: DataTypes.DATE,
        defaultValue: sequelize.fn('NOW')
    },
    photographer_name: {
        type: DataTypes.STRING(100)
    },
    is_featured: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    view_count: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    }
}, {
    tableName: 'photos',
    timestamps: true,
    createdAt: false,
    updatedAt: false
});

// =====================================================
// BOOKING MODEL
// =====================================================

const Booking = sequelize.define('Booking', {
    booking_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'user_id'
        }
    },
    service_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Service,
            key: 'service_id'
        }
    },
    booking_date: {
        type: DataTypes.DATE,
        allowNull: false
    },
    preferred_time_start: {
        type: DataTypes.TIME
    },
    preferred_time_end: {
        type: DataTypes.TIME
    },
    event_date: {
        type: DataTypes.DATE,
        allowNull: false
    },
    event_location: {
        type: DataTypes.STRING(255)
    },
    number_of_participants: {
        type: DataTypes.INTEGER
    },
    special_requests: {
        type: DataTypes.TEXT
    },
    status: {
        type: DataTypes.ENUM('pending', 'confirmed', 'completed', 'cancelled'),
        defaultValue: 'pending'
    },
    total_price: {
        type: DataTypes.DECIMAL(10, 2)
    },
    payment_status: {
        type: DataTypes.ENUM('unpaid', 'paid', 'partial'),
        defaultValue: 'unpaid'
    },
    notes: {
        type: DataTypes.TEXT
    }
}, {
    tableName: 'bookings',
    timestamps: true
});

// =====================================================
// TESTIMONIAL MODEL
// =====================================================

const Testimonial = sequelize.define('Testimonial', {
    testimonial_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    booking_id: {
        type: DataTypes.INTEGER,
        references: {
            model: Booking,
            key: 'booking_id'
        }
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'user_id'
        }
    },
    rating: {
        type: DataTypes.INTEGER,
        validate: {
            min: 1,
            max: 5
        }
    },
    title: {
        type: DataTypes.STRING(200)
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    photo_url: {
        type: DataTypes.STRING(500)
    },
    is_approved: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    approved_by: {
        type: DataTypes.INTEGER,
        references: {
            model: User,
            key: 'user_id'
        }
    },
    approved_date: {
        type: DataTypes.DATE
    },
    is_featured: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
}, {
    tableName: 'testimonials',
    timestamps: true
});

// =====================================================
// CONTACT INQUIRY MODEL
// =====================================================

const ContactInquiry = sequelize.define('ContactInquiry', {
    inquiry_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING(150),
        allowNull: false
    },
    email: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    phone: {
        type: DataTypes.STRING(20)
    },
    subject: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    message: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    inquiry_type: {
        type: DataTypes.ENUM('general', 'booking', 'feedback', 'complaint'),
        defaultValue: 'general'
    },
    status: {
        type: DataTypes.ENUM('new', 'in_progress', 'resolved', 'spam'),
        defaultValue: 'new'
    },
    responded_by: {
        type: DataTypes.INTEGER,
        references: {
            model: User,
            key: 'user_id'
        }
    },
    response_message: {
        type: DataTypes.TEXT
    },
    response_date: {
        type: DataTypes.DATE
    }
}, {
    tableName: 'contact_inquiries',
    timestamps: true
});

// =====================================================
// BLOG CATEGORY MODEL
// =====================================================

const BlogCategory = sequelize.define('BlogCategory', {
    blog_category_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true
    },
    slug: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true
    },
    description: {
        type: DataTypes.TEXT
    },
    display_order: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    }
}, {
    tableName: 'blog_categories',
    timestamps: true
});

// =====================================================
// BLOG POST MODEL
// =====================================================

const BlogPost = sequelize.define('BlogPost', {
    post_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    title: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    slug: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    featured_image_url: {
        type: DataTypes.STRING(500)
    },
    category_id: {
        type: DataTypes.INTEGER,
        references: {
            model: BlogCategory,
            key: 'blog_category_id'
        }
    },
    author_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'user_id'
        }
    },
    status: {
        type: DataTypes.ENUM('draft', 'published', 'archived'),
        defaultValue: 'draft'
    },
    view_count: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    published_date: {
        type: DataTypes.DATE
    }
}, {
    tableName: 'blog_posts',
    timestamps: true
});

// =====================================================
// GALLERY_SERVICE (Many-to-Many) MODEL
// =====================================================

const GalleryService = sequelize.define('GalleryService', {
    gallery_service_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    gallery_id: { type: DataTypes.INTEGER, allowNull: false },
    service_id: { type: DataTypes.INTEGER, allowNull: false }
}, {
    tableName: 'gallery_service',
    timestamps: false
});

// =====================================================
// PHOTO_CATEGORY (Many-to-Many) MODEL
// =====================================================

const PhotoCategory = sequelize.define('PhotoCategory', {
    photo_category_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    photo_id: { type: DataTypes.INTEGER, allowNull: false },
    category_id: { type: DataTypes.INTEGER, allowNull: false }
}, {
    tableName: 'photo_category',
    timestamps: false
});

// =====================================================
// INVOICE MODEL
// =====================================================

const Invoice = sequelize.define('Invoice', {
    invoice_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    booking_id: { type: DataTypes.INTEGER, allowNull: false },
    invoice_number: { type: DataTypes.STRING(50), allowNull: false, unique: true },
    amount: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    tax_amount: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
    total_amount: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    payment_method: { type: DataTypes.STRING(50) },
    status: { type: DataTypes.ENUM('pending', 'paid', 'overdue', 'cancelled'), defaultValue: 'pending' },
    issued_date: { type: DataTypes.DATE, defaultValue: sequelize.fn('NOW') },
    due_date: { type: DataTypes.DATE },
    paid_date: { type: DataTypes.DATE },
    notes: { type: DataTypes.TEXT }
}, {
    tableName: 'invoices',
    timestamps: true
});

// =====================================================
// ACTIVITY LOG MODEL
// =====================================================

const ActivityLog = sequelize.define('ActivityLog', {
    log_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    user_id: { type: DataTypes.INTEGER },
    action: { type: DataTypes.STRING(50), allowNull: false },
    entity_type: { type: DataTypes.STRING(50), allowNull: false },
    entity_id: { type: DataTypes.INTEGER },
    description: { type: DataTypes.TEXT },
    ip_address: { type: DataTypes.STRING(45) }
}, {
    tableName: 'activity_logs',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false
});

// =====================================================
// SETTINGS MODEL
// =====================================================

const Setting = sequelize.define('Setting', {
    setting_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    setting_key: { type: DataTypes.STRING(100), unique: true, allowNull: false },
    setting_value: { type: DataTypes.TEXT },
    setting_type: { type: DataTypes.ENUM('string', 'integer', 'boolean', 'json'), defaultValue: 'string' }
}, {
    tableName: 'settings',
    timestamps: true,
    createdAt: false,
    updatedAt: 'updated_at'
});

// =====================================================
// ASSOCIATIONS (Relationships)
// =====================================================

// User associations
User.hasMany(Booking, { foreignKey: 'user_id' });
User.hasMany(Testimonial, { foreignKey: 'user_id' });
User.hasMany(ContactInquiry, { foreignKey: 'responded_by' });
User.hasMany(Gallery, { foreignKey: 'created_by' });
User.hasMany(BlogPost, { foreignKey: 'author_id' });

// Service associations
Service.hasMany(Booking, { foreignKey: 'service_id' });

// Gallery associations
Gallery.hasMany(Photo, { foreignKey: 'gallery_id' });
Gallery.belongsTo(User, { foreignKey: 'created_by' });

// Photo associations
Photo.belongsTo(Gallery, { foreignKey: 'gallery_id' });

// Booking associations
Booking.belongsTo(User, { foreignKey: 'user_id' });
Booking.belongsTo(Service, { foreignKey: 'service_id' });
Booking.hasMany(Testimonial, { foreignKey: 'booking_id' });

// Testimonial associations
Testimonial.belongsTo(User, { foreignKey: 'user_id' });
Testimonial.belongsTo(Booking, { foreignKey: 'booking_id' });
Testimonial.belongsTo(User, { foreignKey: 'approved_by', as: 'approvedBy' });

// ContactInquiry associations
ContactInquiry.belongsTo(User, { foreignKey: 'responded_by' });

// Blog associations
BlogPost.belongsTo(BlogCategory, { foreignKey: 'category_id' });
BlogPost.belongsTo(User, { foreignKey: 'author_id' });
// GalleryService associations (many-to-many helpers)
GalleryService.belongsTo(Gallery, { foreignKey: 'gallery_id' });
GalleryService.belongsTo(Service, { foreignKey: 'service_id' });

// PhotoCategory associations
PhotoCategory.belongsTo(Photo, { foreignKey: 'photo_id' });
PhotoCategory.belongsTo(Category, { foreignKey: 'category_id' });

// Invoice associations
Invoice.belongsTo(Booking, { foreignKey: 'booking_id' });

// ActivityLog associations
ActivityLog.belongsTo(User, { foreignKey: 'user_id' });

module.exports = {
    sequelize,
    User,
    Category,
    Service,
    Gallery,
    Photo,
    Booking,
    Testimonial,
    ContactInquiry,
    BlogCategory,
    BlogPost,
    GalleryService,
    PhotoCategory,
    Invoice,
    ActivityLog,
    Setting
};