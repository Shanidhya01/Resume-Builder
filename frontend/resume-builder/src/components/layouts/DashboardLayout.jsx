import React from 'react'
import { UserContext } from '../../context/UserContext';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPath';
import Navbar from './Navbar';

const DashboardLayout = ({activeMenu, children}) => {
  const { user } = React.useContext(UserContext); 

  return (
    <div>
      <Navbar activeMenu={activeMenu} />

      {user && <div className='container mx-auto pt-4 pb-4'>{children}</div>}
    </div>
  )
}

export default DashboardLayout
