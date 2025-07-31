const express = require('express');
const { body } = require('express-validator');
const { createCheckin, getCheckins } = require('../controllers/checkinController');
const auth = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(auth);

router.post('/', [
  body('moodRating').isInt({ min: 1, max: 10 }).withMessage('Mood rating must be between 1 and 10'),
  body('stressLevel').isIn(['Low', 'Medium', 'High']).withMessage('Invalid stress level'),
  body('journalEntry').trim().notEmpty().withMessage('Journal entry is required')
], createCheckin);

router.get('/', getCheckins);

module.exports = router;