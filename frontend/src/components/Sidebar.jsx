import { useUserStore } from '../store/useUserStore';
import { useState } from 'react';

const Sidebar = () => {
    const { allUsersData } = useUserStore();
    const [activeTab, setActiveTab] = useState('chat');

    return (
        <div className="w-80 h-screen bg-white text-gray-800 flex flex-col border-r border-gray-200">
            <div className="p-4 border-b border-gray-200">
                <div className="flex space-x-2 bg-gray-100 rounded-lg p-1">
                    <button
                        className={`flex-1 py-2 px-4 rounded-md transition-all duration-200 font-medium ${
                            activeTab === 'chat' 
                                ? 'bg-blue-500 text-white shadow-sm' 
                                : 'hover:bg-gray-200 text-gray-700'
                        }`}
                        onClick={() => setActiveTab('chat')}
                    >
                        💬 Chat
                    </button>
                    <button
                        className={`flex-1 py-2 px-4 rounded-md transition-all duration-200 font-medium ${
                            activeTab === 'contact' 
                                ? 'bg-blue-500 text-white shadow-sm' 
                                : 'hover:bg-gray-200 text-gray-700'
                        }`}
                        onClick={() => setActiveTab('contact')}
                    >
                        👥 Contacts
                    </button>
                </div>
            </div>

            <div className="p-4 border-b border-gray-200">
                <div className="relative">
                    <input
                        type="text"
                        placeholder={`Search ${activeTab === 'chat' ? 'chats' : 'contacts'}...`}
                        className="w-full bg-gray-50 text-gray-800 px-4 py-2 rounded-lg pl-10 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:bg-white border border-gray-200"
                    />
                    <div className="absolute left-3 top-2.5 text-gray-500">
                        🔍
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto">
                {activeTab === 'chat' ? (
                    <div className="p-2">
                        <h3 className="text-sm font-semibold text-gray-500 px-3 py-2">
                            Recent Chats
                        </h3>
                        <div className="text-gray-500 text-center py-8">
                            No recent chats
                        </div>
                    </div>
                ) : (
                    <div className="p-2">
                        <h3 className="text-sm font-semibold text-gray-500 px-3 py-2">
                            All Contacts ({allUsersData.length})
                        </h3>
                        <div className="space-y-1">
                            {allUsersData.map((user) => (
                                <div
                                    key={user._id}
                                    className="flex items-center p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors duration-150 border border-transparent hover:border-gray-200"
                                >
                                    <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-semibold mr-3">
                                        {user.fullname.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-800">{user.fullname}</p>
                                        <p className="text-xs text-gray-500">Online</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <div className="p-4 border-t border-gray-200 bg-gray-50">
                <div className="flex items-center">
                    <div className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center font-semibold mr-3">
                        Y
                    </div>
                    <div className="flex-1">
                        <p className="font-medium text-sm text-gray-800">Your Name</p>
                        <p className="text-xs text-gray-500">Active now</p>
                    </div>
                    <button className="text-gray-500 hover:text-gray-700 p-2 rounded-lg hover:bg-gray-200 transition-colors">
                        ⚙️
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;