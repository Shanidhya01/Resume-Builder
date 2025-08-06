import React from 'react'
import { UserContext } from '../../context/UserContext'
import { useNavigate } from 'react-router-dom'

const ProfileInfoCard = () => {
  const { user, clearUser } = React.useContext(UserContext);
  const navigate = useNavigate();

  // // Add this debug log
  // console.log('ProfileInfoCard - user data:', user);

  const handleLogout = () => {
    localStorage.clear();
    clearUser();
    navigate("/");
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(word => word.charAt(0)).join('').toUpperCase().slice(0, 2);
  };

  if (!user) return null;

  // Add debug for name fields
  // console.log('Name fields:', {
  //   name: user.name,
  //   fullName: user.fullName,
  //   final: user.fullName || user.name
  // });

  return (
    <div className='flex items-center gap-3'>
      {/* Profile Image/Avatar */}
      <div className='relative'>
        {user.profileImageUrl ? (
          <img
            src={user.profileImageUrl}
            alt='Profile'
            className='w-10 h-10 rounded-full object-cover border-2 border-gray-200'
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
        ) : null}
        
        <div 
          className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm bg-purple-500 ${
            user.profileImageUrl ? 'hidden' : 'flex'
          }`}
        >
          {getInitials(user.fullName || user.name)}
        </div>
      </div>

      {/* User Info */}
      <div className='flex flex-col'>
        <span className='text-sm font-semibold text-gray-900 leading-tight'>
          {user.fullName || user.name || "User"}
        </span>
        <button
          className='text-purple-500 text-xs font-medium cursor-pointer hover:underline text-left'
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </div>
  )
}

export default ProfileInfoCard;
