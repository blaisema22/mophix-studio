// Testimonials Routes

const express = require('express');
const router = express.Router();
const testimonialsController = require('../controllers/testimonials.controller');
const { verifyToken, authorize } = require('../middleware/auth');

// Public routes
router.get('/', testimonialsController.getAllTestimonials);
router.get('/rating/average', testimonialsController.getAverageRating);

// Client routes
router.post('/', verifyToken, authorize('client'), testimonialsController.createTestimonial);
router.get('/user', verifyToken, authorize('client'), testimonialsController.getUserTestimonials);

// Admin routes
router.get('/pending', verifyToken, authorize('admin'), testimonialsController.getPendingTestimonials);
router.post('/:id/approve', verifyToken, authorize('admin'), testimonialsController.approveTestimonial);
router.post('/:id/reject', verifyToken, authorize('admin'), testimonialsController.rejectTestimonial);

module.exports = router;
