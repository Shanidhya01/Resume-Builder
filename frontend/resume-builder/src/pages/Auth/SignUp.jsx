import React from 'react'
import { useNavigate } from 'react-router-dom';
import { validEmail } from '../../utils/helper';
import Input from '../../components/Inputs/Input';
import ProfilePhotoSelector from '../../components/Inputs/ProfilePhotoSelector';

const SignUp = ( {setCurrentPage}) => {
  const [profilePic, setProfilePic] = React.useState(null);
  const [fullName, setFullName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  const [error, setError] = React.useState('');

  const navigate = useNavigate();

  //Handle signup
  const handleSignUp = async (e) => {
    e.preventDefault();
    let profileImageUrl = '';

    if (!fullName || !email || !password) {
      setError('Please fill in all fields');
      return;
    }
    if (!validEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    setError('');

    //Signup API call
    try {

    } catch (error) {

    }

  };

  return (
    <div className='w-[90vw] md:w-[33vw] p-7 flex flex-col justify-center'>
      <h3 className='text-lg font-semibold text-black'>Create an Account</h3>
      <p className='text-xs text-slate-700 mt-[5px] mb-6'>
        Please fill in the details below to create your account.
      </p>

      <form onSubmit={handleSignUp}>

        <ProfilePhotoSelector image={profilePic} setImage={setProfilePic} />

        <div className='grid grid-cols-1 md:grid-cols-1 gap-2'>
          <Input
            value={fullName}
            onChange={({target}) => setFullName(target.value)}
            label='Full Name'
            type='text'
            placeholder='Enter your full name'
          />
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
        </div>

        {error && <p className='text-red-500 text-xs pb-2.5'>{error}</p>}

        <button type='submit' className='btn-primary'>
          SIGN UP
        </button>

        <p className='text-[13px] text-slate-800 mt-3'>
          Already have an account?{" "}
          <button
            className='font-medium text-[#9328E7] underline cursor-pointer'
            onClick={() => {
              setCurrentPage('login');
            }}
          >
            Login
          </button>
        </p>
      </form>
    </div>
  )
}

export default SignUp
