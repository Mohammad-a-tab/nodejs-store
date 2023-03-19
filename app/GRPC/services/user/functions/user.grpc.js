const { UserModel } = require("../model/user.model");

async function getListOfUser (call, callback) {
    try {
        const users = await UserModel.find({}, {first_name : 1, last_name : 1, email : 1, username : 1, mobile : 1, token: 1, Role: 1, Name: 1}); 
        callback(null, {users})
        console.log(users);
    } catch (error) {
        callback(error, null)
    }
}
async function UpdateUser (call, callback) {
    try {
        console.log("slam");
        const {id, first_name} = call.request;
        const user = await UserModel.findById(id)
        console.log(user);
        await UserModel.updateOne({id}, {$set : {first_name}})
        callback(null, {status : 'success'}) 
    } catch (error) {
        callback(error, null)
        console.log(error);
    }
}
module.exports = {
    getListOfUser,
    UpdateUser
}