const { COOKIE_PARSER_SECRET_KEY } = require("./utils/constants");
const ExpressEjsLayouts = require("express-ejs-layouts");
const { initialSocket } = require("./utils/initSocket");
const { socketHandler } = require("./socket.io/index");
const { clientHelper } = require("./utils/client");
const { default: mongoose } = require("mongoose");
const { AllRoutes } = require("./router/router");
const swaggerUI = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const createError = require("http-errors");
const express = require("express");
const morgan = require("morgan");
const path = require("path");
const cors =require("cors");
require("dotenv").config();

const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000,
    autoIndex: true, // Don't build indexes
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
        this.initTemplateEngine();
        this.initRedis();
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
                openapi: "3.0.0", 
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
                ],
                components : {
                    securitySchemes : {
                      BearerAuth : {
                        type: "http",
                        scheme: "bearer",
                        bearerFormat: "JWT",
                        
                      }
                    }
                  },
                  security : [{BearerAuth : [] }]
            },
            apis : ["./app/router/**/*.js"]
        }),
        {explorer : true},
        ));

    }

    createServer(){
        const http = require("http")
        const server =  http.createServer(this.#app)
        const io = initialSocket(server)
        socketHandler(io)
        server.listen(this.#PORT, () => {
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
    initClientSession() {
        this.#app.use(cookieParser(COOKIE_PARSER_SECRET_KEY));
    }
    initRedis(){
        require("./utils/initRedis")
    }
    initTemplateEngine(){
        this.#app.use(ExpressEjsLayouts)
        this.#app.set("view engine", "ejs");
        this.#app.set("views", "resource/views");
        this.#app.set("layout extractStyles", true);
        this.#app.set("layout extractScripts", true);
        this.#app.set("layout", "./layouts/master");
        // this.#app.use((req, res, next) => {
        //   this.#app.locals = clientHelper(req, res);
        //   next()
        // })
    }
    createRoutes(){
        this.#app.use(AllRoutes)

    }
    errorHandling(){
       this.#app.use((req,res,next) => {
           next(createError.NotFound("The desired address was not found"));
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