const express = require('express');
const session = require('express-session');
const hbs = require('express-handlebars');
const passport = require('passport');
const mongoose = require('mongoose');
require('dotenv').config();

// Config
require('./config/passport')(passport);

// Router init
const userRouter = require('./routes/userRoutes');
const authRouter = require('./routes/authRoutes');
const quizRouter = require('./routes/quizRoutes');

const app = express();

const dbOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
}

mongoose
    .connect(process.env.DB_URL, dbOptions)
    .then(() => console.log("DB CONNECTED SUCCESSFULY..."))
    .catch(err => console.log(err));
    
// MIDDLEWARE
app.engine('hbs', hbs({ extname: '.hbs'}));
app.set('view engine', 'hbs');
app.use(express.static(__dirname + "/public"));

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// PassportJS
app.use(passport.initialize());
app.use(passport.session());


// ROUTES
app.use('/', userRouter);
app.use('/auth', authRouter);
app.use('/', quizRouter);

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`App Listening on port ${port}`));