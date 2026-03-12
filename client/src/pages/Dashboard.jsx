import AdminTable from "@/components/AdminTable";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import UpdateModal from "@/components/UpdateModal";
import { useAuthUser } from "@/context/useAuthUser";
import useAllUsers from "@/hooks/useAllUsers";
import { axiosInstance } from "@/lib/axios";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Dashboard = () => {
  const { user } = useAuthUser();
  const navigate = useNavigate();
  const { data, loading ,setRefetch} = useAllUsers();
  async function handleLogout() {
    try {
      const res = await axiosInstance.get("/logout");
      if (res.data.success) {
        toast.success(res.data.message);
        navigate("/auth/login");
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  }
   async function handleDelete(id) {
    try {
      const res = await axiosInstance.delete(`/delete-user/${id}`);
      if (res.data.success) {
        toast.success(res.data.message);
        setRefetch(true);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  }

  return (
    <div className="max-w-7xl px-4 mx-auto flex flex-col items-center gap-12 py-12">
      <h1 className="text-5xl font-semibold">{user?.isAdmin ? "Admin" : "User"} profile</h1>
      <div className="space-y-4">
        <h1 className="text-3xl font-semibold">Name: {user.name}</h1>
        <h2 className="text-2xl font-semibold">Email: {user.email}</h2>
        <div className="flex gap-2">
          <Button variant="destructive" onClick={handleLogout}>
            Logout
          </Button>
          <UpdateModal />
        </div>
      </div>
      {user.isAdmin && (
        <div className="w-full">
          <h2 className="text-2xl font-semibold text-accent-foreground mb-4">
            All Users Table - For Admin
          </h2>
          {loading ? (
            <div className="w-full flex justify-center py-12">
              <Spinner />
            </div>
          ) : (
            <AdminTable data={data} handleDelete={handleDelete}/>
          )}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
