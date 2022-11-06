const express = require("express");
const { default: mongoose } = require("mongoose");
const path = require("path")

const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000,
    autoIndex: false, // Don't build indexes
    maxPoolSize: 10, // Maintain up to 10 socket connections
    serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
    socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    family: 4 // Use IPv4, skip trying IPv6
}
module.exports = class Application {
    #express =  require("express");
    #app = this.#express();
    #PORT;
    #DB_URI;
    constructor(PORT , DB_URL){
        this.#PORT = PORT;
        this.#DB_URI = DB_URL;
        this.configApplication();
        this.connectTOMongoDB();
        this.createServer();
        this.createRoutes();
        this.errorHandling();

    }
    configApplication(){
        this.#app.use(express.json());
        this.#app.use(express.urlencoded({extended : true}));
        this.#app.use(express.static(path.join(__dirname , "..", "public")));


    }

    createServer(){
        const http = require("http")
        http.createServer(this.#app).listen(this.#PORT, () => {
            console.log("run > http://localhost:" + this.#PORT);
        })
    }
    connectTOMongoDB(){
        mongoose.connect(this.#DB_URI , options, (err) => {
            if(!err) return console.log("Connected to MongoDB")
            return console.log("felid connect to MongoDB");
        })

    }
    createRoutes(){

    }
    errorHandling(){
       this.#app.use((req,res,next) => {
          return res.status(404).json({
            statusCode : 404,
            message : "آدرس مورد نظر یافت نشد"
          })
       });
       this.#app.use((error,req,res,next) => {
         const statusCode = error?.status || 500;
         const message = error?.message || "InternalServerError";
         return res.status(statusCode).join({
            statusCode,
            message
         })
       })
    }
}