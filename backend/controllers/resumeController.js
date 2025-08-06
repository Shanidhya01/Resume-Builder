const fs = require('fs');
const path = require('path');
const Resume = require('../models/Resume');
const e = require('express');
const { Certificate } = require('crypto');

// @desc Create a new resume
// @route POST /api/resume
// @access Private
const createResume = async (req, res) => {
  try {
    const {title} = req.body ;

    //Default templete
    const defaultResumeData = {
      profileInfo: {
        profileImg: null,
        previewUrl: "",
        fullName: "",
        designation: "",
        summary: "",
      },
      contactInfo: {
        email: "",
        phone: "",
        location: "",
        linkedin: "",
        github: "",
        website: "",
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
        }
      ],
      projects: [
        {
          title: "",
          description: "",
          githubLink: "",
          liveDemo: "",
        }
      ],
      certifications: [
        {
          title: "",
          issuer: "",
          date: "",
          credentialUrl: "",
        }
      ],
      languages: [
        {
          name: "",
          progress: 0,
        }
      ],
      interests:[""],
    };

    const newResume = await Resume.create({
      userId: req.user._id,
      title,
      ...defaultResumeData
    });

    res.status(201).json({
      message: 'Resume created successfully',
      resume: newResume,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Server error while creating resume', error: error.message });
  }
};

// @desc Get all resumes for the authenticated user
// @route GET /api/resume
// @access Private
const getUserResumes = async (req, res) => {
  try {
    const resumes = await Resume.find({ userId: req.user._id }).sort({ createdAt: -1 });

    res.json(resumes);
    
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Server error while fetching resumes', error: error.message });
  }
}

// @desc Get a resume by ID
// @route GET /api/resume/:id
// @access Private
const getResumeById = async (req, res) => {
  try {
    const resume = await Resume.findOne({ _id: req.params.id, userId: req.user._id });
    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Server error while fetching resumes', error: error.message });
  }
}

// @desc Update a resume by ID
// @route PUT /api/resume/:id
// @access Private
const updateResume = async (req, res) => {
  try {
    const resume = await Resume.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });
    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }

    // merge upadted data with existing resume
    Object.assign(resume, req.body);

    const savedResume = await resume.save();

    res.json(savedResume);
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Server error while fetching resumes', error: error.message });
  }
}

// @desc Delete a resume by ID
// @route DELETE /api/resume/:id  
// @access Private  
const deleteResume = async (req, res) => {
  try {
    const resume = await Resume.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }
    // Delete the resume
    const uploadsFolder = path.join(__dirname, '../uploads');
    const baseUrl = `${req.protocol}://${req.get('host')}`;

    if(resume.thumbnailLink){
      const oldThumbnail = path.join(uploadsFolder, path.basename(resume.thumbnailLink));
      if (fs.existsSync(oldThumbnail)) {
        fs.unlinkSync(oldThumbnail);
      } 
    }

    if(resume.profileInfo?.profilePreviewUrl){
      const oldProfile = path.join(uploadsFolder, path.basename(resume.profileInfo.profilePreviewUrl));
      if (fs.existsSync(oldProfile)) {
        fs.unlinkSync(oldProfile);
      }
    }

    const deleted = await Resume.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!deleted) {
      return res.status(404).json({ message: 'Resume not found' });
    }

    res.json({ message: 'Resume deleted successfully' });
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Server error while fetching resumes', error: error.message });
  }
}

module.exports = {
  createResume,
  getUserResumes,
  getResumeById,
  updateResume,
  deleteResume,
};