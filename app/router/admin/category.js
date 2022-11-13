const { CategoryController } = require("../../http/controllers/admin/category.controller");

const router = require("express").Router();
 
/**
 * @swagger
 * /admin/category/add-category:
 *      post:
 *          tags: [Admin-Panel]
 *          summary: create new category title
 *          parameters:
 *              -   in: formData
 *                  type: string
 *                  required: true
 *                  name: title
 *              -   in: formData
 *                  type: string
 *                  required: false
 *                  name: parent        
 *          responses:
 *              201:
 *                  description: success
 */                 
router.post("/add-category" , CategoryController.addCategory)
module.exports = {
    CategoryRoutes : router
}