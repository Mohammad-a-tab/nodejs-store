const { StatusCodes:  HttpStatus} = require("http-status-codes");
const { PaymentModel } = require("../../../../models/payments");
const Controller = require("../../controller");

class TransactionController extends Controller {
    async getAllTransactions (req,res,next){
        try {
            const transactions = await PaymentModel.find({}, {basket : 0}).sort({_id: -1})
            return res.status(HttpStatus.OK).json({
                statusCode : HttpStatus.OK,
                data : {
                    transactions
                }
            })
        } catch (error) {
            next(error)
        }
    }
}
module.exports = {
    TransactionController : new TransactionController()
}