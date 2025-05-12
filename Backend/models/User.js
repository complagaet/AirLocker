const { Schema, model } = require('mongoose');

const schema = new Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    status: { type: String, default: "user" },
    banReason: { type: String, default: "No reason" },
    lockers: [{ type: Schema.Types.ObjectId, ref: 'locker' }],
}, { timestamps: true });

const User = model('user', schema);

module.exports = User;
