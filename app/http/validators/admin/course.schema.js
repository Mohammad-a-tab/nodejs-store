const { MongoIDPattern } = require("../../../utils/constants");
const createError = require("http-errors");
const Joi = require("@hapi/joi");
const createCourseSchema = Joi.object({
    title : Joi.string().min(3).max(30).error(createError.BadRequest("The Course title is not correct")),
    text: Joi.string().error(createError.BadRequest("The text sent is not correct")),
    short_text: Joi.string().error(createError.BadRequest("The text sent is not correct")),
    tags: Joi.array().min(0).max(20).error(createError.BadRequest("Tags cannot be more than 20 items")),
    category: Joi.string().regex(MongoIDPattern).error(createError.BadRequest("The desired category was not found")),
    discountedPrice: Joi.number().error(createError.BadRequest("The entered discountedPrice is not correct")),
    price: Joi.number().error(createError.BadRequest("The entered price is not correct")),
    discount: Joi.number().error(createError.BadRequest("The entered discount is not correct")),
    type: Joi.string().regex(/(free|cash|special)/i).error(createError.BadRequest("The Course Type is not Correct")),
    filename: Joi.string().regex(/(\.png|\.jpg|\.webp|\.jpeg|\.gif)$/).error(createError.BadRequest("The picture sent is not correct")),
    fileUploadPath : Joi.allow(),
});
const createEpisodeSchema = Joi.object({
    title : Joi.string().min(3).max(30).error(createError.BadRequest("The Episode Title is not correct")),
    text: Joi.string().error(createError.BadRequest("The text sent is not correct")),
    type: Joi.string().regex(/(lock|unlock)/i),
    chapterID: Joi.string().regex(MongoIDPattern).error(createError.BadRequest("The chapter ID is not correct")),
    courseID: Joi.string().regex(MongoIDPattern).error(createError.BadRequest("The Course ID is not correct")),
    filename: Joi.string().regex(/(\.mp4|\.mov|\.mkv|\.mpg)$/).error(createError.BadRequest("The picture sent is not correct")),
    fileUploadPath : Joi.allow(),
    episodeID : Joi.allow()
});

module.exports = {
    createCourseSchema,
    createEpisodeSchema
}