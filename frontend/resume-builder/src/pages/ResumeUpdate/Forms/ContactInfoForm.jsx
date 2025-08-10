import React from 'react'
import Input from '../../../components/Inputs/Input'

const ContactInfoForm = ({ contactInfo = {}, updateSection = () => {} }) => {
  const onChangeKey = (key) => (arg) => {
    const next = typeof arg === 'string' ? arg : arg?.target?.value ?? ''
    updateSection(key, next)
  }

  return (
    <div className='px-5 pt-5'>
      <h2 className='text-lg font-semibold text-gray-900'>Contact Information</h2>

      <div className='mt-4 grid grid-cols-1 md:grid-cols-2 gap-4'>
        {/* Address - full width */}
        <div className='md:col-span-2'>
          <Input
            value={contactInfo.location ?? ''}
            onChange={onChangeKey('location')}
            label='Address'
            placeholder='Enter your address'
            type='text'
          />
        </div>

        {/* Email | Phone - side by side */}
        <div>
          <Input
            value={contactInfo.email ?? ''}
            onChange={onChangeKey('email')}
            label='Email'
            placeholder='Enter your email'
            type='email'
          />
        </div>
        <div>
          <Input
            value={contactInfo.phone ?? ''}
            onChange={onChangeKey('phone')}
            label='Phone Number'
            placeholder='Enter your phone number'
            type='tel'
          />
        </div>

        {/* LinkedIn | GitHub - side by side */}
        <div>
          <Input
            value={contactInfo.linkedin ?? ''}
            onChange={onChangeKey('linkedin')}
            label='LinkedIn'
            placeholder='Enter your LinkedIn profile URL'
            type='url'
          />
        </div>
        <div>
          <Input
            value={contactInfo.github ?? ''}
            onChange={onChangeKey('github')}
            label='GitHub'
            placeholder='Enter your GitHub profile URL'
            type='url'
          />
        </div>

        {/* Website - full width */}
        <div className='md:col-span-2'>
          <Input
            value={contactInfo.website ?? ''}
            onChange={onChangeKey('website')}
            label='Portfolio / Website'
            placeholder='Enter your portfolio/website URL'
            type='url'
          />
        </div>
      </div>
    </div>
  )
}

export default ContactInfoForm
