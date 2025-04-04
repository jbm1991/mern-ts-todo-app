import { useAuth } from "../context/AuthContext";

export const useAuthFetch = () => {
  const token = useAuth();

  return async (url: string, options: RequestInit = {}) => {
    const headers = {
      ...options.headers,
      Authorization: `Bearer ${token}`,
      ContentType: "application/json",
    };

    const res = await fetch(url, {
      ...options,
      headers,
    });
    return res;
  };
};
