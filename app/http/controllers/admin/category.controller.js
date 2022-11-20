const createHttpError = require("http-errors");
const { default: mongoose } = require("mongoose");
const { CategoryModel } = require("../../../models/categories");
const { addCategorySchema, updateCategorySchema } = require("../../validators/admin/category.schema");
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
            const result = await CategoryModel.deleteMany({$or : [{ _id : category._id},{parent : category._id}]});
            if(result.deletedCount == 0 ) throw createHttpError.InternalServerError("عملیات حذف دسته بندی انجام نشد");
            return res.status(200).json({
                data : {
                    statusCode : 200,
                    message : "دسته بندی با زیر مجموعه های آن حذف شد"
                }
            })

        } catch (error) {
            next(error)
        }
    }
    async editCategoryTitle(req,res,next){
        try {
            const {id} = req.params;
            const {title} = req.body;
            const category = await this.checkExistCategory(id);
            await updateCategorySchema.validateAsync(req.body);
            const updateResult = await CategoryModel.updateOne({_id : category._id} , {$set : {title}});
            if(updateResult.modifiedCount == 0) throw createHttpError.InternalServerError("عملیات بروزرسانی انجام نشد");
            return res.status(200).json({
                data : {
                    statusCode : 200,
                    message : "عملیات بروزرسانی با موفقیت انجام شد"
                }
            })
            
        } catch (error) {
            next(error)
        }
    }
    async getAllCategory(req,res,next){
        try {
            // const category = await CategoryModel.aggregate([
            //     {
            //         $lookup : {
            //             from : "categories",
            //             localField : "_id",
            //             foreignField : "parent",
            //             as : "children"
            //         }
            //     },
            //     {
            //         $project : {
            //             __v : 0,
            //             "children.__v" : 0,
            //             "children.parent" : 0
            //         }
            //     },
            //     {
            //         $match : {
            //             parent : undefined
            //         }
            //     }
            // ]);
            // const categories = await CategoryModel.aggregate([
            //     {
            //         $graphLookup : {
            //             from : "categories",
            //             startWith : "$_id",
            //             connectFromField : "_id",
            //             connectToField : "parent",
            //             maxDepth : 5,
            //             depthField : "depth",
            //             as : "children"
            //         }
            //     },
            //     {
            //         $project : {
            //             __v : 0,
            //             "children.__v" : 0,
            //             "children.parent" : 0
            //         }
            //     },
            //     {
            //         $match : {
            //             parent : undefined
            //         }
            //     }
            // ]);
            const categories = await CategoryModel.find({parent : undefined} , {__v : 0})
            return res.status(200).json({
                data : {
                    statusCode : 200,
                    categories
                }
            })
            
        } catch (error) {
            next(error)
        }
    }
    async getCategoryByID (req,res,next){
        try {
            const {id} = req.params;
             const category = await CategoryModel.aggregate([
                {
                    $match : {
                        _id : mongoose.Types.ObjectId(id)
                    }
                },
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
    async getAllParents(req,res,next){
        try {
            const parents = await CategoryModel.find({parent : undefined} , {__v : 0});
            return res.status(200).json({
                data : {
                    statusCode : 200,
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
    async getAllCategoryWithoutPopulate(req,res,next) {
        try {
            const categories = await CategoryModel.aggregate([{$match : {}}]);
            return res.status(200).json({
                data : {
                    statusCode : 200,
                    categories
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
    AdminCategoryController : new CategoryController()
}