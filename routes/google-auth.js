const bcrypt = require('bcrypt');
const express = require('express');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const config = require('config');
const {User} = require('../models/user')

passport.use(new GoogleStrategy({
    clientID: '795838790756-gonmujcteqn6ibiia2mlnd777452jam3.apps.googleusercontent.com',
    clientSecret: config.get('googleSecret'),
    callbackURL: "http://localhost:3000/viagoogle/auth/google/callback"
}, async function (accessToken, refreshToken, profile, done) {
    let user = await User.findOne({ 'googleId': profile.id } );
    if (!user) {
        const salt = await bcrypt.genSalt(10);
        const hashed = await bcrypt.hash(profile.displayName, salt);

        user = new User({
            email: profile.emails[0].value,
            password: hashed,
            googleId: profile.id
        });

        await user.save(function (err) {
            if (err) console.log(err);
            return done(err, user);
        });
    } else {
        return done(null, user);
    }
}))

const router = express.Router();

router.get('/auth/google', passport.authenticate('google', {
    scope: [
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/userinfo.email'
    ]
}));

router.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/login'}), async function (req, res) {
    res.redirect(`http://localhost:3000/viagoogle/dashboard/${req.user._id}`);
})

router.get('/dashboard/:id', async (req, res, next) => {
    const user = await User.findById(req.params.id);
    if (!user) {

        return res.status(400).send("User's dashboard not found.");
    }
    res.render('dashboard', user);
})

module.exports = router;