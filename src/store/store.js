import {configureStore} from '@reduxjs/toolkit';
import authSlice from './authSlice.js';
import postSlice from './postSlice.js';

const store = configureStore({
    reducer:{
        auth: authSlice,
        // add more slices here as needed for files say
        posts: postSlice,
    }
});

export default store;