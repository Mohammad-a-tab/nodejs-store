const createError = require('http-errors');
const { UserModel } = require('../../../../models/users');
const { EXPIRES_IN, USER_ROLE } = require('../../../../utils/constants');
const { RandomNumberGenerator } = require('../../../../utils/function');
const { authSchema } = require('../../../validators/user/auth.schema');
const Controller = require('../../controller');


class UserAuthController extends Controller{
   async login(req,res,next){
       try {
          await authSchema.validateAsync(req.body);
          const {mobile} = req.body;
          const code = RandomNumberGenerator()
          const result = await this.saveUser(mobile ,code)
          if(!result) throw createError.Unauthorized("ورود انجام نشد")
          return res.status(200).send({
            statusCode : 200,
            message : "کد اعتبار سنجی با موفقیت برای شما ارسال شد",
            code,
            mobile

          })
       } catch (error) {
          next(createError.BadRequest(error.message))
       }
   }
   async saveUser(mobile , code){
    let otp = {
        code,
        expiresIn : EXPIRES_IN,
    }
        const result = await this.checkExistIUser(mobile);
        if(result){
          
           return (await this.updateUser(mobile , {otp}))
            
        }
        return !!(await UserModel.create({mobile,otp,Roles : [USER_ROLE]}))

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