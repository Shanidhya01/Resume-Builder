import React from 'react'
import { useNavigate } from 'react-router-dom';
import Input from '../../components/Inputs/Input';
import { validEmail } from '../../utils/helper';
import { UserContext } from '../../context/UserContext';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPath';
import ProfilePhotoSelector from '../../components/Inputs/ProfilePhotoSelector';

const SignUp = ({ setCurrentPage }) => {
  const [fullName, setFullName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [profileImage, setProfileImage] = React.useState(null); // File object
  const [profilePreview, setProfilePreview] = React.useState(null); // Preview URL
  const [error, setError] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const { updateUser } = React.useContext(UserContext);
  const navigate = useNavigate();

  // Function to upload image first, then register user
  const uploadImageFirst = async (imageFile) => {
    try {
      const formData = new FormData();
      formData.append('image', imageFile);

      const uploadResponse = await axiosInstance.post(API_PATHS.IMAGE.UPLOAD_IMAGE, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return uploadResponse.data.imageUrl;
    } catch (error) {
      console.error('Image upload error:', error);
      throw new Error('Failed to upload profile image');
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();

    // Validation
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
    setLoading(true);

    try {
      let profileImageUrl = '';

      // Upload image first if selected
      if (profileImage) {
        try {
          profileImageUrl = await uploadImageFirst(profileImage);
          console.log('Image uploaded successfully:', profileImageUrl);
        } catch (uploadError) {
          console.error('Image upload failed:', uploadError);
          // Continue with registration even if image upload fails
          setError('Image upload failed, but continuing with registration...');
        }
      }

      // console.log('Attempting signup with:', { 
      //   fullName, 
      //   email, 
      //   password: 'hidden',
      //   profileImageUrl 
      // });

      // Register user
      const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, {
        fullName,
        email,
        password,
        profileImageUrl
      });

      // console.log('Signup response:', response.data);

      if (response.data.success && response.data.user) {
        const userData = response.data.user;
        updateUser(userData);
        navigate('/dashboard');
      } else {
        setError('Registration failed. Please try again.');
      }
    } catch (error) {
      console.error('Signup error:', error);
      console.error('Error response data:', error.response?.data);

      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError(`Registration failed: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='w-[90vw] md:w-[33vw] p-7 flex flex-col justify-center'>
      <h3 className='text-lg font-semibold text-black'>Create Account</h3>
      <p className='text-xs text-slate-700 mt-[5px] mb-6'>
        Please fill in the details to create your account.
      </p>

      <form onSubmit={handleSignUp}>
        {/* Profile Photo Selector */}
        <ProfilePhotoSelector
          image={profileImage}
          setImage={setProfileImage}
          preview={profilePreview}
          setPreview={setProfilePreview}
        />

        <Input
          value={fullName}
          onChange={({ target }) => setFullName(target.value)}
          label='Full Name'
          type='text'
          placeholder='Enter your full name'
        />

        <Input
          value={email}
          onChange={({ target }) => setEmail(target.value)}
          label='Email Address'
          type='email'
          placeholder='Enter your email'
        />

        <Input
          value={password}
          onChange={({ target }) => setPassword(target.value)}
          label='Password'
          type='password'
          placeholder='Enter your password (Min 8 characters)'
        />

        {error && <p className='text-red-500 text-xs pb-2.5'>{error}</p>}

        <button type='submit' className='btn-primary' disabled={loading}>
          {loading ? 'CREATING ACCOUNT...' : 'SIGN UP'}
        </button>

        <p className='text-[13px] text-slate-800 mt-3'>
          Already have an account?{" "}
          <button
            type="button"
            className='font-medium text-[#9328E7] underline cursor-pointer'
            onClick={() => setCurrentPage('login')}
          >
            Login
          </button>
        </p>
      </form>
    </div>
  )
}

export default SignUp
