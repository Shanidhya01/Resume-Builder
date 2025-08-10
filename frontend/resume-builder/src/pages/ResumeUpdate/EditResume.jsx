import React, { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
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
  const validateAndNext = (e) => {};

  //Function to navigate to next section
  const goToNextStep = () => {};

  //Function to navigate to previous section
  const goBack = () => {};

  const renderForm = () => {};

  // update simple rested objects like profileinfo 
  const updateSection = (section , key ,value) => {};

  // update array items
  const updateArrayItem = (section, index, key, value) => {};

  //add item to array
  const addArrayItem = (section, newItem) => {};

  //Remove item from array
  const removeArrayItem = (section, index) => {};

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
          title: resumeInfo?.title || "",
          template: resumeInfo?.template || prevState?.template,
          profileInfo: resumeInfo?.profileInfo || prevState?.profileInfo,
          contactInfo: resumeInfo?.contactInfo || prevState?.contactInfo,
          workExperience:
            resumeInfo?.workExperience || prevState?.workExperience,
          education: resumeInfo?.education || prevState?.education,
          skills: resumeInfo?.skills || prevState?.skills,
          projects: resumeInfo?.projects || prevState?.projects,
          certifications: 
            resumeInfo?.certifications || prevState?.certifications,
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
  const updateBaseWidth = () => {};

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
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default EditResume
