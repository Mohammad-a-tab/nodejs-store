const { createProductSchema } = require("../../../validators/admin/product.schema");
const { ObjectValidator } = require("../../../validators/public.validator");
const { CategoryModel } = require("../../../../models/categories");
const { MessageSpecial} = require("../../../../utils/constants");
const { StatusCodes: HttpStatus } = require("http-status-codes");
const { ProductModel } = require("../../../../models/products");
const createHttpError = require("http-errors");
const Controller = require("../../controller");
const { 
    deleteFilePublic 
    , ListOfImagesFromRequest 
    , setFeatures
    , copyObject
    , deleteInvalidPropertyInObject,
    deleteFiledAdditional,
    removeFieldEmpty
} = require("../../../../utils/function");
const { 
    createNewProductInElasticSearch, 
    getAllProductsFromElasticSearch, 
    removeProductFromElasticSearch, 
    updateProductInElasticSearch
} = require("../../../../ElasticSearch/controller/product/product.controller");
const ProductBlackList = {
    BOOKMARKS : "bookmarks",
    DISLIKES : "dislikes",
    LIKES : "likes",
    SUPPLIER : "supplier",
    COMMENTS : "comments",
    COLORS : "colors",
    WIDTH : "width",
    WEIGHT : "weight",
    HEIGHT : "height",
    length : "length"
}
Object.freeze(ProductBlackList)
class ProductController extends Controller {
        async addProduct (req, res, next) {
            try {
                const images = ListOfImagesFromRequest(req?.files || [], req.body.fileUploadPath)
                req.body.images = images
                const data = await createProductSchema.validateAsync(req.body);
                delete data?.fileUploadPath
                delete data?.filename
                let features = setFeatures(req.body)
                let type = ""
                if(features.height > 0 || features.length > 0 || features.width >0 || features.weight > 0) {
                    type = "physical"
                }
                else{
                    type = "virtual"
                }
                const category = await this.ExistCorrectCategoryID(data?.category)
                deleteFiledAdditional(data)
                data.supplier = req.user._id;
                data.features = features;
                data.type = type;
                const product = await ProductModel.create({...data});
                if(product._id){
                    data.supplier = {
                        id: req.user._id,
                        First_Name: req.user.first_name,
                        Last_Name: req.user.last_name,
                        UserName: req.user.username,
                        Mobile: req.user.mobile,
                        Email: req.user.email
                    }
                    data.category = {
                        id: category._id,
                        Title: category.title
                    }
                    const createProductInElasticResult = await createNewProductInElasticSearch(data)
                    return res.status(HttpStatus.CREATED).json({
                        StatusCode : HttpStatus.CREATED,
                        data : {
                            message : MessageSpecial.SUCCESSFUL_CREATED_PRODUCT_MESSAGE,
                            ElasticResult : createProductInElasticResult.result
                        }
                    })
                }

            } catch (error) {
                deleteFilePublic(req?.body?.images)
                next(error)
            }
        }
        async editProduct (req, res, next) {
            try {
                const {id} = req.params;
                const product = await this.findProduct(id);
                const data = copyObject(req.body);
                data.features = setFeatures(req.body);
                if(req.files && req.body.fileUploadPath){
                    data.images = ListOfImagesFromRequest(req.files, req.body.fileUploadPath);
                    deleteFilePublic(product.images)
                    req.body.images = data?.images;
                }
                let blackListFields = Object.values(ProductBlackList);
                deleteInvalidPropertyInObject(data , blackListFields)
                let updateResult;
                if(data.category) {
                    if(await this.ExistCorrectCategoryID(data.category)){
                        updateResult = await ProductModel.updateOne({_id : id}, {$set : data})
                        data.category = {
                            id: data.category._id,
                            Title: data.category.title,
                        }
                    }
                }else{

                    updateResult = await ProductModel.updateOne({_id : id}, {$set : data})
                }
                if(updateResult.modifiedCount == 0) 
                    throw {status : HttpStatus.INTERNAL_SERVER_ERROR , message : MessageSpecial.UNSUCCESSFUL_UPDATED_MESSAGE}
                const updateProductInElasticResult = await updateProductInElasticSearch(product, data)
                return res.status(HttpStatus.OK).json({
                    statusCode: HttpStatus.OK,
                    data : {
                        message : MessageSpecial.SUCCESSFUL_UPDATED_MESSAGE,
                        ElasticResult: updateProductInElasticResult.result
                    }
                })
                
            } catch (error) {
                deleteFilePublic(req?.body?.images)
                next(error)
            }
        }
        async removeProduct (req, res, next) {
            try {
                const {id} = req.params;
                const product = await this.findProduct(id);
                deleteFilePublic(product?.images)
                const deleteResult = await ProductModel.deleteOne({_id : id});
                const deleteProductFromElasticResult = await removeProductFromElasticSearch(product?.title)
                if(deleteResult.deletedCount == 0) 
                    throw {status : HttpStatus.INTERNAL_SERVER_ERROR , message : MessageSpecial.INTERNAL_SERVER_ERROR}
                return res.status(HttpStatus.OK).json({
                    statusCode : HttpStatus.OK,
                    data : {
                        message : MessageSpecial.SUCCESSFUL_REMOVE_PRODUCT_MESSAGE,
                        ElasticResult: deleteProductFromElasticResult.deleted
                    }
                })
                
            } catch (error) {
                next(error)
            }
        }
        async getALlProducts (req, res, next) {
            try {
                const search = req?.query?.search || "";
                let data;
                let ElasticData;
                if (search) {
                     data = await ProductModel.aggregate([
                        {
                            $match : { $text: { $search: `"${req.query.search }"`  } }
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
                            $lookup : {
                                from : "users",
                                localField : "supplier",
                                foreignField : "_id",
                                as : "supplier"
                            }
                        },
                        {
                            $unwind : "$supplier"
                        },
                        {
                            $project : {
                                "category.__v" : 0,
                                "__v" : 0,
                                "category.parent" : 0,
                                "category._id" : 0,
                                "supplier.bills" : 0,
                                "supplier.basket" : 0,
                                "supplier.discount" : 0,
                                "supplier.__v" : 0,
                                "supplier.updatedAt" : 0,
                                "supplier.Role" : 0,
                                "supplier.otp" : 0,
                                "supplier.token" : 0,
                                "supplier.Products" : 0,
                                "supplier.Courses" : 0,
                                "supplier.password" : 0,
                                "supplier._id" : 0
                            }
                        }
                  ])
                  ElasticData = await getAllProductsFromElasticSearch()
                } else {
                  data = await ProductModel.aggregate([
                        {
                            $match : {}
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
                            $lookup : {
                                from : "users",
                                localField : "supplier",
                                foreignField : "_id",
                                as : "supplier"
                            }
                        },
                        {
                            $unwind : "$supplier"
                        },
                        {
                            $project : {
                                "category.__v" : 0,
                                "__v" : 0,
                                "category.parent" : 0,
                                "category._id" : 0,
                                "supplier.bills" : 0,
                                "supplier.basket" : 0,
                                "supplier.discount" : 0,
                                "supplier.__v" : 0,
                                "supplier.updatedAt" : 0,
                                "supplier.Role" : 0,
                                "supplier.otp" : 0,
                                "supplier.token" : 0,
                                "supplier.Products" : 0,
                                "supplier.Courses" : 0,
                                "supplier.password" : 0,
                                "supplier._id" : 0
                            }
                        }
                  ])
                  ElasticData = await getAllProductsFromElasticSearch()
                }
                const products = removeFieldEmpty(data)
                const ElasticResult = removeFieldEmpty(ElasticData)
                return res.status(HttpStatus.OK).json({
                  statusCode: HttpStatus.OK,
                  data: {
                    products,
                    ElasticResult
                  }
                })
              } catch (error) {
                next(error);
              }
        }
        async getOneProduct (req, res, next) {
            try {
                const {id} = req.params;
                const product = await this.findProduct(id);
                return res.status(HttpStatus.OK).json({
                    statusCode : HttpStatus.OK,   
                    data : {
                        product
                    }
                })
                
            } catch (error) {
                next(error)
            }
        }
        async findProduct (productID){
        const {id} = await ObjectValidator.validateAsync({id : productID});
        const product = await ProductModel.findById(id);
        if(!product) throw createHttpError.NotFound("Product not found");
        return product 
        }
        async ExistCorrectCategoryID(categoryID){
        const category = await CategoryModel.findOne({_id  : categoryID})
        if(!category) throw createHttpError.BadRequest("Category ID is not correct")
        return category
        }   
}
module.exports =  {
    AdminProductController : new ProductController()
}