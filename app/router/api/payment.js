const { PaymentController } = require("../../http/controllers/api/payment.controller");
const { VerifyAccessToken } = require("../../http/middlewares/verifyAccessToken");

const router = require("express").Router();
router.post("/payment", VerifyAccessToken, PaymentController.PaymentGateway)
router.get("/verify", PaymentController.verifyPayment)
module.exports = {
    ApiPayment : router
}