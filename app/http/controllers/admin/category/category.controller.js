const { addCategorySchema, updateCategorySchema } = require("../../../validators/admin/category.schema");
const { CategoryModel } = require("../../../../models/categories");
const { MessageSpecial } = require("../../../../utils/constants");
const { StatusCodes: HttpStatus } = require("http-status-codes");
const { default: mongoose } = require("mongoose");
const createHttpError = require("http-errors");
const Controller = require("../../controller");
const { any } = require("@hapi/joi");
class CategoryController extends Controller {
    async addCategory(req,res,next){
        try {
            let category = any;
            if(req?.body?.parent){
                const {title,parent} = await addCategorySchema.validateAsync(req.body);
                if(await this.existCorrectParent(parent)){
                    category = await CategoryModel.create({title,parent})
                }
            }
            else{
                const {title} = await addCategorySchema.validateAsync(req.body);
                category = await CategoryModel.create({title})
            }
            if(!category) throw {status : HttpStatus.INTERNAL_SERVER_ERROR , message : MessageSpecial.INTERNAL_SERVER_ERROR}
            return res.status(HttpStatus.CREATED).json({
                statusCode: HttpStatus.CREATED,
                data : {
                    message : MessageSpecial.SUCCESSFUL_CREATED_CATEGORY_MESSAGE
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
            if(result.deletedCount == 0 ) throw {status : HttpStatus.INTERNAL_SERVER_ERROR , message : MessageSpecial.UNSUCCESSFUL_REMOVE_CATEGORY_MESSAGE}
            return res.status(HttpStatus.OK).json({
                statusCode : HttpStatus.OK,
                data : {
                    message : MessageSpecial.SUCCESSFUL_REMOVE_CATEGORY_MESSAGE
                }
            })

        } catch (error) {
            next(error)
        }
    }
    async editCategoryTitle(req,res,next){
        try {
            const {id} = req.params;
            const {title , parent} =  await updateCategorySchema.validateAsync(req.body);
            const category = await this.checkExistCategory(id);
            let updateResult = any;
            if(parent){
                if(await this.existCorrectParent(parent)){
                    updateResult = await CategoryModel.updateOne({_id : category._id} , {$set : {title , parent}});
                }
            }
            updateResult = await CategoryModel.updateOne({_id : category._id} , {$set : {title}});
            if(updateResult.modifiedCount == 0) throw {status : HttpStatus.INTERNAL_SERVER_ERROR , message : MessageSpecial.UNSUCCESSFUL_UPDATED_MESSAGE}
            return res.status(HttpStatus.OK).json({
                statusCode : HttpStatus.OK,
                data : {
                    message : MessageSpecial.SUCCESSFUL_UPDATED_MESSAGE
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
            const categories = await CategoryModel.find({parent : undefined} , {__v : 0}).sort({_id : -1})
            return res.status(HttpStatus.OK).json({
                statusCode : HttpStatus.OK,
                data : {
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
            return res.status(HttpStatus.OK).json({
                statusCode : HttpStatus.OK,
                data : {
                    category
                }
            })
            
            
        } catch (error) {
            next(error)
        }
    }
    async getAllParents(req,res,next){
        try {
            const parents = await CategoryModel.find({parent : undefined} , {__v : 0}).sort({_id : -1});
            return res.status(HttpStatus.OK).json({
                statusCode : HttpStatus.OK,
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
            const {parentID} = req.params;
            const children = await CategoryModel.findOne({parent : parentID}, {__v : 0 , parent : 0});
            return res.status(HttpStatus.OK).json({
                statusCode : HttpStatus.OK,
                data : {
                    children
                }
            })
            
        } catch (error) {
            next(error)
        }
    }
    async getAllCategoryWithoutPopulate(req,res,next) {
        try {
            const categories = await CategoryModel.aggregate([{$match : {}}]).sort({_id : -1});
            return res.status(HttpStatus.OK).json({
                statusCode : HttpStatus.OK,
                data : {
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

    async existCorrectParent (id) {
        const parent = await CategoryModel.findOne({parent : id})
        if(!parent) throw createHttpError.BadRequest("The parent sent is not correct")
        return parent
    } 
}

module.exports = {
    AdminCategoryController : new CategoryController()
}