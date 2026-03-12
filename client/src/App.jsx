import { Route, Routes } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Register from "./pages/Register";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import { AuthUserContextProvider } from "./context/useAuthUser";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Routes>
      <Route path="/auth/register" element={<Register />} />
      <Route path="/auth/login" element={<Login />} />
      <Route
        path="/"
        element={
          <AuthUserContextProvider>
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          </AuthUserContextProvider>
        }
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
