import { useState, useEffect } from "react";

export const getToken = (): string | null => {
  if (typeof window === "undefined") {
    return null; // Return null if running on the server
  }
  return localStorage.getItem("token");
};

export const useUserSession = () => {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(getToken());

  useEffect(() => {
    const fetchCurrentUser = async () => {
      if (!token) {
        setLoading(false);
        console.log("No token found");
        return;
      }

      try {
        const response = await fetch(
          "https://hudddle-backend.onrender.com/api/v1/auth/me",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          const errorResponse = await response.json();
          throw new Error(`${response.status} - ${errorResponse.message}`);
        }

        const userData = await response.json();
        setCurrentUser(userData);
      } catch (err: any) {
        setError(err.message);
        console.error("Error fetching user data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentUser();
  }, [token]);

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setCurrentUser(null);
  };

  return { currentUser, loading, error, token, logout };
};
