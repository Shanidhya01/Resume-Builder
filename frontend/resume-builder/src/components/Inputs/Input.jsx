import React from 'react'

const Input = ({value, onChange, label, type, placeholder}) => {
  return (
    <div>
      <label className='text-sm text-slate-700'>{label}</label>
      <input
        value={value}
        onChange={onChange}
        type={type}
        placeholder={placeholder}
        className='border border-slate-300 rounded-md p-2 mt-1 w-full'
      />
    </div>
  )
}

export default Input
