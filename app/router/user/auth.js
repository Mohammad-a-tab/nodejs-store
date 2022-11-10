const { UserAuthController } = require("../../http/controllers/user/auth/auth.controller");
const router = require("express").Router();

/**
 * @swagger
 *  tags:
 *      name: User-Authentication
 *      description: User-Auth Section
 */
/**
 * @swagger
 * /user/get-otp:
 *      post:
 *          summary: login user in userPanel with phone number
 *          tags: [User-Authentication]
 *          description: one time password(otp) login
 *          parameters:
 *          -   name: mobile
 *              description: fa-IRI phoneNumber
 *              in: formData
 *              required: true
 *              type: string
 *          responses:
 *              201:
 *                  description: Success
 *              400:
 *                  description: Bad Request
 *              401:
 *                  description: Unauthorization
 *              500:
 *                  description: Internal Server Error
 */
router.post("/get-otp" , UserAuthController.getOtp)
/**
 * @swagger
 * /user/check-otp:
 *      post:
 *          summary: check-otp value in user controller
 *          tags: [User-Authentication]
 *          description: check-otp with code-mobile and expires date
 *          parameters:
 *          -   name: mobile
 *              description: fa-IRI phoneNumber
 *              in: formData
 *              required: true
 *              type: string
 *          -   name: code
 *              description: enter sms code received
 *              in: formData
 *              required: true
 *              type: string
 *          responses:
 *              201:
 *                  description: Success
 *              400:
 *                  description: Bad Request
 *              401:
 *                  description: Unauthorization
 *              500:
 *                  description: Internal Server Error
 */
router.post("/check-otp" , UserAuthController.checkOtp)

module.exports = {
    UserAuthRoutes : router
}