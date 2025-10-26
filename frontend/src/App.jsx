import { useLayoutEffect } from "react";
import { useUserStore } from "./store/useUserStore";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from "./components/Navbar";
import Form from './components/Form';
import Dashboard from './pages/Dashboard';
import Sidebar from "./components/Sidebar";

const App = () => {
  const { checkAuth, user, checkingAuth, allUsers } = useUserStore();

  useLayoutEffect(() => {
    checkAuth(); 
  }, []);

  useLayoutEffect(() => {
    allUsers();
  },[user])

  if (checkingAuth) {
    return <div>...Checking Authentication</div>;
  }

  return (
    <Router>
      <Navbar />
      <Sidebar />
      <Routes>
        <Route path="/" element={user ? <Dashboard /> : <Form />} />
      </Routes>
    </Router>
  );
};

export default App;