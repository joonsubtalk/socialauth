const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const { ExtractJwt } = require('passport-jwt');
const { JWT_SECRET } = require('./configs');

const LocalStrategy = require('passport-local').Strategy;

const User = require('./models/user');

// JWT Token Strategy
passport.use(new JwtStrategy({
    jwtFromRequest: ExtractJwt.fromHeader('authorization'),
    secretOrKey: JWT_SECRET,
}, async (payload, done) => {
    try {
        // find user specified in token
        const user = await User.findById(payload.sub);

        // if user doesn't exists, handle it
        if (!user) return done(null, false);

        // otherwise, return user
        done(null, user);

    } catch (error) {
        done(error, false);
    }
}));

// Local Strategy
passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
}, async (email, password, done) => {
    try {
        // Find user given email
        const user = await User.findOne({email});
    
        // If not, handle it.
        if (!user) return done(null, false);
    
        // check if pw is correct
        const isPasswordMatch = await user.isValidPassword(password);
    
        // If not, handle it.
        if (!isPasswordMatch) return done(null, false);
    
        // Otherwise, return user.
        done(null, user);
    } catch (error) {
        done(error, false);
    }
}));
