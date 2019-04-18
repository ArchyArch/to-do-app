const express = require('express');
const {User} = require('../models/user');

const router = express.Router();

router.get('/:id', async (req, res, next) => {
    const user = await User.findById(req.params.id);
    if (!user) {

        return res.status(400).send("User's dashboard not found.");
    }
    res.render('dashboard', user);
})

module.exports = router;