const { default: mongoose } = require("mongoose");
const ProductSchema = new mongoose.Schema({
    productID : {type : mongoose.Types.ObjectId, ref : "product"},
    count : {type : Number, default : 1}
});
const CourseSchema = new mongoose.Schema({
    courseID : {type : mongoose.Types.ObjectId, ref : "course"},
    count : {type : Number, default : 1}
});
const BasketSchema = new mongoose.Schema({
    courses : {type : [CourseSchema], default : []},
    products : {type : [ProductSchema], default : []}
});
const UserSchema = new mongoose.Schema({
    username : {type : String, lowercase : true},
    mobile : {type : String, required : true, unique: true},
    email : {type : String, lowercase : true},
    Role : {type : String, default : "USER"},
    password : {type : String},
    bills : {type : [], default : []},
}, {
    timestamps : true,
    toJSON : {
        virtuals : true
    }
});
UserSchema.index({mobile : "text", last_name : "text", username : "text", first_name : "text", email : "text"})
module.exports = {
    UserModel : mongoose.model("user", UserSchema) 
}