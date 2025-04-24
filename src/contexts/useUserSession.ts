import { useState, useEffect } from 'react';

// Assuming you have a getToken function somewhere
export const getToken = (): string | null => {
  return localStorage.getItem('token'); // or your token retrieval logic
};

export const useUserSession = () => {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = getToken();
    setToken(storedToken);
  }, []);

  useEffect(() => {
    const getCurrentUser = async () => {
      const storedToken = getToken();
      setToken(storedToken);

      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const response = await fetch("http://127.0.0.1:8000/api/v1/auth/me", {
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
      } finally {
        setLoading(false);
      }
    };
    getCurrentUser();
  }, [token]);

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  return { currentUser, loading, error, token, logout };
};