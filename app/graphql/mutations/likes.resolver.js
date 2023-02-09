const { VerifyAccessTokenInGraphQL } = require("../../http/middlewares/verifyAccessToken");
const { checkExistProduct, checkExistCourse, checkExistBlog } = require("../utils");
const {StatusCodes : HttpStatus} = require("http-status-codes");
const { ResponseType } = require("../typeDefs/public.types");
const { ProductModel } = require("../../models/products");
const { CourseModel } = require("../../models/course");
const { BlogModel } = require("../../models/blogs");
const { GraphQLString } = require("graphql");

const LikeProduct = {
    type: ResponseType,
    args: {
        productID: {type: GraphQLString}
    },
    resolve : async (_, args, context) => {
        let message;
        const {req} = context;
        const user = await VerifyAccessTokenInGraphQL(req);
        const {productID} = args;  
        await checkExistProduct(productID)
        const likedProduct = await ProductModel.findOne(
            {_id : productID, likes : user._id}
        ) 
        const dislikedProduct = await ProductModel.findOne(
            {_id : productID, dislikes : user._id}
        ) 
        const updateQuery = likedProduct? {$pull : {likes : user._id}} : {$push : {likes : user._id}}
        await ProductModel.updateOne({_id : productID}, updateQuery)
        if(!likedProduct){
            if(dislikedProduct) await ProductModel.updateOne({_id : productID}, {$pull : {dislikes : user._id}})
            message = "like the product successfully"
        }else message = "liking the product has been cancelled"
        return { 
            statusCode : HttpStatus.CREATED,
            data : {
                message
            }
        }
    }
}
const LikeCourse = {
    type: ResponseType,
    args: {
        courseID: {type: GraphQLString}
    },
    resolve : async (_, args, context) => {
        let message;
        const {req} = context;
        const user = await VerifyAccessTokenInGraphQL(req);
        const {courseID} = args;  
        await checkExistCourse(courseID)
        const likedCourse = await CourseModel.findOne(
            {_id : courseID, likes : user._id}
        ) 
        const dislikedCourse = await CourseModel.findOne(
            {_id : courseID, dislikes : user._id}
        ) 
        const updateQuery = likedCourse? {$pull : {likes : user._id}} : {$push : {likes : user._id}}
        await CourseModel.updateOne({_id : courseID}, updateQuery)
        if(!likedCourse){
            if(dislikedCourse) await CourseModel.updateOne({_id : courseID}, {$pull : {dislikes : user._id}})
            message = "like the product successfully"
        }else message = "liking the product has been cancelled"
        return { 
            statusCode : HttpStatus.CREATED,
            data : {
                message
            }
        }
    }
}
const LikeBlog = {
    type: ResponseType,
    args: {
        blogID: {type: GraphQLString}
    },
    resolve : async (_, args, context) => {
        let message;
        const {req} = context;
        const user = await VerifyAccessTokenInGraphQL(req);
        const {blogID} = args;  
        await checkExistBlog(blogID)
        const likedBlog = await BlogModel.findOne(
            {_id : blogID, likes : user._id}
        ) 
        const dislikedBlog = await BlogModel.findOne(
            {_id : blogID, dislikes : user._id}
        ) 
        const updateQuery = likedBlog? {$pull : {likes : user._id}} : {$push : {likes : user._id}}
        await BlogModel.updateOne({_id : blogID}, updateQuery)
        if(!likedBlog){
            if(dislikedBlog) await BlogModel.updateOne({_id : blogID}, {$pull : {dislikes : user._id}})
            message = "like the product successfully"
        }else message = "liking the product has been cancelled"
        return { 
            statusCode : HttpStatus.CREATED,
            data : {
                message
            }
        }
    }
}
module.exports = {
    LikeBlog,
    LikeProduct,
    LikeCourse
}
