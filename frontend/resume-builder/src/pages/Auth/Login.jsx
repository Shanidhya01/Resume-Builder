import React from 'react'
import { useNavigate } from 'react-router-dom';
import Input from '../../components/Inputs/Input';
import { validEmail } from '../../utils/helper';
import { UserContext } from '../../context/UserContext';
import axiosInstance from '../../utils/axiosInstance'; // Remove destructuring
import { API_PATHS } from '../../utils/apiPath';

const Login = ({setCurrentPage}) => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const {updateUser} = React.useContext(UserContext);
  const navigate = useNavigate();

  // Handle login
  const handleLogin = async (e) => {
    e.preventDefault();

    if(!validEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }
    
    if(!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    if(password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, { 
        email, 
        password 
      });
      
      console.log('Login response:', response.data); // Debug
      
      // Fix: Extract user data properly from backend response
      if(response.data.success && response.data.user) {
        const userData = response.data.user;
        updateUser(userData); // Pass the full user object
        navigate('/dashboard');
      } else {
        setError('Login failed. Please check your credentials.');
      }
    } catch (error) {
      console.error('Login error:', error);
      if(error.response && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError('An error occurred while logging in. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='w-[90vw] md:w-[33vw] p-7 flex flex-col justify-center'>
      <h3 className='text-lg font-semibold text-black'>Welcome Back</h3>
      <p className='text-xs text-slate-700 mt-[5px] mb-6'>
        Please enter your credentials to log in.
      </p>
      
      <form onSubmit={handleLogin}>
        <Input
          value={email}
          onChange={({target}) => setEmail(target.value)}
          label='Email Address'
          type='email'
          placeholder='Enter your email'
        />

        <Input
          value={password}
          onChange={({target}) => setPassword(target.value)}
          label='Password'
          type='password'
          placeholder='Enter your password (Min 8 characters)'
        />

        {error && <p className='text-red-500 text-xs pb-2.5'>{error}</p>}

        <button type='submit' className='btn-primary' disabled={loading}>
          {loading ? 'LOGGING IN...' : 'LOGIN'}
        </button>

        <p className='text-[13px] text-slate-800 mt-3'>
          Don't have an account? {" "}
          <button
            type="button"
            className='font-medium text-[#9328E7] underline cursor-pointer'
            onClick={() => setCurrentPage('signup')}
          >
            Sign Up
          </button>
        </p>
      </form>
    </div>
  )
}

export default Login
