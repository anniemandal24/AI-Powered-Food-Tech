const API_BASE = import.meta.env.VITE_API_BASE_URL;

export const apiFetch = async (url, options = {}) => {
  const res = await fetch(`${API_BASE}${url}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    credentials: "include",
  });

  if (!res.ok) {
    throw await res.json();
  }

  return res.json();
};