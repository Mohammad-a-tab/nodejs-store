const { VerifyAccessTokenInGraphQL } = require("../../http/middlewares/verifyAccessToken");
const { checkExistProduct, checkExistCourse, checkExistBlog } = require("../utils");
const {StatusCodes : HttpStatus} = require("http-status-codes");
const { ResponseType } = require("../typeDefs/public.types");
const { ProductModel } = require("../../models/products");
const { CourseModel } = require("../../models/course");
const { BlogModel } = require("../../models/blogs");
const { GraphQLString } = require("graphql");

const BookmarkProduct = {
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
        const bookmarkedProduct = await ProductModel.findOne(
            {_id : productID, bookmarks : user._id}
        ) 
        const updateQuery = bookmarkedProduct? {$pull : {bookmarks : user._id}} : {$push : {bookmarks : user._id}}
        await ProductModel.updateOne({_id : productID}, updateQuery)
        if(!bookmarkedProduct){
            message = "The product has been added to your favorites or bookmarks list"
        }else message = "The product has been removed from your favorites or bookmarks list"
        return { 
            statusCode : HttpStatus.CREATED,
            data : {
                message
            }
        }
    }
}
const BookmarkCourse = {
    type: ResponseType,
    args: {
        CourseID: {type: GraphQLString}
    },
    resolve : async (_, args, context) => {
        let message;
        const {req} = context;
        const user = await VerifyAccessTokenInGraphQL(req);
        const {CourseID} = args;  
        await checkExistCourse(CourseID)
        const bookmarkedCourse = await CourseModel.findOne(
            {_id : CourseID, bookmarks : user._id}
        ) 
        const updateQuery = bookmarkedCourse? {$pull : {bookmarks : user._id}} : {$push : {bookmarks : user._id}}
        await CourseModel.updateOne({_id : CourseID}, updateQuery)
        if(!bookmarkedCourse){
            message = "The Course has been added to your favorites or bookmarks list"
        }else message = "The Course has been removed from your favorites or bookmarks list"
        return { 
            statusCode : HttpStatus.CREATED,
            data : {
                message
            }
        }
    }
}
const BookmarkBlog = {
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
        const bookmarkedBlog = await BlogModel.findOne(
            {_id : blogID, bookmarks : user._id}
        ) 
        const updateQuery = bookmarkedBlog? {$pull : {bookmarks : user._id}} : {$push : {bookmarks : user._id}}
        await BlogModel.updateOne({_id : blogID}, updateQuery)
        if(!bookmarkedBlog){
            message = "The Blog has been added to your favorites or bookmarks list"
        }else message = "The Blog has been removed from your favorites or bookmarks list"
        return { 
            statusCode : HttpStatus.CREATED,
            data : {
                message
            }
        }
    }
}
module.exports = {
    BookmarkBlog,
    BookmarkProduct,
    BookmarkCourse,
}