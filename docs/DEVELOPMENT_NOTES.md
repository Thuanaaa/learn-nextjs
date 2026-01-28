# 📚 Development Notes - ShopHub E-commerce

> File này lưu trữ tất cả các ghi chú kỹ thuật, giải thích code, và hướng dẫn phát triển cho dự án ShopHub.

---

## 📅 Ngày tạo: 28/01/2026

---

## 🏗️ Cấu trúc dự án

```
book-store/
├── app/
│   ├── (auth)/              # Route group cho authentication
│   │   ├── login/           # Trang đăng nhập
│   │   │   └── page.tsx
│   │   └── register/        # Trang đăng ký
│   │       └── page.tsx
│   ├── globals.css          # CSS toàn cục
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Trang chủ
├── public/                  # Static files
├── package.json
└── DEVELOPMENT_NOTES.md     # File này
```

### 📌 Giải thích cấu trúc thư mục

#### **`(auth)` - Route Group**
- Dấu ngoặc `()` tạo route group trong Next.js
- **KHÔNG** tạo URL segment
- URL: `/login`, `/register` (không phải `/auth/login`)
- Dùng để nhóm các routes liên quan và share layout

---

## 🎨 File `app/globals.css` - CSS Design System

### 1. Import và Setup

```css
/* Import Google Fonts */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');

@import "tailwindcss";
```

**Lưu ý quan trọng:**
- Google Fonts phải import **TRƯỚC** Tailwind CSS
- Nếu đảo ngược sẽ gây lỗi parsing CSS

---

### 2. CSS Variables (Biến CSS)

```css
:root {
  --primary-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  --secondary-gradient: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  --dark-bg: #0f0f23;
  --card-bg: rgba(255, 255, 255, 0.05);
  /* ... */
}
```

**Cách sử dụng:**
```css
background: var(--primary-gradient);
color: var(--text-primary);
```

**Lợi ích:**
- Dễ maintain (chỉ sửa 1 chỗ)
- Consistent design
- Dễ tạo dark/light theme

---

### 3. Animations (Hiệu ứng chuyển động)

#### **fadeIn** - Hiện dần từ dưới lên
```css
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
```
**Dùng cho:** Cards, modals, page transitions

#### **slideIn** - Trượt từ trái sang phải
```css
@keyframes slideIn {
  from { opacity: 0; transform: translateX(-30px); }
  to { opacity: 1; transform: translateX(0); }
}
```
**Dùng cho:** Error messages, notifications

#### **pulse** - Nhấp nháy
```css
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}
```
**Dùng cho:** Loading indicators

#### **float** - Bay lơ lửng
```css
@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
}
```
**Dùng cho:** Background decorations

---

### 4. Utility Classes (Class tiện ích)

#### **`.gradient-text`** - Chữ gradient
```css
.gradient-text {
  background: var(--primary-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
```
**Cách dùng:**
```html
<h1 className="gradient-text">ShopHub</h1>
```

#### **`.glass-effect`** - Hiệu ứng kính mờ (Glassmorphism)
```css
.glass-effect {
  background: var(--card-bg);
  backdrop-filter: blur(10px);
  border: 1px solid var(--card-border);
}
```
**Hiệu ứng:** Nền mờ, nhìn xuyên qua được

#### **`.hover-lift`** - Nâng lên khi hover
```css
.hover-lift:hover {
  transform: translateY(-5px);
  box-shadow: 0 20px 40px rgba(102, 126, 234, 0.3);
}
```
**Dùng cho:** Buttons, cards, interactive elements

#### **`.btn-primary`** - Button chính
```css
.btn-primary {
  background: var(--primary-gradient);
  padding: 12px 32px;
  border-radius: 12px;
  /* ... */
}
```

#### **`.input-field`** - Input field
```css
.input-field {
  background: var(--input-bg);
  border: 1px solid var(--input-border);
  padding: 14px 20px;
  /* ... */
}
```

#### **`.card`** - Card container
```css
.card {
  background: var(--card-bg);
  backdrop-filter: blur(10px);
  border-radius: 24px;
  padding: 40px;
  /* ... */
}
```

---

### 5. Background Decorations

```css
.bg-decoration {
  position: fixed;
  border-radius: 50%;
  filter: blur(100px);
  opacity: 0.3;
  z-index: -1;
  pointer-events: none;
}
```

**Cách dùng:**
```html
<div className="bg-decoration bg-decoration-1"></div>
<div className="bg-decoration bg-decoration-2"></div>
```

