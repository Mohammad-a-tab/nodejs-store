const { AdminBlogController } = require("../../http/controllers/admin/blog/blog.controller");
const { stringToArray } = require("../../http/middlewares/stringToArray");
const { uploadFile } = require("../../utils/multer");
const router = require("express").Router();

router.get("/all"
    , AdminBlogController.getListOfBlogs)
router.post("/add"
    , uploadFile.single("image")
    , stringToArray("tags")
    , AdminBlogController.createBlog)
router.get("/:id"
    , AdminBlogController.getOneBlogByID)
router.delete("/remove/:id"
    , AdminBlogController.deleteBlogByID)
router.patch("/update/:id"
    , uploadFile.single("image")
    , stringToArray("tags")
    , AdminBlogController.updateBlogByID)
 
module.exports = {
    AdminApiBlogRouter : router
}