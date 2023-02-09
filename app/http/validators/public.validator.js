const { MongoIDPattern } = require('../../utils/constants');
const createHttpError = require('http-errors');
const joi = require('@hapi/joi');

const ObjectValidator = joi.object({
    id : joi.string().pattern(MongoIDPattern).error(createHttpError.BadRequest("The entered ID is not correct"))
});
module.exports = {
    ObjectValidator
}