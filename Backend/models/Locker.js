const { Schema, model } = require('mongoose');

const schema = new Schema({
    lockerName: { type: String, required: true },
    owner: { type: Schema.Types.ObjectId, ref: 'User' },
    isLocked: { type: Boolean, default: true },
    password: { type: String, required: true },
    banReason: { type: String, default: "No reason" },
}, { timestamps: true });

const Locker = model('locker', schema);

module.exports = Locker;
