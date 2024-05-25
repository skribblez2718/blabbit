const mongoose = require('mongoose');
const Review = require('./review');
const User = require('./user');
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
    url: String,
    filename: String
});

ImageSchema.virtual('thumbnail').get(function() {
    return this.url.replace('/upload', '/upload/c_thumb,w_200');
});

const BlabbitSchema = new Schema({
    image: {
        type: ImageSchema,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: User
    },
    submittedAt: {
        type: Date,
        required: true
    },
    key: {
        type: String,
        required: true
    },
    authTag: {
        type: String,
        required: true
    },
    iv: {
        type: String,
        required: true
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ],
});

BlabbitSchema.post('findOneAndDelete', async function(doc) {
    if(doc){
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
});

module.exports = mongoose.model('Blabbit', BlabbitSchema);