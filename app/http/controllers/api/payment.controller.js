const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const { getBasketOfUser, invoiceNumberGenerator } = require("../../../utils/function");
const {StatusCodes: HttpStatus} = require("http-status-codes");
const { PaymentModel } = require("../../../models/payments");
const { UserModel } = require("../../../models/users");
const createHttpError = require("http-errors");
const { default: axios } = require("axios");
const Controller = require("../controller");
const moment = require("moment-jalali");
class PaymentController extends Controller {
    async PaymentGateway(req, res, next){
        try {
            const user = req.user
            if(user.basket.courses.length == 0 && user.basket.products.length == 0) 
                throw new createHttpError.BadRequest("The Basket was empty")
            const basket = (await getBasketOfUser(user._id))?.[0];
            if(!basket?.payDetail?.paymentAmount) throw new createHttpError.BadRequest("Payment detail was not found")
            const zarinpal_request_url = "https://sandbox.zarinpal.com/pg/v4/payment/request.json";
            const zarinpalGatewayURL = "https://sandbox.zarinpal.com/pg/StartPay/"
            const description = "For Buy courses and products", amount =  basket?.payDetail?.paymentAmount
            const zapripal_options = {
                merchant_id: process.env.MERCHANT_ID,
                amount,
                description,
                metadata:{
                    email: user?.email || "example@domain.com",
                    mobile: user.mobile
                },
                callback_url: "http://localhost:5000/verify"
            }
            const RequestResult = await axios.post(zarinpal_request_url, zapripal_options).then(result => result.data);
            const {authority, code} = RequestResult.data
            await PaymentModel.create({
                invoiceNumber: invoiceNumberGenerator(),
                paymentDate: moment().format("jYYYYjMMjDDHHmmss"),
                amount,
                user: user._id,
                description,
                authority,
                verify: false,
                basket

             })
            if(code == 100 && authority){
                return res.status(HttpStatus.OK).json({
                    statusCode: HttpStatus.OK,
                    data : {
                        code,
                        basket,
                        gatewayURL: `${zarinpalGatewayURL}/${authority}`
                    }
                })
            }
            throw createHttpError.BadRequest("Connection to payment gateway failed")
        } catch (error) {
            next(error)
        }
    }
    async verifyPayment(req, res, next){
        try {
            const {Authority: authority} = req.query;
            const verifyURL = "https://sandbox.zarinpal.com/pg/v4/payment/verify.json";
            const payment = await PaymentModel.findOne({authority});
            if(!payment) throw createHttpError.NotFound("Pending payment transaction not found")
            if(payment.verify) throw createHttpError.BadRequest("The desired transaction has already been paid")
            const verifyBody = JSON.stringify({
                authority,
                amount: payment.amount,
                merchant_id: process.env.MERCHANT_ID,
            })
            const verifyResult = await fetch(verifyURL, {
                method: "POST",
                headers: {
                    'Content-Type': "application/json"
                },
                body: verifyBody
            }).then(result => result.json())
            if(verifyResult.data.code == 100){
                await PaymentModel.updateOne({authority}, {
                    $set: {
                        refID: verifyResult.data.ref_id,
                        cardHash: verifyResult.data.card_hash,
                        verify: true
                    }
                })
                const user = await UserModel.findById(payment.user)
                await UserModel.updateOne({_id: payment.user}, {
                    $set: {
                        Courses: [...payment?.basket?.payDetail?.courseIds || [], ...user.Courses],
                        Products: [...payment?.basket?.payDetail?.productIds || [], ...user.Products],
                        basket: {
                            courses: [],
                            products: []
                        }
                    }
                })
                return res.status(HttpStatus.OK).json({
                    statusCode: HttpStatus.OK,
                    data: {
                        message: "Your payment has been successfully completed"
                    }
                })
            }
            throw createHttpError.BadRequest("If the payment was not made, it will be returned to your account within 72 hours")
        } catch (error) {
            next(error)
        }
    }
}
module.exports = {
    PaymentController : new PaymentController()
}