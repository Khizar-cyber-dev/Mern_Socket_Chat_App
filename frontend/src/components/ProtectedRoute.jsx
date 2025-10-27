import { useUserStore } from '../store/useUserStore'
import { useNavigate } from 'react-router-dom'
import Loader from './Loader';

const ProtectedRoute = ({ children }) => {
    const navigate = useNavigate();
    const { user, checkingAuth } = useUserStore();
    if (!user) return navigate('/');
    if (checkingAuth) return <div className="h-screen flex items-center justify-center"><Loader /></div>;
  return children
}

export default ProtectedRoute