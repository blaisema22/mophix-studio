// Main App Component

import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from './store';
import { Toaster } from 'react-hot-toast';
import { useEffect } from 'react';

// Layouts
import Navbar from './components/Navbar';
import AIChatWidget from './components/AIChatWidget';

// Public Pages
import Home from './pages/Home';
import Portfolio from './pages/Portfolio';
import Services from './pages/Services';
import ServiceDetails from './pages/ServiceDetails';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Register from './pages/Register';

// Client Pages
import BookingRequest from './pages/BookingRequest';
import MyBookings from './pages/MyBookings';
import MyProfile from './pages/MyProfile';
import DashboardLayout from './pages/dashboard/DashboardLayout';
import DashboardHome from './pages/dashboard/DashboardHome';
import DashboardBookings from './pages/dashboard/DashboardBookings';
import DashboardNewBooking from './pages/dashboard/DashboardNewBooking';
import DashboardUpcomingBookings from './pages/dashboard/DashboardUpcomingBookings';
import DashboardBookingHistory from './pages/dashboard/DashboardBookingHistory';
import DashboardGalleries from './pages/dashboard/DashboardGalleries';
import DashboardViewPhotos from './pages/dashboard/DashboardViewPhotos';
import DashboardDownloadPhotos from './pages/dashboard/DashboardDownloadPhotos';
import DashboardTestimonials from './pages/dashboard/DashboardTestimonials';
import DashboardWriteReview from './pages/dashboard/DashboardWriteReview';
import DashboardSubmittedReviews from './pages/dashboard/DashboardSubmittedReviews';
import DashboardProfile from './pages/dashboard/DashboardProfile';
import DashboardChangePassword from './pages/dashboard/DashboardChangePassword';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import AdminGalleries from './pages/admin/Galleries';
import AdminBookings from './pages/admin/Bookings';
import AdminTestimonials from './pages/admin/Testimonials';
import AdminInquiries from './pages/admin/Inquiries';
import AdminBlog from './pages/admin/Blog';
import AdminUsers from './pages/admin/Users';

// Protected Route Component
const ProtectedRoute = ({ children, requiredRole }) => {
    const { isAuthenticated, user } = useAuthStore();

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (requiredRole && user?.role !== requiredRole && user?.role !== 'admin') {
        return <Navigate to="/" replace />;
    }

    return children;
};

function AppContent() {
    const location = useLocation();
    const { isAuthenticated, user } = useAuthStore();
    const hideNavbar = location.pathname.startsWith('/dashboard');

    useEffect(() => {
        // Initialize auth from localStorage
        const token = localStorage.getItem('token');
        const savedUser = localStorage.getItem('user');
        
        if (token && savedUser) {
            useAuthStore.setState({
                token,
                user: JSON.parse(savedUser),
                isAuthenticated: true
            });
        }
    }, []);

    return (
        <div className="flex flex-col min-h-screen bg-black text-white">
            {!hideNavbar && <Navbar />}
            
            <main className="flex-1">
                <Routes>
                        {/* Public Routes */}
                        <Route path="/" element={<Home />} />
                        <Route path="/portfolio" element={<Portfolio />} />
                        <Route path="/services" element={<Services />} />
                        <Route path="/services/:id" element={<ServiceDetails />} />
                        <Route path="/blog" element={<Blog />} />
                        <Route path="/blog/:slug" element={<BlogPost />} />
                        <Route path="/contact" element={<Contact />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />

                        {/* Client Routes */}
                        <Route
                            path="/book/:serviceId"
                            element={
                                <ProtectedRoute requiredRole="client">
                                    <BookingRequest />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/dashboard/*"
                            element={
                                <ProtectedRoute requiredRole="client">
                                    <DashboardLayout />
                                </ProtectedRoute>
                            }
                        >
                            <Route index element={<DashboardHome />} />
                            <Route path="bookings" element={<DashboardBookings />} />
                            <Route path="bookings/new" element={<DashboardNewBooking />} />
                            <Route path="bookings/upcoming" element={<DashboardUpcomingBookings />} />
                            <Route path="bookings/history" element={<DashboardBookingHistory />} />
                            <Route path="galleries" element={<DashboardGalleries />} />
                            <Route path="galleries/view" element={<DashboardViewPhotos />} />
                            <Route path="galleries/download" element={<DashboardDownloadPhotos />} />
                            <Route path="testimonials" element={<DashboardTestimonials />} />
                            <Route path="testimonials/write" element={<DashboardWriteReview />} />
                            <Route path="testimonials/submitted" element={<DashboardSubmittedReviews />} />
                            <Route path="account" element={<Navigate to="account/profile" replace />} />
                            <Route path="account/profile" element={<DashboardProfile />} />
                            <Route path="account/change-password" element={<DashboardChangePassword />} />
                        </Route>
                        <Route
                            path="/my-bookings"
                            element={
                                <ProtectedRoute requiredRole="client">
                                    <MyBookings />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/profile"
                            element={
                                <ProtectedRoute>
                                    <MyProfile />
                                </ProtectedRoute>
                            }
                        />

                        {/* Admin Routes */}
                        <Route
                            path="/admin/dashboard"
                            element={
                                <ProtectedRoute requiredRole="admin">
                                    <AdminDashboard />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/admin/galleries"
                            element={
                                <ProtectedRoute requiredRole="admin">
                                    <AdminGalleries />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/admin/bookings"
                            element={
                                <ProtectedRoute requiredRole="admin">
                                    <AdminBookings />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/admin/testimonials"
                            element={
                                <ProtectedRoute requiredRole="admin">
                                    <AdminTestimonials />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/admin/inquiries"
                            element={
                                <ProtectedRoute requiredRole="admin">
                                    <AdminInquiries />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/admin/blog"
                            element={
                                <ProtectedRoute requiredRole="admin">
                                    <AdminBlog />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/admin/users"
                            element={
                                <ProtectedRoute requiredRole="admin">
                                    <AdminUsers />
                                </ProtectedRoute>
                            }
                        />

                        {/* 404 */}
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
            </main>

            <Toaster />
            <AIChatWidget />
        </div>
    );
}

function App() {
    return (
        <Router>
            <AppContent />
        </Router>
    );
}

export default App;
