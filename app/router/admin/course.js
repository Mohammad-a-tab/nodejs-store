const { AdminCourseController } = require("../../http/controllers/admin/course.controller");

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
// router.post() // create new course
// router.put() // create new chapter
// router.put() // create new episode
// router.delete() // delete a course
// router.patch() //edit a course 
// router.get() // get one course

module.exports = {
    AdminApiCourseRouter : router
}