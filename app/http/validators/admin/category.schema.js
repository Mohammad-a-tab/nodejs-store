const joi = require("@hapi/joi");
const { MongoIDPattern } = require("../../../utils/constants");
const addCategorySchema = joi.object({
        title : joi.string().min(3).max(30).error(new Error("عنوان دسته بندی صحیح نمیباشد")),
        parent : joi.string().allow("").pattern(MongoIDPattern).allow("").error(new Error("شناسه ارسال شده صحیح نمیباشد"))
});
const updateCategorySchema = joi.object({
    title : joi.string().min(3).max(30).error(new Error("عنوان دسته بندی صحیح نمیباشد"))
   
});


module.exports = {
    addCategorySchema,
    updateCategorySchema
}