const ExpressError = require('./utils/ExpressError');
const { BlabbitSchema, ReviewSchema } = require('./schemas')
const Blabbit = require('./models/blabbit');
const Review = require('./models/review');

module.exports.isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()){
        req.session.returnTo = req.originalUrl
        req.flash('error', 'You must be logged in to do that!');
        return res.redirect('/login');
    }
    next();
}

module.exports.isAuthor = async(req, res, next) => {
    const { id } = req.params;
    const foundBlabbit = await Blabbit.findById(id).populate('reviews').populate('author');

    if(!foundBlabbit.author.equals(req.user._id)){
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect(`/blabbits/${id}`);
    }
    next();
}

module.exports.isReviewAuthor = async(req, res, next) => {
    const { id, reviewId } = req.params;
    const foundReview = await Review.findById(reviewId);

    if(!foundReview.author.equals(req.user._id)){
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect(`/blabbits/${id}`);
    }
    next();
}

module.exports.validateBlabbit = (req, res, next) => {
    const { error } = BlabbitSchema.validate(req.body);

    if(error){
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

module.exports.validateReview = (req, res, next) => {
    const { error } = ReviewSchema.validate(req.body);

    if(error){
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}