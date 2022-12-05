const { CourseModel } = require("../../../models/course");
const Controller = require("../controller");
const {StatusCodes : HttpStatus} = require("http-status-codes")
class CourseController extends Controller {
    async getAllCourses (req, res, next) {
        try {
            const {search} = req.query;
            let courses;
            if(search) courses = await CourseModel.find({$text : {$search : search}}).sort({_id : -1})
            else courses = await CourseModel.find({}).sort({_id : -1})
            return res.status(HttpStatus.OK).json({
                StatusCode : HttpStatus.OK,
                data : {
                    courses
                }
            })
        } catch (error) {
            next(error)
        }
    }
}

module.exports = {
    AdminCourseController : new CourseController()
}