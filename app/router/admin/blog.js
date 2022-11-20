const { AdminBlogController } = require("../../http/controllers/admin/blog.controller");
const { stringToArray } = require("../../http/middlewares/stringToArray");
const { uploadFile } = require("../../utils/multer");

const router = require("express").Router();
/**
 * @swagger
 * /admin/blogs:
 *      get:    
 *          tags: [Blog(Admin-Panel)]
 *          summary: get all blogs
 *          responses:
 *              200:
 *                  description: success
 */
router.get("/", AdminBlogController.getListOfBlogs)
/**
 * @swagger
 * /admin/blogs/add:
 *      post:    
 *          tags: [Blog(Admin-Panel)]
 *          summary: create blog document
 *          consumes:
 *              -  multipart/form-data
 *              -  application/x-www-form-data-urlencoded
 *          parameters:
 *              -   in: formData
 *                  name: title
 *                  required: true
 *                  type: string
 *              -   in: formData
 *                  name: text
 *                  required: true
 *                  type: string
 *              -   in: formData
 *                  name: short_text
 *                  required: true
 *                  type: string
 *              -   in: formData
 *                  name: tags
 *                  example: tag1#tag2#tag3_foo#foo_bar || str || undefined
 *                  type: string
 *              -   in: formData
 *                  name: category
 *                  required: true
 *                  type: string
 *              -   in: formData
 *                  name: image
 *                  required: true
 *                  type: file
 * 
 *          responses:
 *              200:
 *                  description: created
 */
 router.post("/add", uploadFile.single("image"), stringToArray("tags"), AdminBlogController.createBlog)
module.exports = {
    AdminApiBlogRouter : router
}