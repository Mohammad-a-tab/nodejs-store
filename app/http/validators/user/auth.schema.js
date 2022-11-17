const joi = require("@hapi/joi")
const getOTPSchema = joi.object({
        mobile : joi.string().length(11).regex(/^09[0-9]{9}$/).error(new Error("شماره موبایل وارد شده نادرست است"))
});
const checkOTPSchema = joi.object({
    mobile : joi.string().length(11).regex(/^09[0-9]{9}$/).error(new Error("شماره موبایل وارد شده نادرست است")),
    code : joi.string().min(4).max(6).error(new Error("کد ارسال شده صحیح نمیباشد"))
});


module.exports = {
    getOTPSchema,
    checkOTPSchema
}