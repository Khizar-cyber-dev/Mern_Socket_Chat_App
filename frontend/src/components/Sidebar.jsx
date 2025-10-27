import { useUserStore } from '../store/useUserStore';

const Sidebar = () => {
    const { allUsersData } = useUserStore();
  return (
    <div>{allUsersData.map((user) => <p key={user._id}>{user.fullname}</p>)}</div>
  )
}

export default Sidebar