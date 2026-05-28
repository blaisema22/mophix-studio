// Services Controller

const { Service, Gallery } = require('../models');
const { AppError } = require('../middleware/errorHandler');
const { Op } = require('sequelize');
const { isDatabaseConnected } = require('../config/database');

// Get all services

const getAllServices = async (req, res, next) => {
    try {
        if (!isDatabaseConnected()) {
            return res.status(503).json({
                success: false,
                message: 'Database not connected',
            });
        }

        const { category, is_active, page = 1, limit = 20 } = req.query;

        const where = {};

        if (is_active !== undefined) where.is_active = is_active === 'true' || is_active === true;
        else where.is_active = true;
        if (category) where.category = category;

        const offset = (page - 1) * limit;

        const { count, rows } = await Service.findAndCountAll({
            where,
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

// Get service by ID
const getServiceById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const service = await Service.findByPk(id);

        if (!service) {
            return next(new AppError('Service not found', 404));
        }

        res.json({
            success: true,
            data: service
        });
    } catch (error) {
        next(error);
    }
};

// Create service (Admin only)
const createService = async (req, res, next) => {
    try {
        const { name, description, category, price, duration_hours, includes_photos_count } = req.body;

        const service = await Service.create({
            name,
            description,
            category,
            price,
            duration_hours,
            includes_photos_count
        });

        res.status(201).json({
            success: true,
            message: 'Service created successfully',
            data: service
        });
    } catch (error) {
        next(error);
    }
};

// Update service (Admin only)
const updateService = async (req, res, next) => {
    try {
        const { id } = req.params;
        const service = await Service.findByPk(id);

        if (!service) {
            return next(new AppError('Service not found', 404));
        }

        await service.update(req.body);

        res.json({
            success: true,
            message: 'Service updated successfully',
            data: service
        });
    } catch (error) {
        next(error);
    }
};

// Delete service (Admin only)
const deleteService = async (req, res, next) => {
    try {
        const { id } = req.params;
        const service = await Service.findByPk(id);

        if (!service) {
            return next(new AppError('Service not found', 404));
        }

        await service.destroy();

        res.json({
            success: true,
            message: 'Service deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAllServices,
    getServiceById,
    createService,
    updateService,
    deleteService
};
