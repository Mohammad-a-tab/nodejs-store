const JWT = require("jsonwebtoken");
const createError = require("http-errors");
const { UserModel } = require("../models/users");
const { SECRET_KEY } = require("./constants");

function RandomNumberGenerator(){
    return Math.floor((Math.random() * 90000) + 10000)
}

function SignAccessToken(userID){
    return new Promise(async (resolve , reject) => {
        const user = await UserModel.findById(userID)
        const payload = {
            mobile : user.mobile,
            userID : user._id
        }
        const options = {
            expiresIn : "1h"
        }
        JWT.sign(payload , SECRET_KEY , options , (err , token) => {
            if(err) reject(createError.InternalServerError("خطای سروری"));
            resolve(token)
        })
    });
  
}

module.exports = {
    RandomNumberGenerator,
    SignAccessToken
}