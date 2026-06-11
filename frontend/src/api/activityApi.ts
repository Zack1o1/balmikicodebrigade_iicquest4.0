import api from "./api";

export const getMyActivities = async () => {
  const res = await api.get("/activities/my");
  return res.data;
};

export const getAllActivities = async () => {
  const res = await api.get("/activities/all");
  return res.data;
};

export const logActivity = async (data: {
  activityType: string;
  description: string;
  application?: string;
  metadata?: any;
}) => {
  const res = await api.post("/activities", data);
  return res.data;
};
