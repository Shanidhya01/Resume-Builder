import React from 'react'
import Progress from '../Progress';

const LanguageInfo = ({language,progress,accentColor,bgColor}) => {
  return (
    <div className='flex items-center justify-between'>
      <p className='text-[12px] font-semibold text-gray-900'>{language}</p>
      <Progress
        progress={(progress / 100 ) * 5 }
        color={accentColor}
        bgColor={bgColor}
      />
    </div>
  )
}
const LanguageSection = ({ languages, accentColor, bgColor }) => {
  return (
    <div className='flex flex-col gap-2'>
      {languages.map((lang, index) => (
        <LanguageInfo
          key={`slanguage_${index}`}
          language={lang.name}
          progress={lang.proficiency}
          accentColor={accentColor}
          bgColor={bgColor}
        />
      ))}
    </div>
  )
}

export default LanguageSection
