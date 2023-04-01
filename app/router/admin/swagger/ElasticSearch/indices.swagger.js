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
 *                  multipart/form-data:
 *                      schema:
 *                          $ref: '#/components/schemas/Create_Indices'
 *          responses:
 *              201:
 *                  description: created
 */