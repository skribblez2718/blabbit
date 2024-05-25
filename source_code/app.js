if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config();
}

const express = require('express');
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const passportStrategy = require('passport-local');
const helmet = require('helmet');

const ExpressError = require('./utils/ExpressError')

const blabbitsRoutes = require('./routes/blabbits');
const reviewRoutes = require('./routes/reviews');
const userRoutes = require('./routes/users')

const User = require('./models/user')

const mongoose = require('mongoose');
const dbUrl = process.env.DB_URL;
const mongoSanitize = require('express-mongo-sanitize');

mongoose.connect(dbUrl);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});


const app = express();

app.engine('ejs', ejsMate);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')))

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

app.use(mongoSanitize());

const expiration = 1000 * 60 * 60 * 24

const secureFlagSet = (process.env.SECURE_FLAG_SET.toLowerCase() === "true") ? true : false
const sessionConfig = {
    name: 'blabbit_session',
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + expiration,
        maxAge: expiration,
        httpOnly: true,
        secure: secureFlagSet
    }
}

app.use(session(sessionConfig));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new passportStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

connectSrcUrls = [];

scriptSrcUrls = [];

styleSrcUrls = [];

fontSrcUrls = [];

imageSrcUrls = [
    "data:",
    `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload/`,
    "https://images.unsplash.com/",
];

app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: ["'none'"],
            connectSrc: ["'self'", ...connectSrcUrls],
            //scriptSrc: ["'self'", "'unsafe-inline'", ...scriptSrcUrls],
            scriptSrc: ["'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", ...styleSrcUrls],
            objectSrc: ["'none'"],
            imgSrc: ["'self'", ...imageSrcUrls],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);

app.use(flash());

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

app.use('/blabbits', blabbitsRoutes);
app.use('/blabbits/:id/review', reviewRoutes);
app.use('/', userRoutes);

app.get('/', (req, res) => {
    res.redirect('/blabbits');
})

app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404));
});

app.use((err, req, res, next) => {
    const { statusCode = 500, message = 'Something went wrong' } = err;

    if(statusCode === 404){
        res.render('404')
    }else {
        res.status(statusCode).render('error', { statusCode, message })
    }
})

app.listen(3000, () => {
    console.log('Listening on port 3000');
})

