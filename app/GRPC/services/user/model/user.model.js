const { default: mongoose } = require("mongoose");

const UserSchema = new mongoose.Schema({
    username : {type : String, lowercase : true},
    mobile : {type : String, required : true, unique: true},
    email : {type : String, lowercase : true},
    Role : {type : String, default : "USER"},
    password : {type : String},
    bills : {type : [String], default : []},
}, {
    timestamps : true,
    toJSON : {
        virtuals : true
    }
});

module.exports = {
    UserModel : mongoose.model("user", UserSchema) 
}