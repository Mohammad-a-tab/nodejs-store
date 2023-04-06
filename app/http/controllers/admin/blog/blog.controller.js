const { 
    createNewBlogAtElasticSearch,
    getAllBlogsFromElasticSearch,
    removeBlogFromElasticSearch,
    updateBlogAtElasticSearch
 } = require("../../../../ElasticSearch/controller/blog/blog.controller");
const {  deleteFilePublic, deleteInvalidPropertyInObject, copyObject } = require("../../../../utils/function");
const { createBlogSchema } = require("../../../validators/admin/blog.schema");
const { CategoryModel } = require("../../../../models/categories");
const { MessageSpecial } = require("../../../../utils/constants");
const { StatusCodes:HttpStatus } = require("http-status-codes");
const { BlogModel } = require("../../../../models/blogs");
const createHttpError = require("http-errors");
const Controller = require("../../controller");
const { any } = require("@hapi/joi");
const path = require('path');
const BlogBlackList = {
    BOOKMARKS : "bookmarks",
    DISLIKES : "dislikes",
    LIKES : "likes",
    AUTHOR : "author",
    COMMENTS : "comments"
 }
 Object.freeze(BlogBlackList)
class BlogController extends Controller {
    async createBlog (req,res,next) {
        try {
            let blogResult = any;
            const blogDataBody = await createBlogSchema.validateAsync(req.body);
            req.body.image =path.join(blogDataBody.fileUploadPath, blogDataBody.filename)
            req.body.image = req.body.image.replace(/\\/g, "/")
            delete blogDataBody.fileUploadPath
            delete blogDataBody.filename
            const data = blogDataBody;
            data.image = req.body.image;
            data.author = req.user._id;
            const category = await this.existCategoryOfBlogByID(data?.category)
            if(category){
                blogResult = await BlogModel.create({...data});
                data.category = {
                    id: category._id,
                    Title: category.title
                }
            }
            if(blogResult._id){
                data.author = {
                    id : req.user._id,
                    First_Name: req.user.first_name, 
                    Last_Name: req.user.last_name, 
                    UserName: req.user.username,
                    Mobile: req.user.mobile, 
                    Email: req.user.email
                }
                const createBlogAtElasticResult = await createNewBlogAtElasticSearch(data)
                return res.status(HttpStatus.CREATED).json({
                    statusCode : HttpStatus.CREATED,
                    data: {
                        message : MessageSpecial.SUCCESSFUL_CREATED_BLOG_MESSAGE,
                        ElasticResult: createBlogAtElasticResult.result
                    }
                })
            }
            
        } catch (error) {
            deleteFilePublic(req.body.image)
            next(error)
        }
    }
    async getOneBlogByID (req,res,next) {
        try {
            const {id} = req.params;
            const blog = await this.findBlog(id);
            return res.status(HttpStatus.OK).json({
                statusCode : HttpStatus.OK,
                data : {
                    blog
                }
            })
            
        } catch (error) {
            next(error)
        }
    }
    async getListOfBlogs (req,res,next) {
        try {
            const blogs = await BlogModel.aggregate([
                {$match : {}},
                {
                    $lookup : {
                        from : "users",
                        localField : "author",
                        foreignField : "_id",
                        as : "author"
                    }
                },
                {
                    $unwind : "$author"
                },
                {
                    $lookup : {
                        from : "categories",
                        localField : "category",
                        foreignField : "_id",
                        as : "category"
                    }
                },
                {
                    $unwind : "$category"
                },
                {
                    $project : {
                        "author.bills" : 0,
                        "author.basket" : 0,
                        "category.__v" : 0,
                        "author.discount" : 0,
                        "author.__v" : 0,
                        "author.updatedAt" : 0,
                        "author.Role" : 0,
                        "author.otp" : 0,
                        "author.token" : 0,
                        "author.Products" : 0,
                        "author.Courses" : 0,
                        "author.password" : 0,
                        "author._id" : 0,
                        "createdAt" : 0,
                        "updatedAt" : 0
                    }
                }
            ]).sort({_id : -1});
            const elasticBlog = await getAllBlogsFromElasticSearch()
            return res.status(HttpStatus.OK).json({
                statusCode : HttpStatus.OK,
                data : {
                    blogs,
                    elasticBlog
                }
            })
        } catch (error) {
            next(error)
        }
    }
    async getCommentsOfBlog (req,res,next) {
        try {
            
        } catch (error) {
            next(error)
        }
    }
    async deleteBlogByID (req,res,next) {
        try {
            const {id} = req.params;
            const blog = await this.findBlog(id);
            const result = await BlogModel.deleteOne({_id : id});
            if(result.deletedCount == 0) 
                throw {status : HttpStatus.INTERNAL_SERVER_ERROR , message : MessageSpecial.INTERNAL_SERVER_ERROR}
            deleteFilePublic(blog?.image)
            const deleteBlogFromElasticResult = await removeBlogFromElasticSearch(blog?.title)
            return res.status(HttpStatus.OK).json({
                statusCode : HttpStatus.OK,
                data : {
                    message : MessageSpecial.SUCCESSFUL_REMOVE_BLOG_MESSAGE,
                    ElasticResult : deleteBlogFromElasticResult.deleted
                }
            })
        } catch (error) {
            next(error)
        }
    }
    async updateBlogByID (req,res,next) {
        try {
            const {id} = req.params;
            const blog = await this.findBlog(id);
            if(req?.body?.fileUploadPath && req?.body?.filename){
                req.body.image =path.join(req.body.fileUploadPath, req.body.filename)
                req.body.image = req.body.image.replace(/\\/g, "/")
                deleteFilePublic(blog.image)
            }
            const data = copyObject(req.body);
            let blackListFields = Object.values(BlogBlackList);
            deleteInvalidPropertyInObject(data , blackListFields)
            let updateResult = any;
            if(data.category){
                if(await this.existCategoryOfBlogByID(data.category)){
                
                    updateResult = await BlogModel.updateOne({_id : id}, {$set : data})
                    data.category = {
                        id: category._id,
                        Title: category.title
                    }
                }
            }
            updateResult = await BlogModel.updateOne({_id : id}, {$set : data})
            if(updateResult.modifiedCount == 0) 
                throw {status : HttpStatus.INTERNAL_SERVER_ERROR , message : MessageSpecial.UNSUCCESSFUL_UPDATED_MESSAGE}
            const updateBlogAtElasticResult = await updateBlogAtElasticSearch(blog, data)
            return res.status(HttpStatus.OK).json({
                statusCode: HttpStatus.OK,
                data : {
                    message : MessageSpecial.SUCCESSFUL_UPDATED_BLOG_MESSAGE,
                    ElasticResult : updateBlogAtElasticResult.result
                }
            })
            
            
        } catch (error) {
            deleteFilePublic(req?.body?.image)
            next(error)
        }
    }
    async findBlog(id) {
        const blog = await BlogModel.findById(id).populate([{path : "category" , select : ['title']} , {path : "author" , select  : ['mobile', 'first_name' , 'last_name' , 'username']}]);
        if(!blog) throw createHttpError.NotFound("No Blog found");
        return blog
    }
    async existCategoryOfBlogByID(id){
        const category = await CategoryModel.findOne({_id : id})
        if(!category) throw createHttpError.NotFound("There is no category with ID")
        return category
    } 
}

module.exports = {
    AdminBlogController : new BlogController()
}