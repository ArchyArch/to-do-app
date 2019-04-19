const express = require('express');

const router = express.Router();

router.get('/', (req, res, next) => {
    res.render('login');
})

router.get('/failed', (req, res, next) => {
    const failureReason = req.header('x-failure-reason');
    res.render('login', failureReason);
})

module.exports = router;