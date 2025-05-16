import React, { createContext, useContext } from "react";
import { useUserSession } from "./useUserSession";

// Define the type for the UserSessionContext
interface UserSessionContextType {
  currentUser: any;
  loading: boolean;
  error: string | null;
  token: string | null;
  logout: () => void;
}

// Create the context with a default value of null
const CreateUserSessionContext = createContext<UserSessionContextType | null>({
  currentUser: null,
  loading: true,
  error: null,
  token: null,
  logout: () => {},
});

// Define the provider component
export const UserSessionProvider: React.FC<{ children: React.ReactNode }> = (
  props
) => {
  const userSession = useUserSession();

  return (
    <CreateUserSessionContext.Provider value={userSession}>
      {props.children}
    </CreateUserSessionContext.Provider>
  );
};

// Define the custom hook to use the context
export const useUserSessionContext = () => {
  const context = useContext(CreateUserSessionContext);
  console.log(context);
  if (!context) {
    throw new Error(
      "useUserSessionContext must be used within a UserSessionProvider"
    );
  }
  return context;
};
