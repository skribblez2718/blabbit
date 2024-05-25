const User = require('../models/user');

module.exports.renderRegister = (req, res) => {
    res.render('user/register');
}

module.exports.renderLogin = (req, res) => {
    res.render('user/login');
}
module.exports.register = async (req, res, next) => {
    try{
        const { email, username, password } = req.body
        const newUser = new User({email, username});
        const registeredUser = await User.register(newUser, password);

        req.login(registeredUser, function(err){
            if(err){ return next(err); }

            req.flash('success', 'Welcome to blabbit!');
            res.redirect('/blabbits');
        });
    }catch(e){
        req.flash('error', 'Registration failed!');
        res.redirect('/register');
    }
};

module.exports.login = async (req, res) => {
    req.flash('success', 'Welcome back!');
    const redirectUrl = req.session.returnTo || '/blabbits';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
};

module.exports.logout = (req, res, next) => {
    req.logout(function(err){
        if(err){ return next(err); }

        req.flash('success', 'Successfully logged out');
        res.redirect('/blabbits');
    });
}