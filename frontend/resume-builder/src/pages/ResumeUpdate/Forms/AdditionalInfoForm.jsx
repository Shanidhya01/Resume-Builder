import React from 'react'
import Input from '../../../components/Inputs/Input'
import { LuTrash2, LuPlus } from 'react-icons/lu'
import RatingInput from '../../../components/ResumeSections/RatingInput'

const AdditionalInfoForm = ({ 
  languages, 
  interests, 
  achievements, 
  updateArrayItem, 
  addArrayItem, 
  removeArrayItem
}) => {
  return (
    <div className="px-5 pt-5">
      <h2 className="text-lg font-semibold text-gray-900">Additional Information</h2>

      {/* Languages */}
      <div className="mt-6">
        <h3 className="text-sm font-semibold text-gray-700 mb-2">Languages</h3>

        <div className="flex flex-col gap-4">
          {languages.map((language, index) => (
            <div
              key={index}
              className="rounded-xl border border-gray-200/80 bg-white/80 p-4 relative"
            >
              {/* Header labels to align with input/ratings */}
              <div className="hidden md:grid grid-cols-2 gap-4 mb-2">
                <span className="text-xs font-medium text-slate-600">Language</span>
                <span className="text-xs font-medium text-slate-600">Proficiency</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                <Input
                  label="Language"
                  placeholder="e.g. English"
                  value={language.name || ''}
                  onChange={({ target }) =>
                    updateArrayItem('languages', index, 'name', target.value)
                  }
                />

                <div>
                  <label className="md:hidden text-xs font-medium text-slate-600 mb-2 block">
                    Proficiency
                  </label>
                  <RatingInput
                    value={language.progress}
                    onChange={(value) =>
                      updateArrayItem('languages', index, 'progress', value)
                    }
                    total={5}
                    activeColor="#8b5cf6"      // violet-500
                    inactiveColor="#ede9fe"    // violet-100
                  />
                </div>
              </div>

              {languages.length > 1 && (
                <button
                  type="button"
                  className="absolute top-3 right-3 inline-flex items-center justify-center h-8 w-8 rounded-md text-red-600 hover:bg-red-50"
                  aria-label="Remove language"
                  onClick={() => removeArrayItem('languages', index)}
                >
                  <LuTrash2 />
                </button>
              )}
            </div>
          ))}

          <button
            type="button"
            className="self-start inline-flex items-center gap-2 px-4 py-2 rounded-md border border-violet-200 bg-violet-100 text-violet-800 text-sm font-medium hover:bg-violet-200"
            onClick={() => addArrayItem('languages', { name: '', progress: 0 })}
          >
            <LuPlus /> Add Language
          </button>
        </div>
      </div>

      {/* Interests */}
      <div className="mt-8 mb-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-2">Interests</h3>

        <div className="flex flex-col gap-4">
          {interests.map((interest, index) => (
            <div key={index} className="relative rounded-xl border border-gray-200/80 bg-white/80 p-4">
              <Input
                label="Interest"
                placeholder="e.g. Reading"
                value={interest.name || ''}
                onChange={({ target }) =>
                  updateArrayItem('interests', index, 'name', target.value)
                }
              />
              {interests.length > 1 && (
                <button
                  type="button"
                  className="absolute top-3 right-3 inline-flex items-center justify-center h-8 w-8 rounded-md text-red-600 hover:bg-red-50"
                  aria-label="Remove interest"
                  onClick={() => removeArrayItem('interests', index)}
                >
                  <LuTrash2 />
                </button>
              )}
            </div>
          ))}

          <button
            type="button"
            className="self-start inline-flex items-center gap-2 px-4 py-2 rounded-md border border-violet-200 bg-violet-100 text-violet-800 text-sm font-medium hover:bg-violet-200"
            onClick={() => addArrayItem('interests', { name: '' })}
          >
            <LuPlus /> Add Interest
          </button>
        </div>
      </div>

      {/* Achievements */}
      <div className="mt-8 mb-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-2">Achievements</h3>

        <div className="flex flex-col gap-4">
          {achievements.map((achievement, index) => (
            <div key={index} className="relative rounded-xl border border-gray-200/80 bg-white/80 p-4">
              <Input
                label="Achievement"
                placeholder="e.g. Hackathon Winner"
                value={achievement.name || ''}
                onChange={({ target }) =>
                  updateArrayItem('achievements', index, 'name', target.value)
                }
              />
              {achievements.length > 1 && (
                <button
                  type="button"
                  className="absolute top-3 right-3 inline-flex items-center justify-center h-8 w-8 rounded-md text-red-600 hover:bg-red-50"
                  aria-label="Remove achievement"
                  onClick={() => removeArrayItem('achievements', index)}
                >
                  <LuTrash2 />
                </button>
              )}
            </div>
          ))}

          <button
            type="button"
            className="self-start inline-flex items-center gap-2 px-4 py-2 rounded-md border border-violet-200 bg-violet-100 text-violet-800 text-sm font-medium hover:bg-violet-200"
            onClick={() => addArrayItem('achievements', { name: '' })}
          >
            <LuPlus /> Add Achievement
          </button>
        </div>
      </div>
    </div>
  )
}

export default AdditionalInfoForm
