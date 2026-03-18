import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define the shape of our User object
interface User {
  id: string;
  email: string;
  role: 'vendeur' | 'acheteur' | 'prestataire';
  firstName?: string;
  name?: string;
}

interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
}

// 1. Initialize state from localStorage to persist login across refreshes
const initialState: AuthState = {
  token: localStorage.getItem('token'),
  user: null, // Full user data is usually fetched or stored as JSON
  isAuthenticated: !!localStorage.getItem('token'),
  loading: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // 2. Action to call when login is successful
    setCredentials: (
      state,
      action: PayloadAction<{ user: User; token: string }>
    ) => {
      const { user, token } = action.payload;
      state.user = user;
      state.token = token;
      state.isAuthenticated = true;

      // Sync with localStorage so App.tsx and ProtectedRoutes stay updated
      localStorage.setItem('token', token);
      localStorage.setItem('userRole', user.role);
    },

    // 3. Action to call for Logout
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      
      localStorage.removeItem('token');
      localStorage.removeItem('userRole');
    },

    // 4. (Optional) Action to update user info specifically
    updateUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    }
  },
});

export const { setCredentials, logout, updateUser } = authSlice.actions;
export default authSlice.reducer;