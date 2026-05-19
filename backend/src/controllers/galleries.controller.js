// Galleries and Photos Controller

const { Gallery, Photo, Service, User } = require('../models');
const { AppError } = require('../middleware/errorHandler');
const fs = require('fs').promises;
const path = require('path');

// ==================== GALLERY CONTROLLERS ====================

// Get all galleries
const getAllGalleries = async (req, res, next) => {
    try {
        const { is_published = true, created_by, page = 1, limit = 12 } = req.query;
        
        const offset = (page - 1) * limit;
        const where = { is_published: is_published === 'true' };

        if (created_by) {
            where.created_by = parseInt(created_by);
        }

        if (req.user?.role === 'client' && !created_by) {
            where.created_by = req.user.user_id;
        }

        const { count, rows } = await Gallery.findAndCountAll({
            where,
            include: [
                { model: User, attributes: ['first_name', 'last_name'] }
            ],
            offset: parseInt(offset),
            limit: parseInt(limit),
            order: [['published_date', 'DESC']]
        });

        res.json({
            success: true,
            data: rows,
            pagination: {
                total: count,
                page: parseInt(page),
                limit: parseInt(limit),
                pages: Math.ceil(count / limit)
            }
        });
    } catch (error) {
        next(error);
    }
};

// Get gallery by ID with photos
const getGalleryById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const gallery = await Gallery.findByPk(id, {
            include: [
                { model: Photo, order: [['upload_date', 'DESC']] },
                { model: User, attributes: ['first_name', 'last_name'] }
            ]
        });

        if (!gallery) {
            return next(new AppError('Gallery not found', 404));
        }

        res.json({
            success: true,
            data: gallery
        });
    } catch (error) {
        next(error);
    }
};

// Create gallery
const createGallery = async (req, res, next) => {
    try {
        const { title, description, event_type } = req.body;

        const gallery = await Gallery.create({
            title,
            description,
            event_type,
            created_by: req.user.user_id,
            is_published: false
        });

        res.status(201).json({
            success: true,
            message: 'Gallery created successfully',
            data: gallery
        });
    } catch (error) {
        next(error);
    }
};

// Update gallery
const updateGallery = async (req, res, next) => {
    try {
        const { id } = req.params;
        const gallery = await Gallery.findByPk(id);

        if (!gallery) {
            return next(new AppError('Gallery not found', 404));
        }

        const { title, description, event_type, is_published } = req.body;
        
        await gallery.update({
            title: title || gallery.title,
            description: description || gallery.description,
            event_type: event_type || gallery.event_type,
            is_published: is_published !== undefined ? is_published : gallery.is_published,
            published_date: is_published && !gallery.published_date ? new Date() : gallery.published_date
        });

        res.json({
            success: true,
            message: 'Gallery updated successfully',
            data: gallery
        });
    } catch (error) {
        next(error);
    }
};

// Delete gallery
const deleteGallery = async (req, res, next) => {
    try {
        const { id } = req.params;
        const gallery = await Gallery.findByPk(id);

        if (!gallery) {
            return next(new AppError('Gallery not found', 404));
        }

        // Delete associated photos
        const photos = await Photo.findAll({ where: { gallery_id: id } });
        for (const photo of photos) {
            try {
                await fs.unlink(photo.file_path);
                if (photo.thumbnail_path) {
                    await fs.unlink(photo.thumbnail_path);
                }
            } catch (err) {
                console.error('Error deleting file:', err);
            }
        }

        await gallery.destroy();

        res.json({
            success: true,
            message: 'Gallery deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};

// ==================== PHOTO CONTROLLERS ====================

// Get all photos in gallery
const getGalleryPhotos = async (req, res, next) => {
    try {
        const { gallery_id, page = 1, limit = 20 } = req.query;
        
        const offset = (page - 1) * limit;

        const { count, rows } = await Photo.findAndCountAll({
            where: { gallery_id },
            offset: parseInt(offset),
            limit: parseInt(limit),
            order: [['upload_date', 'DESC']]
        });

        res.json({
            success: true,
            data: rows,
            pagination: {
                total: count,
                page: parseInt(page),
                limit: parseInt(limit),
                pages: Math.ceil(count / limit)
            }
        });
    } catch (error) {
        next(error);
    }
};

// Upload photo
const uploadPhoto = async (req, res, next) => {
    try {
        const { gallery_id, title, description, is_featured } = req.body;

        if (!req.file) {
            return next(new AppError('No file uploaded', 400));
        }

        const gallery = await Gallery.findByPk(gallery_id);
        if (!gallery) {
            return next(new AppError('Gallery not found', 404));
        }

        const photo = await Photo.create({
            gallery_id,
            title: title || req.file.originalname,
            description,
            file_path: `/uploads/${req.file.filename}`,
            thumbnail_path: `/uploads/thumb_${req.file.filename}`,
            file_size: req.file.size,
            is_featured: is_featured === 'true',
            photographer_name: `${req.user.first_name} ${req.user.last_name}`
        });

        // Update photo count
        await gallery.increment('photo_count');

        res.status(201).json({
            success: true,
            message: 'Photo uploaded successfully',
            data: photo
        });
    } catch (error) {
        next(error);
    }
};

// Update photo details
const updatePhoto = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { title, description, is_featured } = req.body;

        const photo = await Photo.findByPk(id);
        if (!photo) {
            return next(new AppError('Photo not found', 404));
        }

        await photo.update({
            title: title || photo.title,
            description: description || photo.description,
            is_featured: is_featured !== undefined ? is_featured : photo.is_featured
        });

        res.json({
            success: true,
            message: 'Photo updated successfully',
            data: photo
        });
    } catch (error) {
        next(error);
    }
};

// Delete photo
const deletePhoto = async (req, res, next) => {
    try {
        const { id } = req.params;
        const photo = await Photo.findByPk(id);

        if (!photo) {
            return next(new AppError('Photo not found', 404));
        }

        // Delete file
        try {
            await fs.unlink(photo.file_path);
            if (photo.thumbnail_path) {
                await fs.unlink(photo.thumbnail_path);
            }
        } catch (err) {
            console.error('Error deleting file:', err);
        }

        const galleryId = photo.gallery_id;
        await photo.destroy();

        // Update gallery photo count
        const gallery = await Gallery.findByPk(galleryId);
        if (gallery) {
            await gallery.decrement('photo_count');
        }

        res.json({
            success: true,
            message: 'Photo deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAllGalleries,
    getGalleryById,
    createGallery,
    updateGallery,
    deleteGallery,
    getGalleryPhotos,
    uploadPhoto,
    updatePhoto,
    deletePhoto
};
