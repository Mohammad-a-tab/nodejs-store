const { AdminBlogController } = require("../../http/controllers/admin/blog.controller");
const { stringToArray } = require("../../http/middlewares/stringToArray");
const { uploadFile } = require("../../utils/multer");
/**
 * @swagger
 *  components:
 *      schemas:        
 *          Blog:
 *              type: object
 *              required:
 *                  -   title
 *                  -   text
 *                  -   short_text
 *                  -   category
 *                  -   image
 *              properties: 
 *                  title:     
 *                      type: string
 *                      description: the title Of blog
 *                  text:     
 *                      type: string
 *                      description: the text of blog
 *                  short_text:     
 *                      type: string
 *                      description: the summary text of blog
 *                  tags:     
 *                      type: string
 *                      description: the list of tags for example(tag1#tag2#tag_foo)
 *                  category:     
 *                      type: string
 *                      description: the ID of category for forinField in blog 
 *                  image:     
 *                      type: file
 *                      description: the index picture of blog
 */
const router = require("express").Router();
/**
 * @swagger
 *  components:
 *      schemas:        
 *          BlogUpdate:
 *              type: object
 *              properties: 
 *                  title:     
 *                      type: string
 *                      description: the title Of blog
 *                  text:     
 *                      type: string
 *                      description: the text of blog
 *                  short_text:     
 *                      type: string
 *                      description: the summary text of blog
 *                  tags:     
 *                      type: string
 *                      description: the list of tags for example(tag1#tag2#tag_foo)
 *                  category:     
 *                      type: string
 *                      description: the ID of category for forinField in blog 
 *                  image:     
 *                      type: file
 *                      description: the index picture of blog
 */
/**
 * 
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
 *          requestBody:
 *              required: true
 *              content:
 *                multipart/form-data:
 *                    schema:
 *                        $ref: '#/components/schemas/Blog'      
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
 *          parameters:
 *              -   in: path
 *                  name: id
 *                  type: string
 *                  required: true
 *          requestBody:
 *              required: true
 *              content:
 *                multipart/form-data:
 *                    schema:
 *                        $ref: '#/components/schemas/BlogUpdate' 
 *          responses:
 *              201:
 *                  description: created
 */
 router.patch("/update/:id", uploadFile.single("image"), stringToArray("tags"), AdminBlogController.updateBlogByID)
 
module.exports = {
    AdminApiBlogRouter : router
}