import api from "./api";

export const getCitizenDashboard = async () => {
  const res = await api.get("/dashboard/citizen");
  return res.data;
};

export const getWardDashboard = async () => {
  const res = await api.get("/dashboard/ward");
  return res.data;
};

export const getAdminDashboard = async () => {
  const res = await api.get("/dashboard/admin");
  return res.data;
};