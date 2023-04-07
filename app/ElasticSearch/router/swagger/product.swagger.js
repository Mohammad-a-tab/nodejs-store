/**
 * @swagger
 *  /elastic/products/search-MultiField/{search}:
 *      get:
 *          summary: get product by title, text, short_text and tags with ElasticSearch
 *          tags: [ product(Elastic_Panel) ]
 *          parameters:
 *              -   in: path
 *                  name: search
 *                  type: string
 *                  required: true
 *          responses:
 *              200:
 *                  description: success
 */
/**
 * @swagger
 *  /elastic/products/search-title-regexp/{search}:
 *      get:
 *          summary: get product by title with ElasticSearch
 *          tags: [ product(Elastic_Panel) ]
 *          parameters:
 *              -   in: path
 *                  name: search
 *                  type: string
 *                  required: true
 *          responses:
 *              200:
 *                  description: success
 */
/**
 * @swagger
 *  /elastic/products/search-text-regexp/{search}:
 *      get:
 *          summary: get product by text with ElasticSearch
 *          tags: [ product(Elastic_Panel) ]
 *          parameters:
 *              -   in: path
 *                  name: search
 *                  type: string
 *                  required: true
 *          responses:
 *              200:
 *                  description: success
 */
/**
 * @swagger
 *  /elastic/products/search-supplier-regexp/{search}:
 *      get:
 *          summary: get product by Author with ElasticSearch
 *          tags: [ product(Elastic_Panel) ]
 *          parameters:
 *              -   in: path
 *                  name: search
 *                  type: string
 *                  required: true
 *          responses:
 *              200:
 *                  description: success
 */
/**
 * @swagger
 *  /elastic/products/search-title/{title}:
 *      get:
 *          summary: get product by title with ElasticSearch
 *          tags: [ product(Elastic_Panel) ]
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
 *  /elastic/products/search-text/{text}:
 *      get:
 *          summary: get product by text with ElasticSearch
 *          tags: [ product(Elastic_Panel) ]
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
 *  /elastic/products/search-supplier/{supplier}:
 *      get:
 *          summary: get product by Author with ElasticSearch
 *          tags: [ product(Elastic_Panel) ]
 *          parameters:
 *              -   in: path
 *                  name: supplier
 *                  type: string
 *                  required: true
 *          responses:
 *              200:
 *                  description: success
 */
/**
 * @swagger
 *  /elastic/products/search-tags/{tags}:
 *      get:
 *          summary: get product by tags with ElasticSearch
 *          tags: [ product(Elastic_Panel) ]
 *          parameters:
 *              -   in: path
 *                  name: tags
 *                  type: string
 *                  required: true
 *          responses:
 *              200:
 *                  description: success
 */