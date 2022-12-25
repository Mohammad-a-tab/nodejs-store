const { createEpisodeSchema } = require("../../../validators/admin/course.schema");
const Controller = require("../../controller");
const {CourseModel} = require("../../../../models/course");
const createHttpError = require("http-errors");
const path = require("path");
const {StatusCodes : HttpStatus} = require("http-status-codes")
const { default: getVideoDurationInSeconds } = require("get-video-duration");
const { getTime, copyObject, deleteInvalidPropertyInObject } = require("../../../../utils/function");
const { MessageSpecial } = require("../../../../utils/constants");


class EpisodeController extends Controller {
    async addNewEpisode (req, res , next) {
        try {
            const {
                title,
                text,
                type,
                chapterID,
                courseID,
                filename,
                fileUploadPath
            } = await createEpisodeSchema.validateAsync(req.body);
            const fileAddress = path.join(fileUploadPath , filename);
            const videoAddress = fileAddress.replace(/\\/g ,"/");
            const videoURL = `${process.env.BASE_URL}:${process.env.APPLICATION_PORT}/${videoAddress}`
            const seconds = await getVideoDurationInSeconds(videoURL);
            const time = getTime(seconds);
            const episode = {
                title,
                text,
                type,
                time,
                videoAddress
            }
            const createEpisodeResults = await CourseModel.updateOne({
                _id : courseID,
                "chapters._id" : chapterID
            }, {
                $push : {
                "chapters.$.episodes" : episode
            }});
            if(createEpisodeResults.modifiedCount == 0) 
                throw {status : HttpStatus.INTERNAL_SERVER_ERROR , message : MessageSpecial.UNSUCCESSFUL_CREATED_EPISODE_MESSAGE}
            return res.status(HttpStatus.CREATED).json({
                StatusCode : HttpStatus.CREATED,
                data : {
                    message : MessageSpecial.SUCCESSFUL_CREATED_EPISODE_MESSAGE
                }   
            })

        } catch (error) {
            next(error)
        }
    }
    async deleteOneEpisode(req, res, next) {
        try {
            const {
                id: episodeID
            } = await ObjectIdValidator.validateAsync({
                id: req.params.episodeID
            });
            await this.getOneEpisode(episodeID)
            const removeEpisodeResult = await CourseModel.updateOne({
                "chapters.episodes._id": episodeID,
            }, {
                $pull: {
                    "chapters.$.episodes": {
                        _id: episodeID
                    }
                }
            });

            if (removeEpisodeResult.modifiedCount == 0)
                throw new createHttpError.InternalServerError("حذف اپیزود انجام نشد")
            return res.status(HttpStatus.OK).json({
                statusCode: HttpStatus.OK,
                data: {
                    message: "حذف اپیزود با موفقیت انجام شد"
                }
            })
        } catch (error) {
            next(error)
        }
    }
    async updateOneEpisode (req,res,next) {
        try {
            const {episodeID} = req.params;
           const episode = await this.getOneEpisode(episodeID)
           const { filename, fileUploadPath } = req.body
           let blackListFields = ["_id"]
           if(filename && fileUploadPath){
               const fileAddress = path.join(fileUploadPath, filename)
               req.body.videoAddress = fileAddress.replace(/\\/g, "/");
               const videoURL = `${process.env.BASE_URL}:${process.env.APPLICATION_PORT}/${req.body.videoAddress}`
               const seconds = await getVideoDurationInSeconds(videoURL);
               req.body.time = getTime(seconds);
               blackListFields.push("filename")
               blackListFields.push("fileUploadPath")
           }else{
               blackListFields.push("time")
               blackListFields.push("videoAddress")
           }
           const data = req.body;
           deleteInvalidPropertyInObject(data, blackListFields)
           const newEpisode = {
               ...episode,
               ...data
           }
           console.log(newEpisode)
           const editEpisodeResult = await CourseModel.updateOne({
               "chapters.episodes._id": episodeID
           }, {
               $set: {
                   "chapters.$.episodes": newEpisode
               }
           })
           if (!editEpisodeResult.modifiedCount)
               throw new createHttpError.InternalServerError("ویرایش اپیزود انجام نشد")
           return res.status(HttpStatus.OK).json({
               statusCode: HttpStatus.OK,
               data: {
                   message: "ویرایش اپیزود با موفقیت انجام شد"
               }
           })
       } catch (error) {
           next(error)
       }
    }
    async getOneEpisode(episodeID){
        const course = await CourseModel.findOne({"chapters.episodes._id": episodeID})
        if(!course) throw new createHttpError.NotFound("اپیزودی یافت نشد")
        const episode = await course?.chapters?.[0]?.episodes?.[0]
        if(!episode) throw new createHttpError.NotFound("اپیزودی یافت نشد")
        return copyObject(episode)
    }

}

module.exports = {
    AdminEpisodeController : new EpisodeController()
}