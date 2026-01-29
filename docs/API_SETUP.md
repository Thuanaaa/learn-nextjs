# ✅ Setup API hoàn tất!

## 🎯 Cấu trúc đã tạo

```
lib/api/
├── services/
│   ├── user.service.ts    → User APIs (login, register, getAllUsers, etc.)
│   └── book.service.ts    → Book APIs (getAllBooks, getOneBook, etc.)
├── client.ts              → HTTP client (Fetch wrapper)
├── config.ts              → API config
└── index.ts               → Export tất cả
```

---

## 🔗 API URL

**Base URL:** `https://api.example/api`

Đã cấu hình trong `.env.local`:
```env
NEXT_PUBLIC_API_URL=https://api.example/api
```

---

## 📚 User Service APIs

**File:** `lib/api/services/user.service.ts`

### Auth APIs
- ✅ `login(credentials)` - POST `/auth/login`
- ✅ `register(data)` - POST `/auth/register`
- ✅ `logout()` - POST `/auth/logout`

### User Management APIs
- ✅ `getAllUsers(params)` - GET `/users`
- ✅ `getOneUser(id)` - GET `/users/:id`
- ✅ `createUser(data)` - POST `/users`
- ✅ `updateUser(id, data)` - PUT `/users/:id`
- ✅ `deleteUser(id)` - DELETE `/users/:id`

### Profile APIs
- ✅ `getUserProfile()` - GET `/users/profile`
- ✅ `updateUserProfile(data)` - PUT `/users/profile`

### Helper Functions
- ✅ `getCurrentUser()` - Lấy user từ localStorage
- ✅ `isAuthenticated()` - Check đã login chưa

---

## 📖 Book Service APIs

**File:** `lib/api/services/book.service.ts`

- ✅ `getAllBooks(params)` - GET `/books`
- ✅ `getOneBook(id)` - GET `/books/:id`
- ✅ `createBook(data)` - POST `/books`
- ✅ `updateBook(id, data)` - PUT `/books/:id`
- ✅ `deleteBook(id)` - DELETE `/books/:id`
- ✅ `searchBooks(query)` - GET `/books/search`

---

## 💻 Cách sử dụng

### Import

```typescript
import { 
  // User APIs
  login, 
  register,
  getAllUsers,
  getOneUser,
  
  // Book APIs
  getAllBooks,
  getOneBook,
  createBook,
  
  // Types
  type User,
  type Book,
  type LoginRequest
} from '@/lib/api';
```

### Ví dụ Login

```typescript
'use client';

import { useState } from 'react';
import { login, type ApiError } from '@/lib/api';

export default function LoginPage() {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await login({
        username: formData.username,
        password: formData.password
      });

      if (response.success && response.data) {
        console.log('User:', response.data.user);
        console.log('Token:', response.data.token);
        // Token tự động lưu vào localStorage
      }
    } catch (error) {
      const apiError = error as ApiError;
      console.error(apiError.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
    </form>
  );
}
```

### Ví dụ Get Books

```typescript
'use client';

import { useState, useEffect } from 'react';
import { getAllBooks, type Book } from '@/lib/api';

export default function BooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBooks();
  }, []);

  const loadBooks = async () => {
    try {
      const response = await getAllBooks({
        page: 1,
        limit: 10,
        sortBy: 'title',
        order: 'asc'
      });

      if (response.success && response.data) {
        setBooks(response.data.books);
        console.log('Total:', response.data.total);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {books.map(book => (
        <div key={book.id}>
          <h3>{book.title}</h3>
          <p>{book.author}</p>
          <p>{book.price.toLocaleString()}đ</p>
        </div>
      ))}
    </div>
  );
}
```

---

## 🔧 Features

### ✅ HTTP Client (Fetch API)
- Timeout support (30s)
- Auto token management
- Error handling
- Request/Response interceptors

### ✅ Error Handling
- `TIMEOUT` - Request quá lâu
- `NETWORK_ERROR` - Lỗi kết nối
- `INVALID_CREDENTIALS` - Sai thông tin
- Custom error codes từ backend

### ✅ Token Management
- Tự động lưu token vào localStorage
- Tự động thêm token vào headers
- Helper functions: `getCurrentUser()`, `isAuthenticated()`

---

## 📁 Files đã cập nhật

### Mới tạo:
- ✅ `lib/api/config.ts` - API configuration
- ✅ `lib/api/client.ts` - HTTP client
- ✅ `lib/api/services/user.service.ts` - User APIs
- ✅ `lib/api/services/book.service.ts` - Book APIs
- ✅ `lib/api/index.ts` - Export tất cả
- ✅ `.env.local` - Environment variables

### Đã sửa:
- ✅ `app/(auth)/login/page.tsx` - Tích hợp login API
- ⏳ `app/(auth)/register/page.tsx` - Cần cập nhật

---

## 🎯 Next Steps

1. ✅ Setup API structure - **DONE**
2. ✅ Tích hợp login API - **DONE**
3. ⏳ Tích hợp register API - Cần làm
4. ⏳ Test với backend thật
5. ⏳ Tạo pages để hiển thị books
6. ⏳ Tạo admin pages để quản lý users/books

---

## 💡 Tips

1. **Error Handling:** Luôn dùng try-catch
2. **Loading State:** Hiển thị loading khi call API
3. **Token:** Tự động lưu và gửi kèm requests
4. **Types:** Dùng TypeScript types cho type safety

---

**API đã sẵn sàng sử dụng! 🚀**
