import { createContext, useContext, useState, type ReactNode } from "react";

type AppContextType = {
  userName: string;
  userEmail: string;
  userAvatar: string;
  onLogin: (user: { name: string; email: string; avatar: string }) => void;
  onLogout: () => void;
  setUserName: (name: string) => void;
  setUserAvatar: (avatar: string) => void;
};

const AppContext = createContext<AppContextType | null>(null);
export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};

export function AppProvider({ children }: { children: ReactNode }) {
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userAvatar, setUserAvatar] = useState("");

  const onLogin = (user: { name: string; email: string; avatar: string; }) => {
    const { name, email, avatar } = user;
    setUserName(name);
    setUserEmail(email);
    setUserAvatar(avatar);
    console.log("User logged in:", user);
  }

  const onLogout = () => {
    setUserName("");
    setUserEmail("");
    setUserAvatar("");
  }
  
  return (
    <AppContext.Provider value={{ userName, userEmail, userAvatar, onLogin, onLogout, setUserName, setUserAvatar }}>
      {children}
    </AppContext.Provider>
  );
}
