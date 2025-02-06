const User = require('./userModel'); // ✅ Ensure correct path
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// ✅ Register User
exports.registerUser = async (req, res) => {
    try {
        console.log("📥 Received Registration Data:", req.body); // ✅ Debug log

        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ message: "❌ All fields are required!" });
        }

        let userExists = await User.findOne({ email });
        if (userExists) {
            console.log("⚠️ User already exists:", email);
            return res.status(400).json({ message: "❌ Email already in use!" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, email, password: hashedPassword });

        await newUser.save();
        console.log("✅ User saved successfully:", newUser);

        res.status(201).json({ message: "✅ Registration successful!", user: newUser });
    } catch (error) {
        console.error("❌ Registration error:", error);
        res.status(500).json({ message: "❌ Server error", error });
    }
};

// ✅ Login User
exports.loginUser = async (req, res) => {
    try {
        console.log("📥 Received Login Request:", req.body); // ✅ Log request data

        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "❌ Email and password are required!" });
        }

        const user = await User.findOne({ email });

        if (!user) {
            console.log("❌ User not found:", email);
            return res.status(400).json({ message: "❌ User not found!" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log("❌ Invalid password for:", email);
            return res.status(400).json({ message: "❌ Invalid credentials!" });
        }

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });

        console.log("✅ Login successful:", { username: user.username, email: user.email });

        res.json({ message: "✅ Login successful!", token, username: user.username }); // ✅ Send username

    } catch (error) {
        console.error("❌ Server Error in loginUser:", error);
        res.status(500).json({ message: "❌ Server error", error });
    }
};


// ✅ Update User Points
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
exports.getLeaderboard = async (req, res) => {
    try {
        const users = await User.find().sort({ points: -1 }).select("username points"); // ✅ Sort by points (highest first)
        res.json(users);
    } catch (error) {
        console.error("❌ Error fetching leaderboard:", error);
        res.status(500).json({ message: "❌ Server error", error });
    }
};