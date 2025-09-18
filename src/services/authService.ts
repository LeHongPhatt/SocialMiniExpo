import { apiClient, LoginRequest, LoginResponse } from './apiClient';

// Auth service class
export class AuthService {
  // Login user
  static async login(credentials: LoginRequest): Promise<{
    success: boolean;
    data?: LoginResponse;
    error?: string;
  }> {
    try {
      // Validate input
      if (!credentials.email || !credentials.password) {
        return {
          success: false,
          error: 'Email và password không được để trống',
        };
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(credentials.email)) {
        return {
          success: false,
          error: 'Email không đúng định dạng',
        };
      }

      // Call API
      const response = await apiClient.login(credentials);

      if (response.success) {
        return {
          success: true,
          data: response.data,
        };
      } else {
        return {
          success: false,
          error: response.error || 'Đăng nhập thất bại',
        };
      }
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        error: 'Có lỗi xảy ra khi đăng nhập',
      };
    }
  }

  // Logout user
  static async logout(): Promise<{
    success: boolean;
    error?: string;
  }> {
    try {
      const response = await apiClient.logout();
      return {
        success: response.success,
        error: response.error,
      };
    } catch (error) {
      console.error('Logout error:', error);
      return {
        success: false,
        error: 'Có lỗi xảy ra khi đăng xuất',
      };
    }
  }

  // Get user profile
  static async getProfile(): Promise<{
    success: boolean;
    data?: LoginResponse['user'];
    error?: string;
  }> {
    try {
      const response = await apiClient.getProfile();
      return {
        success: response.success,
        data: response.data,
        error: response.error,
      };
    } catch (error) {
      console.error('Get profile error:', error);
      return {
        success: false,
        error: 'Có lỗi xảy ra khi lấy thông tin người dùng',
      };
    }
  }

  // Refresh token
  static async refreshToken(): Promise<{
    success: boolean;
    error?: string;
  }> {
    try {
      const response = await apiClient.refreshToken();
      return {
        success: response.success,
        error: response.error,
      };
    } catch (error) {
      console.error('Refresh token error:', error);
      return {
        success: false,
        error: 'Có lỗi xảy ra khi làm mới token',
      };
    }
  }
}

export default AuthService;
