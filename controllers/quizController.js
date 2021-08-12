const express = require('express');

exports.getQuiz = (req, res, next) => {
    res.render('quiz', { title: 'Quiz Section', isLoggedIn: true } );
}