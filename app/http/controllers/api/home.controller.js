const Controller = require("../controller");
const createError = require("http-errors")
const { StatusCodes: HttpStatus } = require("http-status-codes");

module.exports =new class HomeController extends Controller{
    indexPage(req,res,next) {
       try {
          return res.status(HttpStatus.OK).send("index page Store")
       } catch (error) {
           next(error)
       }
    }
    

}