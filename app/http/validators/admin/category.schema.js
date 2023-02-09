const { MongoIDPattern } = require("../../../utils/constants");
const joi = require("@hapi/joi");
const addCategorySchema = joi.object({
        title : joi.string().min(3).max(30).error(new Error("The category title is not correct")),
        parent : joi.string().allow("").regex(MongoIDPattern).allow("").error(new Error("The ID sent is not correct")),
        parent : joi.allow()
});
const updateCategorySchema = joi.object({
    title : joi.string().allow("").min(3).max(30).allow("").error(new Error("The category title is not correct")),
    parent : joi.string().allow("").regex(MongoIDPattern).allow("").error(new Error("The ID sent is not correct"))
    
   
});
module.exports = {
    addCategorySchema,
    updateCategorySchema
}