const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const path = require("path");
const userProtoPath = path.join(__dirname, "..", "..", "..", "..", "protos", "user.proto");
const userProto = protoLoader.loadSync(userProtoPath);
const {UserPackage}  = grpc.loadPackageDefinition(userProto);
const userServiceURL = "localhost:4001";
const userClient = new UserPackage.UserService(userServiceURL, grpc.credentials.createInsecure());

class UserController {
    getListOfUser (req, res, next) {
        try {
            
        } catch (error) {
            next(error);
        }
    }
    UpdateUser (req, res, next) {
        try {
            
        } catch (error) {
            next(error);
        }
    }
}
module.exports = {
    UserController : new UserController()
}
