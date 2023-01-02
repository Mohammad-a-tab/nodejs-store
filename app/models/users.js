const { default: mongoose } = require("mongoose");

const UserSchema = new mongoose.Schema({
    first_name : {type : String},
    last_name : {type : String},
    mobile : {type : String, required : true},
    email : {type : String , lowercase : true},
    username : {type : String , lowercase : true},
    password : {type : String},
    bills : {type : [] , default : []},
    discount : {type : Number , default : 0},
    birthday : {type : String },
    Role : {type : String, default : "USER"},
    Courses : {type : [mongoose.Types.ObjectId] , ref : "course",  default : []},
    otp : {type : Object , default : {
        code : 0,
        expiresIn : 0
    }}

},
{
    timestamps : true
    // toJSON : {
    //     virtuals : true
    // }
});
UserSchema.index({mobile : "text", last_name : "text", username : "text", first_name : "text", email : "text"})
module.exports = {
    UserModel : mongoose.model("user", UserSchema) 
}