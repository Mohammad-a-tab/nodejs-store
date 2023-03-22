const { UserModel } = require("../model/user.model");
const { deleteEmptyKeys } = require("../utils/function");

async function getListOfUser (call, callback) {
    try {
        const users = await UserModel.find({}, { _id: 1, email : 1, username : 1, mobile : 1, Role: 1, bills: 1, password: 1}); 
        callback(null, {users})
    } catch (error) {
        callback(error, null)
    }
}
async function UpdateUser (call, callback) {
    try {
        const data = call.request;
        deleteEmptyKeys(data)
        await UserModel.findOne({mobile : data?.mobile})
        await UserModel.updateOne({mobile : data?.mobile}, {$set : {...data}})
        callback(null, {status : 'success'}) 
    } catch (error) {
        callback(error, null)
    }
}
module.exports = {
    getListOfUser,
    UpdateUser
}