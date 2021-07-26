const express = require('express');
const User = require('../models/userModel');
const passport = require('passport');
const bcrypt = require('bcrypt');

exports.isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) return next();
    res.redirect('/login');
}

exports.isLoggedOut = (req, res, next) => {
    if (!req.isAuthenticated()) return next();
    res.redirect('/');
}

exports.home = (req, res) => {
    res.render('index', {title: 'Home'} );
}

exports.getLogin = (req, res) => {
    const response = {
        title: "login",
        error: req.query.error
    }        

    res.render('login', response);
}

exports.loginLocal = passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login?error=true'
});

exports.logout = (req, res, next) => {
    req.session = null;
    req.logout();
    res.redirect('/');
}

exports.signup = async (req, res) => {
    const { name, email, password, confirmPassword } = req.body;

    const newUser = await User.create({
        name,
        email,
        password,
        confirmPassword
    });

    await newUser.save();

    res.redirect('/login');
}

// exports.signup = async (req, res) => {
//     const exists = await User.exists({ user: "admin" });
//     if (exists) {
//         return res.redirect('/login');
//     }

//     bcrypt.genSalt(10, function (err, salt) {
//         if (err) return next(err);
//         bcrypt.hash('mypassword', salt, function (err, hash) {
//             const newAdmin = new User({
//                 username: "admin",
//                 password: hash
//             });

//             newAdmin.save();

//             res.redirect('/login');
//         });
//     });
// }

// exports.signup = async (req, res, next) => {
//     const { name, email, password, confirmPassword } = req.body;

//     const newUser = await new User({
//         name,
//         email,
//         password,
//         confirmPassword
//     });

//     res.status(200).json({
//         status: 'success',
//         data: {
//             user: newUser
//         }
//     });
// }


exports.googleLogin = passport.authenticate('google', { scope: ['profile', 'email'] });

exports.googleLoginCallback = passport.authenticate('google', { 
    successRedirect: '/',
    failureRedirect: '/login' 
});

exports.facebookLogin = passport.authenticate('facebook');

exports.facebookLoginCallback = passport.authenticate('facebook', { 
    successRedirect: '/',
    failureRedirect: '/login' 
});