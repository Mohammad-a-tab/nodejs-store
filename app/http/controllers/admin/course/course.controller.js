const { CourseModel } = require("../../../../models/course");
const Controller = require("../../controller");
const {StatusCodes : HttpStatus} = require("http-status-codes");
const { createCourseSchema } = require("../../../validators/admin/course.schema");
const path = require("path");
const { MessageSpecial } = require("../../../../utils/constants");
const createHttpError = require("http-errors");
const { isValidObjectId } = require("mongoose");
const { deleteInvalidPropertyInObject, copyObject, deleteFilePublic } = require("../../../../utils/function");


let BLACKLIST = {
    TIME : "time",
    COMMENTS : "comments",
    LIKES : "likes",
    DISLIKES : "dislikes",
    EPISODES : "episode",
    CHAPTERS : "chapters",
    BOOKMARKS : "bookmarks",
    STUDENTS : "students",
    FILE_UPLOAD_PATH : "fileUploadPath",
    FILE_NAME : "filename"
}
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
            deleteFilePublic(req.body.image)
            next(error)
        }
    }
    async getOneCourse (req ,res ,next) {
        try {
            const {id} = req.params;
            const course = await CourseModel.findById(id);
            if(!course) throw createHttpError.NotFound("Course not found");
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
    async updateOneCourse (req ,res ,next) {
        try {
            const {courseID} = req.params;
            const course = await this.findCourseByID(courseID);
            const data = copyObject(req.body);
            const {fileUploadPath, filename} = req.body;
            let blackListFields = Object.values(BLACKLIST)
            deleteInvalidPropertyInObject(data , blackListFields)
            if(req.file){
                data.image = path.join(fileUploadPath,filename);
                deleteFilePublic(course.image)
            }
            const updateCourseResults = await CourseModel.updateOne({_id : courseID} , {
                $set : data
            });
            if(updateCourseResults.modifiedCount == 0) throw createHttpError.InternalServerError("Course update failed");
            return res.status(HttpStatus.OK).json({
                statusCode : HttpStatus.OK,
                data : {
                    message : MessageSpecial.SUCCESSFUL_UPDATED_COURSE_MESSAGE
                }
            })
        } catch (error) {
            deleteFilePublic(req?.body?.image)
            next(error)
        }
    }
    async findCourseByID (courseID) {
        if(!isValidObjectId(courseID)) throw createHttpError.BadRequest("The entered ID is not correct"); 
       const course = await CourseModel.findById(courseID);
       if(!course) throw createHttpError.NotFound("Course not found");
       return course
    }
}

module.exports = {
    AdminCourseController : new CourseController()
}