**Hiệu ứng:** Tạo vòng tròn gradient mờ ở background

---

## 🔐 Authentication Pages

### Trang Login (`app/(auth)/login/page.tsx`)

#### **State Management**
```typescript
const [formData, setFormData] = useState({
  email: '',
  password: '',
});
const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
const [isLoading, setIsLoading] = useState(false);
const [showPassword, setShowPassword] = useState(false);
```

#### **Form Validation**
```typescript
const validateForm = () => {
  const newErrors: any = {};
  
  // Email validation
  if (!formData.email) {
    newErrors.email = 'Email là bắt buộc';
  } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
    newErrors.email = 'Email không hợp lệ';
  }
  
  // Password validation
  if (!formData.password) {
    newErrors.password = 'Mật khẩu là bắt buộc';
  } else if (formData.password.length < 6) {
    newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
  }
  
  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};
```

#### **Tính năng**
- ✅ Email validation (regex)
- ✅ Password validation (min 6 chars)
- ✅ Show/hide password
- ✅ Remember me checkbox
- ✅ Forgot password link
- ✅ Social login (Google, Facebook)
- ✅ Loading state
- ✅ Error messages động

---

### Trang Register (`app/(auth)/register/page.tsx`)

#### **State Management**
```typescript
const [formData, setFormData] = useState({
  fullName: '',
  email: '',
  password: '',
  confirmPassword: '',
  phone: '',
  agreeToTerms: false,
});
```

#### **Validation Rules**
```typescript
// Họ tên >= 3 ký tự
if (formData.fullName.length < 3) {
  newErrors.fullName = 'Họ và tên phải có ít nhất 3 ký tự';
}

// Email hợp lệ
if (!/\S+@\S+\.\S+/.test(formData.email)) {
  newErrors.email = 'Email không hợp lệ';
}

// SĐT 10-11 chữ số
if (!/^[0-9]{10,11}$/.test(formData.phone)) {
  newErrors.phone = 'Số điện thoại phải có 10-11 chữ số';
}

// Password mạnh (chữ hoa, chữ thường, số)
if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
  newErrors.password = 'Mật khẩu phải chứa chữ hoa, chữ thường và số';
}

// Confirm password khớp
if (formData.password !== formData.confirmPassword) {
  newErrors.confirmPassword = 'Mật khẩu không khớp';
}

// Đồng ý điều khoản
if (!formData.agreeToTerms) {
  newErrors.agreeToTerms = 'Bạn phải đồng ý với điều khoản sử dụng';
}
```

#### **Regex Patterns**
```typescript
/\S+@\S+\.\S+/                      // Email validation
/^[0-9]{10,11}$/                    // Phone number (10-11 digits)
/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/    // Strong password
```

---

## 🎯 Design Principles

### 1. **Glassmorphism**
- Nền trong suốt với blur effect
- Viền mỏng, trong suốt
- Tạo cảm giác hiện đại, sang trọng

