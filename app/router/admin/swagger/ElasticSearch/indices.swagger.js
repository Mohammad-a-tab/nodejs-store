/**
 * @swagger
 *  components:
 *      schemas:
 *          Create_Indices:
 *              type: object
 *              required:
 *                  -   Name
 *              properties:
 *                  Name:
 *                      type: string
 *                      description: the Index Name of Indices
 */ 
/**
 * @swagger
 *  /elastic/create:
 *      post:
 *          tags: [Elastic_Panel]
 *          summary: create Indices in Elastic Search
 *          parameters:
 *              -   in: path
 *                  required: true
 *                  name: NameP
 *                  type: string
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