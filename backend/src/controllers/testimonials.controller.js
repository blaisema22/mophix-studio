// Testimonials Controller

const { Testimonial, User, Booking, Service } = require('../models');
const { AppError } = require('../middleware/errorHandler');
const { Op } = require('sequelize');

// Get all testimonials (public - only approved)
const getAllTestimonials = async (req, res, next) => {
    try {
        const { page = 1, limit = 10, is_featured } = req.query;
        
        const where = { is_approved: true };
        if (is_featured) where.is_featured = true;

        const offset = (page - 1) * limit;

        const { count, rows } = await Testimonial.findAndCountAll({
            where,
            include: [
                { model: User, attributes: ['first_name', 'last_name', 'profile_image_url'] },
                { model: Booking, attributes: ['service_id'] }
            ],
            offset: parseInt(offset),
            limit: parseInt(limit),
            order: [['created_at', 'DESC']]
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

// Get pending testimonials (Admin)
const getPendingTestimonials = async (req, res, next) => {
    try {
        const { page = 1, limit = 20 } = req.query;
        
        const offset = (page - 1) * limit;

        const { count, rows } = await Testimonial.findAndCountAll({
            where: { is_approved: false },
            include: [
                { model: User, attributes: ['first_name', 'last_name', 'email'] }
            ],
            offset: parseInt(offset),
            limit: parseInt(limit),
            order: [['created_at', 'DESC']]
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

// Create testimonial
const createTestimonial = async (req, res, next) => {
    try {
        const { booking_id, rating, title, content, photo_url } = req.body;

        // Validate rating
        if (!rating || rating < 1 || rating > 5) {
            return next(new AppError('Rating must be between 1 and 5', 400));
        }

        const testimonial = await Testimonial.create({
            booking_id,
            user_id: req.user.user_id,
            rating,
            title,
            content,
            photo_url
        });

        res.status(201).json({
            success: true,
            message: 'Testimonial submitted successfully (awaiting approval)',
            data: testimonial
        });
    } catch (error) {
        next(error);
    }
};

// Approve testimonial (Admin)
const approveTestimonial = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { is_featured } = req.body;

        const testimonial = await Testimonial.findByPk(id);
        if (!testimonial) {
            return next(new AppError('Testimonial not found', 404));
        }

        await testimonial.update({
            is_approved: true,
            approved_by: req.user.user_id,
            approved_date: new Date(),
            is_featured: is_featured || false
        });

        res.json({
            success: true,
            message: 'Testimonial approved successfully',
            data: testimonial
        });
    } catch (error) {
        next(error);
    }
};

// Reject testimonial (Admin)
const rejectTestimonial = async (req, res, next) => {
    try {
        const { id } = req.params;

        const testimonial = await Testimonial.findByPk(id);
        if (!testimonial) {
            return next(new AppError('Testimonial not found', 404));
        }

        await testimonial.destroy();

        res.json({
            success: true,
            message: 'Testimonial rejected and deleted'
        });
    } catch (error) {
        next(error);
    }
};

// Get user testimonials
const getUserTestimonials = async (req, res, next) => {
    try {
        const { page = 1, limit = 20 } = req.query;
        const offset = (page - 1) * limit;

        const { count, rows } = await Testimonial.findAndCountAll({
            where: { user_id: req.user.user_id },
            include: [
                { model: Booking, include: [{ model: Service, attributes: ['name'] }] }
            ],
            offset: parseInt(offset),
            limit: parseInt(limit),
            order: [['created_at', 'DESC']]
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

// Get average rating
const getAverageRating = async (req, res, next) => {
    try {
        const result = await Testimonial.findAll({
            where: { is_approved: true },
            attributes: [
                ['AVG(rating)', 'average_rating'],
                ['COUNT(*)', 'total_reviews']
            ]
        });

        const average = result[0]?.dataValues?.average_rating || 0;
        const total = result[0]?.dataValues?.total_reviews || 0;

        res.json({
            success: true,
            data: {
                average_rating: parseFloat(average).toFixed(1),
                total_reviews: total
            }
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAllTestimonials,
    getPendingTestimonials,
    createTestimonial,
    approveTestimonial,
    rejectTestimonial,
    getAverageRating,
    getUserTestimonials
};

