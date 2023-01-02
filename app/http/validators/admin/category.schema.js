const Joi = require("@hapi/joi");
const joi = require("@hapi/joi");
const { MongoIDPattern } = require("../../../utils/constants");
const addCategorySchema = joi.object({
        title : joi.string().min(3).max(30).error(new Error("عنوان دسته بندی صحیح نمیباشد")),
        parent : joi.string().allow("").regex(MongoIDPattern).allow("").error(new Error("شناسه ارسال شده صحیح نمیباشد")),
        parent : joi.allow()
});
const updateCategorySchema = joi.object({
    title : joi.string().min(3).max(30).error(new Error("عنوان دسته بندی صحیح نمیباشد")),
    parent : joi.allow()
    
   
});


module.exports = {
    addCategorySchema,
    updateCategorySchema
}