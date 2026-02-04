import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

interface UserContextType {
  username: string;
  setUsername: (username: string) => void;
  isLoggedIn: boolean;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const STORAGE_KEY = 'codeleap_username';

export function UserProvider({ children }: { children: ReactNode }) {
  const [username, setUsernameState] = useState<string>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored || '';
  });

  const setUsername = (newUsername: string) => {
    setUsernameState(newUsername);
    localStorage.setItem(STORAGE_KEY, newUsername);
  };

  const logout = () => {
    setUsernameState('');
    localStorage.removeItem(STORAGE_KEY);
  };

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setUsernameState(stored);
    }
  }, []);

  return (
    <UserContext.Provider
      value={{
        username,
        setUsername,
        isLoggedIn: username.length > 0,
        logout,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
