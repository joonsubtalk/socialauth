const User = require('../models/user');

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
        res.json({user: 'created'});
    },
    signIn: async(req, res, next) => {
        // generate token
        console.log('UsersController.signIn() called!')
    },
    secret: async(req, res, next) => {
        console.log('UsersController.secret() called!')
    },
}
