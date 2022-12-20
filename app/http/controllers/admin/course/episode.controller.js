const { createEpisodeSchema } = require("../../../validators/admin/course.schema");
const Controller = require("../../controller");
const {CourseModel} = require("../../../../models/course");
const createHttpError = require("http-errors");
const path = require("path");
const {StatusCodes : HttpStatus} = require("http-status-codes")
const { default: getVideoDurationInSeconds } = require("get-video-duration");
const { getTime } = require("../../../../utils/function");
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

}

module.exports = {
    AdminEpisodeController : new EpisodeController()
}