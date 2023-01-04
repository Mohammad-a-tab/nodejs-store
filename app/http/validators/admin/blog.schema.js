const { MongoIDPattern } = require("../../../utils/constants");
const createError = require("http-errors");
const Joi = require("@hapi/joi");
const createBlogSchema = Joi.object({
    title : Joi.string().min(3).max(30).error(createError.BadRequest("The Blog title is not correct")),
    text: Joi.string().error(createError.BadRequest("The text sent is not correct")),
    short_text: Joi.string().error(createError.BadRequest("The text sent is not correct")),
    filename: Joi.string().pattern(/(\.png|\.jpg|\.webp|\.jpeg|\.gif)$/).error(createError.BadRequest("The picture sent is not correct")),
    tags: Joi.array().min(0).max(20).error(createError.BadRequest("Tags cannot be more than 20 items")),
    category: Joi.string().pattern(MongoIDPattern).error(createError.BadRequest("The desired category was not found")),
    fileUploadPath : Joi.allow()
});

module.exports = {
    createBlogSchema
}