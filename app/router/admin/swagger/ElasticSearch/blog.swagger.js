/**
 * @swagger
 *  /elastic/blogs/search-title/{title}:
 *      get:
 *          summary: get blog by title with ElasticSearch
 *          tags: [ Blog(Elastic_Panel) ]
 *          parameters:
 *              -   in: path
 *                  name: title
 *                  type: string
 *                  required: true
 *          responses:
 *              200:
 *                  description: success
 */