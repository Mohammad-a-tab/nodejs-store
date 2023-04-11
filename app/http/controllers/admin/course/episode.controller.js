const { getTime, copyObject, deleteInvalidPropertyInObject, deleteFilePublic } = require("../../../../utils/function");
const { createEpisodeSchema } = require("../../../validators/admin/course.schema");
const { default: getVideoDurationInSeconds } = require("get-video-duration");
const { ObjectValidator } = require("../../../validators/public.validator");
const { MessageSpecial } = require("../../../../utils/constants");
const {StatusCodes : HttpStatus} = require("http-status-codes")
const {CourseModel} = require("../../../../models/course");
const createHttpError = require("http-errors");
const Controller = require("../../controller");
const path = require("path");
const { AdminCourseController } = require("./course.controller");
const { updateCourseInElasticSearch } = require("../../../../ElasticSearch/controller/course/course.controller");
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
            req.body.videoAddress = fileAddress.replace(/\\/g ,"/");
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
            const course = await AdminCourseController.findCourseByID(courseID);
            const data = copyObject(course)
            deleteCourseFieldForInsertElastic(data)
            const updateCourseInElasticResult = await updateCourseInElasticSearch(course, data)
            if(createEpisodeResults.modifiedCount == 0) 
                throw {
                    status : HttpStatus.INTERNAL_SERVER_ERROR, 
                    message : MessageSpecial.UNSUCCESSFUL_CREATED_EPISODE_MESSAGE
                }
            return res.status(HttpStatus.CREATED).json({
                StatusCode : HttpStatus.CREATED,
                data : {
                    message : MessageSpecial.SUCCESSFUL_CREATED_EPISODE_MESSAGE,
                    ElasticResult: updateCourseInElasticResult.result
                }   
            })

        } catch (error) {
            deleteFilePublic(req?.body?.videoAddress)
            next(error)
        }
    }
    async deleteOneEpisode(req, res, next) {
        try {
            const {
                id: episodeID
            } = await ObjectValidator.validateAsync({
                id: req.params.episodeID
            });
            const episode = await this.getOneEpisodeForUpdate(episodeID)
            deleteFilePublic(episode?.videoAddress)
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
                throw new createHttpError.InternalServerError("Episode remove failed")
            return res.status(HttpStatus.OK).json({
                statusCode: HttpStatus.OK,
                data: {
                    message: MessageSpecial.SUCCESSFUL_REMOVE_EPISODE_MESSAGE
                }
            })
        } catch (error) {
            next(error)
        }
    }
    async updateOneEpisode (req,res,next) {
        try {
           const {episodeID} = req.params;
           const episode = await this.getOneEpisodeForUpdate(episodeID)
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
           const editEpisodeResult = await CourseModel.updateOne({
               "chapters.episodes._id": episodeID
           }, {
               $set: {
                   "chapters.$.episodes": newEpisode
               }
           })
           if (!editEpisodeResult.modifiedCount)
               throw new createHttpError.InternalServerError("The episode was not edited")
           return res.status(HttpStatus.OK).json({
               statusCode: HttpStatus.OK,
               data: {
                   message: MessageSpecial.SUCCESSFUL_CREATED_EPISODE_MESSAGE
               }
           })
       } catch (error) {
           deleteFilePublic(req?.body?.videoAddress)
           next(error)
       }
    }
    async getOneEpisodeForUpdate(episodeID){
        const course1 = await CourseModel.findOne({"chapters.episodes._id": episodeID} , {"chapters.episodes.$" :1})
        if(!course1) throw new createHttpError.NotFound("Episode not found")
        let array = []
        array.push(course1)
        let index = 0
        index = array.map(item => item.chapters?.[0]).map(i => i.episodes).map(k => k.findIndex(n => n._id == episodeID))
        const episode = course1?.chapters?.[0]?.episodes?.[index]
        if(!episode) throw new createHttpError.NotFound("Episode not found")
        return copyObject(episode)
    }
    async getOneEpisode(req,res,next){
        try {
            const {episodeID} = req.params;
            const course1 = await CourseModel.findOne({"chapters.episodes._id": episodeID} , {"chapters.episodes.$" :1})
            if(!course1) throw new createHttpError.NotFound("Episode not found")
            let array = []
            array.push(course1)
            let index = 0
            index = array.map(item => item.chapters?.[0]).map(i => i.episodes).map(k => k.findIndex(n => n._id == episodeID))
            const episode = course1?.chapters?.[0]?.episodes?.[index]
            if(!episode) throw new createHttpError.NotFound("Episode not found")
            return res.status(HttpStatus.OK).json({
            statusCode : HttpStatus.OK,
            data : {
                episode
            }
        })
            
        } catch (error) {
            next(error)
        }
    }
}

module.exports = {
    AdminEpisodeController : new EpisodeController()
}