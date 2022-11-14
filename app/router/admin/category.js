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
/**
 * @swagger
 * /admin/category/parents:
 *      get:
 *          tags: [Admin-Panel]
 *          summary: get All parents of category or category Heads
 *          responses:
 *               200:
 *                  description: success
 */
router.get("/parents" , CategoryController.getAllParents)
/**
 * @swagger
 * /admin/category/child/{parent}:
 *      get:
 *          tags: [Admin-Panel]
 *          summary: get All children of parents category 
 *          parameters:
 *              -   in: path
 *                  name: parent
 *                  type: string
 *                  required: true
 *          responses:
 *               200:
 *                  description: success
 */
 router.get("/child/:parent" , CategoryController.getChildOfParents)
 /**
 * @swagger
 * /admin/category/all-c:
 *      get:
 *          tags: [Admin-Panel]
 *          summary: get All categories
 *          responses:
 *               200:
 *                  description: success
 */
  router.get("/all-c" , CategoryController.getAllCategory)
/**
 * @swagger
 * /admin/category/remove/{id}:
 *      delete:
 *          tags: [Admin-Panel]
 *          summary: delete category with object-id
 *          parameters:
 *              -   in: path
 *                  name: id
 *                  type: string
 *                  required: true
 *          responses:
 *               200:
 *                  description: success
 */
 router.delete("/remove/:id" , CategoryController.removeCategory)
 /**
 * @swagger
 * /admin/category/{id}:
 *      get:
 *          tags: [Admin-Panel]
 *          summary: get category By ID
 *          parameters:
 *              -   in: path
 *                  name: id
 *                  type: string
 *                  required: true
 *          responses:
 *               200:
 *                  description: success
 */
  router.get("/:id" , CategoryController.getCategoryByID)

module.exports = {
    CategoryRoutes : router
}