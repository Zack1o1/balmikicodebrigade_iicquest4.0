import api from "./api";

export const sendChatMessage = async (message: string) => {
  const res = await api.post("/ai/chat", { message });
  return res.data;
};
