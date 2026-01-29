/**
 * Book Service
 * Các API liên quan đến Book: getAllBook, getOneBook, createBook, updateBook, deleteBook, searchBook
 */

import { apiClient, ApiResponse } from '../client';
import { API_ENDPOINTS } from '../config';

// ===== TYPES =====

export interface Book {
    id: string;
    title: string;
    author: string;
    description?: string;
    price: number;
    category?: string;
    coverImage?: string;
    publishedDate?: string;
    isbn?: string;
    stock?: number;
    createdAt?: string;
    updatedAt?: string;
}

export interface CreateBookRequest {
    title: string;
    author: string;
    description?: string;
    price: number;
    category?: string;
    coverImage?: string;
    publishedDate?: string;
    isbn?: string;
    stock?: number;
}

export interface UpdateBookRequest extends Partial<CreateBookRequest> { }

export interface GetBooksParams {
    page?: number;
    limit?: number;
    category?: string;
    search?: string;
    sortBy?: 'title' | 'price' | 'publishedDate' | 'createdAt';
    order?: 'asc' | 'desc';
}

export interface BooksResponse {
    books: Book[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

// ===== API FUNCTIONS =====

/**
 * Get all books
 * GET /books
 */
export async function getAllBooks(params?: GetBooksParams): Promise<ApiResponse<BooksResponse>> {
    return apiClient.get<BooksResponse>(API_ENDPOINTS.BOOK.GET_ALL, params);
}

/**
 * Get one book by ID
 * GET /books/:id
 */
export async function getOneBook(id: string): Promise<ApiResponse<Book>> {
    const endpoint = API_ENDPOINTS.BOOK.GET_ONE.replace(':id', id);
    return apiClient.get<Book>(endpoint);
}

/**
 * Create book
 * POST /books
 */
export async function createBook(data: CreateBookRequest): Promise<ApiResponse<Book>> {
    return apiClient.post<Book>(API_ENDPOINTS.BOOK.CREATE, data);
}

/**
 * Update book
 * PUT /books/:id
 */
export async function updateBook(
    id: string,
    data: UpdateBookRequest
): Promise<ApiResponse<Book>> {
    const endpoint = API_ENDPOINTS.BOOK.UPDATE.replace(':id', id);
    return apiClient.put<Book>(endpoint, data);
}

/**
 * Delete book
 * DELETE /books/:id
 */
export async function deleteBook(id: string): Promise<ApiResponse<void>> {
    const endpoint = API_ENDPOINTS.BOOK.DELETE.replace(':id', id);
    return apiClient.delete<void>(endpoint);
}

/**
 * Search books
 * GET /books/search
 */
export async function searchBooks(query: string): Promise<ApiResponse<Book[]>> {
    return apiClient.get<Book[]>(API_ENDPOINTS.BOOK.SEARCH, { q: query });
}
