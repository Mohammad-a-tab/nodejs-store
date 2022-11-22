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
 *          parameters:
 *              -   in: header
 *                  value: Bearer 
 *                  name: access-token
 *                  type: string
 *                  required: true
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
 *          parameters:
 *              -   in: header
 *                  value: Bearer 
 *                  name: access-token
 *                  type: string
 *                  required: true
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
 *              201:
 *                  description: created
 */
 router.post("/add", uploadFile.single("image"), stringToArray("tags"), AdminBlogController.createBlog)
 /**
 * @swagger
 * /admin/blogs/{id}:
 *      get:    
 *          tags: [Blog(Admin-Panel)]
 *          summary: get blog By ID and populate this field
 *          parameters:
 *              -   in: header
 *                  value: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtb2JpbGUiOiIwOTE0MTI0MTc0NyIsImlhdCI6MTY2OTA2Njg4NywiZXhwIjoxNjY5MDcwNDg3fQ.5HqloTWBLyO8nU9tQM7YqiwMlHBaz6GW8wcjz9adEuM
 *                  name: access-token
 *                  type: string
 *                  required: true
 *              -   in: path
 *                  name: id
 *                  type: string
 *                  required: true
 *          responses:
 *              200:
 *                  description: success
 */
router.get("/:id", AdminBlogController.getOneBlogByID)
 /**
 * @swagger
 * /admin/blogs/remove/{id}:
 *      delete:    
 *          tags: [Blog(Admin-Panel)]
 *          summary: delete blog By ID 
 *          parameters:
 *              -   in: header
 *                  value: Bearer 
 *                  name: access-token
 *                  type: string
 *                  required: true
 *              -   in: path
 *                  name: id
 *                  type: string
 *                  required: true
 *          responses:
 *              200:
 *                  description: success
 */
router.delete("/remove/:id", AdminBlogController.deleteBlogByID)
/**
 * @swagger
 * /admin/blogs/update/{id}:
 *      patch:    
 *          tags: [Blog(Admin-Panel)]
 *          summary: update blog document By ID
 *          consumes:
 *              -  multipart/form-data
 *          parameters:
 *              -   in: header
 *                  value: Bearer 
 *                  name: access-token
 *                  type: string
 *                  required: true
 *              -   in: path
 *                  name: id
 *                  type: string
 *                  required: true
 *              -   in: formData
 *                  name: title
 *                  type: string
 *              -   in: formData
 *                  name: text
 *                  type: string
 *              -   in: formData
 *                  name: short_text
 *                  type: string
 *              -   in: formData
 *                  name: tags
 *                  example: tag1#tag2#tag3_foo#foo_bar || str || undefined
 *                  type: string
 *              -   in: formData
 *                  name: category
 *                  type: string
 *              -   in: formData
 *                  name: image
 *                  type: file
 * 
 *          responses:
 *              201:
 *                  description: created
 */
 router.patch("/update/:id", uploadFile.single("image"), stringToArray("tags"), AdminBlogController.updateBlogByID)
 
module.exports = {
    AdminApiBlogRouter : router
}