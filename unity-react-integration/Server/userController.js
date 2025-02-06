const User = require('./userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// User Registration
exports.registerUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Check if user already exists
        let userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ message: "❌ Email already in use!" });

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save();

        res.status(201).json({ message: "✅ User registered successfully!" });
    } catch (error) {
        res.status(400).json({ message: "❌ Registration failed", error });
    }
};

// Update User Points
exports.updatePoints = async (req, res) => {
    try {
        const { username, points } = req.body;

        const user = await User.findOneAndUpdate(
            { username },
            { $inc: { points: points } }, // Increment points
            { new: true }
        );

        if (!user) return res.status(404).json({ message: "❌ User not found" });

        res.json({ message: "✅ Points updated!", user });
    } catch (error) {
        res.status(500).json({ message: "❌ Error updating points", error });
    }
};
