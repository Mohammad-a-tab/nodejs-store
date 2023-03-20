const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const path = require("path");
const userProtoPath = path.join(__dirname, "..", "..", "protos", "user.proto");
const userProto = protoLoader.loadSync(userProtoPath);
const {UserPackage}  = grpc.loadPackageDefinition(userProto);
const userServiceURL = "localhost:4001";
const userClient = new UserPackage.UserService(userServiceURL, grpc.credentials.createInsecure());
class UserController {
    async getListOfUser (req, res, next) {
        try {
            userClient.getListOfUser(null, (err, data) => {
                if(err) return next(err);
                return res.status(200).json(data);
            })
        } catch (error) {
            next(error);
        }
    }
    UpdateUser (req, res, next) {
        try {
            const {id, username, mobile, email, bills, password} = req.body;
            userClient.UpdateUser({id, username, mobile, email, password, bills}, (err, data) => {
                if(err) return next(err);
                return res.status(200).json(data);
            })
        } catch (error) {
            next(error);
        }
    }
}
module.exports = {
    UserController : new UserController()
}
