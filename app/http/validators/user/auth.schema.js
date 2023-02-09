const joi = require("@hapi/joi")
const getOTPSchema = joi.object({
        mobile : joi.string().length(11).regex(/^09[0-9]{9}$/).error(new Error("The mobile number entered is incorrect"))
});
const checkOTPSchema = joi.object({
    mobile : joi.string().length(11).regex(/^09[0-9]{9}$/).error(new Error("The mobile number entered is incorrect")),
    code : joi.string().min(4).max(6).error(new Error("The code sent is not correct"))
});


module.exports = {
    getOTPSchema,
    checkOTPSchema
}