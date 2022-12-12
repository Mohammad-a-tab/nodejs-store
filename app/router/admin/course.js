const { AdminCourseController } = require("../../http/controllers/admin/course/course.controller");
const { stringToArray } = require("../../http/middlewares/stringToArray");
const { uploadFileCourse} = require("../../utils/multer");
const router = require("express").Router();

router.get("/list" , AdminCourseController.getAllCourses) // get all course
router.post("/add" , uploadFileCourse.single("image") , stringToArray("tags") , AdminCourseController.addCourse)
router.post("/add" , uploadFileCourse.single("image") , stringToArray("tags") , AdminCourseController.addCourse)
router.get("/:id" , AdminCourseController.getOneCourse) 

module.exports = {
    AdminApiCourseRouter : router
}