const { RandomNumberGenerator, SignAccessToken, verifyRefreshToken, SignRefreshToken } = require('../../../../utils/function');
const { checkOTPSchema , getOTPSchema } = require('../../../validators/user/auth.schema');
const { StatusCodes: HttpStatus } = require("http-status-codes");
const { UserModel } = require('../../../../models/users');
const { ROLES } = require('../../../../utils/constants');
const Controller = require('../../controller');
const createError = require('http-errors');


class UserAuthController extends Controller{
   async getOtp(req,res,next){
       try {
          await getOTPSchema.validateAsync(req.body);
          const {mobile} = req.body;
          const code = RandomNumberGenerator()
          const result = await this.saveUser(mobile ,code)
          if(!result) throw createError.Unauthorized("Login failed")
          return res.status(HttpStatus.OK).json({
            statusCode : HttpStatus.OK,
            data : {
               message : "The validation code has been successfully sent to you",
               code,
               mobile
            }

          })
       } catch (error) {
          next(error)
       }
   }
   async checkOtp(req,res,next){
      try {
         await checkOTPSchema.validateAsync(req.body);
         const {mobile , code} = req.body;
         const user = await UserModel.findOne({mobile});
         if(!user) throw createError.NotFound("User not found");
         if(user.otp.code != code) throw createError.Unauthorized("The code sent is not correct");
         const now = Date.now();
         if(+user.otp.expiresIn < now) throw createError.Unauthorized("Your code has expired")
         const accessToken = await SignAccessToken(user._id);
         const refreshToken = await SignRefreshToken(user._id);
         return res.status(HttpStatus.OK).json({
            statusCode: HttpStatus.OK,
            data : {
               accessToken,
               refreshToken
            }
         })
         
      } catch (error) {
         next(error)
      }
   }
   async refreshToken(req,res,next){
       try {
         const {refreshToken} = req.body;
         const mobile = await verifyRefreshToken(refreshToken);
         const user = await UserModel.findOne({mobile});
         const accessToken = await SignAccessToken(user._id);
         const newRefreshToken = await SignRefreshToken(user._id);
         return res.status(HttpStatus.OK).json({
            statusCode : HttpStatus.OK,
            data : {
               accessToken,
               refreshToken : newRefreshToken
            }
         })
       } catch (error) {
            next(error)
       }
   }
   async saveUser(mobile , code){
      let otp = {
         code,
         expiresIn : (new Date().getTime() + 120000),
      }
      const result = await this.checkExistIUser(mobile);
      if(result){
          
         return (await this.updateUser(mobile , {otp}))
            
      }
      return !!(await UserModel.create({mobile,otp,Role : ROLES.USER}))

    }
   async checkExistIUser(mobile){
      const user = await UserModel.findOne({mobile});
      return !!user
   }
   async updateUser(mobile , objectData = {}){
      Object.keys(objectData).forEach(key => {
         if(["" , " " , 0 , null , undefined , -1 , "0" , NaN].includes(objectData[key])) delete objectData[key]
      });
      const updateResult = await UserModel.updateOne({mobile} , {$set : objectData})
      return !!updateResult.modifiedCount
   }
}

module.exports = {
    UserAuthController : new UserAuthController()
}