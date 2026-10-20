const express = require('express');
const router = express.Router();
const {
  submitContactMessage,
  getAllMessages,
  updateMessageStatus
} = require('../controllers/contactController');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/', submitContactMessage);
router.get('/', protect, admin, getAllMessages);
router.patch('/:id/status', protect, admin, updateMessageStatus);

module.exports = router;
