const { AdminCourseController } = require("../../http/controllers/admin/course.controller");
const { stringToArray } = require("../../http/middlewares/stringToArray");
const { uploadFileCourse} = require("../../utils/multer");
/**
 * @swagger
 *  components:
 *       schemas:
 *          Types:        
 *              type: string
 *              enum:
 *                -   free
 *                -   cash              
 *                -   special
 */
const router = require("express").Router();
/**
 * @swagger
 * /admin/courses/list:
 *      get:
 *          tags: [Course(Admin-Panel)]
 *          summary: get all of courses
 *          parameters:
 *              -   in: query
 *                  name: search
 *                  type: string
 *                  description: text for search in title,text and short_text (course)
 *          responses: 
 *              200:
 *                  description: success
 */
router.get("/list" , AdminCourseController.getAllCourses) // get all course
/**
 * @swagger
 *  components:
 *      schemas:        
 *          Course:
 *              type: object
 *              required:
 *                  -   title
 *                  -   text
 *                  -   short_text
 *                  -   tags
 *                  -   category
 *                  -   price
 *                  -   discount
 *                  -   image   
 *                  -   type
 *              properties: 
 *                  title:     
 *                      type: string
 *                      description: the title Of course
 *                      example: عنوان دوره
 *                  text:     
 *                      type: string
 *                      description: the text of course
 *                      example: متن توضیحات دوره به صورت تستی
 *                  short_text:     
 *                      type: string
 *                      description: the summary text of course
 *                      example: متن کوتاه تستی
 *                  tags:     
 *                      type: array
 *                      description: the list of tags in course
 *                  category:     
 *                      type: string
 *                      description: the ID category for course
 *                      example: 63728d0246ac6325879028d0
 *                  price:     
 *                      type: string
 *                      description: the price of course
 *                      example: 250000 
 *                  discount:     
 *                      type: string
 *                      description: the discount of course
 *                      example: 10
 *                  image:     
 *                      type: string
 *                      format: binary
 *                  type:     
 *                      $ref : '#/components/schemas/Types'
 */
/**
 * @swagger
 * /admin/courses/add:
 *      post:
 *          tags: [Course(Admin-Panel)]
 *          summary : create and save course
 *          requestBody:
 *              required: true
 *              content:
 *                multipart/form-data:
 *                    schema:
 *                        $ref: '#/components/schemas/Course'   
 *          responses:
 *              201:
 *                  description: create new course  
 */
 router.post("/add" , uploadFileCourse.single("image") , stringToArray("tags") , AdminCourseController.addCourse)
/**
 * @swagger
 * /admin/courses/{id}:
 *      get:
 *          tags: [Course(Admin-Panel)]
 *          summary: get One course By ID
 *          parameters:
 *              -   in: path
 *                  name: id
 *                  type: string
 *                  description: find One Course By ID
 *          responses: 
 *              200:
 *                  description: success
 */
 router.get("/:id" , AdminCourseController.getOneCourse) 

module.exports = {
    AdminApiCourseRouter : router
}