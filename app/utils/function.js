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
            expiresIn : "20d"
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


function ListOfImagesFromRequest(files, fileUploadPath) {
    if (files?.length > 0) {
        return ((files.map(file => path.join(fileUploadPath, file.filename))).map(item => item.replace(/\\/g, "/")))
    } else {
        return []
    }
}
function setFeatures(body) {
    const { colors, width, weight, height, length } = body;
    let features = {};
    features.colors = colors;
    if (!isNaN(+width) || !isNaN(+height) || !isNaN(+weight) || !isNaN(+length)) {
        if (!width) features.width = 0;
        else features.width = +width;
        if (!height) features.height = 0;
        else features.height = +height;
        if (!weight) features.weight = 0;
        else features.weight = +weight;
        if (!length) features.length = 0;
        else features.length = +length;
    }
    return features
}

function copyObject(object){
    return JSON.parse(JSON.stringify(object))
}
function deleteInvalidPropertyInObject(data = {}, blackListFields = []){
    let nullishData = ["", " ", "0", 0, null, undefined]
    Object.keys(data).forEach(key => {
        if(blackListFields.includes(key)) delete data[key]
        if(typeof data[key] == "string") data[key] = data[key].trim();
        if(Array.isArray(data[key]) && data[key].length > 0 ) data[key] = data[key].map(item => item.trim()) 
        if(Array.isArray(data[key]) && data[key].length == 0 ) delete data[key]
        if(nullishData.includes(data[key])) delete data[key];
    });
    
}
function getTime(seconds) {
    let total = Math.round(seconds) / 60;
    let [minutes, percent] = String(total).split(".");
    let second = Math.round((percent * 60) / 100).toString().substring(0, 2);
    let hours = 0;
    if (minutes > 60) {
        total = minutes / 60
         let [h1, percent] = String(total).split(".");
         hours = h1,
         minutes = Math.round((percent * 60) / 100).toString().substring(0, 2);
    }
    if(String(hours).length ==1) hours = `0${hours}`
    if(String(minutes).length ==1) minutes = `0${minutes}`
    if(String(second).length ==1) second = `0${second}`
    
    return (hours + ":" + minutes + ":" +second)
}
module.exports = {
    RandomNumberGenerator,
    SignAccessToken,
    SignRefreshToken,
    verifyRefreshToken,
    deleteFilePublic,
    ListOfImagesFromRequest,
    setFeatures,
    copyObject,
    deleteInvalidPropertyInObject,
    getTime   
}