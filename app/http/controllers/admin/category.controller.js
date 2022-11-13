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
            
        } catch (error) {
            next(error)
        }
    }
    async getChildOfParents(req,res,next){
        try {
            
        } catch (error) {
            next(error)
        }
    }

}


module.exports = {
    CategoryController : new CategoryController()
}