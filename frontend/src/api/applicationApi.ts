import api from "./api";

export const createApplication = async (data: any) => {
  const res = await api.post("/applications", data);
  return res.data;
};

export const getMyApplications = async () => {
  const res = await api.get("/applications/my");
  return res.data;
};

export const getAllApplications = async () => {
  const res = await api.get("/applications/all");
  return res.data;
};

export const getApplication = async (id: string) => {
  const res = await api.get(`/applications/${id}`);
  return res.data;
};

export const trackApplicationById = async (applicationId: string) => {
  const res = await api.get(`/applications/track/${applicationId}`);
  return res.data;
};

export const updateApplicationStatus = async (id: string, status: string, note?: string) => {
  const res = await api.put(`/applications/${id}/status`, { status, note });
  return res.data;
};

export const approveApplication = async (id: string, note?: string) => {
  const res = await api.put(`/applications/${id}/approve`, { note });
  return res.data;
};

export const rejectApplication = async (id: string, note?: string) => {
  const res = await api.put(`/applications/${id}/reject`, { note });
  return res.data;
};

export const requestMissingDocuments = async (id: string, missingDocs: string[], note?: string) => {
  const res = await api.put(`/applications/${id}/request-documents`, { missingDocs, note });
  return res.data;
};

export const uploadRequestedDocument = async (id: string, documentName: string, fileUrl: string) => {
  const res = await api.put(`/applications/${id}/upload-requested-document`, { documentName, fileUrl });
  return res.data;
};

export const uploadAdditionalDocuments = async (id: string, documents: { name: string; fileUrl: string }[]) => {
  const res = await api.put(`/applications/${id}/upload-additional`, { documents });
  return res.data;
};
