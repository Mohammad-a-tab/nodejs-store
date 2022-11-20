const { AdminCategoryController } = require("../../http/controllers/admin/category.controller");

const router = require("express").Router();
 
/**
 * @swagger
 * /admin/category/add-category:
 *      post:
 *          tags: [Category(Admin-Panel)]
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
router.post("/add-category" , AdminCategoryController.addCategory)
/**
 * @swagger
 * /admin/category/parents:
 *      get:
 *          tags: [Category(Admin-Panel)]
 *          summary: get All parents of category or category Heads
 *          responses:
 *               200:
 *                  description: success
 */
router.get("/parents" , AdminCategoryController.getAllParents)
/**
 * @swagger
 * /admin/category/child/{parent}:
 *      get:
 *          tags: [Category(Admin-Panel)]
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
 router.get("/child/:parent" , AdminCategoryController.getChildOfParents)
 /**
 * @swagger
 * /admin/category/all-c:
 *      get:
 *          tags: [Category(Admin-Panel)]
 *          summary: get All categories
 *          responses:
 *               200:
 *                  description: success
 */
  router.get("/all-c" , AdminCategoryController.getAllCategory)
/**
 * @swagger
 * /admin/category/remove/{id}:
 *      delete:
 *          tags: [Category(Admin-Panel)]
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
 router.delete("/remove/:id" , AdminCategoryController.removeCategory)
 /**
 * @swagger
 * /admin/category/get-all:
 *      get:
 *          tags: [Category(Admin-Panel)]
 *          summary: get all category without populate 
 *          responses:
 *               200:
 *                  description: success
 */
  router.get("/get-all" , AdminCategoryController.getAllCategoryWithoutPopulate)
 /**
 * @swagger
 * /admin/category/{id}:
 *      get:
 *          tags: [Category(Admin-Panel)]
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
  router.get("/:id" , AdminCategoryController.getCategoryByID)
/**
 * @swagger
 * /admin/category/update/{id}:
 *      patch:
 *          tags: [Category(Admin-Panel)]
 *          summary: update category title with ID
 *          parameters:
 *              -   in: path
 *                  name: id
 *                  type: string
 *                  required: true
 *              -   in: formData
 *                  name: title
 *                  type: string
 *                  required: true
 *          responses:
 *               200:
 *                  description: success
 *               500:
 *                  description: internal Server Error
 */
    router.patch("/update/:id" , AdminCategoryController.editCategoryTitle)


module.exports = {
  AdminApiCategoryRouter : router
}