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
    first_name : {type : String},
    last_name : {type : String},
    username : {type : String, lowercase : true},
    mobile : {type : String, required : true, unique: true},
    email : {type : String, lowercase : true},
    password : {type : String},
    bills : {type : [String], default : []},
    discount : {type : Number, default : 0},
    birthday : {type : String},
    Role : {type : String, default : "USER"},
    token : {type : String, default: ""},
    Courses : {type: [mongoose.Types.ObjectId], ref : "course", default : []},
    Products : {type: [mongoose.Types.ObjectId], ref : "product", default : []},
    basket: {type: BasketSchema},
    otp : {type : Object, default : {
        code : 0,
        expiresIn : 0
    }},
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