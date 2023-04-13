const { 
    deleteInvalidPropertyInObject, 
    copyObject, 
    updateElasticCourse
} = require("../../../../utils/function");
const { MessageSpecial } = require("../../../../utils/constants");
const { AdminCourseController } = require("./course.controller");
const {StatusCodes : HttpStatus} = require("http-status-codes");
const { CourseModel } = require("../../../../models/course");
const Controller = require("../../controller");
const createHttpError = require("http-errors");
class ChapterController extends Controller {
    async addChapter (req , res , next) {
        try {
            const {id , title , text} = req.body;
            await AdminCourseController.findCourseByID(id);
            const saveChapterResults = await CourseModel.updateOne({_id : id} , {$push : {
                chapters : {title , text , episodes : []}
            }});
            if(saveChapterResults.modifiedCount == 0) 
                throw createHttpError.InternalServerError("Add chapter failed");
            const ElasticResult = await updateElasticCourse(id);
            return res.status(HttpStatus.CREATED).json({
                statusCode : HttpStatus.CREATED,
                data : {
                    message : MessageSpecial.SUCCESSFUL_CREATED_CHAPTER_MESSAGE,
                    ElasticResult
                }
            })

        } catch (error) {
            next(error)
        }
    }
    async chaptersOfCourse (req , res , next) {
        try {
            const {courseID} = req.params;
            const course = await this.getChapterOfCourse(courseID);
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
    async updateChapterById (req , res , next) {
        try {
            const {chapterID} = req.params;
            const course = await CourseModel.findOne({"chapters._id" : chapterID});
            const chapter = await this.getOneChapter(chapterID);
            const data = copyObject(req.body);
            deleteInvalidPropertyInObject(data , ["_id"]);
            const newChapter = {
                ...chapter,
                ...data
            }
            const updateChapterResults = await CourseModel.updateOne({"chapters._id" : chapterID} , {
                $set : {"chapters.$" : newChapter}
            });
            if(updateChapterResults.modifiedCount == 0) 
                throw createHttpError.InternalServerError("The desired chapter was not updated");
            const ElasticResult = await updateElasticCourse(course?._id);
            return res.status(HttpStatus.OK).json({
                statusCode : HttpStatus.OK,
                data : {
                    message : MessageSpecial.SUCCESSFUL_UPDATED_CHAPTER_MESSAGE,
                    ElasticResult
                }
            })
        } catch (error) {
            next(error)
        }
    }
    async removeChapterById (req , res , next) {
        try {
            const {chapterID} = req.params;
            await this.getOneChapter(chapterID);
            const course = await CourseModel.findOne({"chapters._id" : chapterID});
            const removeChapterResults = await CourseModel.updateOne({"chapters._id" : chapterID} , {
                $pull : {
                    chapters : {
                        _id : chapterID
                    }
                }
            });
            if(removeChapterResults.modifiedCount == 0) 
                throw {
                    status : HttpStatus.INTERNAL_SERVER_ERROR, 
                    message : MessageSpecial.UNSUCCESSFUL_REMOVE_CHAPTER_MESSAGE
                }
            const ElasticResult = await updateElasticCourse(course?._id);
            return res.status(HttpStatus.OK).json({
                statusCode : HttpStatus.OK,
                data : {
                    message : MessageSpecial.SUCCESSFUL_REMOVE_CHAPTER_MESSAGE,
                    ElasticResult
                }
            })
            
        } catch (error) {
            next(error)
        }
    }
    async getChapterOfCourse(courseID) {
        const chapters = await CourseModel.findOne({_id : courseID} , 
            {"chapters._id" : 1 , "chapters.title" : 1 , "chapters.text" : 1 , title : 1});
        if(!chapters) throw createHttpError.NotFound("Course not found");
        return chapters
    }
    async getOneChapter(chapterID) {
        const course = await CourseModel.findOne({"chapters._id" : chapterID} , {"chapters.$" : 1});
        if(!course) throw createHttpError.NotFound("No chapter was found with this specification");
        const chapter = await course?.chapters?.[0]
        if(!chapter) throw new createHttpError.NotFound("Chapter not found")
        return copyObject(chapter)
    }
}
module.exports = {
    AdminChapterController : new ChapterController()
}