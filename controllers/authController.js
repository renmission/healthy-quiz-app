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
    failureRedirect: '/login'
}), 


exports.logout = (req, res, next) => {
    req.logout();
    res.redirect('/');
}


exports.getSignup = (req, res) => {
    const response = {
        title: "Sign up",
        error: req.query.error
    }        

    res.render('signup', response);
}

exports.signup = async (req, res) => {
  try {
    const { firstName, lastName, email, password, confirmPassword } = req.body;

    const hashPassword = await bcrypt.hash(password, 10);

    const newUser = {
       local: {
            firstName,
            lastName,
            email,
            password: hashPassword,
            confirmPassword: hashPassword
       }
    };

    new User(newUser)
            .save()
            .then(() => res.redirect('/'));

  } catch {
      res.redirect('/signup');
  }
}


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