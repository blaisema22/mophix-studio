// API Service - Axios instance and API calls

import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || '/api/v1';

// Create axios instance
export const api = axios.create({
    baseURL: API_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    }
});

// Request interceptor to add auth token
api.interceptors.request.use(
    config => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    error => Promise.reject(error)
);

// Response interceptor to handle errors
api.interceptors.response.use(
    response => response.data,
    error => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error.response?.data || error.message);
    }
);

// ============ AUTH SERVICES ============

export const authService = {
    register: (data) => api.post('/auth/register', data),
    login: (email, password) => api.post('/auth/login', { email, password }),
    getCurrentUser: () => api.get('/auth/me'),
    logout: () => api.post('/auth/logout'),
    requestPasswordReset: (email) => api.post('/auth/request-password-reset', { email }),
    resetPassword: (data) => api.post('/auth/reset-password', data),
};

// ============ SERVICES SERVICES ============

export const servicesService = {
    getAll: (params) => api.get('/services', { params }),
    getById: (id) => api.get(`/services/${id}`),
    create: (data) => api.post('/services', data),
    update: (id, data) => api.put(`/services/${id}`, data),
    delete: (id) => api.delete(`/services/${id}`),
};

// ============ GALLERIES SERVICES ============

export const galleriesService = {
    getAll: (params) => api.get('/galleries', { params }),
    getById: (id) => api.get(`/galleries/${id}`),
    getPhotos: (galleryId, params) => api.get(`/galleries/${galleryId}/photos`, { params }),
    create: (data) => api.post('/galleries', data),
    update: (id, data) => api.put(`/galleries/${id}`, data),
    delete: (id) => api.delete(`/galleries/${id}`),
    
    // Photo operations
    uploadPhoto: (galleryId, formData) => 
        api.post(`/galleries/${galleryId}/photos`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        }),
    updatePhoto: (photoId, data) => api.put(`/galleries/photos/${photoId}`, data),
    deletePhoto: (photoId) => api.delete(`/galleries/photos/${photoId}`),
};

// ============ BOOKINGS SERVICES ============

export const bookingsService = {
    getAll: (params) => api.get('/bookings', { params }),
    getById: (id) => api.get(`/bookings/${id}`),
    create: (data) => api.post('/bookings', data),
    updateStatus: (id, status, notes) => 
        api.patch(`/bookings/${id}/status`, { status, notes }),
    updatePaymentStatus: (id, payment_status) =>
        api.patch(`/bookings/${id}/payment`, { payment_status }),
    delete: (id) => api.delete(`/bookings/${id}`),
    getCalendar: (month, year) => api.get(`/bookings/calendar/${month}/${year}`),
};

// ============ TESTIMONIALS SERVICES ============

export const testimonialsService = {
    getAll: (params) => api.get('/testimonials', { params }),
    getUserTestimonials: (params) => api.get('/testimonials/user', { params }),
    getAverageRating: () => api.get('/testimonials/rating/average'),
    create: (data) => api.post('/testimonials', data),
    getPending: (params) => api.get('/testimonials/pending', { params }),
    approve: (id, data) => api.post(`/testimonials/${id}/approve`, data),
    reject: (id) => api.post(`/testimonials/${id}/reject`),
};
// ============ CONTACT SERVICES ============

export const contactService = {
    submit: (data) => api.post('/contact', data),
    getAll: (params) => api.get('/contact', { params }),
    getById: (id) => api.get(`/contact/${id}`),
    updateStatus: (id, status) => api.patch(`/contact/${id}/status`, { status }),
    respond: (id, response_message) => 
        api.post(`/contact/${id}/respond`, { response_message }),
    getStats: () => api.get('/contact/stats'),
};

// ============ BLOG SERVICES ============

export const blogService = {
    getPosts: (params) => api.get('/blog', { params }),
    getCategories: () => api.get('/blog/categories'),
    getPostBySlug: (slug) => api.get(`/blog/post/${slug}`),
    create: (data) => api.post('/blog', data),
    update: (id, data) => api.put(`/blog/${id}`, data),
    delete: (id) => api.delete(`/blog/${id}`),
    getDrafts: (params) => api.get('/blog/drafts', { params }),
    createCategory: (data) => api.post('/blog/categories', data),
};

// ============ USERS SERVICES ============

export const usersService = {
    getAll: (params) => api.get('/users', { params }),
    getById: (id) => api.get(`/users/${id}`),
    updateProfile: (id, data) => api.put(`/users/${id}`, data),
    updateRole: (id, role) => api.put(`/users/${id}/role`, { role }),
    toggleActive: (id) => api.patch(`/users/${id}/toggle-active`),
};

// ============ DASHBOARD SERVICES ============

export const dashboardService = {
    getStats: () => api.get('/dashboard/stats'),
    getBookingAnalytics: (params) => api.get('/dashboard/bookings/analytics', { params }),
    getRevenueReport: (params) => api.get('/dashboard/revenue/report', { params }),
};

export default api;
