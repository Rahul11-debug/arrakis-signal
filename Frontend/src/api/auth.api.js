import axios from "axios";

const API = import.meta.env.VITE_API_URL;

export const registerUser = (data) =>
  axios.post(`${API}/auth/register`, data);

export const verifyOtp = (data) =>
  axios.post(`${API}/otp/verify`, data);

export const loginUser = (data) =>
  axios.post(`${API}/auth/login`, data,
    { withCredentials: true,
    }
  );

export const getMe = () => {
  const token = localStorage.getItem("token");
  return axios.get(`${API}/auth/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const forgotPassword = (email) =>
  axios.post(`${API}/password/forgot`, { email });

export const resetPassword = ({ token, password }) => {
  return axios.post(`${API}/password/reset/${token}`, { password });
};

export const resendOtp = (email) => {
  axios.post(`${API}/otp/resend`, { email });
};

export const changePassword = (data) =>
  axios.put(`${API}/password/change/${data.token}`, data);

export const logout = () => {
  axios.post(`${API}/auth/logout`, {}, {
    withCredentials: true,
  });
};