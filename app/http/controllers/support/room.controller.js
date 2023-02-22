const { ConversationModel } = require("../../../models/conversation");
const {StatusCodes: HttpStatus} = require("http-status-codes");
const Controller = require("../controller");
const createHttpError = require("http-errors");
const path = require("path")

class RoomController extends Controller {
    async addRoom (req, res, next) {
        try {
            let image;
            const {name, description, fileUploadPath, filename, namespace} = req.body;
            await this.findConversationWithEndpoint(namespace);
            await this.existRoomName(name);
            if(fileUploadPath && filename) image = path.join(fileUploadPath,filename).replace(/\\/g, "/");
            const room = {name, image, description}
            await ConversationModel.updateOne({endpoint : namespace}, {
                    $push : {rooms : room}
            });
            return res.status(HttpStatus.CREATED).json({
                statusCode : HttpStatus.CREATED,
                data : {
                    message : "The Room was created successfully"
                }
            })
        } catch (error) {
            next(error)
        }
    }
    async getListOfRoom (req, res, next) {
        try {
            const conversations = await ConversationModel.find({}, {rooms : 1});
            return res.status(HttpStatus.OK).json({
                statusCode : HttpStatus.OK,
                data : {
                    conversations
                }
            })
        } catch (error) {
            next(error)
        }
    }
    async existRoomName (name) {
        const conversation = await ConversationModel.findOne({"rooms.name" : name});
        if(conversation) throw createHttpError.BadRequest("This name has already been chosen")
    }
    async findConversationWithEndpoint (endpoint) {
        const conversation = await ConversationModel.findOne({endpoint});
        if(!conversation) throw createHttpError.NotFound("No conversation space found")
        return conversation
    }
}
module.exports = {
    RoomController: new RoomController()
}