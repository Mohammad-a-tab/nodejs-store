const { ConversationModel } = require("../../../models/conversation");
const {StatusCodes: HttpStatus} = require("http-status-codes");
const createHttpError = require("http-errors");
const Controller = require("../controller");

class NameSpaceController extends Controller {
    async addNameSpace (req, res, next) {
        try {
            const {title, endpoint} = req.body;
            await this.existEndpoint(endpoint)
            await ConversationModel.create({title, endpoint});
            return res.status(HttpStatus.CREATED).json({
                statusCode : HttpStatus.CREATED,
                data : {
                    message : "The conversation space was created successfully"
                }
            })
        } catch (error) {
            next(error)
        }
    }
    async getListOfNameSpaces (req, res, next) {
        try {
            const nameSpaces = await ConversationModel.find({}, {rooms : 0});
            return res.status(HttpStatus.OK).json({
                statusCode : HttpStatus.OK,
                data : {
                    nameSpaces
                }
            })
        } catch (error) {
            next(error)
        }
    }
    async existEndpoint (endpoint) {
        const conversation = await ConversationModel.findOne({endpoint});
        if(conversation) throw createHttpError.BadRequest("This name has already been chosen")
    }
}
module.exports = {
    NameSpaceController: new NameSpaceController()
}