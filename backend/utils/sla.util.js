export const isSlaBreached = (complaint) => {
  if (!complaint.slaDeadline) return false;
  if (["resolved", "closed"].includes(complaint.status)) return false;

  return new Date() > new Date(complaint.slaDeadline);
};
