require('dotenv').config()

const User = require('../models/User');

const isNotBanned = async (req, res, next) => {
    try {
        const user = await User.findOne({ _id: req.decodedToken._id })
        if (user.status === "ban") {
            console.log("[isNotBanned] User banned.");
            return res.status(401).json({ error: "User banned." })
        }

        console.log(`[isNotBanned] ${user.username} is not banned.`);

        req.user = user
        next()
    } catch (e) {
        console.log("[isNotBanned] Unknown error.");
        res.status(520).json({ error: "Unknown error." })
    }
}

module.exports = isNotBanned;