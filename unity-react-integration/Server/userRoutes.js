const express = require('express');
const { registerUser, updatePoints } = require('./userController');

const router = express.Router();

router.post('/register', registerUser); // User registration
router.put('/update-points', updatePoints); // Update quiz points

module.exports = router;
