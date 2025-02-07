const express = require('express');
const { registerUser, updatePoints, loginUser, getLeaderboard } = require('../Controllers/userController');

const router = express.Router();

router.post('/register', registerUser); 
router.put('/update-points', updatePoints); 
router.post('/login', loginUser);
router.get('/leaderboard', getLeaderboard);


module.exports = router;
