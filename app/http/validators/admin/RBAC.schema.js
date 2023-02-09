const Joi = require("@hapi/joi");
const createHttpError = require("http-errors");
const {MongoIDPattern} = require("../../../utils/constants")
const addRoleSchema = Joi.object({
    title : Joi.string().min(3).max(30).error(createHttpError.BadRequest("The Role Title is not correct")),
    description : Joi.string().min(0).max(100).error(createHttpError.BadRequest("The role description is not correct")),
    permissions : Joi.array().items(Joi.string().pattern(MongoIDPattern)).error(createHttpError.BadRequest("The permission send is not correct")),
});
const addPermissionSchema = Joi.object({
    name : Joi.string().min(3).max(30).error(createHttpError.BadRequest("The permission name is not correct")),
    description : Joi.string().min(0).max(100).error(createHttpError.BadRequest("The permission description is not correct")),
});


module.exports = {
    addRoleSchema,
    addPermissionSchema
}