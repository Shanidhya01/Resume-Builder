import React from 'react'
import Input from '../../../components/Inputs/Input'
import { LuTrash2, LuPlus } from 'react-icons/lu'

const CertificationsInfoForm = ({ certificationsInfo, updateArrayItem, addArrayItem, removeArrayItem }) => {
  return (
    <div className='px-5 pt-5'>
      <h2 className='text-lg font-semibold text-gray-900'>Certifications</h2>
      <div className='mt-4 flex flex-col gap-4 mb-3'>
        
          {certificationsInfo.map((certification, index) => (
            <div 
              key={index} 
              className='border border-gray-200/80 p-4 rounded-lg relative'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <Input
                  label='Certification Title'
                  placeholder='Enter certification title'
                  type='text'
                  value={certification.title || ""}
                  onChange={({target}) => updateArrayItem(index, 'title', target.value)}
                />
                <Input
                  label='Issuing Organization'
                  placeholder='Enter issuing organization'
                  type='text'
                  value={certification.issuer || ""}
                  onChange={({target}) => updateArrayItem(index, 'issuer', target.value)}
                />
                <Input
                  label='Year'
                  placeholder='Enter year'
                  type='text'
                  value={certification.year || ""}
                  onChange={({target}) => updateArrayItem(index, 'year', target.value)}
                />
              </div>
              {certificationsInfo.length > 1 && (
                <button
                  type='button'
                  className='absolute top-3 right-3 text-sm text-red-600 hover:underline cursor-pointer'
                  onClick={() => removeArrayItem(index)}
                >
                  <LuTrash2 />
                </button>
              )}
            </div>
          ))}
          <button
            type='button'
            className='self-start flex items-center gap-2 px-4 py-2 rounded bg-purple-100 text-purple-800 text-sm font-medium hover:bg-purple-200 cursor-pointer'
            onClick={addArrayItem}
          >
            <LuPlus className='mr-1' />
            Add Certification
          </button>
        
      </div>
    </div>
  )
}

export default CertificationsInfoForm
