const JWT = require('jsonwebtoken');
const User = require('../models/user');
const {JWT_SECRET} = require('../configs');

signToken = (user, date) => {
    return JWT.sign({
        iss: 'socialAuth',
        sub: user._id,
        iat: date.getTime/1000,
        exp: Math.round(new Date().setDate(date.getDate() * 60)/1000),
    }, JWT_SECRET);
}

module.exports = {
    signUp: async(req, res, next) => {
        // // email and pass
        // console.log('contents of req.value.body: ', req.value.body)
        const {email, password} = req.value.body;

        // does the user already exist?
        const userExists = await User.findOne({email});
        if (userExists) return res.status(409).json({ error: 'Email is already in use' })

        // create a new user
        const newUser = new User({
            email,
            password,
        });
        await newUser.save();

        // respond with token
        // res.json({user: 'created'});
        const token = signToken(newUser, new Date());

        res.status(200).json({token});
    },
    signIn: async(req, res, next) => {
        // generate token
        console.log('UsersController.signIn() called!')
    },
    secret: async(req, res, next) => {
        console.log('UsersController.secret() called!')
    },
}