### 2. **Gradient Colors**
- Primary: Tím (#667eea → #764ba2)
- Secondary: Hồng (#f093fb → #f5576c)
- Success: Xanh dương (#4facfe → #00f2fe)

### 3. **Animations**
- Smooth transitions (0.3s ease)
- Hover effects (lift, shadow)
- Loading states (pulse, spin)
- Page transitions (fadeIn, slideIn)

### 4. **Typography**
- Font: Inter (Google Fonts)
- Weights: 300, 400, 500, 600, 700, 800
- Line height: 1.6 (dễ đọc)

### 5. **Spacing**
- Padding: 12px, 14px, 20px, 32px, 40px
- Border radius: 12px, 24px
- Gaps: 4px, 6px, 8px

---

## 🚀 Lệnh thường dùng

### Development
```bash
npm run dev          # Chạy dev server (localhost:3000)
npm run build        # Build production
npm run start        # Chạy production server
npm run lint         # Check linting
```

### URLs
- **Trang chủ:** http://localhost:3000
- **Đăng nhập:** http://localhost:3000/login
- **Đăng ký:** http://localhost:3000/register

---

## 📝 TODO - Tính năng cần làm tiếp

### Phase 1: Core Features
- [ ] Tạo trang chủ (homepage)
- [ ] Tạo navbar/header component
- [ ] Tạo footer component
- [ ] Tạo trang danh sách sản phẩm
- [ ] Tạo trang chi tiết sản phẩm

### Phase 2: E-commerce Features
- [ ] Giỏ hàng (shopping cart)
- [ ] Trang checkout
- [ ] Trang đơn hàng (orders)
- [ ] Trang profile người dùng

### Phase 3: Backend Integration
- [ ] Tạo API routes (Next.js API)
- [ ] Kết nối database (MongoDB/PostgreSQL)
- [ ] Implement JWT authentication
- [ ] Session management
- [ ] Password reset functionality

### Phase 4: Advanced Features
- [ ] Search functionality
- [ ] Filters & sorting
- [ ] Product reviews & ratings
- [ ] Wishlist
- [ ] Payment integration (Stripe/PayPal)
- [ ] Email notifications
- [ ] Admin dashboard

---

## 🐛 Known Issues & Solutions

### Issue 1: CSS Parsing Error
**Lỗi:** `Parsing CSS source code failed`

**Nguyên nhân:** Google Fonts import sau Tailwind CSS

**Giải pháp:**
```css
/* ✅ ĐÚNG */
@import url('https://fonts.googleapis.com/...');
@import "tailwindcss";

/* ❌ SAI */
@import "tailwindcss";
@import url('https://fonts.googleapis.com/...');
```

---

## 💡 Best Practices

### 1. **Component Organization**
```
components/
├── ui/              # Reusable UI components
│   ├── Button.tsx
│   ├── Input.tsx
│   └── Card.tsx
├── layout/          # Layout components
│   ├── Header.tsx
│   ├── Footer.tsx
│   └── Sidebar.tsx
└── features/        # Feature-specific components
    ├── auth/
    ├── products/
    └── cart/
```

### 2. **State Management**
- Local state: `useState` cho form data
- Global state: Context API hoặc Zustand
- Server state: React Query hoặc SWR

### 3. **Form Validation**
- Client-side validation (UX)
- Server-side validation (Security)
- Use libraries: Zod, Yup, React Hook Form

### 4. **Error Handling**
```typescript
try {
  const response = await fetch('/api/login', {
    method: 'POST',
    body: JSON.stringify(formData),
  });
  
  if (!response.ok) {
    throw new Error('Login failed');
  }
  
  const data = await response.json();
  // Handle success
} catch (error) {
  console.error(error);
  setErrors({ general: 'Đã có lỗi xảy ra' });
}
```

### 5. **Security**
- Never store passwords in plain text
- Use HTTPS in production
- Implement CSRF protection
- Sanitize user inputs
- Use environment variables for secrets

---

## 📚 Resources & References

### Documentation
- [Next.js Docs](https://nextjs.org/docs)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [React Docs](https://react.dev)

### Design Inspiration
- [Dribbble](https://dribbble.com)
- [Behance](https://behance.net)
- [Awwwards](https://awwwards.com)

### Tools
- [Coolors](https://coolors.co) - Color palette generator
- [Google Fonts](https://fonts.google.com)
- [Heroicons](https://heroicons.com) - SVG icons

---

## 📌 Notes for Future Development

### Khi thêm tính năng mới:
1. ✅ Tạo component trong thư mục phù hợp
2. ✅ Sử dụng CSS classes có sẵn trong `globals.css`
3. ✅ Follow naming conventions
4. ✅ Add validation cho forms
5. ✅ Update file này với notes mới

### Khi tạo page mới:
1. ✅ Tạo folder trong `app/`
2. ✅ Tạo `page.tsx` trong folder đó
3. ✅ Add metadata (SEO)
4. ✅ Test responsive design
5. ✅ Update navigation/links

---

## 🎓 Kiến thức đã học

### Next.js Concepts
- ✅ App Router (Next.js 13+)
- ✅ Route Groups `(auth)`
- ✅ Server Components vs Client Components
- ✅ Metadata API
- ✅ File-based routing

### React Concepts
- ✅ `useState` hook
- ✅ `useRouter` hook
- ✅ Event handling
- ✅ Conditional rendering
- ✅ Form handling

### CSS Concepts
- ✅ CSS Variables
- ✅ Keyframe animations
- ✅ Glassmorphism
- ✅ Gradient backgrounds
- ✅ Backdrop filters
- ✅ Custom scrollbar

### TypeScript
- ✅ Type annotations
- ✅ Interfaces
- ✅ Generic types
- ✅ Type inference

---

## 📞 Support & Contact

Nếu gặp vấn đề hoặc cần hỗ trợ:
1. Check file này trước
2. Google error message
3. Check Next.js/React docs
4. Ask AI assistant

---

**Last Updated:** 28/01/2026
**Version:** 1.0.0
**Author:** Development Team
