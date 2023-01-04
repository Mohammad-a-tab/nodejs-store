const { AdminProductController } = require("../../http/controllers/admin/product/product.controller");
const { stringToArray } = require("../../http/middlewares/stringToArray");
const { uploadFileProduct } = require("../../utils/multer");
const router = require("express").Router();
router.post("/add", 
    uploadFileProduct.array("images" ,10), 
    stringToArray("tags"), 
    stringToArray("colors"), 
    AdminProductController.addProduct)
router.get('/get-all', 
    AdminProductController.getALlProducts)
router.get("/:id", 
    AdminProductController.getOneProduct)
router.delete("/remove/:id", 
    AdminProductController.removeProduct)
router.patch("/edit/:id", 
    uploadFileProduct.array("images" ,10), 
    stringToArray("tags", "colors"), 
    AdminProductController.editProduct)

module.exports = {
    AdminApiProductRouter : router
}