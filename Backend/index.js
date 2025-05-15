require('dotenv').config()

const PORT = process.env.PORT || 3000;
const DB_URL = process.env.DB_URL || 'mongodb://localhost:27017'

const fs = require('fs');
const express = require('express');
const mongoose = require('mongoose');
const app = express();

mongoose.connect(`${DB_URL}`).then(() => console.log(`Connected to MongoDB`));

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const checkToken = require('./middleware/checkToken');
const isNotBanned = require('./middleware/isNotBanned');

const AuthRoutes = require('./routes/Auth');
const AdminRoutes = require('./routes/Admin');
const UserRoutes = require('./routes/User');
const LockerRoutes = require('./routes/Locker');

app.use('/api', AuthRoutes)
app.use('/api', checkToken, AdminRoutes)
app.use('/api', checkToken, UserRoutes)
app.use('/api', LockerRoutes)

app.get("/secured", checkToken, async (req, res) => {
    res.send("ok")
})

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
})