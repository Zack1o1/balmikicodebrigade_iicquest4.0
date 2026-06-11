import api from "./api";

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber: string;
  role?: "citizen" | "ward" | "admin";
  province?: string;
  district?: string;
  municipality?: string;
  wardNo?: number;
  address?: string;
}

export const login = async (credentials: LoginData) => {
  const res = await api.post("/auth/login", credentials);
  return res.data;
};

export const register = async (data: RegisterData) => {
  const res = await api.post("/auth/register", data);
  return res.data;
};

// JWT logout is usually frontend only
export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};