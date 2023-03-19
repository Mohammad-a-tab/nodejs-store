const { default: mongoose } = require("mongoose");
module.exports = mongoose.connect("mongodb://localhost:27017/StoreDB")
.then(() => console.log("connected to MongoDB"))
.catch(err => console.log(err))