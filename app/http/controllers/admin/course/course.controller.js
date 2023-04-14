const { 
    deleteInvalidPropertyInObject, 
    copyObject, deleteFilePublic, 
    deleteCourseFieldForInsertCourseInElastic, 
    updateElasticCourse
} = require("../../../../utils/function");
const { 
    createNewCourseInElasticSearch, 
    getAllCourseFromElasticSearch, 
    removeCourseFromElasticSearch
} = require("../../../../ElasticSearch/controller/course/course.controller");
const { createCourseSchema } = require("../../../validators/admin/course.schema");
const { CategoryModel } = require("../../../../models/categories");
const { MessageSpecial } = require("../../../../utils/constants");
const {StatusCodes : HttpStatus} = require("http-status-codes");
const { CourseModel } = require("../../../../models/course");
const { isValidObjectId } = require("mongoose");
const Controller = require("../../controller");
const createHttpError = require("http-errors");
const path = require("path");

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
Object.freeze(BLACKLIST)
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
            const data = copyObject(courses)
            const elasticCourses = await getAllCourseFromElasticSearch(data)
            return res.status(HttpStatus.OK).json({
                StatusCode : HttpStatus.OK,
                data : {
                    courses,
                    elasticCourses
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
            const data = courseDataBody;
            data.image = req.body.image
            data.teacher = req.user._id
            if(Number(data.price) > 0 && data.type === "free") 
                throw createHttpError.BadRequest("برای دوره ی رایگان نمیتوان قیمت ثبت کرد")
            data.discountStatus = false
            if(Number(data?.discount) > 0){
                data.discountStatus = true
            }
            const category = await this.existCategoryByID(data?.category)
            const courseResult = await CourseModel.create({...data});
            if(!courseResult?._id) 
                throw {
                    status : HttpStatus.INTERNAL_SERVER_ERROR, 
                    message : MessageSpecial.UNSUCCESSFUL_CREATED_COURSE_MESSAGE
                }
            deleteCourseFieldForInsertCourseInElastic(data, req, category)
            const createCourseInElasticResult = await createNewCourseInElasticSearch(data)
            return res.status(HttpStatus.CREATED).json({
                statusCode : HttpStatus.CREATED,
                data: {
                    message : MessageSpecial.SUCCESSFUL_CREATED_COURSE_MESSAGE,
                    ElasticResult: createCourseInElasticResult.result
                }
            })
            
        } catch (error) {
            deleteFilePublic(req?.body?.image)
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
            let discountStatus = false
            if(Number(req?.body?.discount) > 0){
                discountStatus = true
                req.body.discountStatus = discountStatus
            }
            const data = copyObject(req.body);
            const { fileUploadPath, filename } = req.body;
            let blackListFields = Object.values(BLACKLIST)
            deleteInvalidPropertyInObject(data , blackListFields)
            if(req.file){
                data.image = path.join(fileUploadPath,filename);
                deleteFilePublic(course.image)
            }
            let updateCourseResults;
            if(data.category){
                if(await this.existCategoryByID(data.category)){
                    updateCourseResults = await CourseModel.updateOne({_id : courseID} , {
                        $set : data
                    });
                }
            }
            updateCourseResults = await CourseModel.updateOne({_id : courseID} , {
                $set : data
            });
            if(updateCourseResults.modifiedCount == 0) 
                throw createHttpError.InternalServerError("Course update failed");
            const ElasticResult = await updateElasticCourse(CourseModel, courseID);
            return res.status(HttpStatus.OK).json({
                statusCode : HttpStatus.OK,
                data : {
                    message : MessageSpecial.SUCCESSFUL_UPDATED_COURSE_MESSAGE,
                    ElasticResult
                }
            })
        } catch (error) {
            deleteFilePublic(req?.body?.image)
            next(error)
        }
    }
    async removeCourse (req, res, next) {
        try {
            const {CourseID} = req.params;
            const course = await this.findCourseByID(CourseID);
            const deleteCourseFromElasticResult = await removeCourseFromElasticSearch(course?.title)
            if(deleteCourseFromElasticResult.deleted) {
                const deleteCourseResult = await CourseModel.deleteOne({_id : CourseID});
                if(deleteCourseResult.deletedCount == 0) 
                    throw createHttpError.InternalServerError("The course delete Unsuccessfully")
                deleteFilePublic(course?.image)
            }
            return res.status(HttpStatus.OK).json({
                statusCode : HttpStatus.OK,
                data : {
                    message : MessageSpecial.SUCCESSFUL_REMOVE_COURSE_MESSAGE,
                    ElasticResult: deleteCourseFromElasticResult.deleted
                }
            })
            
        } catch (error) {
            next(error)
        }
    }
    async findCourseByID (courseID) {
        if(!isValidObjectId(courseID)) 
            throw createHttpError.BadRequest("The entered ID is not correct"); 
       const course = await CourseModel.findById(courseID);
       if(!course) throw createHttpError.NotFound("Course not found");
       return course
    }
    async existCategoryByID (categoryID) {
        const category = await CategoryModel.findOne({_id : categoryID})
        if(!category) throw createHttpError.NotFound("Category not found")
        return category
    }
}

module.exports = {
    AdminCourseController : new CourseController()
}