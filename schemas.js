const BaseJoi = require('joi');
const sanitizeHtml = require('sanitize-html');


const extension = (joi) => ({
    type: 'string',
    base: joi.string(),
    rules: {
        sanitizeHTML: {
            validate(value) {
                const clean = sanitizeHtml(value);
                
                return clean;
            }
        }
    }
});

const Joi = BaseJoi.extend(extension);

module.exports.BlabbitSchema = Joi.object({
    blabbit: Joi.object({
        message: Joi.string().required().sanitizeHTML()
    }).required(),
    deleteImages: Joi.array()
});

module.exports.ReviewSchema = Joi.object({
    review: Joi.object({
        body: Joi.string().required().sanitizeHTML(),
        rating: Joi.number().required().min(0).max(5)
    }).required()
})