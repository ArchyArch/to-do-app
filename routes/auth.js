const XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;
const bcrypt = require('bcrypt');
const {User, validate} = require('../models/user');
const express = require('express');

const router = express.Router();

router.post('/', async (req, res) => {
    const {error} = validate(req.body);
    if (error) {
        // let xhr = new XMLHttpRequest();
        // await xhr.open('GET', `http://localhost:3000/login/failed`, true);
        // xhr.setRequestHeader('x-failure-reason', error.details[0].message);
        // xhr.send();

        return res.status(400).send(error.details[0].message);
    }

    let user = await User.findOne({ email: req.body.email });
    if (!user) {
        // let xhr = new XMLHttpRequest();
        // await xhr.open('GET', `http://localhost:3000/login/failed`, true);
        // xhr.setRequestHeader('x-failure-reason', 'Invalid email or password.');
        // xhr.send();

        return res.status(400).send('Invalid email or password.');
    }

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) {
        // let xhr = new XMLHttpRequest();
        // await xhr.open('GET', `http://localhost:3000/login/failed`, true);
        // xhr.setRequestHeader('x-failure-reason', 'Invalid email or password.');
        // xhr.send();
        
        return res.status(400).send('Invalid email or password.');
    }

    const token = user.generateAuthToken();

    // let xhr = new XMLHttpRequest();
    // await xhr.open('GET', `http://localhost:3000/dashboard/${user._id}`, true);
    // xhr.setRequestHeader('x-auth-token', token);
    // xhr.send()

    res.status(200);
    res.setHeader('x-auth-token', token);
    res.setHeader('x-users-id', user._id);
    res.send();
})

module.exports = router;