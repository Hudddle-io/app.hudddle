import React, { createContext, useContext } from 'react';
import { useUserSession } from './useUserSession';

const UserSessionContext = createContext<ReturnType<typeof useUserSession> | null>(null);

export const UserSessionProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const userSession = useUserSession();

  return (
    <UserSessionContext.Provider value={userSession}>
      {children}
    </UserSessionContext.Provider>
  );
};

export const useUserSessionContext = () => {
  const context = useContext(UserSessionContext);
  if (!context) {
    throw new Error('useUserSessionContext must be used within a UserSessionProvider');
  }
  return context;
};