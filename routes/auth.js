const config = require('config');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const {User, validate} = require('../models/user');
const mongoose = require('mongoose');
const express = require('express');

const router = express.Router();

router.post('/', async (req, res) => {
    const {error} = validate(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    let user = await User.findOne({ email: req.body.email });
    if (!user) {
        return res.status(400).send('Invalid email or password.');
    }

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) {
        return res.status(400).send('Invalid email or password.');
    }

    const token = user.generateAuthToken();

    let xhr = new XMLHttpRequest();
    await xhr.open('GET', `/dashboard/:${user._id}`, true);
    xhr.setRequestHeader('x-auth-token', token);
    xhr.send()
})

module.exports = router;