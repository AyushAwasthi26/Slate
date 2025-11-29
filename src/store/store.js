import {configureStore} from '@reduxjs/toolkit';
import authSlice from './authSlice.js';

const store = configureStore({
    reducer:{
        auth: authSlice,
        // add more slices here as needed for files say
    }
});

export default store;