const createHttpError = require("http-errors");
const { CategoryModel } = require("../../../models/categories");
const { addCategorySchema } = require("../../validators/admin/category.schema");
const Controller = require("../controller");

class CategoryController extends Controller {
    async addCategory(req,res,next){
        try {
            await addCategorySchema.validateAsync(req.body);
            const {title,parent} = req.body;
            const category = await CategoryModel.create({title,parent})
            if(!category) throw createHttpError.InternalServerError("خطای داخلی")
            return res.status(201).json({
                data : {
                    statusCode: 201,
                    message : "دسته بندی با موفقیت افزوده شد"
                }


            })
        } catch (error) {
            next(error)
        }
    }
    async removeCategory(req,res,next){
        try {
            const {id} = req.params;
            const category = await this.checkExistCategory(id);
            const result = await CategoryModel.deleteOne({_id : category._id});
            if(result.deletedCount == 0 ) throw createHttpError.InternalServerError("عملیات حذف دسته بندی انجام نشد");
            return res.status(200).json({
                data : {
                    statusCode : 200,
                    message : "دسته بندی با موفقیت حذف شد"
                }
            })

        } catch (error) {
            next(error)
        }
    }
    async editCategory(req,res,next){
        try {
            
        } catch (error) {
            next(error)
        }
    }
    async getAllCategory(req,res,next){
        try {
            const category = await CategoryModel.aggregate([
                {
                    $lookup : {
                        from : "categories",
                        localField : "_id",
                        foreignField : "parent",
                        as : "children"
                    }
                },
                {
                    $project : {
                        __v : 0,
                        "children.__v" : 0,
                        "children.parent" : 0
                    }
                }
            ]);
            return res.status(200).json({
                data : {
                    statusCode : 200,
                    category
                }
            })
            
        } catch (error) {
            next(error)
        }
    }
    async getCategoryByID (req,res,next){
        try {
            
        } catch (error) {
            next(error)
        }
    }
    async getAllParents(req,res,next){
        try {
            const parents = await CategoryModel.find({parent : undefined} , {__v : 0});
            return res.status(200).json({
                data : {
                    parents
                }
            })
            
        } catch (error) {
            next(error)
        }
    }
    async getChildOfParents(req,res,next){
        try {
            const {parent} = req.params;
            const children = await CategoryModel.find({parent}, {__v : 0 , parent : 0});
            return res.status(200).json({
                data : {
                    statusCode : 200,
                    children
                }
            })
            
        } catch (error) {
            next(error)
        }
    }
    async checkExistCategory(id){
        const category = await CategoryModel.findById(id);
        if(!category) throw createHttpError.NotFound("دسته بندی یافت نشد");
        return category
    }

}


module.exports = {
    CategoryController : new CategoryController()
}