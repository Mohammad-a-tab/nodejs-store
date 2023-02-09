const { MongoIDPattern } = require("../../../utils/constants");
const createError = require("http-errors");
const Joi = require("@hapi/joi");
const createProductSchema = Joi.object({
    title : Joi.string().min(3).max(30).error(createError.BadRequest("The Product title not correct")),
    text: Joi.string().error(createError.BadRequest("The text sent is not correct")),
    short_text: Joi.string().error(createError.BadRequest("The text sent is not correct")),
    tags: Joi.array().min(0).max(20).error(createError.BadRequest("Tags cannot be more than 20 items")),
    colors: Joi.array().min(0).max(20).error(createError.BadRequest("The selected colors cannot be more than 20 items")),
    category: Joi.string().regex(MongoIDPattern).error(createError.BadRequest("The Desired category was not found")),
    price: Joi.number().error(createError.BadRequest("The entered price is not correct")),
    discount: Joi.number().error(createError.BadRequest("The entered discount is not correct")),
    count: Joi.number().error(createError.BadRequest("The entered number is not correct")),
    weight: Joi.number().allow(null, 0, "0").error(createError.BadRequest("The entered weight is not correct")),
    length: Joi.number().allow(null, 0, "0").error(createError.BadRequest("The entered length is not correct")),
    height: Joi.number().allow(null, 0, "0").error(createError.BadRequest("The entered height is not correct")),
    width: Joi.number().allow(null, 0, "0").error(createError.BadRequest("The entered width is not correct")),
    type: Joi.string().regex(/(virtual|phisical)/i).error(createError.BadRequest("The Course Type is not Correct")),
    filename: Joi.string().regex(/(\.png|\.jpg|\.webp|\.jpeg|\.gif)$/).error(createError.BadRequest("The picture sent is not correct")),
    fileUploadPath : Joi.allow(),
    images : Joi.allow()
});

module.exports = {
    createProductSchema
}