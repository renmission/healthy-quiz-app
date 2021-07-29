const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const localStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const User = require('./../models/userModel');


module.exports = (passport) => {
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });
    
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });
    
    // login local
    passport.use(new localStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
    }, (req, email, password, done) => {

        User.findOne({ 'local.email': email }, async (err, user) => {

            if (err) return done(err);

            if(!user) return done(null, false, { message: 'Incorrect username. '});

            try {
                if (await bcrypt.compare(password , user.local.password)) {
                    return done(null, user);
                }else{
                    return done(null, false, { message: 'Incorrect password. '});
                }
            } catch (error) {
                return done(error);
            } 
        }); 

    }));

    // login with google
    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "/auth/google/callback",
        proxy: true
    }, (accessToken, refreshToken, profile, done) => {
        const image = profile.photos[0].value;
        
        const newUser = {
            google: {
                googleID: profile.id,
                firstName: profile.name.givenName,
                lastName: profile.name.familyName,
                email: profile.emails[0].value,
                image: image
            }
        }

        // check for existing user
        User
            .findOne({ googleID: profile.id })
            .then( user => {
                if (user) {
                    // return user
                    done(null, user)
                }else{
                    // create user
                    new User(newUser)
                        .save()
                        .then(user => done(null, user));
                }
            });

    }));

    // login with facebook
    passport.use(new FacebookStrategy({
        clientID: process.env.FACEBOOK_CLIENT_ID_TEST,
        clientSecret: process.env.FACEBOOK_CLIENT_SECRET_TEST,
        callbackURL: '/auth/facebook/callback',
        profileFields: ['id', 'displayName', 'photos', 'email', 'gender']
    }, (accessToken, refreshToken, profile, done) => {

        const image = profile.photos[0].value;
        const newUser = {
           facebook: {
                facebookID: profile.id,
                facebookDisplayName: profile.displayName,
                firstName: profile.name.givenName,
                lastName: profile.name.familyName,
                image: image
           }
        }

        User
            .findOne({ facebookID: profile.id })
            .then( user => {
                if (user) {
                    done(null, user);
                }else {
                    new User(newUser)
                            .save()
                            .then(user => done(null, user));
                }
            });
    }));


}
