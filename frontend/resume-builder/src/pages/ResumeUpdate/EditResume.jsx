import React, { useEffect } from 'react'
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import {
  LuArrowLeft,
  LuCircleAlert,
  LuDownload,
  LuPalette,
  LuSave,
  LuUpload,
  LuTrash2,
} from "react-icons/lu";
import DashboardLayout from '../../components/layouts/DashboardLayout';
import TitleInput from '../../components/Inputs/TitleInput';
import  { useReactToPrint } from "react-to-print"
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPath';
import StepProgress from '../../components/StepProgress';
import ProfileInfoForm from './Forms/ProfileInfoForm';
import ContactInfoForm from './Forms/ContactInfoForm';
import WorkExperienceForm from './Forms/WorkExperienceForm';
import EducationDetailsForm from './Forms/EducationDetailsForm';
import SkillsInfoForm from './Forms/SkillsInfoForm';
import ProjectsInfoForm from './Forms/ProjectsInfoForm';
import CertificationsInfoForm from './Forms/CertificationsInfoForm';
import AdditionalInfoForm from './Forms/AdditionalInfoForm';
import RenderResume from '../../components/ResumeTempletes/RenderResume';

const EditResume = () => {
  const { resumeId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const resumeRef = React.useRef(null);
  const resumeDownloadRef = React.useRef(null);

  const [baseWidth, setBaseWidth] = React.useState(800);

  const [openThemeSelector, setOpenThemeSelector] = React.useState(false);

  const [openPreviewModal, setOpenPreviewModal] = React.useState(false);

  const [currentPage, setCurrentPage] = React.useState("profile-info");
  const [progress, setProgress] = React.useState(0);
  const [resumeData, setResumeData] = React.useState({
    title: location.state?.title ?? "",
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
  const [errorMsg, setErrorMsg] = React.useState("");
  const [isLoading, setLoading] = React.useState(false);

  // validate Inputs
  const validateAndNext = (e) => {
    const error = [];
    switch (currentPage){
      case "profile-info":
        const { fullName, designation, summary } = resumeData.profileInfo;
        if (!fullName.trim()) error.push("Full Name is required");
        if (!designation.trim()) error.push("Designation is required");
        if (!summary.trim()) error.push("Summary is required");
        break;

      case "contact-info":
        const { email, phone } = resumeData.contactInfo;
        if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) 
          error.push("Email is required");
        if (!phone.trim()) 
          error.push("Phone is required");
        break;
      
      case "work-experience":
        resumeData.workExperience.forEach(({ company, role, startDate, endDate }, index) => {
          if (!company.trim()) 
            error.push(`Company is required in experience ${index + 1}`);
          if (!role.trim()) 
            error.push(`Role is required in experience ${index + 1}`);
          if (!startDate) 
            error.push(`Start Date is required in experience ${index + 1}`);
          if (!endDate) 
            error.push(`End Date is required in experience ${index + 1}`);
        });
        break;

      case "education-info":
        resumeData.education.forEach(
          ({ degree, institution, eduStartDate, eduEndDate }, index) => {
            if (!degree.trim()) 
              error.push(`Degree is required in education ${index + 1}`);
            if (!institution.trim()) 
              error.push(`Institution is required in education ${index + 1}`);
            if (!eduStartDate) 
              error.push(`Start Date is required in education ${index + 1}`);
            if (!eduEndDate) 
              error.push(`End Date is required in education ${index + 1}`);
          }
        );
        break;

      case "skills":
        resumeData.skills.forEach(({ name, progress }, index) => {
          if (!name.trim()) 
            error.push(`Skill Name is required in skill ${index + 1}`);
          if (progress < 1 || progress > 100) 
            error.push(`Skill Proficiency is required in skill ${index + 1}`);
        });
        break;

      case "projects":
        resumeData.projects.forEach(({ title, description, github, liveDemo }, index) => {
          if (!title.trim()) 
          error.push(`Project Title is required in project ${index + 1}`);
          if (!description.trim()) 
            error.push(`Project Description is required in project ${index + 1}`);
          if (!github.trim()) 
            error.push(`GitHub Link is required in project ${index + 1}`);
          if (!liveDemo.trim()) 
            error.push(`Live Demo Link is required in project ${index + 1}`);
        });
        break;

      case "certifications":
        resumeData.certifications.forEach(({ certTitle, issuer, year }, index) => {
          if (!certTitle.trim()) 
            error.push(`Certification Title is required in certification ${index + 1}`);
          if (!issuer.trim()) 
            error.push(`Certification Issuer is required in certification ${index + 1}`);
          if (!year) 
            error.push(`Certification Year is required in certification ${index + 1}`);
        });
        break;

      case "additionalInfo":
        if(
          resumeData.languages.length === 0 ||
          !resumeData.languages[0].name.trim()
        ){
          error.push(`Language Name is required`);
        }

        if(
          resumeData.interests.length === 0 ||
          !resumeData.interests[0].trim()
        ){
          error.push(`Interest is required`);
        }

        if(
          resumeData.achievements.length === 0 ||
          !resumeData.achievements[0].trim()
        ){
          error.push(`Achievement is required`);
        } 
        break;
      default:
        break;
    }

    if(error.length > 0){
      setErrorMsg(error.join(", "));
      return;
    }

    // Proceed to the next step
    setErrorMsg("");
    goToNextStep();
  };

  //Function to navigate to next section
  const goToNextStep = () => {
    const pages = [
      "profile-info",
      "contact-info",
      "work-experience",
      "education-info",
      "skills",
      "projects",
      "certifications",
      "additionalInfo"
    ];

    if(currentPage === "additionalInfo") setOpenPreviewModal(true);

    const currentIndex = pages.indexOf(currentPage);
    if(currentIndex !== -1 && currentIndex < pages.length - 1){
      const nextIndex = currentIndex + 1;
      setCurrentPage(pages[nextIndex]);

      // set progress as percentage
      const percent = Math.round((nextIndex / (pages.length - 1)) * 100);
      setProgress(percent);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  //Function to navigate to previous section
  const goBack = () => {
    const pages = [
      "profile-info",
      "contact-info",
      "work-experience",
      "education-info",
      "skills",
      "projects",
      "certifications",
      "additionalInfo"
    ];

    if(currentPage === "profile-info")  navigate("/dashboard");

    const currentIndex = pages.indexOf(currentPage);
    if(currentIndex > 0){
      const prevIndex = currentIndex - 1;
      setCurrentPage(pages[prevIndex]);

      // update progress
      const percent = Math.round((prevIndex / (pages.length - 1)) * 100);
      setProgress(percent);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const renderForm = () => {
    switch (currentPage) {
      case 'profile-info':
        return (
          <ProfileInfoForm
            profileData={resumeData?.profileInfo}
            updateSection={(key, value) => updateSection('profileInfo', key, value)}
            onNext={validateAndNext}
          />
        )
      case 'contact-info':
        return (
          <ContactInfoForm
            contactInfo={resumeData?.contactInfo}
            updateSection={(key, value) => updateSection('contactInfo', key, value)}
          />
        )

      case "work-experience":
        return (
          <WorkExperienceForm
            workExperience={resumeData?.workExperience}
            updateArrayItem={(index, key, value) => {
              updateArrayItem('workExperience', index, key, value);
            }}
            addArrayItem={(newItem) => addArrayItem('workExperience', newItem)}
            removeArrayItem={(index) => {
              removeArrayItem('workExperience', index);
            }}
          />
        );

      case "education-info":
        return (
          <EducationDetailsForm
            educationInfo={resumeData?.education}
            updateArrayItem={(index, key, value) => {
              updateArrayItem('education', index, key, value);
            }}
            addArrayItem={(newItem) => addArrayItem('education', newItem)}
            removeArrayItem={(index) => {
              removeArrayItem('education', index);
            }}
          />
        );

      case "skills":
        return(
          <SkillsInfoForm
            skillsInfo={resumeData?.skills}
            updateArrayItem={(index, key, value) => {
              updateArrayItem('skills', index, key, value);
            }}
            addArrayItem={(newItem) => addArrayItem('skills', newItem)}
            removeArrayItem={(index) => {
              removeArrayItem('skills', index);
            }}
          />
        )

      case "projects":
        return (
          <ProjectsInfoForm
            projectsInfo={resumeData?.projects}
            updateArrayItem={(index, key, value) => {
              updateArrayItem('projects', index, key, value);
            }}
            addArrayItem={(newItem) => addArrayItem('projects', newItem)}
            removeArrayItem={(index) => {
              removeArrayItem('projects', index);
            }}
          />
        );

      case "certifications":
        return (
          <CertificationsInfoForm
            certificationsInfo={resumeData?.certifications}
            updateArrayItem={(index, key, value) => {
              updateArrayItem('certifications', index, key, value);
            }}
            addArrayItem={(newItem) => addArrayItem('certifications', newItem)}
            removeArrayItem={(index) => {
              removeArrayItem('certifications', index);
            }}
          />
        );

      case "additionalInfo":
        return (
          <AdditionalInfoForm
            languages={resumeData?.languages}
            interests={resumeData?.interests}
            achievements={resumeData?.achievements}
            updateArrayItem={(section, index, key, value) =>
              updateArrayItem(section, index, key, value)
            }
            addArrayItem={(section, newItem) => addArrayItem(section, newItem)}
            removeArrayItem={(section, index) => removeArrayItem(section, index)}
          />
        );

      default:
        return null
    }
  };

  // update simple rested objects like profileinfo 
  const updateSection = (section , key ,value) => {
    setResumeData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value,
      },
    }));
  };

  // update array items
  const updateArrayItem = (section, index, key, value) => {
    setResumeData((prev) => {
      const updatedArray = [...prev[section]];
      
      if(key === null){
        updatedArray[index] = value;
      } else {
        updatedArray[index] = {
          ...updatedArray[index],
          [key]: value,
        };
      }

      return {
        ...prev,
        [section]: updatedArray,
      };
    });
  };

  //add item to array
  const addArrayItem = (section, newItem) => {
    setResumeData((prev) => ({
      ...prev,
      [section]: [...prev[section], newItem],
    }));
  };

  //Remove item from array
  const removeArrayItem = (section, index) => {
    setResumeData((prev) => {
      const updatedArray = [...prev[section]];
      updatedArray.splice(index, 1);
      return {
        ...prev,
        [section]: updatedArray,
      };
    });
  };

  //fetch resume info by id
  const fetchResumeDetailsById = async () => {
    try{
      const response = await axiosInstance.get(
        API_PATHS.RESUME.GET_BY_ID(resumeId)
      );

      if(response.data && response.data.profileInfo){
        const resumeInfo = response.data;

        setResumeData((prevState) => ({
          ...prevState,
          title: resumeInfo?.title ?? prevState.title,
          template: resumeInfo?.template || prevState?.template,
          profileInfo: resumeInfo?.profileInfo || prevState?.profileInfo,
          contactInfo: resumeInfo?.contactInfo || prevState?.contactInfo,
          workExperience: resumeInfo?.workExperience || prevState?.workExperience,
          education: resumeInfo?.education || prevState?.education,
          skills: resumeInfo?.skills || prevState?.skills,
          projects: resumeInfo?.projects || prevState?.projects,
          certifications: resumeInfo?.certifications || prevState?.certifications,
          languages: resumeInfo?.languages || prevState?.languages,
          interests: resumeInfo?.interests || prevState?.interests,
          achievements: resumeInfo?.achievements || prevState?.achievements
        }));
      }
    } catch (error) {
      console.error("Error fetching resume details:", error);
    }
  };

  //upload thumbnail and resume profile image
  const uploadResumeImages = async () => {};

  const updateResumeDetails = async ({thumbnailLink, profilePreviewUrl}) => {};

  // delete resume
  const handleDeleteResume = async () => {};

  //download resume
  const reactToPrintFn = useReactToPrint({ contentRef : resumeDownloadRef});

  // function to update basewidth based on resume
  const updateBaseWidth = () => {
    if(resumeRef.current){
      const width = resumeRef.current.offsetWidth;
      setBaseWidth(width);
    }
  };

  useEffect(() => {
    updateBaseWidth();
    window.addEventListener("resize", updateBaseWidth);

    if(resumeId){
      fetchResumeDetailsById();
    }

    return () => {
      window.removeEventListener("resize", updateBaseWidth);
    }
    
  }, []);

  return (
    <DashboardLayout>
      <div className='container mx-auto'>
        <div className='flex items-center justify-between gap-5 bg-white rounded-lg border border-purple-100 py-3 px-4 mb-4 '>
          <TitleInput
            title={resumeData.title}
            setTitle={(value) => 
              setResumeData((prevState) => ({
                ...prevState,
                title: value
              }))
            }
          />

          <div className='flex items-center gap-4'>
            <button 
              className='btn-small-light'
              onClick={() => setOpenThemeSelector(true)}
            >
              <LuPalette className='text-[16px]' />
              <span className='hidden md:block'>Change Theme</span>
            </button>

            <button 
              className='btn-small-light'
              onClick={handleDeleteResume}
            >
              <LuTrash2 className='text-[16px]' />
              <span className='hidden md:block'>Delete</span>
            </button>

            <button
              className='btn-small-light'
              onClick={() => setOpenPreviewModal(true)}
            >
              <LuDownload className='text-[16px]' />
              <span className='hidden md:block'>Preview & Download</span>
            </button>

          </div>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
          <div className='bg-white rounded-lg border border-purple-100 overflow-hidden'>

            <StepProgress progress={progress} />

            {renderForm()}
            <div className='mx-5'>
              {errorMsg && (
                <div className='flex items-center gap-2 text-[11px] font-medium text-amber-600 bg-amber-100 px-2 py-0.5 my-1 rounded'>
                  <LuCircleAlert className='text-md' /> {errorMsg}
                </div>
              )}

              <div className='flex items-end justify-end gap-3 mt-3 mb-5'>
                <button 
                  className='btn-small-light'
                  onClick={goBack}
                  disabled={isLoading}
                >
                  <LuArrowLeft className='text-[16px]' />
                  Back
                </button>

                <button
                  className='btn-small-light'
                  onClick={uploadResumeImages}
                  disabled={isLoading}
                >
                  <LuUpload className='text-[16px]' />
                  {isLoading ? "Uploading..." : "Save & Exit"}
                </button>

                <button
                  className='btn-small'
                  onClick={validateAndNext}
                  disabled={isLoading}
                >
                  {currentPage === "additionalInfo" && (
                    <LuDownload className='text-[16px]' />
                  )}

                  {currentPage === "additionalInfo" 
                    ? "Preview & Download"
                    : "Next"}
                  {currentPage === "additionalInfo" && (
                    <LuArrowLeft className='text-[16px] rotate-180' />
                  )}
                </button>
              </div>
            </div>
          </div>

          <div ref={resumeRef} className='h-[100vh]'>
            {/* Resume Template */}
            <RenderResume
              templateId={resumeData?.template?.theme || ""}
              resumeData={resumeData}
              colorPalette={resumeData?.template?.colorPalette || []}
              containerWidth={baseWidth}
            />
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default EditResume