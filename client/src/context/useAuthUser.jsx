import { axiosInstance } from "@/lib/axios";
import { createContext, useContext, useEffect, useState } from "react";

const AuthUserContext = createContext(null);

export const AuthUserContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refetch, setRefetch] = useState(null)
  useEffect(() => {
    async function getProfile() {
      try {
        const res = await axiosInstance.get("/profile");
        // console.log(res);
        if (res.data.success) {
          setUser(res.data.user);
        } else {
          setUser(null);
        }
      } catch (error) {
        setUser(null);
        // console.error(error);
      } finally {
        setLoading(false);
      }
    }
    getProfile();
  }, [refetch]);

  return (
    <AuthUserContext value={{ user, loading ,setRefetch}}>{children}</AuthUserContext>
  );
};

export const useAuthUser = () => {
  return useContext(AuthUserContext);
};
