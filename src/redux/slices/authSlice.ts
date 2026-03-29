import { createSlice, PayloadAction } from '@reduxjs/toolkit';

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
  isInitialLoading: true, // Start true to prevent "flicker" on refresh
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{ user: User }>) => {
      state.user = action.payload.user;
      state.isAuthenticated = true;
      state.isInitialLoading = true;
    },
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
    // ADD THIS BACK IN:
    updateUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    }
  },
});

// Make sure to export it here too!
export const { setCredentials, logout, setAuthFailed, updateUser } = authSlice.actions;
export default authSlice.reducer;