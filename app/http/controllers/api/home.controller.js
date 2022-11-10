const Controller = require("../controller");
const createError = require("http-errors")

module.exports =new class HomeController extends Controller{
    indexPage(req,res,next) {
       try {
          return res.status(200).send("index page Store")
       } catch (error) {
           next(error)
       }
    }
    

}