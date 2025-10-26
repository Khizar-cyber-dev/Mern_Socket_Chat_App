import React from 'react'
import { useUserStore } from '../store/useUserStore'

const Sidebar = () => {
    const { AllUsers } = useUserStore();
  return (
    // <div>{AllUsers.map((user) => <p key={user._id}>{user.fullname}</p>)}</div>
    <div>
        
    </div>
  )
}

export default Sidebar