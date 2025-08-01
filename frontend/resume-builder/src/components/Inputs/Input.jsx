import React from 'react'
import { FaEyeDropper,FaEyeSlash, FaRegEye } from 'react-icons/fa'
const Input = ({value, onChange, label, type, placeholder}) => {
  const [showPassword, setShowPassword] = React.useState(false);

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  }

  return (
    <>
    <div>
      <label className='text-[13px] text-slate-800'>{label}</label>
      <div className='input-box'>
        <input
          type={type === 'password' ? (showPassword ? 'text' : 'password') : type}
          value={value}
          placeholder={placeholder}
          className='w-full bg-transparent outline-none'
          onChange={(e) => onChange(e)}
        />

        {type === 'password' && (
          <>
          {showPassword ? (
            <FaRegEye
              size={22}
              className='text-primary cursor-pointer'
              onClick={() => handleTogglePassword()}
            />
          ) : (
            <FaEyeSlash
              size={22}
              className='text-slate-400 cursor-pointer'
              onClick={() => handleTogglePassword()}
            />
          )}
          </>
        )}
      </div>
    </div>
    </>
  )
}

export default Input
