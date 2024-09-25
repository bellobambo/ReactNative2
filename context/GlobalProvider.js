import { createContext, useContext, useState, useEffect } from "react";
import { loadUserSession } from "../lib/appwrite";

const GlobalContext = createContext();
export const useGlobalContext = () => useContext(GlobalContext);

const GlobalProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserSession = async () => {
      const storedUser = await loadUserSession();
      if (storedUser) {
        setIsLoggedIn(true);
        setUser(storedUser);
      } else {
        setIsLoggedIn(false);
        setUser(null);
      }
      setIsLoading(false);
    };

    fetchUserSession();
  }, []);

  return (
    // <GlobalContext.Provider
    //   value={{
    //     isLoggedIn,
    //     setIsLoggedIn,
    //     user,
    //     setUser,
    //     isLoading,
    //   }}
    // >
    <div>{children}</div>
  );
};

export default GlobalProvider;
