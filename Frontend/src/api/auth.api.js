import axios from "axios";

const API = "http://localhost:5000/api/auth";

export const registerUser = (data) =>
  axios.post(`${API}/register`, data);

export const verifyOtp = (data) =>
  axios.post(`${API}/otp/verify`, data);

export const loginUser = (data) =>
  axios.post(`${API}/login`, data);

export const forgotPassword = (email) =>
  axios.post(`${API}/password/forgot`, { email });

export const resetPassword = (data) =>
  axios.post(`${API}/password/reset`, data);

export const resendOtp = (email) => {
  axios.post(`${API}/register`, { email });
};