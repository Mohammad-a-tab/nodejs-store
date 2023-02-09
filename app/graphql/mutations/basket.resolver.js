const { VerifyAccessTokenInGraphQL } = require("../../http/middlewares/verifyAccessToken");
const { StatusCodes : HttpStatus } = require("http-status-codes")
const { ResponseType } = require("../typeDefs/public.types");
const { copyObject } = require("../../utils/function");
const { UserModel } = require("../../models/users");
const { checkExistProduct, checkExistCourse } = require("../utils");
const { GraphQLString } = require("graphql");
const createHttpError = require("http-errors");

const AddProductToBasket = {
    type : ResponseType,
    args : {
        productID : {type : GraphQLString}
    },
    resolve : async (_, args, context) => {
        const {req} = context;
        const user = await VerifyAccessTokenInGraphQL(req);
        const {productID} = args;
        await checkExistProduct(productID);
        const product = await findProductInBasket(user._id, productID);
        if(product){
            await UserModel.updateOne({
                _id : user._id,
                "basket.products.productID" : productID
            }, {
                $inc : {
                    "basket.products.$.count" : 1
                }
            });
        }else {
            await UserModel.updateOne({_id : user._id}, {
                $push : {
                    "basket.products" : {
                        productID,
                        count : 1
                    }
                }
            });
        }
        return {
            statusCode : HttpStatus.OK,
            data : {
                message : "The product has been successfully added to the Basket"
            }
        }

    }
}
const AddCourseToBasket = {
    type : ResponseType,
    args : {
        courseID : {type : GraphQLString}
    },
    resolve : async (_, args, context) => {
        const {req} = context;
        const user = await VerifyAccessTokenInGraphQL(req);
        const {courseID} = args;
        await checkExistCourse(courseID);
        const course = await findCourseInBasket(user._id, courseID);
        if(course){
            throw createHttpError.BadRequest("You cannot add this course more than once to your Basket")
        }else {
            await UserModel.updateOne({_id : user._id}, {
                $push : {
                    "basket.courses" : {
                        courseID,
                        count : 1
                    }
                }
            });
        }
        return {
            statusCode : HttpStatus.OK,
            data : {
                message : "The course has been successfully added to the Basket"
            }
        }

    }
}
const RemoveCourseFromBasket = {
    type : ResponseType,
    args : {
        courseID : {type : GraphQLString}
    },
    resolve : async (_, args, context) => {
        const {req} = context;
        const user = await VerifyAccessTokenInGraphQL(req);
        const {courseID} = args;
        await checkExistCourse(courseID);
        const course = await findCourseInBasket(user._id, courseID);
        if(!course) throw createHttpError.NotFound("No course was found with this specification in basket")
        if(course && course.count == 1){
            await UserModel.updateOne({
                _id : user._id,
                "basket.courses.courseID" : courseID
            }, {
                $pull : {
                    "basket.courses" : {
                        courseID
                    }
                }
            });
            
        }
        return {
            statusCode : HttpStatus.OK,
            data : {
                message : "The desired course was removed from the Basket"
            }
        }

    }
}
const RemoveProductFromBasket = {
    type : ResponseType,
    args : {
        productID : {type : GraphQLString}
    },
    resolve : async (_, args, context) => {
        let message;
        const {req} = context;
        const user = await VerifyAccessTokenInGraphQL(req);
        const {productID} = args;
        await checkExistProduct(productID);
        const product = await findProductInBasket(user._id, productID);
        if(!product) throw createHttpError.NotFound("No product was found with this specification in Basket")
        if(product.count > 1){
            await UserModel.updateOne({
                _id : user._id,
                "basket.products.productID" : productID
            }, {
                $inc : {
                    "basket.products.$.count" : -1
                }
            });
            message = "One product was removed from the Basket"
        }else {
            await UserModel.updateOne({
                _id : user._id,
                "basket.products.productID" : productID
            }, {
                $pull : {
                    "basket.products" : {
                        productID
                    }
                }
            });
            message = "The product was removed from the Basket"
        }
        return {
            statusCode : HttpStatus.OK,
            data : {
                message
            }
        }

    }
}
async function findProductInBasket(userID, productID){
    const findResult = await UserModel.findOne({_id : userID, "basket.products.productID" : productID}, {"basket.products.$" : 1})
    const userDetail = copyObject(findResult)
    return userDetail?.basket?.products?.[0]
}
async function findCourseInBasket(userID, courseID){
    const findResult = await UserModel.findOne({_id : userID, "basket.courses.courseID" : courseID}, {"basket.courses.$" : 1})
    const userDetail = copyObject(findResult)
    return userDetail?.basket?.courses?.[0]
}
module.exports = {
    AddCourseToBasket,
    AddProductToBasket,
    RemoveCourseFromBasket,
    RemoveProductFromBasket    
}