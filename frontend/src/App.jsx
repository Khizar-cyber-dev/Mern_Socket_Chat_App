import { useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { useUserStore } from "./store/useUserStore";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import Form from "./components/Form";
import Loader from './components/Loader';
import ProtectedRoute from "./components/ProtectedRoute";

const App = () => {
  const { checkAuth, user, checkingAuth, fetchAllUsers } = useUserStore();
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    fetchAllUsers();
  }, []);

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  if (checkingAuth) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <>
      {user ? (
        <div className="flex flex-col h-screen">
          <Navbar />
          <div className="flex flex-1 overflow-hidden">
            <Sidebar />
            <main className="flex-1 overflow-auto p-6 bg-gray-50">
              <Routes>
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </main>
          </div>
        </div>
      ) : (
        <Routes>
          <Route path="/" element={<Form />} />
        </Routes>
      )}
    </>
  );
};

export default App;