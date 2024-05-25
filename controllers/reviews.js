const Review = require('../models/review');
const Blabbit = require('../models/blabbit');

module.exports.createReview = async (req, res) => {
    const blabbit = await Blabbit.findById(req.params.id)
    const review = new Review(req.body.review)

    review.author = req.user._id;
    blabbit.reviews.push(review);

    await review.save();
    await blabbit.save();

    req.flash('success', 'Review successfully created')

    res.redirect(`/blabbits/${blabbit._id}`)
};

module.exports.deleteReview = async (req, res) => {
    const { id, reviewId } = req.params;
    
    await Blabbit.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);

    req.flash('success', 'Review successfully deleted')

    res.redirect(`/blabbits/${id}`);
};