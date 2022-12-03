const { AdminProductController } = require("../../http/controllers/admin/product.controller");
const { stringToArray } = require("../../http/middlewares/stringToArray");
const { uploadFile } = require("../../utils/multer");
const router = require("express").Router();
/**
 * @swagger
 *  components:
 *      schemas:        
 *          Product:
 *              type: object
 *              required:
 *                  -   title
 *                  -   text
 *                  -   short_text
 *                  -   tags
 *                  -   category
 *                  -   price
 *                  -   discount
 *                  -   count
 *              properties: 
 *                  title:     
 *                      type: string
 *                      description: the title Of product
 *                  text:     
 *                      type: string
 *                      description: the text of product
 *                  short_text:     
 *                      type: string
 *                      description: the summary text of product
 *                  tags:     
 *                      type: array
 *                      description: the list of tags in product
 *                  category:     
 *                      type: string
 *                      description: the ID category for product
 *                  price:     
 *                      type: string
 *                      description: the price of product
 *                  discount:     
 *                      type: string
 *                      description: the discount of product
 *                  count:     
 *                      type: string
 *                      description: the count of product packet
 *                  images:     
 *                      type: array
 *                      items:
 *                          type: string
 *                          format: binary
 *                  height:     
 *                      type: string
 *                      description: the height of product packet
 *                  weight:     
 *                      type: string
 *                      description: the weight of product packet
 *                  width:     
 *                      type: string
 *                      description: the width of product packet
 *                  length:     
 *                      type: string
 *                      description: the length of product packet
 *                  colors:     
 *                      type: array
 *                      items:
 *                          type: string
 *                          enum:
 *                            - red
 *                            - blue        
 *                      style: pipeDelimited
 *                      explode: false
 *                      description: the length of product packet
 */
/**
 * @swagger
 * /admin/products/add:
 *      post:
 *          tags: [Product(Admin-Panel)]
 *          summary : create and save products
 *          requestBody:
 *              required: true
 *              content:
 *                multipart/form-data:
 *                    schema:
 *                        $ref: '#/components/schemas/Product'   
 *          responses:
 *              201:
 *                  description: create new product  
 */
router.post("/add" , uploadFile.array("images" ,10) , stringToArray("tags") , stringToArray("colors") , AdminProductController.addProduct)
/**
 * @swagger
 * /admin/products/get-all:
 *      get:
 *          tags: [Product(Admin-Panel)]
 *          summary : get all products
 *          responses:
 *              200:
 *                  description: success 
 */
router.get('/get-all',AdminProductController.getALlProducts)
/**
 * @swagger
 * /admin/products/{id}:
 *      get:
 *          tags: [Product(Admin-Panel)]
 *          summary : get One product with ID
 *          parameters:
 *              -   in: path
 *                  name: id 
 *                  type: string
 *                  required: true
 *                  description: ObjectID of product
 *          responses:
 *              200:
 *                  description: success 
 */
router.get("/:id" , AdminProductController.getOneProduct)
// router.patch()
// router.delete()
module.exports = {
    AdminApiProductRouter : router
}