import React from 'react'
import { useNavigate } from 'react-router-dom';
import Input from '../../components/Inputs/Input';

const Login = ({setCurrentPage}) => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState('');

  const navigate = useNavigate();

  //Handle login
  const handleLogin = async (e) => {};

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
            label='Email'
            type='email'
            placeholder='Enter your email'
          />
          {error && <p className='text-red-500 text-xs pb-2.5'>{error}</p>}

          <button type='submit' className='btn-primary'>
            LOGIN
          </button>

          <p className='text-[13px] text-slate-800 mt-3'>
            Don't have an account? {" "}
            <button
              className='font-medium text-primary underline cursor-pointer'
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
