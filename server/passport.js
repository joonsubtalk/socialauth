const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const { ExtractJwt } = require('passport-jwt');
const config = require('./configs');

const LocalStrategy = require('passport-local').Strategy;

const GooglePlusTokenStrategy = require('passport-google-plus-token');

const FacebookTokenStrategy = require('passport-facebook-token');

const User = require('./models/user');

// JWT Token Strategy
passport.use(new JwtStrategy({
    jwtFromRequest: ExtractJwt.fromHeader('authorization'),
    secretOrKey: config.JWT_SECRET,
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

// Google OAuth Token Strategy
passport.use('googleToken', new GooglePlusTokenStrategy({
    clientID: config.oauth.google.clientID,
    clientSecret: config.oauth.google.clientSecret,
}, async (accessToken, refreshToken, profile, done) => {
    try {
        // check if current user exists in DB
        const user = await User.findOne({ 'google.id': profile.id });
        if(user) return done(null, user);
        // if new account
        const newUser = new User({
            method: 'google',
            google: {
                id: profile.id,
                email: profile.emails[0].value,
            }
        });

        await newUser.save();
        done(null, newUser);

    } catch (error) {
        done(error, false, error.message);
    }
}));

// Facebook Token Strategy
passport.use('facebookToken', new FacebookTokenStrategy({
    clientID: config.oauth.facebook.clientID,
    clientSecret: config.oauth.facebook.clientSecret,
}, async(accessToken, refreshToken, profile, done) => {
    try {
        // check if current user exists in DB
        const user = await User.findOne({ 'facebook.id': profile.id });
        if(user) return done(null, user);
        // if new account
        const newUser = new User({
            method: 'facebook',
            facebook: {
                id: profile.id,
                email: profile.emails[0].value,
            }
        });

        await newUser.save();
        done(null, newUser);

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
        const user = await User.findOne({"local.email": email});
    
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
