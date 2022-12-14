const { CourseModel } = require("../../../../models/course");
const Controller = require("../../controller");
const {StatusCodes : HttpStatus} = require("http-status-codes");
const { createCourseSchema } = require("../../../validators/admin/course.schema");
const path = require("path");
const { MessageSpecial } = require("../../../../utils/constants");
const createHttpError = require("http-errors");
const { isValidObjectId } = require("mongoose");
class CourseController extends Controller {
    async getAllCourses (req, res, next) {
        try {
            const {search} = req.query;
            let courses;
            if(search) courses = await CourseModel
            .find({$text : {$search : search}})
            .populate([
                {path : "category" , select : {children : 0 , parent : 0}},
                {path : "teacher" , select : {"first_name" : 1 , "last_name" : 1 , "mobile" : 1, "email" : 1}}
            ]).sort({_id : -1})
            else courses = await CourseModel
            .find({})
            .populate([
                {path : "category" , select : {title : 1}},
                {path : "teacher" , select : {first_name : 1 , last_name : 1 , mobile : 1, email : 1}}
            ]).sort({_id : -1})
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
    async addCourse (req , res , next) {
        try {
            const courseDataBody = await createCourseSchema.validateAsync(req.body);
            req.body.image =path.join(courseDataBody.fileUploadPath, courseDataBody.filename)
            req.body.image = req.body.image.replace(/\\/g, "/")
            let {title , text , short_text , tags , category , price , discount = 0 , type} = courseDataBody;
            const image = req.body.image
            const teacher = req.user._id
            if(Number(price) > 0 && type === "free") throw createHttpError.BadRequest("برای دوره ی رایگان نمیتوان قیمت ثبت کرد")
            const courseResult = await CourseModel.create({
                title
                , text
                , short_text
                , category
                , tags
                , image
                , teacher
                , price
                , discount
                , type,
                time : "00:00:00",
                status : "notStarted",
            });
            if(!courseResult?._id) throw {status : HttpStatus.INTERNAL_SERVER_ERROR , message : MessageSpecial.UNSUCCESSFUL_CREATED_COURSE_MESSAGE}
            return res.status(HttpStatus.CREATED).json({
                statusCode : HttpStatus.CREATED,
                data: {
                    message : MessageSpecial.SUCCESSFUL_CREATED_COURSE_MESSAGE
                }
            })
            
        } catch (error) {
            next(error)
        }
    }
    async getOneCourse (req ,res ,next) {
        try {
            const {id} = req.params;
            const course = await CourseModel.findById(id);
            if(!course) throw createHttpError.NotFound("دوره ای یافت نشد");
            return res.status(HttpStatus.OK).json({
                statusCode : HttpStatus.OK,
                data : {
                    course
                }
            })
        } catch (error) {
            next(error)
        }
    }
    async findCourseByID (id) {
        if(!isValidObjectId(id)) throw createHttpError.BadRequest("شناسه وارد شده صحیح نمیباشد"); 
       const course = await CourseModel.findById(id);
       if(!course) throw createHttpError.NotFound("دوره ای یافت نشد");
       return course
    }
}

module.exports = {
    AdminCourseController : new CourseController()
}