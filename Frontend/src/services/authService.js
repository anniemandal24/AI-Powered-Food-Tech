import { apiFetch } from "./api";

export const signupUser = (data) => {
  return apiFetch("/api/v1/auth/signup", {
    method: "POST",
    body: JSON.stringify(data),
  });
};

export const loginUser = (data) => {
  return apiFetch("/api/v1/auth/login", {
    method: "POST",
    body: JSON.stringify(data),
  });
};

export const logoutUser = () => {
  return apiFetch("/api/v1/auth/logout", {
    method: "POST",
  });
};

export const getCurrentUser = () => {
  return apiFetch("api/v1/users/me", {//
    method: "GET",
  });
};