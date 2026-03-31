import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

// 1. Create the Async Thunk for API Logout
export const logoutUser =  async ( ) => {
    try {
      // Must use withCredentials to allow the browser to delete the cookie
      await axios.post('http://localhost:5000/api/auth/logout',{}, { withCredentials: true });
      return true;
    } catch (error: any) {
      return error.response?.data;
    }
  }

interface User {
  id: string;
  email: string;
  role: 'vendeur' | 'acheteur' | 'prestataire';
  firstName?: string;
  name?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isInitialLoading: boolean; 
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isInitialLoading: true,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{ user: User }>) => {
      state.user = action.payload.user;
      state.isAuthenticated = true;
      state.isInitialLoading = false; // Set to false once user is loaded
    },
    // Manual local logout (can still be used for forced resets)
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.isInitialLoading = false;
    },
    setAuthFailed: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.isInitialLoading = false;
    },
    updateUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    }
  },
 
});

export const { setCredentials, logout, setAuthFailed, updateUser } = authSlice.actions;
export default authSlice.reducer;