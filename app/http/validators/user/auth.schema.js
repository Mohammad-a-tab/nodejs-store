const joi = require("@hapi/joi")
const authSchema = joi.object({
        mobile : joi.string().length(11).pattern(/^09[0-9]{9}$/).error(new Error("شماره موبایل وارد شده نادرست است"))
});


module.exports = {
    authSchema
}