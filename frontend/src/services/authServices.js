import api from "../lib/axios";

export const register = async (username, email, password) => {
  const response = await api.post("/auth/register", {
    username,
    email,
    password,
  });
  return response.data;
};

export const login = async (loginId, password) => {
  // backend accepts username or email. We will just pass both to API relying on backend's $or logic
  const isEmail = loginId.includes("@");
  const payload = isEmail
    ? { email: loginId, password }
    : { username: loginId, password };

  const response = await api.post("/auth/login", payload);
  return response.data;
};

export const logout = async () => {
  const response = await api.post("/auth/logout");
  return response.data;
};
