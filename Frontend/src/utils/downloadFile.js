import api from "../api/axios";

export const downloadReport = async (id) => {
  if (!id) {
    alert("Complaint ID missing");
    return;
  }

  const res = await api.get(`/complaints/${id}/report`, {
    responseType: "blob",
  });

  const blob = new Blob([res.data], {
    type: "application/pdf",
  });

  const url = window.URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = `complaint-${id}.pdf`;
  document.body.appendChild(link);
  link.click();
  link.remove();

  window.URL.revokeObjectURL(url);
};
