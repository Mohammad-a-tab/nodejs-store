const { AllRoutes } = require("./routes/index.routes");
const swaggerUI = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");
const express = require("express");
const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(AllRoutes);
app.use( "/api-doc" , swaggerUI.serve , swaggerUI.setup(swaggerJsDoc({
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
                    url : "http://localhost:4000"
                }
            ],
            
        },
        apis : ["./routes/**/*.js"]
    }),
    {explorer : true},
));
app.use((req, res, next) => {
    return res.status(404).json({
        statusCode : 404,
        message : "Not Found"
    })
});
app.use((err, req, res, next) => {
    return res.status(err.status || 500).json({
        data : null,
        errors : [
            statusCode = err.status || 500,
            message = err.message
        ]
    })
});
app.listen(4000, () => {
    console.log("Client running over port 4000");
})