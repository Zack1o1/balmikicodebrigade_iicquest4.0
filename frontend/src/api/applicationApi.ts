import api from "./api";

export const createApplication = async (data: any) => {
  const res = await api.post("/applications", data);
  return res.data;
};

export const getMyApplications = async () => {
  const res = await api.get("/applications/my");
  return res.data;
};

export const getApplication = async (id: string) => {
  const res = await api.get(`/applications/${id}`);
  return res.data;
};

export const updateApplicationStatus = async (
  id: string,
  status: string
) => {
  const res = await api.put(`/applications/${id}/status`, {
    status,
  });

  return res.data;
};