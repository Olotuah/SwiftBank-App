// src/services/adminTransferService.js
import api from "../utils/api";

// GET pending transfers
export const fetchPendingTransfers = async () => {
  const res = await api.get("/transfers/pending");
  return res.data;
};

// Approve transfer
export const approveTransfer = async (id) => {
  const res = await api.post(`/transfers/${id}/approve`);
  return res.data;
};

// Reject transfer
export const rejectTransfer = async (id, reason) => {
  const res = await api.post(`/transfers/${id}/reject`, { reason });
  return res.data;
};
