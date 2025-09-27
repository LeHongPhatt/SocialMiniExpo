import { configureStore } from '@reduxjs/toolkit';
import { authReducer } from './reduces/authReducer';
import { setProfileReducer } from './reduces/profileReducer';
import { postReducer } from './reduces/postReducer';

const store = configureStore({
    reducer: {
        auth: authReducer,       // ✅ state.auth
        profile: setProfileReducer,
        posts: postReducer, // ✅ thêm đây
    },
});
export type RootState = ReturnType<typeof store.getState>; // ✅ định nghĩa type global cho state
export type AppDispatch = typeof store.dispatch;

export default store;
