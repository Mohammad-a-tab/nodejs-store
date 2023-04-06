/**
 * @swagger
 *  components:
 *      schemas:
 *          Create_Indices:
 *              type: object
 *              required:
 *                  -   indexName
 *              properties:
 *                  indexName:
 *                      type: string
 *                      description: the Index Name of Indices
 */ 
/**
 * @swagger
 *  /elastic/index/create:
 *      post:
 *          tags: [Elastic_Panel]
 *          summary: create Index in Elastic Search
 *          requestBody:
 *              required: true
 *              content:
 *                  application/x-www-form-urlencoded:
 *                      schema:
 *                          $ref: '#/components/schemas/Create_Indices'
 *          responses:
 *              201:
 *                  description: created
 */
/**
 * @swagger
 *  /elastic/index/list:
 *      get:
 *          tags: [Elastic_Panel]
 *          summary: Gets a list of Indices
 *          responses:
 *              200:
 *                  description: successfully
 */
/**
 * @swagger
 *  /elastic/index/remove:
 *      delete:
 *          tags: [Elastic_Panel]
 *          summary: remove Index in Elastic Search
 *          requestBody:
 *              required: true
 *              content:
 *                  application/x-www-form-urlencoded:
 *                      schema:
 *                          $ref: '#/components/schemas/Create_Indices'
 *          responses:
 *              201:
 *                  description: successfully Removed index
 */