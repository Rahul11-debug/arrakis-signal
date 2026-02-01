import api from "./axios";

export const createComplaint = async (formData) => {
  const res = await api.post("/complaints", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

export const myComplaints = async () => {
  const res = await api.get("/complaints/me");
  return res.data;
};

export const allComplaints = async () => {
  const res = await api.get("/complaints");
  return res.data;
};  

export const getMySingleComplaint = async (id) => {
  const res = await api.get(`/complaints/${id}`);
  return res.data;
};  

export const updateComplaintStatus = async (id, status) => {
  const res = await api.put(`/complaints/${id}/status`, { status });
  return res.data;
};

export const assignComplaint = async (id, assigneeId) => {
  const res = await api.put(`/complaints/${id}/assign`, { assigneeId });
  return res.data;
}; 

export const deleteComplaint = async (id) => {  
  const res = await api.delete(`/complaints/${id}`);
  return res.data;
};  

export const updatePriority = async (id, priority) => {
  const res = await api.put(`/complaints/${id}/priority`, { priority });
  return res.data;
};

export const generateComplaintReport = async (id) => {
  const res = await api.get(`/complaints/${id}/report`, {
    responseType: 'blob',
  });
  return res.data;
};

export const getComplaintHistory = async (id) => {
  const res = await api.get(`/complaints/${id}/history`);
  return res.data;
};

export const addRemark = async (id, remark) => {
  const res = await api.post(`/complaints/${id}/remarks`, { remark });
  return res.data;
};

export const filterComplaints = async (filters) => {
  const query = new URLSearchParams(filters).toString();
  const res = await api.get(`/complaints/filter?${query}`);
  return res.data.complaints;
};

export const getHeatmapData = async () => {
  const res = await api.get('/complaints/heatmap');
  return res.data;
};

