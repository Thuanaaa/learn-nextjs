/**
 * API Configuration
 * Cấu hình cho API endpoints và HTTPS settings
 */

// Base URL cho API - Lấy từ env hoặc dùng URL mặc định
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.example/api';

// Timeout cho API requests (milliseconds)
export const API_TIMEOUT = 30000;

// API endpoints - Tổ chức theo domain
export const API_ENDPOINTS = {
    // ===== USER ENDPOINTS =====
    USER: {
        LOGIN: '/auth/login',
        REGISTER: '/auth/register',
        LOGOUT: '/auth/logout',
        GET_ALL: '/users',
        GET_ONE: '/users/:id',
        CREATE: '/users',
        UPDATE: '/users/:id',
        DELETE: '/users/:id',
        GET_PROFILE: '/users/profile',
        UPDATE_PROFILE: '/users/profile',
    },

    // ===== BOOK ENDPOINTS =====
    BOOK: {
        GET_ALL: '/books',
        GET_ONE: '/books/:id',
        CREATE: '/books',
        UPDATE: '/books/:id',
        DELETE: '/books/:id',
        SEARCH: '/books/search',
    },

    // ===== CATEGORY ENDPOINTS (ví dụ mở rộng) =====
    CATEGORY: {
        GET_ALL: '/categories',
        GET_ONE: '/categories/:id',
    },

    // ===== ORDER ENDPOINTS (ví dụ mở rộng) =====
    ORDER: {
        GET_ALL: '/orders',
        GET_ONE: '/orders/:id',
        CREATE: '/orders',
        UPDATE_STATUS: '/orders/:id/status',
    },
} as const;

// HTTPS configuration
export const HTTPS_CONFIG = {
    // Bật/tắt HTTPS (trong production nên luôn bật)
    enabled: process.env.NODE_ENV === 'production',

    // Verify SSL certificates (trong development có thể tắt)
    rejectUnauthorized: process.env.NODE_ENV === 'production',
};

// Request headers mặc định
export const DEFAULT_HEADERS = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
};
