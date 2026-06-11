import api from "./api";

export const getServices = async () => {
  const res = await api.get("/services");
  return res.data;
};

export const getService = async (id: string) => {
  const res = await api.get(`/services/${id}`);
  return res.data;
};