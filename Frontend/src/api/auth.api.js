
import api from "./axios"

export const registerUser = (data) =>
 api.post("auth/register", data);

export const verifyOtp = (data) =>
  api.post("otp/verify", data);

export const loginUser = (data) =>
  api.post("auth/login", data,
    { withCredentials: true,
    }
  );

export const getMe = () => {
  const token = localStorage.getItem("token");
  return api.get("auth/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const forgotPassword = (email) =>
  api.post(`password/forgot`, { email });

export const resetPassword = ({ token, password }) => {
  api.post('password/reset/${token}', { password });
};

export const resendOtp = (email) => {
  api.post("otp/resend", { email });
};

export const changePassword = (data) =>
  api.put('password/change/${data.token}', data);

export const logout = () => {
  api.post("auth/logout", {}, {
    withCredentials: true,
  });
};