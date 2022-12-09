const { AdminCategoryController } = require("../../http/controllers/admin/category.controller");
const router = require("express").Router();
              
router.post("/add" , AdminCategoryController.addCategory)
router.get("/parents" , AdminCategoryController.getAllParents)
router.get("/child/:parent" , AdminCategoryController.getChildOfParents)
router.get("/all" , AdminCategoryController.getAllCategory)
router.delete("/remove/:id" , AdminCategoryController.removeCategory)
router.get("/list-of-all" , AdminCategoryController.getAllCategoryWithoutPopulate)
router.get("/:id" , AdminCategoryController.getCategoryByID)
router.patch("/update/:id" , AdminCategoryController.editCategoryTitle)

module.exports = {
  AdminApiCategoryRouter : router
}