import { useAuthUser } from "@/context/useAuthUser";
import { axiosInstance } from "@/lib/axios";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

const useAllUsers = () => {
  const { user } = useAuthUser();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refetch, setRefetch] = useState(null)
  useEffect(() => {
    if (!user.isAdmin) return;
    async function getAllUsers() {
      setLoading(true);
      try {
        const res = await axiosInstance.get("/all-users");
        if (res.data.success) {
          setData(res.data.users);
        } else {
          setData([]);
        }
      } catch (error) {
        setData([]);
        console.log("use All Users", error);
        toast.error(error.response.data.message);
      } finally {
        setLoading(false);
      }
    }
    getAllUsers();
  }, [user.isAdmin,refetch]);

  return { data, loading,setRefetch };
};

export default useAllUsers;
