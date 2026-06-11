import api from "./api";

export const getProfile = async () => {
  const res = await api.get("/users/profile");
  return res.data;
};

export const updateProfile = async (data: any) => {
  const res = await api.put("/users/profile", data);
  return res.data;
};

export const getUsers = async (role?: string) => {
  const url = role ? `/users?role=${role}` : "/users";
  const res = await api.get(url);
  return res.data;
};

export const createUser = async (data: any) => {
  const res = await api.post("/users", data);
  return res.data;
};

export const deleteUser = async (id: string) => {
  const res = await api.delete(`/users/${id}`);
  return res.data;
};