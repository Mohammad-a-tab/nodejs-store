const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000,
    autoIndex: true, // Don't build indexes
    maxPoolSize: 10, // Maintain up to 10 socket connections
    serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
    socketTimeoutMS: 145000, // Close sockets after 45 seconds of inactivity
    family: 4 // Use IPv4, skip trying IPv6
}
const { default: mongoose } = require("mongoose");
module.exports = mongoose.connect("mongodb://localhost:27017/StoreDB", options)
.then(() => console.log("connected to MongoDB"))
.catch(err => console.log(err))