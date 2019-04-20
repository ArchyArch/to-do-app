const jwt = require('jsonwebtoken');
const config = require('config');
const Joi = require('joi');
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        minlength: 6,
        maxlength: 256,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
        maxlength: 1024
    },
    lists: {
        type: Array
    },
    facebookId: Number
})

userSchema.methods.generateAuthToken = function() {
        const token = jwt.sign({ _id: this._id }, config.get('jwtPrivateKey'));
        return token;
}

const User = mongoose.model('User', userSchema);

function validateUser(user) {
    const schema = {
        email: Joi.string().min(6).max(256).email().required(),
        password: Joi.string().min(6).max(1024).required()
    }

    return Joi.validate(user, schema);
}

module.exports.User = User;
module.exports.validate = validateUser;