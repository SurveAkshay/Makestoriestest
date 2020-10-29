const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },
    age: {
        type: Number,
        required: true
    },
    email: {
        type: String,
        unique: true,
        trim: true,
        lowercase: true,
        required: true,
        validate(value) {
            if(!(validator.isEmail(value))) {
                throw new Error('Email is invalid')
            }
        }
    },
    phone: {
        type: String,
        required: true,
        validate(value) {
            if(!(validator.isMobilePhone(value, ["en-IN"]))) {
                throw new Error('Phone Number is invalid')
            }
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength:7,
        validate(value) {
            if(value.toLowerCase().includes('password')) {
                throw new Error('password cannot conatin "password"')
            }
        }
    },
    address: { type: String, trim: true },
    photo: { type: String },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
});


userSchema.methods.generateAuthToken = async function () {
    const user =this;
    const token = jwt.sign({_id: user._id.toString()}, 'thisissecretkey');
    user.tokens = user.tokens.concat({ token });
    await user.save();
    return token;
}

userSchema.methods.toJSON = function () {
    const user =this;

    const userObject = user.toObject();

    delete userObject.password;
    delete userObject.tokens;
    return userObject;
}

userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({email});

    if(!user) {
        throw new Error("unable to login");
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if(!isMatch) {
        throw new Error("unable to login");
    }

    return user;

}

//hash the plain text password
userSchema.pre('save', async function (next) {
    const user = this;
    if(user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }
    next()
})

const User = mongoose.model('User', userSchema);

module.exports = User;