import {configureStore} from '@reduxjs/toolkit';
import userReducer from '../features/userSlice.js';
import taskReducer from '../features/task.Slice.js';

export const store = configureStore({
    reducer: {
        user: userReducer,
        tasks: taskReducer,
    },
});