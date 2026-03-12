import { useAuthUser } from "@/context/useAuthUser";
import { Navigate } from "react-router-dom";
import { Spinner } from "./ui/spinner";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuthUser();

  if (loading) {
    return (
      <div className="flex items-center justify-center w-full h-screen">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }
  if (!user) {
    return <Navigate to="/auth/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
