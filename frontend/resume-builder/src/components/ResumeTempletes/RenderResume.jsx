import React from 'react'
import TemplateOne from './TemplateOne';

const RenderResume = ({
  templeteId,
  resumeData,
  colorPalette,
  containerWidth
}) => {
  switch (templeteId) {
    case "01":
      return (
        <TemplateOne
          resumeData={resumeData}
          colorPalette={colorPalette}
          containerWidth={containerWidth}
        />
      );
    default:
      return (
        <TemplateOne
          resumeData={resumeData}
          colorPalette={colorPalette}
          containerWidth={containerWidth}
        />
      );
  }
}

export default RenderResume
