import { createSlice, PayloadAction } from "@reduxjs/toolkit";

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

const profileSlice = createSlice({
    name: "profile",
    initialState,
    reducers: {
        ProfileReducer: (state, action: PayloadAction<ProfileState>) => {
            return action.payload; // ✅ Ghi đè state cũ bằng dữ liệu mới
        },
        updateProfileField: (state, action: PayloadAction<Partial<ProfileState>>) => {
            return { ...state, ...action.payload }; // ✅ Merge dữ liệu
        },
        clearProfile: () => {
            return initialState; // ✅ Reset về rỗng
        },
    },
});

export const { ProfileReducer, updateProfileField, clearProfile } =
    profileSlice.actions;

export const setProfileReducer = profileSlice.reducer;
