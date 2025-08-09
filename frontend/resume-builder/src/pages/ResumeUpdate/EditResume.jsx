import React from 'react'
import { useNavigate, useParams } from 'react-router-dom';

const EditResume = () => {

  const { resumeId } = useParams();
  const navigate = useNavigate();

  const resumeRef = React.useRef(null);
  const resumeDownloadRef = React.useRef(null);

  const [baseWidth, setBaseWidth] = React.useState(800);

  const [openThemeSelector, setOpenThemeSelector] = React.useState(false);

  const [openPreviewModal, setOpenPreviewModal] = React.useState(false);

  const [currentPage, setCurrentPage] = React.useState("profile-info");
  const [progress, setProgress] = React.useState(0);
  const [resumeData, setResumeData] = React.useState({
    title: "",
    thumbnailLink: "",
    profileInfo: {
      profileImg: null,
      profilePreviewUrl: "",
      fullName: "",
      designation: "",
      summary: ""
    },
    template:{
      theme: "",
      colorPalette: ""
    },
    contactInfo: {
      email: "",
      phone: "",
      location: "",
      linkedin: "",
      github: "",
      website: ""
    },
    workExperience: [
      {
        company: "",
        role: "",
        startDate: "",
        endDate: "",
        description: "",
      },
    ],
    education: [
      {
        institution: "",
        degree: "",
        fieldOfStudy: "",
        startDate: "",
        endDate: "",
        description: "",
      },
    ],
    education: [
      {
        degree: "",
        institution: "",
        startDate: "",
        endDate: "",
      },
    ],
    skills: [
      {
        name: "",
        progress: 0,
      },
    ],
    projects: [
      {
        title: "",
        description: "",
        github: "",
        liveDemo: "",
      },
    ],
    certifications: [
      {
        title: "",
        issuer: "",
        year: "",
      },
    ],
    languages: [
      {
        name: "",
        progress: 0,
      },
    ],
    interests: [""],
    achievements: [""]
  });
  const []
  return (
    <div>
      EditResume
    </div>
  )
}

export default EditResume
