import AsyncStorage from '@react-native-async-storage/async-storage';

// Cấu hình API base URL
const API_BASE_URL = 'https://your-api-domain.com/api'; // Thay đổi URL này theo API thực tế của bạn

// Interface cho API response
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// Interface cho login request
export interface LoginRequest {
  email: string;
  password: string;
}

// Interface cho login response
export interface LoginResponse {
  user: {
    id: string;
    email: string;
    name?: string;
    avatar?: string;
  };
  accessToken: string;
  refreshToken?: string;
}

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  // Lấy token từ AsyncStorage
  private async getToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem('accessToken');
    } catch (error) {
      console.error('Error getting token:', error);
      return null;
    }
  }

  // Lưu token vào AsyncStorage
  private async setToken(token: string): Promise<void> {
    try {
      await AsyncStorage.setItem('accessToken', token);
    } catch (error) {
      console.error('Error saving token:', error);
    }
  }

  // Xóa token khỏi AsyncStorage
  private async removeToken(): Promise<void> {
    try {
      await AsyncStorage.removeItem('accessToken');
    } catch (error) {
      console.error('Error removing token:', error);
    }
  }

  // Tạo headers cho request
  private async getHeaders(): Promise<HeadersInit> {
    const token = await this.getToken();
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  // Xử lý response
  private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.message || `HTTP error! status: ${response.status}`,
      };
    }

    return {
      success: true,
      data: data.data || data,
      message: data.message,
    };
  }

  // Generic request method
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${this.baseURL}${endpoint}`;
      const headers = await this.getHeaders();

      const response = await fetch(url, {
        ...options,
        headers: {
          ...headers,
          ...options.headers,
        },
      });

      return await this.handleResponse<T>(response);
    } catch (error) {
      console.error('API request error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error',
      };
    }
  }

  // POST request
  async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  // GET request
  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'GET',
    });
  }

  // PUT request
  async put<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  // DELETE request
  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'DELETE',
    });
  }

  // Login method
  async login(credentials: LoginRequest): Promise<ApiResponse<LoginResponse>> {
    const response = await this.post<LoginResponse>('/auth/login', credentials);
    
    if (response.success && response.data?.accessToken) {
      await this.setToken(response.data.accessToken);
    }
    
    return response;
  }

  // Logout method
  async logout(): Promise<ApiResponse> {
    const response = await this.post('/auth/logout');
    await this.removeToken();
    return response;
  }

  // Refresh token method
  async refreshToken(): Promise<ApiResponse<{ accessToken: string }>> {
    const response = await this.post<{ accessToken: string }>('/auth/refresh');
    
    if (response.success && response.data?.accessToken) {
      await this.setToken(response.data.accessToken);
    }
    
    return response;
  }

  // Get current user profile
  async getProfile(): Promise<ApiResponse<LoginResponse['user']>> {
    return this.get<LoginResponse['user']>('/auth/profile');
  }
}

// Export singleton instance
export const apiClient = new ApiClient();
export default apiClient;
