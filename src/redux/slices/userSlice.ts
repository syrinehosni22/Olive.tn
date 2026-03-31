import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// 1. THE TYPE DEFINITION (The "Shape" of your data)
interface UserState {
  id:string,
  userInfo: any | null; // This will hold your Mongoose object
  role: "vendeur" | "acheteur" | "prestataire" | null;
  planId: string;
  isAuthenticated: boolean;
  loading: boolean;
}

// 2. THE INITIAL STATE (The "Starting Point")
const initialState: UserState = {
  id:"",
  userInfo: null,
  role: null,
  planId: "free",
  isAuthenticated: false,
  loading: false,
};

// 3. THE SLICE (The "Logic")
export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // This function acts as the "Reducer"
    loginSuccess: (state, action: PayloadAction<any>) => {
      console.log("payload",action.payload)
      state.userInfo = action.payload;
      state.id = action.payload.id;
      state.role = action.payload.role;
      state.planId = action.payload.planId;
      state.isAuthenticated = true;
      state.loading = false;
    },
    // This function updates only the membership
    updatePlan: (state, action: PayloadAction<string>) => {
      state.planId = action.payload;
      if (state.userInfo) state.userInfo.planId = action.payload;
    },
    logoutUser: (state) => {
      return initialState; // Resets everything to null/false
    }
  }
});

// 4. THE EXPORTS (The "Tools" for the rest of your app)
// These are the "Actions" you will call in your components
export const { loginSuccess, updatePlan, logoutUser } = userSlice.actions;

// This is the "Reducer" you will put in your combineReducers
export default userSlice.reducer;