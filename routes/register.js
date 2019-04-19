const express = require('express');

const router = express.Router();

router.get('/', (req, res, next) => {
    res.render('register');
})

router.get('/failed', (req, res, next) => {
    const failureReason = req.header('x-failure-reason');
    res.render('register', failureReason);
})

module.exports = router;