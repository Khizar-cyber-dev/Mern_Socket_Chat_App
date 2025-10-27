import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useUserStore } from "./store/useUserStore";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import Form from "./components/Form";
import Loader from './components/Loader';

const App = () => {
  const { checkAuth, user, checkingAuth, fetchAllUsers, allUsersData } = useUserStore();

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
      fetchAllUsers();
  }, []);

  if (checkingAuth) return <div className="h-screen flex items-center justify-center"><Loader /></div>;

  return (
    <Router>
      {user && <Navbar />}
      {user && <Sidebar />}

      <Routes>
         <Route
          path="/"
          element={user ? <Dashboard /> : <Form />}
        />
      </Routes>
    </Router>
  );
};

export default App;
