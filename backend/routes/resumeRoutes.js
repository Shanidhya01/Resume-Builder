const express = require('express');
const {
  createResume,
  getUserResumes,
  getResumeById,
  updateResume,
  deleteResume,
} = require('../controllers/resumeController');
const { protect } = require('../middleware/authMiddleware');
const { uploadResumeImage } = require('../controllers/uploadImages');

const router = express.Router();

router.post('/', protect, createResume);
router.get('/', protect, getUserResumes);
router.get('/:id', protect, getResumeById);
router.put('/:id', protect, updateResume);
router.post('/:id/upload-images', protect, uploadResumeImage);

router.delete('/:id', protect, deleteResume);

module.exports = router;
