const { createBlogSchema } = require("../../validators/admin/blog.schema");
const Controller = require("../controller");
const path = require('path');
const { BlogModel } = require("../../../models/blogs");
const { deleteFilePublic } = require("../../../utils/function");
const createHttpError = require("http-errors");
const { StatusCodes:HttpStatus } = require("http-status-codes");

class BlogController extends Controller {
    async createBlog (req,res,next) {
        try {
            const blogDataBody = await createBlogSchema.validateAsync(req.body);
            req.body.image =path.join(blogDataBody.fileUploadPath, blogDataBody.filename)
            req.body.image = req.body.image.replace(/\\/g, "/")
            const {title , text , short_text , tags , category} = blogDataBody;
            const image = req.body.image
            const author = req.user._id
            const blogResult = await BlogModel.create({title,text,short_text,category,tags,image,author});
            return res.status(201).json({
                data: {
                    statusCode : 201,
                    message : "بلاگ با موفقیت ایجاد شد"
                }
            })
            
        } catch (error) {
            deleteFilePublic(req.body.image)
            next(error)
        }
    }
    async getOneBlogByID (req,res,next) {
        try {
            const {id} = req.params;
            const blog = await this.findBlog(id);
            return res.status(200).json({
                data : {
                    statusCode : 200,
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
                        "category.__v" : 0,
                        "author.discount" : 0,
                        "author.__v" : 0,
                        "author.Roles" : 0,
                        "author.otp" : 0
                    }
                }
            ]);
            return res.status(200).json({
                data : {
                    statusCode : 200,
                    blogs
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
            await this.findBlog(id);
            const result = await BlogModel.deleteOne({_id : id});
            if(result.deletedCount == 0) throw createHttpError.InternalServerError("حذف انجام نشد");
            return res.status(200).json({
                data : {
                    statusCode : 200,
                    message : "حذف بلاگ با موفقیت انجام شد"
                }
            })
        } catch (error) {
            next(error)
        }
    }
    async updateBlogByID (req,res,next) {
        try {
            const {id} = req.params;
            await this.findBlog(id);
            if(req?.body?.fileUploadPath && req?.body?.filename){
                req.body.image =path.join(req.body.fileUploadPath, req.body.filename)
                req.body.image = req.body.image.replace(/\\/g, "/")
            }
            const data = req.body;
            let nullishData = ["", " ", "0", 0, null, undefined]
            let blackListFields = ["bookmarks", "dislikes", "comments", "likes", "author"]
            Object.keys(data).forEach(key => {
                if(blackListFields.includes(key)) delete data[key]
                if(typeof data[key] == "string") data[key] = data[key].trim();
                if(Array.isArray(data[key]) && data[key].length > 0 ) data[key] = data[key].map(item => item.trim()) 
                if(nullishData.includes(data[key])) delete data[key];
            })
            const updateResult = await BlogModel.updateOne({_id : id}, {$set : data})
            if(updateResult.modifiedCount == 0) throw createError.InternalServerError("به روز رسانی انجام نشد")

            return res.status(HttpStatus.OK).json({
                statusCode: HttpStatus.OK,
                data : {
                    message : "به روز رسانی بلاگ با موفقیت انجام شد"
                }
            })
            
            
        } catch (error) {
            deleteFilePublic(req?.body?.image)
            next(error)
        }
    }
    async findBlog(id) {
        const blog = await BlogModel.findById(id).populate([{path : "category" , select : ['title']} , {path : "author" , select  : ['mobile' , 'first_name' , 'last_name' , 'username']}]);
        if(!blog) throw createHttpError.NotFound("مقاله ای یافت نشد");
        return blog
    }
   
}

module.exports = {
    AdminBlogController : new BlogController()
}