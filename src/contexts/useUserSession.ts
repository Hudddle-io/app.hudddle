// @/contexts/useUserSession.ts
import { backendUri } from "@/lib/config";
import { useState, useEffect, useCallback } from "react"; // Import useCallback

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

  // Memoize the logout function to prevent unnecessary re-renders in consumers
  const logout = useCallback(() => {
    localStorage.removeItem("token");
    setToken(null); // Clear token state
    setCurrentUser(null); // Clear user data state
    console.log("User logged out.");
  }, []); // No dependencies, so it's stable

  // Memoize the fetchCurrentUser function to prevent unnecessary re-creations
  const fetchCurrentUser = useCallback(async () => {
    // Only proceed if a token exists. If token is null, just set loading to false.
    if (!token) {
      setLoading(false);
      setCurrentUser(null); // Ensure currentUser is null if no token
      console.log("No token found, skipping user data fetch.");
      return;
    }

    setLoading(true); // Set loading true before fetch starts
    setError(null);   // Clear previous errors

    try {
      const response = await fetch(`${backendUri}/api/v1/auth/me`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      // Handle unauthorized specifically, e.g., if token is invalid or expired
      if (response.status === 401) {
        console.warn("Unauthorized: Token might be invalid or expired. Logging out.");
        logout(); // Call the memoized logout function
        return; // Exit early after logout
      }

      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(`${response.status} - ${errorResponse.message}`);
      }

      const userData = await response.json();
      setCurrentUser(userData);
      console.log("User data fetched:", userData);
    } catch (err: any) {
      setError(err.message);
      console.error("Error fetching user data:", err);
      setCurrentUser(null); // Ensure currentUser is null on error
    } finally {
      setLoading(false);
    }
  }, [token, logout]); // Dependencies: token (to re-run when token changes) and logout (because it's called inside)

  // Initial fetch of user data when the component mounts or token changes
  useEffect(() => {
    fetchCurrentUser();
  }, [fetchCurrentUser]); // Dependency on the memoized fetchCurrentUser function

  // Expose fetchCurrentUser as refreshUser for external calls
  return { currentUser, loading, error, token, logout, refreshUser: fetchCurrentUser };
};
