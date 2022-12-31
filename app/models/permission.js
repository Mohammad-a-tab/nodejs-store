const { default: mongoose } = require("mongoose");

const PermissionSchema = new mongoose.Schema({
    title : {type : String , unique : true},
    description : {type : String ,  default : ""}
}, {
    toJSON : {virtuals : true}
});
module.exports = {
    PermissionSchema : mongoose.model("permissions" , PermissionSchema)
}