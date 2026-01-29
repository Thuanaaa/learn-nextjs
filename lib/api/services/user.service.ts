/**
 * User Service
 * Các API liên quan đến User: login, register, getAllUser, getOneUser, createUser, etc.
 */

import { apiClient, ApiResponse } from '../client';
import { API_ENDPOINTS } from '../config';

// ===== TYPES =====

export interface LoginRequest {
    username: string;
    password: string;
}

export interface RegisterRequest {
    username: string;
    password: string;
    email: string;
    fullName?: string;
    phone?: string;
}

export interface User {
    id: string;
    username: string;
    email: string;
    fullName?: string;
    phone?: string;
    role?: string;
    createdAt?: string;
}

export interface AuthResponse {
    user: User;
    token: string;
    refreshToken?: string;
}

export interface CreateUserRequest {
    username: string;
    password: string;
    email: string;
    fullName?: string;
    phone?: string;
    role?: string;
}

export interface UpdateUserRequest {
    fullName?: string;
    email?: string;
    phone?: string;
    role?: string;
}

// ===== API FUNCTIONS =====

/**
 * Login
 * POST /auth/login
 */
export async function login(credentials: LoginRequest): Promise<ApiResponse<AuthResponse>> {
    try {
        const response = await apiClient.post<AuthResponse>(
            API_ENDPOINTS.USER.LOGIN,
            credentials
        );

        // Lưu token vào localStorage nếu thành công
        if (response.success && response.data?.token) {
            if (typeof window !== 'undefined') {
                localStorage.setItem('auth_token', response.data.token);
                localStorage.setItem('user', JSON.stringify(response.data.user));
            }
        }

        return response;
    } catch (error) {
        throw error;
    }
}

/**
 * Register
 * POST /auth/register
 */
export async function register(data: RegisterRequest): Promise<ApiResponse<AuthResponse>> {
    try {
        const response = await apiClient.post<AuthResponse>(
            API_ENDPOINTS.USER.REGISTER,
            data
        );

        // Lưu token vào localStorage nếu thành công
        if (response.success && response.data?.token) {
            if (typeof window !== 'undefined') {
                localStorage.setItem('auth_token', response.data.token);
                localStorage.setItem('user', JSON.stringify(response.data.user));
            }
        }

        return response;
    } catch (error) {
        throw error;
    }
}

/**
 * Logout
 * POST /auth/logout
 */
export async function logout(): Promise<void> {
    try {
        await apiClient.post(API_ENDPOINTS.USER.LOGOUT);
    } catch (error) {
        // Ignore errors
    } finally {
        // Clear localStorage
        if (typeof window !== 'undefined') {
            localStorage.removeItem('auth_token');
            localStorage.removeItem('user');
        }
    }
}

/**
 * Get all users
 * GET /users
 */
export async function getAllUsers(params?: {
    page?: number;
    limit?: number;
    search?: string;
}): Promise<ApiResponse<{ users: User[]; total: number }>> {
    return apiClient.get(API_ENDPOINTS.USER.GET_ALL, params);
}

/**
 * Get one user by ID
 * GET /users/:id
 */
export async function getOneUser(id: string): Promise<ApiResponse<User>> {
    const endpoint = API_ENDPOINTS.USER.GET_ONE.replace(':id', id);
    return apiClient.get<User>(endpoint);
}

/**
 * Create user
 * POST /users
 */
export async function createUser(data: CreateUserRequest): Promise<ApiResponse<User>> {
    return apiClient.post<User>(API_ENDPOINTS.USER.CREATE, data);
}

/**
 * Update user
 * PUT /users/:id
 */
export async function updateUser(
    id: string,
    data: UpdateUserRequest
): Promise<ApiResponse<User>> {
    const endpoint = API_ENDPOINTS.USER.UPDATE.replace(':id', id);
    return apiClient.put<User>(endpoint, data);
}

/**
 * Delete user
 * DELETE /users/:id
 */
export async function deleteUser(id: string): Promise<ApiResponse<void>> {
    const endpoint = API_ENDPOINTS.USER.DELETE.replace(':id', id);
    return apiClient.delete<void>(endpoint);
}

/**
 * Get current user profile
 * GET /users/profile
 */
export async function getUserProfile(): Promise<ApiResponse<User>> {
    return apiClient.get<User>(API_ENDPOINTS.USER.GET_PROFILE);
}

/**
 * Update current user profile
 * PUT /users/profile
 */
export async function updateUserProfile(
    data: UpdateUserRequest
): Promise<ApiResponse<User>> {
    return apiClient.put<User>(API_ENDPOINTS.USER.UPDATE_PROFILE, data);
}

// ===== HELPER FUNCTIONS =====

/**
 * Get current user from localStorage
 */
export function getCurrentUser(): User | null {
    if (typeof window !== 'undefined') {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            try {
                return JSON.parse(userStr);
            } catch {
                return null;
            }
        }
    }
    return null;
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
    if (typeof window !== 'undefined') {
        return !!localStorage.getItem('auth_token');
    }
    return false;
}
