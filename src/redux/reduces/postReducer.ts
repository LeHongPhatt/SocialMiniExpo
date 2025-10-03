import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Post {
    _id: string;
    author: { _id: string; name: string; avatar: string };
    content: string;
    image?: string;
    likes: any[];
    comments: any[];
    visibility: string;
}

interface PostState {
    posts: Post[];
    page: number;
    hasMore: boolean;
    loading: boolean;
}

const initialState: PostState = {
    posts: [],
    page: 1,
    hasMore: true,
    loading: false,
};

const postSlice = createSlice({
    name: "posts",
    initialState,
    reducers: {
        setPosts(state, action: PayloadAction<Post[]>) {
            state.posts = action.payload;
            state.page = 2; // vì page 1 đã load xong
        },
        addPosts(state, action: PayloadAction<Post[]>) {
            // Gộp bài cũ + bài mới và loại bỏ trùng theo _id
            const merged = [...state.posts, ...action.payload];
            state.posts = Array.from(new Map(merged.map((p) => [p._id, p])).values());
            state.page += 1;
        },
        addPostAtStart(state, action: PayloadAction<Post>) {
            const exists = state.posts.find(p => p._id === action.payload._id);
            if (!exists) state.posts.unshift(action.payload);
        },

        setLoading(state, action: PayloadAction<boolean>) {
            state.loading = action.payload;
        },
        setHasMore(state, action: PayloadAction<boolean>) {
            state.hasMore = action.payload;
        },
        resetPosts(state) {
            state.posts = [];
            state.page = 1;
            state.hasMore = true;
        },
        setLikes(state, action: PayloadAction<{ postId: string; likes: string[] }>) {
            const { postId, likes } = action.payload;
            const post = state.posts.find((p) => p._id === postId);
            if (post) post.likes = likes;
        }, toggleLike(state, action: PayloadAction<{ postId: string; userId: string }>) {
            const { postId, userId } = action.payload;
            console.log("===toggleLike action.payload===", action.payload);
            const post = state.posts.find((p) => p._id === postId);
            if (post) {
                if (post.likes.includes(userId)) {
                    post.likes = post.likes.filter((id) => id !== userId);
                } else {
                    post.likes.push(userId);
                }
            }
        },
    },
});

export const postReducer = postSlice.reducer;
export const { setPosts, addPosts, addPostAtStart, setLoading, setHasMore, resetPosts, setLikes, toggleLike } =
    postSlice.actions;
