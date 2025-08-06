import React, {createContext , useEffect , useState} from 'react'
import axiosInstance from '../utils/axiosInstance'
import { API_PATHS } from '../utils/apiPath'

export const UserContext = createContext();

const UserProvider = ({children}) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if(user) {
      setLoading(false);
      return;
    }

    const accessToken = localStorage.getItem('token');
    if (!accessToken) {
      setLoading(false);
      return;
    }

    const fetchUser = async () => {
      try {
        const response = await axiosInstance.get(API_PATHS.AUTH.GET_PROFILE);
        // console.log('Profile response:', response.data);
        
        if(response.data.success) {
          setUser(response.data.user);
        } else {
          setUser(response.data);
        }
      } catch (error) {
        console.error('Failed to fetch user profile:', error);
        clearUser();
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [user]);
  
  const updateUser = (userData) => {
    console.log('Updating user with:', userData);
    setUser(userData);
    if(userData.token) {
      localStorage.setItem('token', userData.token); 
    }
    setLoading(false);
  };

  const clearUser = () => {
    setUser(null);
    localStorage.removeItem('token');
  };

  return (
    <UserContext.Provider value={{ user, loading, updateUser, clearUser }}>
      {children}
    </UserContext.Provider>
  );
}

export default UserProvider;
