const { ConversationModel } = require("../../../models/conversation");
const {StatusCodes: HttpStatus} = require("http-status-codes");
const Controller = require("../controller");

class MessageController extends Controller {

}
module.exports = {
    MessageController: new MessageController()
}