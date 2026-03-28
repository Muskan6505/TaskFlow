import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunks
export const fetchTasks = createAsyncThunk(
  'tasks/fetchTasks',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { user } = getState().user;
      const endpoint = user.role === 'admin' ? '/api/v1/users/admin/tasks' : '/api/v1/users/tasks';
      const res = await axios.get(endpoint, { withCredentials: true });
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch tasks');
    }
  }
);

export const createTask = createAsyncThunk(
  'tasks/createTask',
  async (taskData, { rejectWithValue }) => {
    try {
      const res = await axios.post('/api/v1/tasks', taskData, { withCredentials: true });
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to create task');
    }
  }
);

export const updateTask = createAsyncThunk(
  'tasks/updateTask',
  async ({ taskId, updates }, { rejectWithValue }) => {
    try {
      const res = await axios.put(`/api/v1/tasks/${taskId}`, updates, { withCredentials: true });
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to update task');
    }
  }
);

export const updateTaskStatus = createAsyncThunk(
  'tasks/updateTaskStatus',
  async ({ taskId, status }, { rejectWithValue }) => {
    try {
      const res = await axios.patch(`/api/v1/tasks/${taskId}/status`, { status }, { withCredentials: true });
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to update task status');
    }
  }
);

export const deleteTask = createAsyncThunk(
  'tasks/deleteTask',
  async (taskId, { rejectWithValue }) => {
    try {
      await axios.delete(`/api/v1/tasks/${taskId}`, { withCredentials: true });
      return taskId;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to delete task');
    }
  }
);

const initialState = {
  tasks: [],
  loading: false,
  error: null,
  success: null,
};

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = null;
      })
      .addCase(createTask.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks.push(action.payload);
        state.success = "Task created successfully";
      })
      .addCase(createTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = null;
      })
      .addCase(updateTask.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.tasks.findIndex(task => task._id === action.payload._id);
        if (index !== -1) {
          state.tasks[index] = action.payload;
        }
        state.success = "Task updated successfully";
      })
      .addCase(updateTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = null;
      })
      .addCase(updateTaskStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(updateTaskStatus.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.tasks.findIndex(task => task._id === action.payload._id);
        if (index !== -1) {
          state.tasks[index] = action.payload;
        }
        state.success = "Task status updated successfully";
      })
      .addCase(updateTaskStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = null;
      })
      .addCase(deleteTask.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = state.tasks.filter(task => task._id !== action.payload);
        state.success = "Task deleted successfully";
      })
      .addCase(deleteTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = null;
      });
  },
});

export const { clearError, clearSuccess } = taskSlice.actions;
export default taskSlice.reducer;