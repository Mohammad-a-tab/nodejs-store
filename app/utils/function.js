const { ACCESS_TOKEN_SECRET_KEY, REFRESH_TOKEN_SECRET_KEY } = require("./constants");
const { UserModel } = require("../models/users");
const redisClient = require("./initRedis");
const createError = require("http-errors");
const moment = require("moment-jalali");
const JWT = require("jsonwebtoken");
const path = require("path");
const fs = require("fs")

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
            if(err) reject(createError.InternalServerError("Internal server error"));
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
            if(err) reject(createError.InternalServerError("Internal Server Error"));
            await redisClient.SETEX(String(userID), (365 * 24 * 60 * 60) ,token);
            resolve(token)
        })
    });
  
}
function verifyRefreshToken(token){
    return new Promise((resolve , reject) => {
        JWT.verify(token , REFRESH_TOKEN_SECRET_KEY , async (err , payload) => {
            if(err) reject(createError.Unauthorized("Please log in to your account"));
            const {mobile} = payload || {}
            const user = await UserModel.findOne({mobile} , {password : 0 , otp : 0});
            if(!user) reject(createError.Unauthorized("User account not found"));
            const refreshToken = await redisClient.get(String(user?._id || "key-default"));
            if(!refreshToken) reject(createError.Unauthorized("Login to user account failed"))
            if(token === refreshToken) return resolve(mobile);
            reject(createError.Unauthorized("Login to user account failed"));
           
           
        });
        
    })
}
function deleteFilePublic(fileAddress) {
    if (!Array.isArray(fileAddress) && fileAddress.length > 0) {
        const pathFile = path.join(__dirname, "..", "..", "public", fileAddress)
        if (fs.existsSync(pathFile)) fs.unlinkSync(pathFile)
    }else if(Array.isArray(fileAddress) && fileAddress.length > 0){
       for (const image of fileAddress) {
        const pathFile = path.join(__dirname, "..", "..", "public", image)
        if (fs.existsSync(pathFile)) fs.unlinkSync(pathFile)
       }
    }else if(fileAddress == null || undefined || "" || [""]){
        return "Not found"
    }

}
function ListOfImagesFromRequest(files, fileUploadPath) {
    if (files?.length > 0) {
        return ((files.map(file => path.join(fileUploadPath, file.filename))).map(item => item.replace(/\\/g, "/")))
    } else {
        return []
    }
}
function deleteFiledAdditional(obj) {
    let fieldsToDelete = ['colors', 'weight', 'length', 'height', 'width'];
    fieldsToDelete.forEach(field => {
        delete obj[field]
    })
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
function getTimeOfCourse(chapters = []){
    let time, hour, minute, second = 0;
    for (const chapter of chapters) {
        if(Array.isArray(chapter?.episodes)){
            for (const episode of chapter.episodes) {
                if(episode?.time) time = episode.time.split(":") // [hour, min, second]
                else time = "00:00:00".split(":")
                if(time.length == 3){
                    second += Number(time[0]) * 3600 // convert hour to second
                    second += Number(time[1]) * 60 // convert minute to second
                    second += Number(time[2]) //sum second with second
                }else if(time.length == 2){ //05:23
                    second += Number(time[0]) * 60 // convert minute to second
                    second += Number(time[1]) //sum second with second
                }
            }
        }
    }
    hour = Math.floor(second / 3600); //convert second to hour
    minute = Math.floor(second / 60) % 60; //convert second to minute
    second = Math.floor(second % 60); //convert seconds to second
    if(String(hour).length ==1) hour = `0${hour}`
    if(String(minute).length ==1) minute = `0${minute}`
    if(String(second).length ==1) second = `0${second}`
    return (hour + ":" + minute + ":" +second) 
}
function calculateDiscount(price, discount){
    return Number(price) - ((Number(discount) / 100) * Number(price))
}
function invoiceNumberGenerator(){
    return moment().format("jYYYYjMMjDDHHmmssSSS") + String(process.hrtime()[1]).padStart(9, 0)
}
async function getBasketOfUser(userID, discount = {}){
    const userDetail = await UserModel.aggregate([
        {
            $match : { _id: userID }
        },
        {
            $project:{ basket: 1}
        },
        {
            $lookup: {
                from: "products",
                localField: "basket.products.productID",
                foreignField: "_id",
                as: "productDetail"
            }
        },
        {
            $lookup: {
                from: "courses",
                localField: "basket.courses.courseID",
                foreignField: "_id",
                as: "courseDetail"
            }
        },
        {
            $addFields : {
                "productDetail" : {
                    $function: {
                        body: function(productDetail, products){
                            return productDetail.map(function(product){
                                const count = products.find(item => item.productID.valueOf() == product._id.valueOf()).count;
                                const totalPrice = count * product.price
                                return {
                                    ...product,
                                    basketCount: count,
                                    totalPrice,
                                    finalPrice: totalPrice - ((product.discount / 100) * totalPrice)
                                }
                            })
                        },
                        args: ["$productDetail", "$basket.products"],
                        lang: "js"
                    }
                },
                "courseDetail" : {
                    $function: {
                        body: function(courseDetail){
                            return courseDetail.map(function(course){
                                return {
                                    ...course,
                                    finalPrice: course.price - ((course.discount / 100) * course.price)
                                }
                            })
                        },
                        args: ["$courseDetail"],
                        lang: "js"
                    }
                },
                "payDetail" : {
                    $function: {
                        body: function(courseDetail, productDetail, products){
                            const courseAmount =  courseDetail.reduce(function(total, course){
                                return total + (course.price - ((course.discount / 100) * course.price))
                            }, 0)
                            const productAmount =  productDetail.reduce(function(total, product){
                                const count = products.find(item => item.productID.valueOf() == product._id.valueOf()).count
                                const totalPrice = count * product.price;
                                return total + (totalPrice - ((product.discount / 100) * totalPrice))
                            }, 0)
                            const courseIds = courseDetail.map(course => course._id.valueOf())
                            const productIds = productDetail.map(product => product._id.valueOf())
                            return {
                                courseAmount,
                                productAmount,
                                paymentAmount : courseAmount + productAmount,
                                courseIds,
                                productIds
                            }
                        },
                        args: ["$courseDetail", "$productDetail", "$basket.products"],
                        lang: "js"
                    }
                },
            }
        },{
            $project: {
                basket: 0
            }
        }
    ]);
    return copyObject(userDetail)
}
function removeFieldEmpty(array) {
    for (const obj of array) {
        for (let key in obj) {
            if (obj[key] === null || obj[key].length === 0 || obj[key] === undefined || obj[key] === '') {
              delete obj[key];
            }
        }
    }
    return array
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
    getTime,
    getTimeOfCourse,
    calculateDiscount,
    getBasketOfUser,
    invoiceNumberGenerator,
    deleteFiledAdditional,
    removeFieldEmpty
}