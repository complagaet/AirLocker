require('dotenv').config()

const express = require('express');
const User = require('../models/User');
const router = express.Router();

const isAdmin = require('../middleware/isAdmin');

router.get('/admin/users', isAdmin, async (req, res) => {
    try {
        let userList = []

        const users = await User.find({}, { password: 0, __v: 0 });
        users.forEach((doc) => { userList.push(doc) })

        console.log("[GET admin/users] Shared userList successfully.");
        res.json(userList)
    } catch (e) {
        console.log("[GET admin/users] Unknown error.");
        res.status(520).json({error: "Unknown error."})
    }
})

router.patch('/admin/user/:id', isAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const { username, email, status, banReason } = req.body;

        if (username === undefined && email === undefined && status === undefined && banReason === undefined) {
            console.log("[PATCH admin/user] No fields provided for update.");
            return res.status(400).json({ error: "At least one field must be provided for update." });
        }

        const user = await User.findOne({ _id: id });
        if (!user) {
            console.log("[PATCH admin/user] User not found or access denied.");
            return res.status(404).json({ error: "User not found or access denied." });
        }

        if (username) user.username = username;
        if (email) user.email = email;
        if (status) user.status = status;
        if (banReason) user.banReason = banReason;

        await user.save();

        console.log("[PATCH admin/user] User updated successfully.");
        res.status(200).json({ message: "User updated successfully." });
    } catch (e) {
        console.log("[PATCH user] User update error.", e);
        res.status(520).json({ error: "Unknown error." });
    }
})

router.delete('/admin/user/:id', isAdmin, async (req, res) => {
    try {
        const { id } = req.params;

        const userDeleteResult = await User.deleteOne({ _id: id })

        if (userDeleteResult.deletedCount === 0) {
            console.log("[DELETE admin/user] User not found.");
            return res.status(404).json({ error: "User not found." });
        }

        console.log("[DELETE admin/user] User deleted successfully.");
        res.status(200).json({ message: "User deleted successfully." });
    } catch (e) {
        console.log("[DELETE user] User update error.", e);
        res.status(520).json({ error: "Unknown error." });
    }
})

module.exports = router;