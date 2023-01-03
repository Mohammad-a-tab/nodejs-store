const joi = require("@hapi/joi");
const { MongoIDPattern } = require("../../../utils/constants");
const addCategorySchema = joi.object({
        title : joi.string().min(3).max(30).error(new Error("عنوان دسته بندی صحیح نمیباشد")),
        parent : joi.string().allow("").regex(MongoIDPattern).allow("").error(new Error("شناسه ارسال شده صحیح نمیباشد")),
        parent : joi.allow()
});
const updateCategorySchema = joi.object({
    title : joi.string().allow("").min(3).max(30).allow("").error(new Error("عنوان دسته بندی صحیح نمیباشد")),
    parent : joi.string().allow("").regex(MongoIDPattern).allow("").error(new Error("شناسه ارسال شده صحیح نمیباشد"))
    
   
});


module.exports = {
    addCategorySchema,
    updateCategorySchema
}