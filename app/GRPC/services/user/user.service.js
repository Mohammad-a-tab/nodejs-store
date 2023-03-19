require("./config/db.connection");
const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const protoPath = path.join(__dirname, "..", "..", "protos","user.proto");
const userProto = protoLoader.loadSync(protoPath);
const { getUserList, UpdateUser } = require('./functions/user.grpc');
const {UserPackage} = grpc.loadPackageDefinition(userProto);
const UserServiceURL = "localhost:4001";
const path = require("path");

function main() {
    const server = new grpc.Server();
    server.addService(UserPackage.UserService.service, {
        getUserList,
        UpdateUser
    });
    server.bindAsync(UserServiceURL, grpc.ServerCredentials.createInsecure(), (err, port) => {
        if(err) return console.log("Error :", err);
        console.log("GRPC Service Running On port " + port);
        server.start();
    })
}
main()