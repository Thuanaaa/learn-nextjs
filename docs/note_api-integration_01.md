# Note: Setup API Integration - Bước 01

**Ngày:** 29/01/2026  
**Tính năng:** Cấu hình API để call REST API từ Frontend  
**API URL:** `https://api.ecorpjsc.com/api`

---

## 🎯 Mục tiêu

Setup hệ thống API để:
- Call REST API từ backend
- Tổ chức code theo domain (user, book)
- Dễ mở rộng khi thêm API mới
- Sử dụng Fetch API (native, không cần axios)

---

## 📁 Cấu trúc đã tạo

```
lib/api/
├── services/
│   ├── user.service.ts    → User APIs (login, register, getAllUsers, etc.)
│   └── book.service.ts    → Book APIs (getAllBooks, getOneBook, etc.)
├── client.ts              → HTTP client wrapper (Fetch API)
├── config.ts              → API configuration (URL, endpoints, HTTPS)
└── index.ts               → Export tất cả
```

---

## 🔧 Chi tiết từng file

### 1. `lib/api/config.ts`

**Mục đích:** Cấu hình API URL, endpoints, HTTPS settings

**Nội dung chính:**
```typescript
// Base URL
export const API_BASE_URL = 'https://api.ecorpjsc.com/api';

// Endpoints theo domain
export const API_ENDPOINTS = {
  USER: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    GET_ALL: '/users',
    GET_ONE: '/users/:id',
    CREATE: '/users',
    UPDATE: '/users/:id',
    DELETE: '/users/:id',
    // ...
  },
  BOOK: {
    GET_ALL: '/books',
    GET_ONE: '/books/:id',
    CREATE: '/books',
    UPDATE: '/books/:id',
    DELETE: '/books/:id',
    SEARCH: '/books/search',
  },
};

// HTTPS config
export const HTTPS_CONFIG = {
  enabled: process.env.NODE_ENV === 'production',
  rejectUnauthorized: process.env.NODE_ENV === 'production',
};
```

**Lý do tổ chức như vậy:**
- ✅ Dễ tìm endpoints theo domain
- ✅ Dễ thêm domain mới (category, order, etc.)
- ✅ Centralized configuration

---

### 2. `lib/api/client.ts`

**Mục đích:** HTTP client wrapper sử dụng Fetch API

**Features:**
- ✅ Timeout support (30s)
- ✅ Auto token management (lấy từ localStorage)
- ✅ Error handling (TIMEOUT, NETWORK_ERROR, etc.)
- ✅ Request/Response interceptors

**Methods:**
```typescript
class ApiClient {
  async get<T>(endpoint, params?)
  async post<T>(endpoint, data?)
  async put<T>(endpoint, data?)
  async delete<T>(endpoint)
  
  setAuthToken(token)
  removeAuthToken()
}
```

**Lý do dùng Fetch thay vì Axios:**
- ✅ Native browser API (0KB bundle size)
- ✅ Đủ cho website bán sách đơn giản
- ✅ Không cần install dependencies
- ✅ Modern, promise-based

---

### 3. `lib/api/services/user.service.ts`

**Mục đích:** Tất cả APIs liên quan đến User

**APIs đã implement:**

#### Auth APIs
```typescript
login(credentials: LoginRequest): Promise<ApiResponse<AuthResponse>>
register(data: RegisterRequest): Promise<ApiResponse<AuthResponse>>
logout(): Promise<void>
```

#### User Management APIs
```typescript
getAllUsers(params?): Promise<ApiResponse<{users: User[], total: number}>>
getOneUser(id: string): Promise<ApiResponse<User>>
createUser(data: CreateUserRequest): Promise<ApiResponse<User>>
updateUser(id: string, data: UpdateUserRequest): Promise<ApiResponse<User>>
deleteUser(id: string): Promise<ApiResponse<void>>
```

#### Profile APIs
```typescript
getUserProfile(): Promise<ApiResponse<User>>
updateUserProfile(data: UpdateUserRequest): Promise<ApiResponse<User>>
```

#### Helper Functions
```typescript
getCurrentUser(): User | null
isAuthenticated(): boolean
```

**Types đã định nghĩa:**
```typescript
interface User {
  id: string;
  username: string;
  email: string;
  fullName?: string;
  phone?: string;
  role?: string;
  createdAt?: string;
}

interface LoginRequest {
  username: string;
  password: string;
}

interface RegisterRequest {
  username: string;
  password: string;
  email: string;
  fullName?: string;
  phone?: string;
}

interface AuthResponse {
  user: User;
  token: string;
  refreshToken?: string;
}
```

**Token Management:**
- Tự động lưu token vào `localStorage` khi login/register thành công
- Tự động thêm token vào headers cho các requests tiếp theo
- Clear token khi logout

---

### 4. `lib/api/services/book.service.ts`

**Mục đích:** Tất cả APIs liên quan đến Book

**APIs đã implement:**
```typescript
getAllBooks(params?: GetBooksParams): Promise<ApiResponse<BooksResponse>>
getOneBook(id: string): Promise<ApiResponse<Book>>
createBook(data: CreateBookRequest): Promise<ApiResponse<Book>>
updateBook(id: string, data: UpdateBookRequest): Promise<ApiResponse<Book>>
deleteBook(id: string): Promise<ApiResponse<void>>
searchBooks(query: string): Promise<ApiResponse<Book[]>>
```

**Types đã định nghĩa:**
```typescript
interface Book {
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

interface GetBooksParams {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
  sortBy?: 'title' | 'price' | 'publishedDate' | 'createdAt';
  order?: 'asc' | 'desc';
}

interface BooksResponse {
  books: Book[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
```

---

### 5. `lib/api/index.ts`

