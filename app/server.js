const express = require("express");
const { default: mongoose } = require("mongoose");
const morgan = require("morgan");
const path = require("path");
const createError = require("http-errors");
const swaggerUI = require("swagger-ui-express");
const cors =require("cors");
const swaggerJsDoc = require("swagger-jsdoc")
const { AllRoutes } = require("./router/router");

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
        this.#app.use(cors());
        this.#app.use(morgan("dev"));
        this.#app.use(express.json());
        this.#app.use(express.urlencoded({extended : true}));
        this.#app.use(express.static(path.join(__dirname , "..", "public")));
        this.#app.use( "/api-doc" , swaggerUI.serve , swaggerUI.setup(swaggerJsDoc({
            swaggerDefinition : {
                info : {
                    title : "Boto Start Store",
                    version : "2.0.0",
                    description : "بزرگترین مرجع ارائه پکیج برنامه نویسی",
                    contact : {
                        name : "Mohammad Aali",
                        url : "http://github.com/Mohammad-a-tab",
                        email : "mohammad.programmer.tab@gmail.com",
                    },
                    
                },
                servers : [
                    {
                        url : "http://localhost:5000"
                    }
                ]
            },
            apis : ["./app/router/**/*.js"]
        })));

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
        });
        mongoose.connection.on("connected" , () => {
            console.log('mongoose connected to MongoDB')
        });
        process.on("SIGINT" , () => {
            mongoose.connection.close();
            console.log("disconnected");
            process.exit();
        })

    }
    createRoutes(){
        this.#app.use(AllRoutes)

    }
    errorHandling(){
       this.#app.use((req,res,next) => {
           next(createError.NotFound("آدرس مورد نظر یافت نشد"));
       });
       this.#app.use((error,req,res,next) => {
        const serverError = createError.InternalServerError()
         const statusCode = error?.status || serverError.status
         const message = error?.message || serverError.message
         return res.status(statusCode).json({
            data : null,
            errors : [
        
                statusCode,
                message 
            ]
         });
       })
    }
}