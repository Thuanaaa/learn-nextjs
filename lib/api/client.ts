/**
 * API Client
 * HTTP client sử dụng Fetch API với error handling và timeout
 */

import { API_BASE_URL, API_TIMEOUT, DEFAULT_HEADERS } from './config';

export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    message?: string;
    error?: string;
}

export interface ApiError {
    message: string;
    status?: number;
    code?: string;
}

class ApiClient {
    private baseURL: string;
    private timeout: number;
    private defaultHeaders: Record<string, string>;

    constructor() {
        this.baseURL = API_BASE_URL;
        this.timeout = API_TIMEOUT;
        this.defaultHeaders = DEFAULT_HEADERS;
    }

    /**
     * Set authorization token
     */
    setAuthToken(token: string) {
        this.defaultHeaders['Authorization'] = `Bearer ${token}`;
    }

    /**
     * Remove authorization token
     */
    removeAuthToken() {
        delete this.defaultHeaders['Authorization'];
    }

    /**
     * Get token from localStorage
     */
    private getStoredToken(): string | null {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('auth_token');
        }
        return null;
    }

    /**
     * Make HTTP request
     */
    private async request<T>(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<ApiResponse<T>> {
        const url = `${this.baseURL}${endpoint}`;

        // Thêm token vào headers nếu có
        const token = this.getStoredToken();
        const headers = {
            ...this.defaultHeaders,
            ...options.headers,
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        };

        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), this.timeout);

            const response = await fetch(url, {
                ...options,
                headers,
                signal: controller.signal,
            });

            clearTimeout(timeoutId);

            // Parse response
            const data = await response.json();

            if (!response.ok) {
                throw {
                    message: data.message || 'Request failed',
                    status: response.status,
                    code: data.code,
                } as ApiError;
            }

            return {
                success: true,
                data: data.data || data,
                message: data.message,
            };
        } catch (error: any) {
            // Handle timeout
            if (error.name === 'AbortError') {
                throw {
                    message: 'Request timeout',
                    code: 'TIMEOUT',
                } as ApiError;
            }

            // Handle network errors
            if (error instanceof TypeError) {
                throw {
                    message: 'Network error. Please check your connection.',
                    code: 'NETWORK_ERROR',
                } as ApiError;
            }

            // Re-throw API errors
            throw error as ApiError;
        }
    }

    /**
     * GET request
     */
    async get<T>(endpoint: string, params?: Record<string, any>): Promise<ApiResponse<T>> {
        let url = endpoint;

        if (params) {
            const queryString = new URLSearchParams(params).toString();
            url = `${endpoint}?${queryString}`;
        }

        return this.request<T>(url, {
            method: 'GET',
        });
    }

    /**
     * POST request
     */
    async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
        return this.request<T>(endpoint, {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    /**
     * PUT request
     */
    async put<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
        return this.request<T>(endpoint, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    }

    /**
     * DELETE request
     */
    async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
        return this.request<T>(endpoint, {
            method: 'DELETE',
        });
    }
}

// Export singleton instance
export const apiClient = new ApiClient();
