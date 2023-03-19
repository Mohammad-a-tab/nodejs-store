/**
 * @swagger
 *  components:
 *      schemas:
 *          Update-User:
 *              type: object
 *              properties:
 *                  id:
 *                      type: string
 *                      description: the id of the user
 *                  first_name:
 *                      type: string
 *                      description: the first_name of the user
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