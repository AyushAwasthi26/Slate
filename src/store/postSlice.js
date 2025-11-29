import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    allPosts: [],
    userPosts: [],
}

const postSlice = createSlice({
    name: 'posts',
    initialState,
    reducers: {
        // Set all posts (typically after fetching from database)
        setAllPosts: (state, action) => {
            state.allPosts = action.payload;
        },

        // Set user-specific posts
        setUserPosts: (state, action) => {
            state.userPosts = action.payload;
        },

        // Add a single post to allPosts
        addPost: (state, action) => {
            state.allPosts.push(action.payload);
        },

        // Update a post in both arrays
        updatePost: (state, action) => {
            const updatedPost = action.payload;
            
            // Update in allPosts
            const allPostIndex = state.allPosts.findIndex(
                post => post.$id === updatedPost.$id
            );
            if (allPostIndex !== -1) {
                state.allPosts[allPostIndex] = updatedPost;
            }

            // Update in userPosts
            const userPostIndex = state.userPosts.findIndex(
                post => post.$id === updatedPost.$id
            );
            if (userPostIndex !== -1) {
                state.userPosts[userPostIndex] = updatedPost;
            }
        },

        // Remove a post from both arrays
        removePost: (state, action) => {
            const postId = action.payload;
            state.allPosts = state.allPosts.filter(post => post.$id !== postId);
            state.userPosts = state.userPosts.filter(post => post.$id !== postId);
        },

        // Clear all posts (useful on logout)
        clearPosts: (state) => {
            state.allPosts = [];
            state.userPosts = [];
        }
    }
});

export const { 
    setAllPosts, 
    setUserPosts, 
    addPost, 
    updatePost, 
    removePost, 
    clearPosts 
} = postSlice.actions;

export default postSlice.reducer;