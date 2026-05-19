// Zustand Store - Global State Management

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Auth Store
export const useAuthStore = create(
    persist(
        (set) => ({
            user: null,
            token: null,
            isAuthenticated: false,

            setUser: (user) => set({ user, isAuthenticated: !!user }),
            setToken: (token) => set({ token }),
            
            login: (user, token) => set({
                user,
                token,
                isAuthenticated: true
            }),

            logout: () => {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                return set({
                    user: null,
                    token: null,
                    isAuthenticated: false
                });
            },

            updateUser: (user) => set({ user })
        }),
        {
            name: 'auth-storage',
        }
    )
);

// Gallery Store
export const useGalleryStore = create((set) => ({
    galleries: [],
    selectedGallery: null,

    setGalleries: (galleries) => set({ galleries }),
    setSelectedGallery: (gallery) => set({ selectedGallery: gallery }),
    addGallery: (gallery) => set((state) => ({
        galleries: [gallery, ...state.galleries]
    })),
    removeGallery: (id) => set((state) => ({
        galleries: state.galleries.filter(g => g.gallery_id !== id)
    })),
}));

// Bookings Store
export const useBookingsStore = create((set) => ({
    bookings: [],
    selectedBooking: null,

    setBookings: (bookings) => set({ bookings }),
    setSelectedBooking: (booking) => set({ selectedBooking: booking }),
    addBooking: (booking) => set((state) => ({
        bookings: [booking, ...state.bookings]
    })),
    updateBooking: (id, updates) => set((state) => ({
        bookings: state.bookings.map(b => 
            b.booking_id === id ? { ...b, ...updates } : b
        )
    })),
}));

// UI Store
export const useUIStore = create((set) => ({
    isLoading: false,
    isMobileMenuOpen: false,

    setIsLoading: (isLoading) => set({ isLoading }),
    toggleMobileMenu: () => set((state) => ({
        isMobileMenuOpen: !state.isMobileMenuOpen
    })),
    closeMobileMenu: () => set({ isMobileMenuOpen: false }),
}));

// Testimonials Store
export const useTestimonialsStore = create((set) => ({
    testimonials: [],
    averageRating: 0,

    setTestimonials: (testimonials) => set({ testimonials }),
    setAverageRating: (averageRating) => set({ averageRating }),
    addTestimonial: (testimonial) => set((state) => ({
        testimonials: [testimonial, ...state.testimonials]
    })),
}));
