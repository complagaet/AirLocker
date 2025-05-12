require('dotenv').config();

const { ObjectId } = require('mongodb');

const express = require('express');
const router = express.Router();

const checkToken = require("../middleware/checkToken");
const isNotBanned = require("../middleware/isNotBanned");
const ownsLocker = require("../middleware/ownsLocker");

const Locker = require("../models/Locker");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const isAdmin = require("../middleware/isAdmin");

router.post("/locker", checkToken, isNotBanned, async (req, res) => {
    try {
        const user = req.user;
        const { lockerName, password } = req.body;

        const hashedPwd = await bcrypt.hash(password, 12);

        const locker = new Locker({
            lockerName,
            password: hashedPwd
        });

        await locker.save();

        user.lockers.push(locker._id);
        await user.save();

        console.log("[POST /locker] Locker created successfully.");
        res.status(200).json({
            message: "Locker created successfully.",
            lockerId: locker._id
        });
    } catch (err) {
        console.error("[POST /locker] Unknown error:", err);
        res.status(520).json({ error: "An unknown error occurred." });
    }
});


router.get("/locker/:id", checkToken, isNotBanned, ownsLocker, async (req, res) => {
    try {
        const locker = req.locker.toObject();
        delete locker.password;
        delete locker.__v;

        console.log("[GET /locker] Locker shared successfully.");
        res.status(200).json(locker);
    } catch (err) {
        console.error("[GET /locker] Error:", err);
        res.status(500).json({ error: "An unknown error occurred." });
    }
});


router.put("/locker/:id", checkToken, isNotBanned, ownsLocker, async (req, res) => {
    try {
        const updates = {};
        const { isLocked, password, lockerName } = req.body;

        if (typeof isLocked === "boolean") {
            updates.isLocked = isLocked;
        }

        if (typeof lockerName === "string" && lockerName.trim()) {
            updates.lockerName = lockerName.trim();
        }

        if (typeof password === "string" && password.trim()) {
            updates.password = await bcrypt.hash(password, 12);
        }

        if (Object.keys(updates).length === 0) {
            return res.status(400).json({ error: "No valid fields to update." });
        }

        const updatedLocker = await Locker.findByIdAndUpdate(
            req.lockerId,
            { $set: updates },
            { new: true, projection: { password: 0, __v: 0 } }
        );

        if (!updatedLocker) {
            return res.status(404).json({ error: "Locker not found." });
        }

        console.log("[PUT /locker] Locker updated successfully.");
        res.status(200).json(updatedLocker);
    } catch (err) {
        console.error("[PUT /locker] Error:", err);
        res.status(500).json({ error: "Failed to update locker." });
    }
});

router.delete("/locker/:id", checkToken, isNotBanned, ownsLocker, async (req, res) => {
    try {
        const lockerId = req.lockerId;

        const deletedLocker = await Locker.findByIdAndDelete(lockerId);

        if (!deletedLocker) {
            return res.status(404).json({ error: "Locker not found." });
        }

        await req.user.updateOne({ $pull: { lockers: lockerId } });

        console.log("[DELETE /locker] Locker deleted and reference removed from user.");
        res.status(200).json({ message: "Locker deleted successfully." });
    } catch (err) {
        console.error("[DELETE /locker] Error:", err);
        res.status(500).json({ error: "Failed to delete locker." });
    }
});


module.exports = router;
