const { default: mongoose } = require("mongoose");

const Schema = mongoose.Schema({
    first_name : {type : String},
    last_name : {type : String},
    phone : {type : String },
    email : {type : String},
    username : {type : String},
    password : {type : String},
    bills : {type : [] , default : []},
    discount : {type : Number , default : 0},
    birthday : {type : String },
    Roles : {type : [String] , default : ["USER"]},
    otp : {type : String , default : {
        code : 0,
        expires : 0
    }}

});

module.exports = {
    UserModel : mongoose.model("user", Schema) 
}