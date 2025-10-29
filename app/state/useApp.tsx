import { createContext, useContext, useState, type ReactNode } from "react";
import { useNavigate } from "react-router";

type AppContextType = {
  // isAuthenticated: boolean;
  userName: string;
  userEmail: string;
  onLogin: (name: string, email: string) => void;
};

const AppContext = createContext<AppContextType | null>(null);
export const useApp = () => useContext(AppContext);

export function AppProvider({ children }: { children: ReactNode }) {
  // const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const navigate = useNavigate();

  const onLogin = (name: string, email: string) => {
    // setIsAuthenticated(true);
    setUserName(name);
    setUserEmail(email);
    console.log("User logged in:", name, email);
    navigate("/dashboard");
  }
  
  return (
    <AppContext.Provider value={{ userName, userEmail, onLogin }}>
      {children}
    </AppContext.Provider>
  );
}
