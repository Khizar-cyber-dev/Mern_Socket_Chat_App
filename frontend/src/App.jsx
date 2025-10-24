import { useEffect } from 'react';
import Form from './components/Form';
import { useUserStore } from './store/useUserStore';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';

export const App = () => {
  const { checkAuth, user, checkingAuth } = useUserStore();
  useEffect(() => {
    checkAuth()
  },[checkAuth])

  if(checkingAuth) return "...Loading";
  return (
     <Router>
      <Routes>
        <Route path='/' element={user ? <Dashboard /> : <Form />}/>
      </Routes>
     </Router>
  )
}

export default App