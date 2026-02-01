
import api from "./axios"

export const registerUser = (data) =>
 api.post("api/auth/register", data);

export const verifyOtp = (data) =>
  api.post("api/otp/verify", data);

export const loginUser = (data) =>
  api.post("api/auth/login", data,
    { withCredentials: true,
    }
  );

export const getMe = () => {
  const token = localStorage.getItem("token");
  return api.get("api/auth/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const forgotPassword = (email) =>
  api.post(`api/password/forgot`, { email });

export const resetPassword = ({ token, password }) => {
  return api.post('api/password/reset/${token}', { password });
};

export const resendOtp = (email) => {
  api.post("api/otp/resend", { email });
};

export const changePassword = (data) =>
  api.put('api/password/change/${data.token}', data);

export const logout = () => {
  api.post("api/auth/logout", {}, {
    withCredentials: true,
  });
};