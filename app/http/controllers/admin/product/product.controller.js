const { ProductModel } = require("../../../../models/products");
const { createProductSchema } = require("../../../validators/admin/product.schema");
const Controller = require("../../controller");
const { StatusCodes: HttpStatus } = require("http-status-codes");
const { deleteFilePublic, ListOfImagesFromRequest, setFeatures, copyObject, deleteInvalidPropertyInObject } = require("../../../../utils/function");
const { ObjectValidator } = require("../../../validators/public.validator");
const createHttpError = require("http-errors");
const { MessageSpecial} = require("../../../../utils/constants");
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
                const productBody = await createProductSchema.validateAsync(req.body);
                const {title , text , short_text , category , tags , count , price , discount} = productBody;
                const supplier = req.user._id;
                let features = setFeatures(req.body)
                let type = ""
                if(features.height > 0 || features.length > 0 || features.width >0 || features.weight > 0){
                    type = "physical"
                }
                else{
                  type = "virtual"
                }
                const product = await ProductModel.create({
                    title,
                    text,
                    short_text,
                    tags,
                    count,
                    category,
                    discount,
                    type,
                    price,
                    images,
                    features,
                    supplier
                });
                if(product._id){
                    
                    return res.status(HttpStatus.CREATED).json({
                        StatusCode : HttpStatus.CREATED,
                        data : {
                            message : MessageSpecial.SUCCESSFUL_CREATED_PRODUCT_MESSAGE
                        }
                    })
                }

            } catch (error) {
                deleteFilePublic(req.body.image)
                next(error)
            }
        }
        async editProduct (req, res, next) {
            try {
                const {id} = req.params;
                await this.findProduct(id);
                const data = copyObject(req.body);
                data.images = ListOfImagesFromRequest(req?.files || [], req.body.fileUploadPath);
                data.features = setFeatures(req.body);
                let blackListFields = Object.values(ProductBlackList);
                deleteInvalidPropertyInObject(data , blackListFields)
                const updateResult = await ProductModel.updateOne({_id : id}, {$set : data})
                if(updateResult.modifiedCount == 0) throw {status : HttpStatus.INTERNAL_SERVER_ERROR , message : MessageSpecial.UNSUCCESSFUL_UPDATED_MESSAGE}
    
                return res.status(HttpStatus.OK).json({
                    statusCode: HttpStatus.OK,
                    data : {
                        message : MessageSpecial.SUCCESSFUL_UPDATED_MESSAGE
                    }
                })
                
            } catch (error) {
                next(error)
            }
        }
        async removeProduct (req, res, next) {
            try {
                const {id} = req.params;
                await this.findProduct(id);
                const deleteResult = await ProductModel.deleteOne({id : id});
                if(deleteResult.deletedCount == 0) throw {status : HttpStatus.INTERNAL_SERVER_ERROR , message : MessageSpecial.INTERNAL_SERVER_ERROR}
                return res.status(HttpStatus.OK).json({
                    statusCode : HttpStatus.OK,
                    data : {
                        message : MessageSpecial.SUCCESSFUL_REMOVE_PRODUCT_MESSAGE
                    }
                })
                
            } catch (error) {
                next(error)
            }
        }
        async getALlProducts (req, res, next) {
            try {
                const search = req?.query?.search || "";
                let products;
                if (search) {
                     products = await ProductModel.find({ $text: { $search: `"${req.query.search }"`  } })
                } else {
                  products = await ProductModel.find({})
                }
                return res.status(HttpStatus.OK).json({
                  statusCode: HttpStatus.OK,
                  data: {
                    products
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
        if(!product) throw createHttpError.NotFound("محصولی یافت نشد");
        return product 
    }
    
}
module.exports =  {
    AdminProductController : new ProductController()
}