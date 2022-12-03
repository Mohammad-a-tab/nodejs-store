const { UserAuthController } = require("../../http/controllers/user/auth/auth.controller");
const router = require("express").Router();
/**
 * @swagger
 *  components:
 *      schemas:        
 *          GetOTP:
 *              type: object
 *              required:
 *                  -   mobile
 *              properties: 
 *                  mobile:     
 *                      type: string
 *                      description: the user mobile for signUp/signIn
 *          checkOTP:
 *              type: object
 *              required:
 *                  -   mobile
 *                  -   code
 *              properties: 
 *                  mobile:     
 *                      type: string
 *                      description: the user mobile for signUp/signIn
 *                  code:     
 *                      type: integer
 *                      description: received code from getOTP
 *          RefreshToken:
 *              type: object
 *              required:
 *                  -   refreshToken
 *              properties: 
 *                  refreshToken:     
 *                      type: string
 *                      description: enter refresh-token for get fresh Token and refresh-token
 */
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
 *          tags: [User-Authentication]
 *          summary: login user in userPanel with phone number
 *          description: one time password(otp) login
 *          requestBody:
 *              required: true
 *              content:    
 *                  application/x-www-form-urlencoded:
 *                      schema:
 *                          $ref: '#/components/schemas/GetOTP'
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/GetOTP'
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
 *          requestBody:
 *              required: true
 *              content:    
 *                  application/x-www-form-urlencoded:
 *                      schema:
 *                          $ref: '#/components/schemas/checkOTP'
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/checkOTP'
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
/**
 * @swagger
 * /user/refresh-token:
 *      post:
 *          summary: send refresh token for get new token and refresh token
 *          tags: [User-Authentication]
 *          description: fresh token
 *          requestBody:
 *              required: true
 *              content:    
 *                  application/x-www-form-urlencoded:
 *                      schema:
 *                          $ref: '#/components/schemas/RefreshToken'
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/RefreshToken'
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
router.post("/refresh-token" , UserAuthController.refreshToken)

module.exports = {
    UserAuthRoutes : router
}