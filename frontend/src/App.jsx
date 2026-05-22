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
import GalleryDetail from './pages/GalleryDetail';
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

// Staff Pages
import StaffDashboardLayout from './pages/staff/StaffDashboardLayout';
import StaffDashboardHome from './pages/staff/StaffDashboardHome';

import StaffBookingsAll from './pages/staff/StaffBookingsAll';
import StaffBookingsPending from './pages/staff/StaffBookingsPending';
import StaffBookingsCalendar from './pages/staff/StaffBookingsCalendar';
import StaffBookingsUpdateStatus from './pages/staff/StaffBookingsUpdateStatus';

import StaffClientsAll from './pages/staff/StaffClientsAll';
import StaffClientsProfiles from './pages/staff/StaffClientsProfiles';
import StaffClientsBookings from './pages/staff/StaffClientsBookings';

import StaffPortfolioGalleries from './pages/staff/StaffPortfolioGalleries';
import StaffPortfolioUpload from './pages/staff/StaffPortfolioUpload';
import StaffPortfolioManage from './pages/staff/StaffPortfolioManage';
import StaffPortfolioFeatured from './pages/staff/StaffPortfolioFeatured';

import StaffServicesAll from './pages/staff/StaffServicesAll';
import StaffServicesCategories from './pages/staff/StaffServicesCategories';

import StaffBlogAll from './pages/staff/StaffBlogAll';
import StaffBlogWrite from './pages/staff/StaffBlogWrite';
import StaffBlogDrafts from './pages/staff/StaffBlogDrafts';
import StaffBlogPublished from './pages/staff/StaffBlogPublished';

import StaffMessagesUnread from './pages/staff/StaffMessagesUnread';
import StaffMessagesAll from './pages/staff/StaffMessagesAll';
import StaffMessagesReplied from './pages/staff/StaffMessagesReplied';
import StaffMessagesArchived from './pages/staff/StaffMessagesArchived';

import StaffAccountProfile from './pages/staff/StaffAccountProfile';
import StaffAccountChangePassword from './pages/staff/StaffAccountChangePassword';


// Admin Pages
import AdminDashboardLayout from './pages/admin/AdminDashboardLayout';
import AdminDashboard from './pages/admin/Dashboard';
import AdminGalleries from './pages/admin/Galleries';
import AdminBookings from './pages/admin/Bookings';
import AdminTestimonials from './pages/admin/Testimonials';
import AdminInquiries from './pages/admin/Inquiries';
import AdminBlog from './pages/admin/Blog';
import AdminUsers from './pages/admin/Users';

// Protected Route Component
const normalizeRole = (role) => {
    if (!role) return role;
    return String(role).toLowerCase() === 'customer' ? 'client' : String(role).toLowerCase();
};

const ProtectedRoute = ({ children, requiredRole }) => {
    const { isAuthenticated, user } = useAuthStore();

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    const normalizedUserRole = normalizeRole(user?.role);
    const normalizedRequiredRole = normalizeRole(requiredRole);

    if (requiredRole && normalizedUserRole !== normalizedRequiredRole && normalizedUserRole !== 'admin') {
        return <Navigate to="/" replace />;
    }

    return children;
};

function AppContent() {
    const location = useLocation();
    const hideNavbar =
        location.pathname.startsWith('/dashboard') ||
        location.pathname.startsWith('/staff') ||
        location.pathname.startsWith('/admin');

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
                { path: 'portfolio/:id', element: <GalleryDetail /> },
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
                {
                    path: 'staff/dashboard',
                    element: <ProtectedRoute requiredRole="staff"><StaffDashboardLayout /></ProtectedRoute>,
                    children: [
                        { index: true, element: <StaffDashboardHome /> },
                        { path: 'bookings', element: <StaffBookingsAll /> },
                        { path: 'bookings/pending', element: <StaffBookingsPending /> },
                        { path: 'bookings/calendar', element: <StaffBookingsCalendar /> },
                        { path: 'bookings/update-status', element: <StaffBookingsUpdateStatus /> },
                        { path: 'clients', element: <StaffClientsAll /> },
                        { path: 'clients/profiles', element: <StaffClientsProfiles /> },
                        { path: 'clients/bookings', element: <StaffClientsBookings /> },
                        { path: 'portfolio/galleries', element: <StaffPortfolioGalleries /> },
                        { path: 'portfolio/upload', element: <StaffPortfolioUpload /> },
                        { path: 'portfolio/manage', element: <StaffPortfolioManage /> },
                        { path: 'portfolio/featured', element: <StaffPortfolioFeatured /> },
                        { path: 'services', element: <StaffServicesAll /> },
                        { path: 'services/categories', element: <StaffServicesCategories /> },
                        { path: 'blog', element: <StaffBlogAll /> },
                        { path: 'blog/write', element: <StaffBlogWrite /> },
                        { path: 'blog/drafts', element: <StaffBlogDrafts /> },
                        { path: 'blog/published', element: <StaffBlogPublished /> },
                        { path: 'messages/unread', element: <StaffMessagesUnread /> },
                        { path: 'messages', element: <StaffMessagesAll /> },
                        { path: 'messages/replied', element: <StaffMessagesReplied /> },
                        { path: 'messages/archived', element: <StaffMessagesArchived /> },
                        { path: 'account/profile', element: <StaffAccountProfile /> },
                        { path: 'account/change-password', element: <StaffAccountChangePassword /> },
                    ],
                },

                { path: 'my-bookings', element: <ProtectedRoute requiredRole="client"><MyBookings /></ProtectedRoute> },
                { path: 'profile', element: <ProtectedRoute><MyProfile /></ProtectedRoute> },
                {
                    path: 'admin',
                    element: <ProtectedRoute requiredRole="admin"><AdminDashboardLayout /></ProtectedRoute>,
                    children: [
                        { index: true, element: <AdminDashboard /> },
                        { path: 'galleries', element: <AdminGalleries /> },
                        { path: 'bookings', element: <AdminBookings /> },
                        { path: 'testimonials', element: <AdminTestimonials /> },
                        { path: 'inquiries', element: <AdminInquiries /> },
                        { path: 'blog', element: <AdminBlog /> },
                        { path: 'users', element: <AdminUsers /> },
                    ],
                },
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
