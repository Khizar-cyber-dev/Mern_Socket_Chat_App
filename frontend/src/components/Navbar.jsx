import { useNavigate } from "react-router-dom";
import { useUserStore } from "../store/useUserStore";

const Navbar = () => {
    const { user, logOut } = useUserStore();
    const navigate = useNavigate();
    
    const getUserInitials = () => {
        if (user?.username) {
            return user.username.charAt(0).toUpperCase();
        }
        return "U";
    };

    const handleLogout = async () => {
        await logOut();
        navigate("/");
    };

    return (
        <div className='flex justify-between items-center mx-4 py-4 border-b border-gray-200'>
            <div className='flex items-center gap-3'>
                <div className='w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center'>
                    <span className='text-white font-bold text-lg'>C</span>
                </div>
                <h1 className='text-xl font-bold text-gray-800'>ChatApp</h1>
            </div>

            <div className='flex items-center gap-4'>
                {user && (
                    <>
                        <div className='text-right hidden md:block'>
                            <p className='font-medium text-gray-800'>{user.username}</p>
                            <p className='text-sm text-gray-500'>{user.email}</p>
                        </div>
                        
                        <div className="relative group">
                            <div className='w-12 h-12 bg-gradient-to-r from-orange-400 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg cursor-pointer hover:shadow-xl transition-all duration-300'>
                                {getUserInitials()}
                            </div>
                            
                            <div className="absolute right-0 top-14 w-48 bg-white rounded-lg shadow-xl border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                                <div className="p-3 border-b border-gray-100">
                                    <p className="font-medium text-gray-800">{user.username}</p>
                                    <p className="text-sm text-gray-500 truncate">{user.email}</p>
                                </div>
                                
                                <button 
                                    onClick={handleLogout}
                                    className="w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 transition-colors duration-200 rounded-b-lg"
                                >
                                    🚪 Logout
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}

export default Navbar;