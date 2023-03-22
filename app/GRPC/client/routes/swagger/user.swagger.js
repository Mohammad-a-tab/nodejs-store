/**
 * @swagger
 *  components:
 *      schemas:
 *          Update-User:
 *              type: object
 *              required: 
 *                  -   mobile
 *              properties:
 *                  mobile:
 *                      type: string
 *                      description: the mobile of the user
 *                  username:
 *                      type: string
 *                      description: the username of the user
 *                  email:
 *                      type: string
 *                      description: the email of the user
 *                  password:
 *                      type: string
 *                      description: the password of the user
 *                  bills:
 *                      type: array
 *                      description: the bills of the user
 */
/**
 * @swagger
 *  /user/list:
 *      get:
 *          tags: [GrpcServer(User)]
 *          summary: Gets a list of Users
 *          responses:
 *              200:
 *                  description: successfully
 */
/**
 * @swagger
 *  /user/update:
 *      put:
 *          tags: [GrpcServer(User)]
 *          summary: update a user
 *          requestBody:
 *              required: true
 *              content:
 *                  application/x-www-form-urlencoded:
 *                      schema:
 *                          $ref: '#/components/schemas/Update-User'
 *          responses:
 *              200:
 *                  description: successfully
 */