require("./config/db.connection");
const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const path = require("path");
const protoPath = path.join(__dirname, "..", "..", "protos","user.proto");
const userProto = protoLoader.loadSync(protoPath);
const {UserPackage} = grpc.loadPackageDefinition(userProto);
const { getListOfUser, UpdateUser } = require('./functions/user.grpc');
const UserServiceURL = "localhost:4001";

function main() {
    const server = new grpc.Server();
    server.addService(UserPackage.UserService.service, {
        getListOfUser,
        UpdateUser
    });
    server.bindAsync(UserServiceURL, grpc.ServerCredentials.createInsecure(), (err, port) => {
        if(err) return console.log("Error :", err);
        console.log("GRPC Service Running On port " + port);
        server.start();
    })
}
main()