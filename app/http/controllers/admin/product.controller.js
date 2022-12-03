const { ProductModel } = require("../../../models/products");
const { createProductSchema } = require("../../validators/admin/product.schema");
const Controller = require("../controller");
const { StatusCodes: HttpStatus } = require("http-status-codes");
const { deleteFilePublic, ListOfImagesFromRequest, setFeatures } = require("../../../utils/function");
const { ObjectValidator } = require("../../validators/public.validator");
const createHttpError = require("http-errors");

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
                return res.status(HttpStatus.CREATED).json({
                    StatusCode : HttpStatus.CREATED,
                    data : {
                        message : 'ثبت محصول با موفقیت انجام شد'
                    }
                })

            } catch (error) {
                deleteFilePublic(req.body.image)
                next(error)
            }
        }
        editProduct (req, res, next) {
            try {
                return res.json(req.body)
                
            } catch (error) {
                next(error)
            }
        }
        removeProduct (req, res, next) {
            try {
                
            } catch (error) {
                next(error)
            }
        }
        async getALlProducts (req, res, next) {
            try {
                const products = await ProductModel.find({});
                return res.status(HttpStatus.OK).json({
                    StatusCode : 200,
                    data : {
                        products
                    }
                })
                
            } catch (error) {
                next(error)
            }
        }
        async getOneProduct (req, res, next) {
            try {
                const {id} = req.params;
                const product = await this.findProduct(id);
                return res.status(HttpStatus.OK).json({
                    statusCode : 200,   
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