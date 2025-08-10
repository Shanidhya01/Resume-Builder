import React from 'react'
import Input from '../../../components/Inputs/Input'
import { LuPlus, LuTrash2 } from 'react-icons/lu'

const WorkExperienceForm = ({
  workExperience = [],
  updateArrayItem,
  addArrayItem,
  removeArrayItem
}) => {
  const onChange = (index, key) => (arg) => {
    const next = typeof arg === 'string' ? arg : arg?.target?.value ?? ''
    updateArrayItem(index, key, next)
  }

  return (
    <div className='px-5 pt-5'>
      <h2 className='text-lg font-semibold text-gray-900'>Work Experience</h2>

      <div className='mt-4 flex flex-col gap-4 mb-3'>
        {workExperience.map((experience, index) => (
          <div
            key={index}
            className='border border-gray-200/80 p-4 rounded-lg relative'
          >
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <Input
                label='Company'
                placeholder='Enter company name'
                type='text'
                value={experience?.company ?? ''}
                onChange={onChange(index, 'company')}
              />

              <Input
                label='Role'
                placeholder='Frontend Developer'
                type='text'
                value={experience?.role ?? ''}
                onChange={onChange(index, 'role')}
              />

              <Input
                label='Start Date'
                type='month'
                value={experience?.startDate ?? ''}
                onChange={onChange(index, 'startDate')}
              />

              <Input
                label='End Date'
                type='month'
                value={experience?.endDate ?? ''}
                onChange={onChange(index, 'endDate')}
              />
            </div>

            <div className='mt-4'>
              <label className='text-xs font-medium text-slate-600'>
                Description
              </label>
              <textarea
                placeholder='What did you do in this role?'
                className='w-full mt-1 bg-white border border-purple-100 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-purple-500'
                rows={3}
                value={experience?.description ?? ''}
                onChange={onChange(index, 'description')}
              />
            </div>

            {workExperience.length > 1 && (
              <button
                type='button'
                className='absolute top-3 right-3 text-sm text-red-600 hover:underline cursor-pointer'
                onClick={() => removeArrayItem(index)}
                aria-label='Remove work experience'
              >
                <LuTrash2 />
              </button>
            )}
          </div>
        ))}

        <button
          type='button'
          className='self-start flex items-center gap-2 px-4 py-2 rounded bg-purple-100 text-purple-800 text-sm font-medium hover:bg-purple-200 cursor-pointer'
          onClick={() =>
            addArrayItem({
              company: '',
              role: '',
              startDate: '',
              endDate: '',
              description: '',
            })
          }
        >
          <LuPlus /> Add Work Experience
        </button>
      </div>
    </div>
  )
}

export default WorkExperienceForm