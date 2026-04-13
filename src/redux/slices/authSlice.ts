import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

// LOGIQUE ASYNCHRONE (Thunk)
export const logoutUser = () => async (dispatch: any) => {
  try {
    // Appel API pour supprimer le cookie HttpOnly
    await axios.post('http://localhost:5000/api/auth/logout', {}, { withCredentials: true });
    // Une fois l'API OK, on nettoie le store Redux localement
    dispatch(logout());
  } catch (error: any) {
    console.error("Erreur lors du logout API:", error.response?.data);
    // Même en cas d'erreur API, on déconnecte souvent l'utilisateur localement
    dispatch(logout());
  }
};

interface User {
  id: string;
  email: string;
  role: "vendeur" | "acheteur" | "prestataire" | "admin";
  firstName?: string;
  lastName?: string;
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
      state.isInitialLoading = false;
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
    updateUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    }
  },
});

export const { setCredentials, logout, setAuthFailed, updateUser } = authSlice.actions;
export default authSlice.reducer;