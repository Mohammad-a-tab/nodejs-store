/**
 * @swagger
 *  components:
 *      schemas:
 *          Blog:
 *              type: object
 *              required:
 *                  -   title
 *                  -   short_text
 *                  -   text
 *                  -   tags
 *                  -   category
 *                  -   image
 *              properties:
 *                  title:
 *                      type: string
 *                      description: the title of Blog
 *                  short_text:
 *                      type: string
 *                      description: the summary of text of blog
 *                  text:
 *                      type: string
 *                      description: the text of blog
 *                  tags:
 *                      type: array
 *                      description: the list of tags for example(tag1#tag2#tag_foo)
 *                  category:
 *                      type: string
 *                      description: the id of category for foreignField in blog
 *                  image:
 *                      type: file
 *                      description: the index picture of blog
 *          BlogUpdate:
 *              type: object
 *              properties:
 *                  title:
 *                      type: string
 *                      description: the title of blog
 *                  short_text:
 *                      type: string
 *                      description: the summary of text of blog
 *                  text:
 *                      type: string
 *                      description: the text of blog
 *                  tags:
 *                      type: array
 *                      description: the list of tags for example(tag1#tag2#tag_foo)
 *                  category:
 *                      type: string
 *                      description: the id of category for foreignField in blog
 *                  image:
 *                      type: file
 *                      description: the index picture of blog
 */ 
/**
 * @swagger
 *  definitions:
 *      listOfBlogs:
 *          type: object
 *          properties:
 *              statusCode:
 *                  type: integer
 *                  example: 200
 *              data:
 *                  type: object
 *                  properties:
 *                      Blogs:
 *                          type: array
 *                          items:
 *                              type: object
 *                              properties:
 *                                  _id:
 *                                      type: string
 *                                      example: "62822e4ff68cdded54aa928d"
 *                                  title:
 *                                      type: string
 *                                      example: "title of blog"
 *                                  short_text:
 *                                      type: string
 *                                      example: "summary text of blog"
 *                                  text:
 *                                      type: string
 *                                      example: "text and describe of blog"
 *                                  tags:
 *                                      type: array
 *                                      example: [item1,item2]
 *                                  category:
 *                                      type: string
 *                                      example: "62822e4ff68cdded54aa928d"
 *                                  author:
 *                                      type: string
 *                                      example: "Mohammad Aali"
 */

/**
 * @swagger
 *  /admin/blogs/all:
 *      get:
 *          tags: [ Blog(Admin-Panel)]
 *          summary: get all blogs
 *          responses:
 *              200:
 *                  description: success - get array of blogs
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/definitions/listOfBlogs'
 */
/**
 * @swagger
 *  /admin/blogs/add:
 *      post:
 *          tags: [ Blog(Admin-Panel)]
 *          summary: create Blog document
 *          requestBody:
 *              required: true
 *              content:
 *                  multipart/form-data:
 *                      schema:
 *                          $ref: '#/components/schemas/Blog'
 *          responses:
 *              201:
 *                  description: created
 */
/**
 * @swagger
 *  /admin/blogs/update/{id}:
 *      patch:
 *          tags: [ Blog(Admin-Panel)]
 *          summary: update  Blog document by id 
 *          consumes: 
 *              -   multipart/form-data
 *          parameters:
 *              -   in: path
 *                  required: true
 *                  name: id
 *                  type: string
 *          requestBody:
 *              required: true
 *              content:
 *                  multipart/form-data:
 *                      schema:
 *                          $ref: '#/components/schemas/BlogUpdate'
 *          responses:
 *              200:
 *                  description: success
 */
/**
 * @swagger
 *  /admin/blogs/{id}:
 *      get:
 *          summary: get blog by ID and populate this field 
 *          tags: [ Blog(Admin-Panel) ]
 *          parameters:
 *              -   in: path
 *                  name: id
 *                  type: string
 *                  required: true
 *          responses:
 *              200:
 *                  description: success
 */
/**
 * @swagger
 *  /admin/blogs/remove/{id}:
 *      delete:
 *          summary: remove blog by ID 
 *          tags: [ Blog(Admin-Panel) ]
 *          parameters:
 *              -   in: path
 *                  name: id
 *                  type: string
 *                  required: true
 *          responses:
 *              200:
 *                  description: success
 */