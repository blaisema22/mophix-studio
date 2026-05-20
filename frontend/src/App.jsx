// Main App Component

import { createBrowserRouter, RouterProvider, Navigate, Outlet, useLocation } from 'react-router-dom';
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
                <Outlet />
            </main>

            <Toaster />
            <AIChatWidget />
        </div>
    );
}

const router = createBrowserRouter(
    [
        {
            path: '/',
            element: <AppContent />,
            children: [
                { index: true, element: <Home /> },
                { path: 'portfolio', element: <Portfolio /> },
                { path: 'services', element: <Services /> },
                { path: 'services/:id', element: <ServiceDetails /> },
                { path: 'blog', element: <Blog /> },
                { path: 'blog/:slug', element: <BlogPost /> },
                { path: 'contact', element: <Contact /> },
                { path: 'login', element: <Login /> },
                { path: 'register', element: <Register /> },
                { path: 'book/:serviceId', element: <ProtectedRoute requiredRole="client"><BookingRequest /></ProtectedRoute> },
                {
                    path: 'dashboard',
                    element: <ProtectedRoute requiredRole="client"><DashboardLayout /></ProtectedRoute>,
                    children: [
                        { index: true, element: <DashboardHome /> },
                        { path: 'bookings', element: <DashboardBookings /> },
                        { path: 'bookings/new', element: <DashboardNewBooking /> },
                        { path: 'bookings/upcoming', element: <DashboardUpcomingBookings /> },
                        { path: 'bookings/history', element: <DashboardBookingHistory /> },
                        { path: 'galleries', element: <DashboardGalleries /> },
                        { path: 'galleries/view', element: <DashboardViewPhotos /> },
                        { path: 'galleries/download', element: <DashboardDownloadPhotos /> },
                        { path: 'testimonials', element: <DashboardTestimonials /> },
                        { path: 'testimonials/write', element: <DashboardWriteReview /> },
                        { path: 'testimonials/submitted', element: <DashboardSubmittedReviews /> },
                        { path: 'account', element: <Navigate to="account/profile" replace /> },
                        { path: 'account/profile', element: <DashboardProfile /> },
                        { path: 'account/change-password', element: <DashboardChangePassword /> },
                    ],
                },
                { path: 'my-bookings', element: <ProtectedRoute requiredRole="client"><MyBookings /></ProtectedRoute> },
                { path: 'profile', element: <ProtectedRoute><MyProfile /></ProtectedRoute> },
                { path: 'admin/dashboard', element: <ProtectedRoute requiredRole="admin"><AdminDashboard /></ProtectedRoute> },
                { path: 'admin/galleries', element: <ProtectedRoute requiredRole="admin"><AdminGalleries /></ProtectedRoute> },
                { path: 'admin/bookings', element: <ProtectedRoute requiredRole="admin"><AdminBookings /></ProtectedRoute> },
                { path: 'admin/testimonials', element: <ProtectedRoute requiredRole="admin"><AdminTestimonials /></ProtectedRoute> },
                { path: 'admin/inquiries', element: <ProtectedRoute requiredRole="admin"><AdminInquiries /></ProtectedRoute> },
                { path: 'admin/blog', element: <ProtectedRoute requiredRole="admin"><AdminBlog /></ProtectedRoute> },
                { path: 'admin/users', element: <ProtectedRoute requiredRole="admin"><AdminUsers /></ProtectedRoute> },
                { path: '*', element: <Navigate to="/" replace /> },
            ],
        },
    ],
    {
        future: {
            v7_startTransition: true,
            v7_relativeSplatPath: true,
        },
    }
);

function App() {
    return <RouterProvider router={router} />;
}

export default App;
