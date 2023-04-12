const { AdminProductController } = require("../../http/controllers/admin/product/product.controller");
const { stringToArray } = require("../../http/middlewares/stringToArray");
const { uploadFile } = require("../../utils/multer");

const router = require("express").Router();
router.post("/add", 
    uploadFile.array("images" ,10), 
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
    uploadFile.array("images" ,10), 
    stringToArray("tags", "colors"), 
    AdminProductController.editProduct)

module.exports = {
    AdminApiProductRouter : router
}