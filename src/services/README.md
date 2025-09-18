# API Services Documentation

## Tổng quan
Thư mục `services` chứa các API client và service classes để tương tác với backend API.

## Cấu trúc
```
src/services/
├── apiClient.ts      # API client chính với các method HTTP
├── authService.ts    # Service xử lý authentication
├── index.ts          # Export tất cả services
└── README.md         # Tài liệu hướng dẫn
```

## Sử dụng

### 1. API Client (`apiClient.ts`)
API client chính cung cấp các method HTTP cơ bản:

```typescript
import { apiClient } from '../services';

// POST request
const response = await apiClient.post('/endpoint', data);

// GET request
const response = await apiClient.get('/endpoint');

// PUT request
const response = await apiClient.put('/endpoint', data);

// DELETE request
const response = await apiClient.delete('/endpoint');
```

### 2. Auth Service (`authService.ts`)
Service xử lý authentication:

```typescript
import { AuthService } from '../services';

// Login
const loginResult = await AuthService.login({
  email: 'user@example.com',
  password: 'password123'
});

// Logout
const logoutResult = await AuthService.logout();

// Get profile
const profileResult = await AuthService.getProfile();
```

### 3. Redux Integration
Sử dụng với Redux thunks:

```typescript
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, authLoadingSelector, authErrorSelector } from '../redux/reduces/authReducer';

const dispatch = useDispatch();
const isLoading = useSelector(authLoadingSelector);
const error = useSelector(authErrorSelector);

// Dispatch login action
const handleLogin = async () => {
  const result = await dispatch(loginUser({ email, password }));
  if (loginUser.fulfilled.match(result)) {
    // Login successful
  }
};
```

## Cấu hình

### Base URL
Thay đổi `API_BASE_URL` trong `apiClient.ts`:

```typescript
const API_BASE_URL = 'https://your-api-domain.com/api';
```

### Token Management
API client tự động quản lý access token:
- Tự động lưu token sau khi login thành công
- Tự động thêm token vào headers của các request
- Tự động xóa token khi logout

## Error Handling
Tất cả API calls đều trả về format chuẩn:

```typescript
interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}
```

## Validation
AuthService có built-in validation:
- Email format validation
- Password length validation (minimum 6 characters)
- Required field validation

## AsyncStorage
API client sử dụng AsyncStorage để lưu trữ:
- `accessToken`: Access token của user
- Token được tự động thêm vào Authorization header

## Ví dụ sử dụng trong Component

```typescript
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, authLoadingSelector, authErrorSelector } from '../redux/reduces/authReducer';

const LoginComponent = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const dispatch = useDispatch();
  const isLoading = useSelector(authLoadingSelector);
  const error = useSelector(authErrorSelector);

  const handleLogin = async () => {
    const result = await dispatch(loginUser({ email, password }));
    
    if (loginUser.fulfilled.match(result)) {
      // Navigate to main screen
      navigation.navigate('MainScreen');
    }
  };

  return (
    // Your UI components
  );
};
```

## Lưu ý
1. Đảm bảo cấu hình đúng `API_BASE_URL` trước khi sử dụng
2. Xử lý error cases trong UI
3. Sử dụng loading states để cải thiện UX
4. Token sẽ tự động được refresh nếu có refresh token endpoint
