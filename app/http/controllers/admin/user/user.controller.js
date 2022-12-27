const { UserModel } = require("../../../../models/users");
const Controller = require("../../controller");
const {StatusCodes : HttpStatus} = require("http-status-codes")

class UserController extends Controller{
    async getAllUsers (req , res , next) {
        try {
            const {search} = req.query;
            let users;
            if(search) users = await UserModel.find({$text : {$search : search}}, {first_name : 1 , last_name : 1 , username : 1 , mobile : 1 , email : 1});
            else users = await UserModel.find({} , {first_name : 1 , last_name : 1 , username : 1 , mobile : 1 , email : 1})
            return res.status(HttpStatus.OK).json({
                StatusCode : HttpStatus.OK,
                data : {
                    users
                }
            })
            
        } catch (error) {
            next(error)
        }
    }
}

module.exports = {
    AdminUserController : new UserController()
}