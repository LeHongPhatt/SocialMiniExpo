import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import authenticationAPI from "../../apis/authApi";

interface Stats {
    posts: number;
    followers: number;
    following: number;
    photos: number;
}

interface ProfileState {
    id?: string;
    username?: string;
    displayName?: string;
    email?: string;
    avatar?: string;
    bio?: string;
    location?: string;
    interests?: string[];
    stats?: Stats;
    isProfileCompleted?: boolean;
}

const initialState: ProfileState = {};


export const fetchProfile = createAsyncThunk(
    "profile/fetchProfile",
    async (_, { rejectWithValue }) => {
        try {
            const res = await authenticationAPI.HandleAuthentication("/get-profile", "get");
            console.log("📡 API /get-profile response:", res);
            return res;
        } catch (error: any) {
            console.log("❌ API /get-profile error:", error.response?.data);
            return rejectWithValue(error.response?.data || "Fetch profile failed");
        }
    }
);


const profileSlice = createSlice({
    name: "profile",
    initialState,
    reducers: {
        ProfileReducer: (state, action: PayloadAction<ProfileState>) => {
            return action.payload;
        },
        updateProfileField: (state, action: PayloadAction<Partial<ProfileState>>) => {
            return { ...state, ...action.payload };
        },
        clearProfile: () => initialState,
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchProfile.fulfilled, (state, action) => {
                return action.payload; // ✅ lưu luôn profile vào Redux
            })
            .addCase(fetchProfile.rejected, (state, action) => {
                console.log("❌ Fetch profile error:", action.payload);
                return initialState;
            });
    },
});

export const { ProfileReducer, updateProfileField, clearProfile } =
    profileSlice.actions;

export const setProfileReducer = profileSlice.reducer;
