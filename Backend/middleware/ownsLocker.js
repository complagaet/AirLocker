const { ObjectId } = require("mongodb");
const Locker = require("../models/Locker");

const ownsLocker = async (req, res, next) => {
    try {
        const lockerId = new ObjectId(req.params.id);
        const locker = await Locker.findById(lockerId);

        if (!locker) {
            console.log("[ownsLocker] Locker not found.");
            return res.status(404).json({ error: "Locker not found." });
        }

        const user = req.user;
        const owns = user.lockers.some(id => id.equals(lockerId));

        if (!owns) {
            console.log("[ownsLocker] Forbidden: User does not own this locker.");
            return res.status(403).json({ error: "Forbidden." });
        }

        req.lockerId = lockerId;
        req.locker = locker;
        next();
    } catch (err) {
        console.error("[ownsLocker] Error:", err);
        return res.status(400).json({ error: "Invalid locker ID." });
    }
};

module.exports = ownsLocker;

