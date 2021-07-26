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
    
    passport.use(new localStrategy(function(username, password, done) {
        User.findOne({ username }, function(err, user) {
            if (err) { return done(err); }
            if(!user) { return done(null, false, { message: 'Incorrect username. '}); }
    
            bcrypt.compare(password, user.password, function(err, res) {
                if (err) return done(err);
                if(res === false) { return done(null, false, { message: 'Incorrect password. '}); }
    
                return done(null, user);
            });
        }); 
    }));

    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "/auth/google/callback",
        proxy: true
    }, (accessToken, refreshToken, profile, done) => {
        const image = profile.photos[0].value;
        
        const newUser = {
            googleID: profile.id,
            firstName: profile.name.givenName,
            lastName: profile.name.familyName,
            email: profile.emails[0].value,
            image: image
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

    passport.use(new FacebookStrategy({
        clientID: process.env.FACEBOOK_CLIENT_ID_TEST,
        clientSecret: process.env.FACEBOOK_CLIENT_SECRET_TEST,
        callbackURL: '/auth/facebook/callback',
        profileFields: ['id', 'displayName', 'photos', 'email', 'gender']
    }, (accessToken, refreshToken, profile, done) => {
        console.log(profile);
    }));


}
