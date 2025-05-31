const joi = require("joi");

module.exports.productsSchema = joi.object({
    product: joi.object({
        title: joi.string().required(),
        description: joi.string().required(),
        author: joi.string().required(),
        price: joi.number().required().min(65),
        discount: joi.number().allow("", null),
        image: joi.string().allow("", null),
        pdf: joi.string().allow("", null),
        category: joi.string().required()
    }).required()
});

module.exports.reviewSchema = joi.object({
    review: joi.object({
        rating: joi.number().required().min(1).max(5),
        comment: joi.string().required()
    }).required()
});