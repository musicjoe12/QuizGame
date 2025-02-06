const express = require('express');
const { registerUser, updatePoints, loginUser, getLeaderboard } = require('./userController');

const router = express.Router();

router.post('/register', registerUser); // User registration
router.put('/update-points', updatePoints); // Update quiz points
router.post('/login', loginUser);
router.get('/leaderboard', getLeaderboard);


module.exports = router;
