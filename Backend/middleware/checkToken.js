require('dotenv').config()

const jwt = require('jsonwebtoken');

const checkToken = (req, res, next) => {
    try {
        const token = req.header('Authorization');

        if (!token) {
            console.log("[checkToken] Access denied.");
            return res.status(401).json({ error: "Access denied." })
        }

        req.decodedToken = jwt.verify(token, process.env.JWT_SECRET);

        next()
    } catch (e) {
        console.log("[checkToken] Invalid token.");
        res.status(401).json({ error: "Invalid token." })
    }
}

module.exports = checkToken;