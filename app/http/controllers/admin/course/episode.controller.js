const { createEpisodeSchema } = require("../../../validators/admin/course.schema");
const Controller = require("../../controller");
const {CourseModel} = require("../../../../models/course");
const createHttpError = require("http-errors");


class EpisodeController extends Controller {
    async addNewEpisode (req, res , next) {
        try {
            const {title , text , type , time , chapterID , courseID} = await createEpisodeSchema.validateAsync(req.body)
        } catch (error) {
            next(error)
        }
    }

}

module.exports = {
    AdminEpisodeController : new EpisodeController()
}