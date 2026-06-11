import api from "./api";

export const getProfile = async () => {
  const res = await api.get("/users/profile");
  return res.data;
};

export const updateProfile = async (data: any) => {
  const res = await api.put("/users/profile", data);
  return res.data;
};

export const getUsers = async () => {
  const res = await api.get("/users");
  return res.data;
};