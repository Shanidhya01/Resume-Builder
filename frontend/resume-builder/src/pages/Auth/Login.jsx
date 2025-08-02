import React from 'react'
import { useNavigate } from 'react-router-dom';
import Input from '../../components/Inputs/Input';
import { validEmail } from '../../utils/helper';

const Login = ({setCurrentPage}) => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState('');

  const navigate = useNavigate();

  //Handle login
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

    //Login API call
    try {
      
    } catch (error) {
      
    }

  };

  return (
    <>
      <div className='w-[90vw] md:w-[33vw] p-7 flex flex-col justify-center'>
        <h3 className='text-lg font-semibold text-black'>Welcome Back</h3>
        <p className='text-xs text-slate-700 mt-[5px] mb-6'>
          Please enter your credentials to log in.
        </p>
        <form onSubmit={handleLogin} >

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
            placeholder='Enter your password(Min 8 characters)'
          />

          
          {error && <p className='text-red-500 text-xs pb-2.5'>{error}</p>}

          <button type='submit' className='btn-primary'>
            LOGIN
          </button>

          <p className='text-[13px] text-slate-800 mt-3'>
            Don't have an account? {" "}
            <button
              className='font-medium text-[#9328E7] underline cursor-pointer'
              onClick={ () => {
                setCurrentPage('signup');
              }}
            >
              Sign Up
            </button>
          </p>
        </form>
      </div>
    </>
  )
}

export default Login
