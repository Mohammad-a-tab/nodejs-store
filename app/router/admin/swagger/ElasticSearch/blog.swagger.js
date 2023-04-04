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
/**
 * @swagger
 *  /elastic/blogs/search-text/{text}:
 *      get:
 *          summary: get blog by text with ElasticSearch
 *          tags: [ Blog(Elastic_Panel) ]
 *          parameters:
 *              -   in: path
 *                  name: text
 *                  type: string
 *                  required: true
 *          responses:
 *              200:
 *                  description: success
 */
/**
 * @swagger
 *  /elastic/blogs/search-author/{info}:
 *      get:
 *          summary: get blog by Author with ElasticSearch
 *          tags: [ Blog(Elastic_Panel) ]
 *          parameters:
 *              -   in: path
 *                  name: info
 *                  type: string
 *                  required: true
 *          responses:
 *              200:
 *                  description: success
 */
/**
 * @swagger
 *  /elastic/blogs/search-tags/{tags}:
 *      get:
 *          summary: get blog by tags with ElasticSearch
 *          tags: [ Blog(Elastic_Panel) ]
 *          parameters:
 *              -   in: path
 *                  name: tags
 *                  type: string
 *                  required: true
 *          responses:
 *              200:
 *                  description: success
 */