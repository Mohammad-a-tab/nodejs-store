const { VerifyAccessTokenInGraphQL } = require("../../http/middlewares/verifyAccessToken");
const { checkExistBlog, checkExistProduct, checkExistCourse } = require("../utils");
const {StatusCodes : HttpStatus} = require("http-status-codes");
const { ResponseType } = require("../typeDefs/public.types");
const { ProductModel } = require("../../models/products");
const { CourseModel } = require("../../models/course");
const { copyObject } = require("../../utils/function");
const { BlogModel } = require("../../models/blogs");
const { default: mongoose } = require("mongoose");
const createHttpError = require("http-errors");
const { GraphQLString } = require("graphql");

const CreateCommentForBlog = {
    type: ResponseType,
    args : {
        comment: {type: GraphQLString},
        blogID: {type: GraphQLString},
        parent: {type: GraphQLString},
    },
    resolve : async (_, args, context) => {
        const {req} = context;
        const user = await VerifyAccessTokenInGraphQL(req)
        const {comment, blogID, parent} = args
        if(!mongoose.isValidObjectId(blogID)) 
            throw createHttpError.BadGateway("The blog ID sent is not correct")
        await checkExistBlog(blogID)
        if(parent && mongoose.isValidObjectId(parent)){
            const commentDocument = await getComment(BlogModel, parent)
            if(commentDocument && !commentDocument?.openToComment) 
                throw createHttpError.BadRequest("Answer registrations is not allowed")
            const createAnswerResult = await BlogModel.updateOne({
                "comments._id": parent
            }, {
                $push: {
                    "comments.$.answers": {
                        comment,
                        user: user._id,
                        show: false,
                        openToComment: false
                    }
                }
            });
            if(!createAnswerResult.modifiedCount) {
                throw createHttpError.InternalServerError("The answer was not registered")
            }
            return {
                statusCode: HttpStatus.CREATED,
                data : {
                    message: "Your answer has been successfully registered"
                }
            }
        }else{
            await BlogModel.updateOne({_id: blogID}, {
                $push : {comments : {
                    comment, 
                    user: user._id, 
                    show : false,
                    openToComment : true
                }}
            })
        }
        return {
            statusCode: HttpStatus.CREATED,
            data : {
                message: "The comment was successfully registered and will be posted on the website after confirmation"
            }
        }
    }
}
const CreateCommentForProduct = {
    type: ResponseType,
    args : {
        comment: {type: GraphQLString},
        productID: {type: GraphQLString},
        parent: {type: GraphQLString},
    },
    resolve : async (_, args, context) => {
        const {req} = context;
        const user = await VerifyAccessTokenInGraphQL(req)
        const {comment, productID, parent} = args
        if(!mongoose.isValidObjectId(productID)) 
            throw createHttpError.BadGateway("The product ID sent is not correct")
        await checkExistProduct(productID)
        if(parent && mongoose.isValidObjectId(parent)){
            const commentDocument = await getCommentForProduct(parent)
            if(commentDocument && !commentDocument?.openToComment) 
                throw createHttpError.BadRequest("Answer registrations is not allowed")
            const createAnswerResult = await ProductModel.updateOne({
                _id : productID,
                "comments._id": parent
            }, {
                $push: {
                    "comments.$.answers": {
                        comment,
                        user: user._id,
                        show: false,
                        openToComment: false
                    }
                }
            });
            if(!createAnswerResult.modifiedCount) {
                throw createHttpError.InternalServerError("The answer was not registered")
            }
            return {
                statusCode: HttpStatus.CREATED,
                data : {
                    message: "Your answer has been successfully registered"
                }
            }
        }else{
            await ProductModel.updateOne({_id: productID}, {
                $push : {comments : {
                    comment, 
                    user: user._id, 
                    show : false,
                    openToComment : true
                }}
            })
        }
        return {
            statusCode: HttpStatus.CREATED,
            data : {
                message: "The comment was successfully registered and will be posted on the website after confirmation"
            }
        }
    }
}
const CreateCommentForCourse = {
    type : ResponseType,
    args : {
        comment : {type : GraphQLString},
        courseID : {type : GraphQLString},
        parent : {type : GraphQLString}
    },
    resolve : async (_,args, context) => {
        const {req} = context;
        const user = await VerifyAccessTokenInGraphQL(req);
        const {comment, courseID, parent} = args;
        if(!mongoose.isValidObjectId(courseID))
            throw createHttpError.BadGateway("The Course ID sent is not correct")
        await checkExistCourse(courseID)
        if(parent && mongoose.isValidObjectId(parent)){
            const commentDocument = await getComment(CourseModel, parent)
            console.log(commentDocument);
            if(commentDocument && !commentDocument?.openToComment) 
                throw createHttpError.BadRequest("Answer registrations not allowed")
            const createAnswerResult = await CourseModel.updateOne({"comments._id" : parent}, {
                $push : {
                    "comments.$.answers" : {
                        comment,
                        user : user._id,
                        show : false,
                        openToComment : false
                    }
                }
            });
            if(!createAnswerResult.modifiedCount) 
                throw createHttpError.InternalServerError("The answer was not registered")
            return {
                statusCode : HttpStatus.CREATED,
                data : {
                    message : "Your answer has been successfully registered"
                }
            }
        }else {
            await CourseModel.updateOne({_id : courseID} , {
                $push : {comments : {
                    comment,
                    user : user._id,
                    show : false,
                    openToComment : true
                }}
            });
            return { 
                statusCode : HttpStatus.CREATED,
                data : {
                    message : "The comment was successfully registered and will be posted on the website after confirmation"
                }
            }
        }
    }
}
async function getComment(model , parent) {
    const findComment = await model.findOne({"comments._id" : parent} , {"comments.$" : 1});
    const comment = copyObject(findComment)
    if(!comment?.comments?.[0]) 
        throw createHttpError.NotFound("No comment was found with this specification")
    return comment?.comments?.[0]
}
async function getCommentForProduct(id) {
    const findComment = await ProductModel.findOne({"comments._id" : id} , {"comments.$" : 1});
    if(!findComment || findComment == null) 
        throw createHttpError.NotFound("No comment was found with this specification")
    return findComment?.comments?.[0]
}
module.exports = {
    CreateCommentForBlog,
    CreateCommentForProduct,
    CreateCommentForCourse
}