const { CourseModel } = require("../../../../models/course");
const { MessageSpecial } = require("../../../../utils/constants");
const Controller = require("../../controller");
const { AdminCourseController } = require("./course.controller");
const {StatusCodes : HttpStatus} = require("http-status-codes");
const createHttpError = require("http-errors");

class ChapterController extends Controller {
    async addChapter (req , res , next) {
        try {
            const {id , title , text} = req.body;
            await AdminCourseController.findCourseByID(id);
            const saveChapterResults = await CourseModel.updateOne({_id : id} , {$push : {
                chapters : {title , text , episodes : []}
            }});
            if(saveChapterResults.modifiedCount == 0) throw createHttpError.InternalServerError("عملیات افزودن فصل انجام نشد");
            return res.status(HttpStatus.CREATED).json({
                statusCode : HttpStatus.CREATED,
                data : {
                    message : MessageSpecial.SUCCESSFUL_CREATED_CHAPTER_MESSAGE
                }
            })

        } catch (error) {
            next(error)
        }
    }
    async chaptersOfCourse (req , res , next) {
        try {
            const {id} = req.params;
            const chapters = await this.getChapterOfCourse(id);
            return res.status(HttpStatus.OK).json({
                statusCode : HttpStatus.OK,
                data : {
                    chapters
                }
            })
        } catch (error) {
            next(error)
        }
    }
    async getChapterOfCourse(id) {
        const chapters = await CourseModel.findOne({_id : id} , {chapters : 1});
        if(!chapters) throw createHttpError.NotFound("دوره ای یافت نشد");
        return chapters
    }
    async removeChapterById (req , res , next) {
        try {
            
        } catch (error) {
            next(error)
        }
    }
    async updateChapterById (req , res , next) {
        try {
            
        } catch (error) {
            next(error)
        }
    }
}
module.exports = {
    AdminChapterController : new ChapterController()
}