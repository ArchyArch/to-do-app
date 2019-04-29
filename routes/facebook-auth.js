const bcrypt = require('bcrypt');
const express = require('express');
const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const config = require('config');
const {User} = require('../models/user');
const XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;

passport.use(new FacebookStrategy({
    clientID: 350663588907201,
    clientSecret: config.get('fbAppSecret'),
    callbackURL: "http://localhost:3000/viafb/auth/facebook/callback",
    profileFields: ['id', 'displayName', 'emails']
}, async function (accessToken, refreshToken, profile, cb) {
    let user = await User.findOne({ 'facebookId': profile.id } );
    if (!user) {
        const salt = await bcrypt.genSalt(10);
        const hashed = await bcrypt.hash(profile.displayName, salt);

        user = new User({
            email: `fb${profile.emails[0].value}`,
            password: hashed,
            facebookId: profile.id
        });

        await user.save(async function (err) {
            if (err) {
                let xhr = new XMLHttpRequest();
                await xhr.open('GET', `http://localhost:3000/login/failed`, true);
                xhr.setRequestHeader('x-failure-reason', 'Something went wrong with fb login/register.');
                xhr.send();
                console.log(err);
            }
            return cb(err, user);
        });
    } else {
        return cb(null, user);
    }
}));

passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (user, done) {
    done(null, user);
});

const router = express.Router();

router.get('/auth/facebook', passport.authenticate('facebook', { scope: ['email']}));
router.get('/auth/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/login'}), async function (req, res) {
    res.redirect(`http://localhost:3000/viafb/dashboard/${req.user._id}`);
})

router.get('/dashboard/:id', async (req, res, next) => {
    const user = await User.findById(req.params.id);
    if (!user) {

        return res.status(400).send("User's dashboard not found.");
    }
    res.render('dashboard', user);
})

module.exports = router;
