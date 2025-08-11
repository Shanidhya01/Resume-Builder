import React from 'react'
import { LuGithub, LuExternalLink } from 'react-icons/lu'
import ActionLink from './ActionLink';

const ProjectInfo = ({ 
  title, 
  description, 
  githubLink, 
  liveLink, 
  bgColor,
  isPreview 
}) => {
  return (
    <div className='mb-5'>
      <h3
        className={`${
          isPreview ? "text-xs" : "text-base"
        } font-semibold text-gray-900`}
      >
        {title}
      </h3>
      <p className='text-sm text-gray-700 font-medium mt-1'>{description}</p>

      <div className='flex items-center gap-3 mt-2'>
        {githubLink && <ActionLink icon={<LuGithub />} link={githubLink} bgColor={bgColor} />}
        {liveLink && <ActionLink icon={<LuExternalLink />} link={liveLink} bgColor={bgColor} />}
      </div>
    </div>
  )
}

export default ProjectInfo
