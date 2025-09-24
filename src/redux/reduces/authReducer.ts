import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { AuthService } from '../../services/authService';
import { LoginRequest, LoginResponse } from '../../services/apiClient';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthState {
    id: string;
    email: string;
    accesstoken: string;
    name?: string;
    avatar?: string;
}

interface AuthReducerState {
    authData: AuthState;
    isLoading: boolean;
    error: string | null;
}

const initialState: AuthState = {
    id: '',
    email: '',
    accesstoken: '',
    name: '',
    avatar: '',
};

const initialReducerState: AuthReducerState = {
    authData: initialState,
    isLoading: false,
    error: null,
};

// Async thunk cho login
export const loginUser = createAsyncThunk(
    'auth/loginUser',
    async (credentials: LoginRequest, { rejectWithValue }) => {
        try {
            const response = await AuthService.login(credentials);

            if (response.success && response.data) {
                return {
                    id: response.data.user.id,
                    email: response.data.user.email,
                    accesstoken: response.data.accessToken,
                    name: response.data.user.name || '',
                    avatar: response.data.user.avatar || '',
                };
            } else {
                return rejectWithValue(response.error || 'Đăng nhập thất bại');
            }
        } catch (error) {
            return rejectWithValue('Có lỗi xảy ra khi đăng nhập');
        }
    }
);

// Async thunk cho logout
export const logoutUser = createAsyncThunk(
    "auth/logoutUser",
    async (_, { dispatch }) => {
        // Xoá token khỏi AsyncStorage
        await AsyncStorage.removeItem("auth");
        // reset state redux
        dispatch(removeAuth());
        return true;
    }
);

// Async thunk cho get profile
export const getProfile = createAsyncThunk(
    'auth/getProfile',
    async (_, { rejectWithValue }) => {
        try {
            const response = await AuthService.getProfile();

            if (response.success && response.data) {
                return {
                    id: response.data.id,
                    email: response.data.email,
                    name: response.data.name || '',
                    avatar: response.data.avatar || '',
                };
            } else {
                return rejectWithValue(response.error || 'Lấy thông tin người dùng thất bại');
            }
        } catch (error) {
            return rejectWithValue('Có lỗi xảy ra khi lấy thông tin người dùng');
        }
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState: initialReducerState,
    reducers: {
        addAuth: (state, action) => {
            state.authData = action.payload;
            state.error = null;
        },

        removeAuth: (state) => {
            state.authData = initialState;
            state.error = null;
        },

        clearError: (state) => {
            state.error = null;
        },
        updateAvatar: (state, action) => {
            state.authData.avatar = action.payload;
        },
    },
    extraReducers: (builder) => {
        // Login cases
        builder
            .addCase(loginUser.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.authData = action.payload;
                state.error = null;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            // Logout cases
            .addCase(logoutUser.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(logoutUser.fulfilled, (state) => {
                state.isLoading = false;
                state.authData = initialState;
                state.error = null;
            })
            .addCase(logoutUser.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            // Get profile cases
            .addCase(getProfile.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(getProfile.fulfilled, (state, action) => {
                state.isLoading = false;
                state.authData = { ...state.authData, ...action.payload };
                state.error = null;
            })
            .addCase(getProfile.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });
    },
});

export const authReducer = authSlice.reducer;
export const { addAuth, removeAuth, clearError, updateAvatar } = authSlice.actions;

export const authSelector = (state: any) => state.authReducer.authData;
export const authLoadingSelector = (state: any) => state.authReducer.isLoading;
export const authErrorSelector = (state: any) => state.authReducer.error;
