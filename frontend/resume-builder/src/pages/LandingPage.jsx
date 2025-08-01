import React, { useState } from 'react'
import HERO_IMG from '../assets/hero-img.png'
import { useNavigate } from 'react-router-dom'
// import GitHubIcon from '@mui/icons-material/GitHub';

const LandingPage = () => {
  const navigate = useNavigate();

  const [openAuthModal,setOpenAuthModal] = useState(false);
  const [currentPage,setCurrentPage] = useState("login");

  const handleCTA = () => {};
  return (
    <div className='w-full min-h-full bg-white'>
      <div className='container mx-auto px-4 py-6'>
        {/* Header */}
        <header className='flex justify-between items-center mb-16'>
          <div className='text-xl font-bold'>Resume Builder</div>
          <button
            className='bg-purple-100 text-sm font-semibold text-black px-7 py-2.5 rounded-lg hover:bg-gray-800 hover:text-white transition-colors cursor-pointer'
            onClick={() => setOpenAuthModal(true)}
          >
            Login / Sign Up
          </button>
        </header>

        {/* Hero Content */}
        <div className='flex flex-col md:flex-row items-center'>
          <div className='w-full md:w-1/2 pr-4 mb-8 md:mb-0'>
            <h1 className='text-5xl font-bold mb-6 leading-tight'>
              Build Your{" "}
              <span className='text-transparent bg-clip-text bg-[radial-gradient(circle,_#7182ff_0%,_#3cff52_100%)]'>
                Resume Effortlessly
              </span>
            </h1>
            < p className='text-lg text-gray-700 mb-8'>
              Craft a Standout Resume in Minutes with our smart and intuitive
              resume builder.
            </p>
            <button
              className='bg-black text-sm font-semibold text-white px-8 py-3 rounded-lg hover:bg-gray-800 transition-colors cursor-pointer'
              onClick={handleCTA}
            >
              Get Started
            </button>
          </div>
          <div className=''>
            <img 
              src={HERO_IMG}
              alt='Hero Image'
              className='w-full rounded-lg '
            />
          </div>

        </div>

        <section className='mt-5'>
          <h2 className='text-2xl font-bold text-center mb-12'>
            Features That Make You Shine
          </h2>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-3'>
            <div className='bg-gray-50 p-6 rounded-xl shadow-sm hover:shadow-md transition'>
              <h3 className='text-lg font-semibold mb-3'>Easy Editing</h3>
              <p className='text-gray-600'>
                Update Your resume sections with live preview and instant
                formatting.
              </p>
            </div>
            
            <div className='bg-gray-50 p-6 rounded-xl shadow-sm hover:shadow-md transition'>
              <h3 className='text-lg font-semibold mb-3'>
                Beautiful Templete
              </h3>
              <p className='text-gray-600'>
                Choose from modern, Professional templetes that are esay to
                customize.
              </p>
            </div>

            <div className='bg-gray-50 p-6 rounded-xl shadow-sm hover:shadow-md transition'>
              <h3 className='text-lg font-semibold mb-3'>
                One-Click Export
              </h3>
              <p className='text-gray-600'>
                Download your resume instantly as a high-quality PDF with one
                click.
              </p>
            </div>
          </div>
        </section>

      </div>
      <div className="text-sm bg-gray-50 text-secondary text-center p-5 mt-5">
        {/* <a 
          href="https://github.com/Shanidhya01" 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center gap-2"
        >
          <GitHubIcon />
          <span>Made By Shanidhya</span>
        </a> */}
          Made by Shanidhya
          https://www.github.com/Shanidhya01
        </div>
    </div>
  )
}

export default LandingPage
