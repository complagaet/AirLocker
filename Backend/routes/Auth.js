require('dotenv').config()

const express = require('express');
const validator = require('validator');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();

router.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body

        if (!validator.isEmail(email)) {
            console.log("[POST /register] Bad email.");
            return res.status(400).json({ error: 'Bad email' });
        }

        const hashedPwd = await bcrypt.hash(password, 12);

        const user = new User({
            username: username,
            email: email,
            password: hashedPwd
        })
        await user.save()

        console.log("[POST /register] User created successfully.");
        res.status(200).json({ message: "User created successfully."});
    } catch (e) {
        console.log("[POST /register] Registration failed!");
        res.status(500).json({ error: "Registration failed" });
    }
})

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body

        const user = await User.findOne({ email: email })
        if (!user) {
            console.log("[POST /login] Email not found!");
            return res.status(401).json({ error: 'Login failed' });
        }

        const checkPasswords = await bcrypt.compare(password, user.password);
        if (!checkPasswords) {
            console.log("[POST /login] Wrong password!");
            return res.status(401).json({ error: 'Login failed' });
        }

        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '12h' })
        console.log("[POST /login] Login successfully!");
        res.status(200).json({ message: "Login successfully.", token: token });
    } catch (e) {
        console.log("[POST /login] Login failed!");
        res.status(500).json({ error: "Login failed" });
    }
})

module.exports = router;