**Mục đích:** Export tất cả để dễ import

```typescript
// Export client
export { apiClient } from './client';
export type { ApiResponse, ApiError } from './client';

// Export config
export { API_BASE_URL, API_ENDPOINTS, HTTPS_CONFIG } from './config';

// Export services
export * from './services/user.service';
export * from './services/book.service';
```

**Lợi ích:**
- Import đơn giản: `import { login, getAllBooks } from '@/lib/api'`
- Không cần biết file nào chứa function gì
- Centralized exports

---

## 🔌 Tích hợp vào UI

### Login Page (`app/(auth)/login/page.tsx`)

**Thay đổi:**
1. Import API: `import { login, type ApiError } from '@/lib/api'`
2. Đổi `email` → `username` (linh hoạt hơn)
3. Call API thật thay vì mock
4. Error handling với different error codes
5. Thêm general error display

**Code:**
```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  if (!validateForm()) return;
  
  setIsLoading(true);
  setErrors({});
  
  try {
    const response = await login({
      username: formData.username,
      password: formData.password,
    });
    
    if (response.success && response.data) {
      alert(`Đăng nhập thành công! Xin chào ${response.data.user.fullName}`);
      router.push('/');
    }
  } catch (error) {
    const apiError = error as ApiError;
    
    if (apiError.code === 'INVALID_CREDENTIALS' || apiError.status === 401) {
      setErrors({ general: 'Username hoặc mật khẩu không đúng' });
    } else if (apiError.code === 'NETWORK_ERROR') {
      setErrors({ general: 'Lỗi kết nối. Vui lòng kiểm tra internet.' });
    } else if (apiError.code === 'TIMEOUT') {
      setErrors({ general: 'Yêu cầu quá lâu. Vui lòng thử lại.' });
    } else {
      setErrors({ general: apiError.message || 'Đã có lỗi xảy ra.' });
    }
  } finally {
    setIsLoading(false);
  }
};
```

---

## 🌍 Environment Variables

**File:** `.env.local`

```env
NEXT_PUBLIC_API_URL=https://api.example/api
NODE_ENV=development
```

**Lưu ý:**
- `NEXT_PUBLIC_` prefix để expose cho client-side
- Có thể override trong production

---

## 💡 Cách sử dụng

### Ví dụ 1: Login

```typescript
import { login } from '@/lib/api';

const response = await login({
  username: 'user@example.com',
  password: 'password123'
});

console.log(response.data.user);
console.log(response.data.token); // Đã tự động lưu vào localStorage
```

### Ví dụ 2: Get Books

```typescript
import { getAllBooks } from '@/lib/api';

const response = await getAllBooks({
  page: 1,
  limit: 10,
  category: 'Programming',
  sortBy: 'title',
  order: 'asc'
});

console.log(response.data.books);
console.log(response.data.total);
```

### Ví dụ 3: Create Book

```typescript
import { createBook } from '@/lib/api';

const response = await createBook({
  title: 'Clean Code',
  author: 'Robert C. Martin',
  price: 299000,
  category: 'Programming',
  stock: 50
});

console.log(response.data); // Book mới tạo
```

### Ví dụ 4: Check Authentication

```typescript
import { isAuthenticated, getCurrentUser } from '@/lib/api';

if (isAuthenticated()) {
  const user = getCurrentUser();
  console.log('Logged in as:', user.username);
} else {
  console.log('Not logged in');
}
```

---

## ✅ Best Practices đã áp dụng

### 1. **Separation of Concerns**
- Config riêng (config.ts)
- Client riêng (client.ts)
- Services theo domain (user.service.ts, book.service.ts)

### 2. **Type Safety**
- Định nghĩa đầy đủ interfaces
- Generic types cho ApiResponse<T>
- Type exports

### 3. **Error Handling**
- Centralized error handling trong client
- Error codes chuẩn (TIMEOUT, NETWORK_ERROR, etc.)
- Proper error types (ApiError)

### 4. **Token Management**
- Auto save token khi login
- Auto attach token vào requests
- Clear token khi logout

### 5. **Code Organization**
- Tổ chức theo domain (user, book)
- Dễ tìm, dễ maintain
- Dễ mở rộng

---

## 🚀 Mở rộng trong tương lai

### Thêm service mới (ví dụ: Category)

**Bước 1:** Thêm endpoints vào `config.ts`
```typescript
CATEGORY: {
  GET_ALL: '/categories',
  GET_ONE: '/categories/:id',
  CREATE: '/categories',
}
```

**Bước 2:** Tạo `lib/api/services/category.service.ts`
```typescript
export async function getAllCategories() {
  return apiClient.get(API_ENDPOINTS.CATEGORY.GET_ALL);
}
```

**Bước 3:** Export trong `index.ts`
```typescript
export * from './services/category.service';
```

**Done!** ✅

---

## 📝 Checklist

- [x] Tạo API config với URL thật
- [x] Tạo HTTP client với Fetch API
- [x] Tạo User service (login, register, CRUD)
- [x] Tạo Book service (CRUD, search)
- [x] Setup environment variables
- [x] Tích hợp vào Login page
- [ ] Tích hợp vào Register page (TODO)
- [ ] Test với backend thật
- [ ] Tạo pages hiển thị books
- [ ] Tạo admin pages quản lý

---

## 🐛 Known Issues

Không có issues hiện tại.

---

## 📚 Tài liệu liên quan

- `docs/API_SETUP.md` - Hướng dẫn sử dụng API
- `.env.local.example` - Environment variables mẫu

---

**Tóm tắt:** Đã setup xong hệ thống API với cấu trúc rõ ràng, dễ mở rộng, sử dụng Fetch API native. Tích hợp thành công vào Login page, sẵn sàng test với backend!
