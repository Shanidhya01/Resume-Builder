const fs = require('fs');
const path = require('path');
const Resume = require('../models/Resume');
const upload = require('../middleware/uploadMiddleware');

const uploadResumeImage = async (req, res) => {
  try {
    upload.fields([{ name: 'thumbnail'},{name:'profileImage'}])(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ message: 'Error uploading images', error: err.message });
      }

      const resumeId = req.params.id;
      const resume = await Resume.findOne({ _id: resumeId, userId: req.user._id });
      if (!resume) {
        return res.status(404).json({ message: 'Resume not found' });
      }

      const uploadsFolder = path.join(__dirname, '../uploads');
      const baseUrl = `${req.protocol}://${req.get('host')}`;

      const newThumbnail = req.files.thumbnail?.[0];
      const newProfileImage = req.files.profileImage?.[0];
      
      // if new thumbnail exists, delete old one
      if (newThumbnail) {
        if (resume.thumbnailLink) {
          const oldThumbnail = path.join(uploadsFolder, path.basename(resume.thumbnailLink));
          if (fs.existsSync(oldThumbnail)) {
            fs.unlinkSync(oldThumbnail);
          }
        }
        resume.thumbnailLink = `${baseUrl}/uploads/${newThumbnail.filename}`;
      }

      // if new profile image exists, delete old one
      if (newProfileImage) {
        if (resume.profileInfo?.profilePreviewUrl) {
          const oldProfile = path.join(uploadsFolder, path.basename(resume.profileInfo.profilePreviewUrl));
          if (fs.existsSync(oldProfile)) {
            fs.unlinkSync(oldProfile);
          }
        }
        resume.profileInfo = resume.profileInfo || {};
        resume.profileInfo.profilePreviewUrl = `${baseUrl}/uploads/${newProfileImage.filename}`;
      }

      await resume.save();
      res.status(200).json({ 
        message: 'Images uploaded successfully',
        thumbnailLink: resume.thumbnailLink,
        profilePreviewUrl: resume.profileInfo?.profilePreviewUrl
      });
    });
    
  } catch (error) {
    console.error('Error uploading resume images:', error);
    res.status(500).json({ message: 'Server error while uploading image', error: error.message });
  }
}

module.exports = {
  uploadResumeImage,
};