import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/api";

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: "citizen" | "ward" | "admin";
}

interface AuthResponse {
  user: User;
  token: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: JSON.parse(localStorage.getItem("iic_user") || "null"),
  token: localStorage.getItem("iic_token"),
  loading: false,
  error: null,
};

export const loginUser = createAsyncThunk<
  AuthResponse,
  { email: string; password: string }
>("auth/login", async (data, { rejectWithValue }) => {
  try {
    const res = await api.post("/auth/login", data);
    return res.data;
  } catch (err: any) {
    return rejectWithValue(
      err.response?.data?.message || "Login failed"
    );
  }
});

export const registerUser = createAsyncThunk<
  AuthResponse,
  {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phoneNumber?: string;
    role?: "citizen" | "ward" | "admin";
  }
>("auth/register", async (data, { rejectWithValue }) => {
  try {
    const res = await api.post("/auth/register", data);
    return res.data;
  } catch (err: any) {
    return rejectWithValue(
      err.response?.data?.message || "Registration failed"
    );
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      state.error = null;

      localStorage.removeItem("iic_user");
      localStorage.removeItem("iic_token");
    },

    clearError(state) {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // LOGIN
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;

        localStorage.setItem(
          "iic_user",
          JSON.stringify(action.payload.user)
        );
        localStorage.setItem(
          "iic_token",
          action.payload.token
        );
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // REGISTER
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;

        localStorage.setItem(
          "iic_user",
          JSON.stringify(action.payload.user)
        );
        localStorage.setItem(
          "iic_token",
          action.payload.token
        );
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;