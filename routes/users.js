const XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;
const express = require('express');
const _ = require('lodash');
const bcrypt = require('bcrypt');
const {User, validate} = require('../models/user');

const router = express.Router();

router.post('/', async (req, res) => {
    const {error} = validate(req.body);
    if (error) {
        let xhr = new XMLHttpRequest();
        await xhr.open('GET', 'http://localhost:3000/register/failed');
        xhr.setRequestHeader('x-failure-reason', error.details[0].message);
        xhr.send();

        return res.status(400).send(error.details[0].message);
    }

    let user = await User.findOne({ email: req.body.email });
    if (user) {
        let xhr = new XMLHttpRequest();
        await xhr.open('GET', 'http://localhost:3000/register/failed');
        xhr.setRequestHeader('x-failure-reason', 'User already registered.');
        xhr.send();
        
        return res.status(400).send('User already registered.');
    }

    user = new User(_.pick(req.body, ['email', 'password']));

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);

    await user.save();

    const token = user.generateAuthToken();

    let xhr = new XMLHttpRequest();
    await xhr.open('GET', `http://localhost:3000/dashboard/:${user._id}`, true);
    xhr.setRequestHeader('x-auth-token', token);
    xhr.send();

    res.status(201).send(user);
})

module.exports = router;