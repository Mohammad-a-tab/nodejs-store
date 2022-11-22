const JWT = require("jsonwebtoken");
const createError = require("http-errors");
const fs = require("fs");

const { UserModel } = require("../models/users");
const { ACCESS_TOKEN_SECRET_KEY, REFRESH_TOKEN_SECRET_KEY } = require("./constants");
const redisClient = require("./init_redis");
const path = require("path");

function RandomNumberGenerator(){
    return Math.floor((Math.random() * 90000) + 10000)
}

function SignAccessToken(userID){
    return new Promise(async (resolve , reject) => {
        const user = await UserModel.findById(userID)
        const payload = {
            mobile : user.mobile
        }
        const options = {
            expiresIn : "2d"
        }
        JWT.sign(payload , ACCESS_TOKEN_SECRET_KEY , options , (err , token) => {
            if(err) reject(createError.InternalServerError("خطای سروری"));
            resolve(token)
        })
    });
  
}

 function SignRefreshToken(userID){
    return new Promise(async (resolve , reject) => {
        const user = await UserModel.findById(userID)
        const payload = {
            mobile : user.mobile
        }
        const options = {
            expiresIn : "365d"
        }
        JWT.sign(payload , REFRESH_TOKEN_SECRET_KEY , options , async (err , token) => {
            if(err) reject(createError.InternalServerError("خطای سروری"));
            await redisClient.SETEX(String(userID), (365 * 24 * 60 * 60) ,token);
            resolve(token)
        })
    });
  
}


function verifyRefreshToken(token){
    return new Promise((resolve , reject) => {
        JWT.verify(token , REFRESH_TOKEN_SECRET_KEY , async (err , payload) => {
            if(err) reject(createError.Unauthorized("لطفا وارد حساب کاربری خود شوید"));
            const {mobile} = payload || {}
            const user = await UserModel.findOne({mobile} , {password : 0 , otp : 0});
            if(!user) reject(createError.Unauthorized("حساب کاربری یافت نشد"));
            const refreshToken = await redisClient.get(String(user?._id || "key-default"));
            if(!refreshToken) reject(createError.Unauthorized("ورود به حساب کاربری انجام نشد"))
            if(token === refreshToken) return resolve(mobile);
            reject(createError.Unauthorized("ورود به حساب کاربری انجام نشد"));
           
           
        });
        
    })
}

function deleteFilePublic(fileAddress) {
    if (fileAddress) {
        const pathFile = path.join(__dirname, "..", "..", "public", fileAddress)
        if (fs.existsSync(pathFile)) fs.unlinkSync(pathFile)
    }
}

module.exports = {
    RandomNumberGenerator,
    SignAccessToken,
    SignRefreshToken,
    verifyRefreshToken,
    deleteFilePublic
}