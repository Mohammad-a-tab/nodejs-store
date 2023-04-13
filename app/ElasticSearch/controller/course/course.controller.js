const { elasticClient } = require("../../config/elastic.config");
const {StatusCodes : HttpStatus} = require("http-status-codes");
const indexCourse = "course"
class ElasticCourseController {
    async searchByTitle (req, res, next) {
        try {
            const {title} = req.params;
            const course = await elasticClient.search({
                index: indexCourse,
                query: {
                    match: {
                        title
                    }
                }
            });
            const courseResult = course.hits.hits.map(item => item._source)
            return res.status(HttpStatus.OK).json(courseResult)
        } catch (error) {
            next(error)
        }
    }
    async searchBySupplier (req, res, next) {
        try {
            const {supplier} = req?.params;
            const course = await elasticClient.search({
                index: indexCourse,
                body: { 
                    query: {
                        bool: {
                            should: [
                                {
                                    nested: {
                                        path: "supplier",
                                        query: {
                                          bool: {
                                            must: [
                                              { match: { "supplier.First_Name": supplier }}
                                            ]
                                          }
                                        }
                                      }
                                },
                                {
                                    nested: {
                                        path: "supplier",
                                        query: {
                                          bool: {
                                            must: [
                                              { match: { "supplier.Last_Name": supplier }}
                                            ]
                                          }
                                        }
                                      }
                                },
                                {
                                    nested: {
                                        path: "supplier",
                                        query: {
                                          bool: {
                                            must: [
                                              { match: { "supplier.UserName": supplier }}
                                            ]
                                          }
                                        }
                                      }
                                },
                                {
                                    nested: {
                                        path: "supplier",
                                        query: {
                                          bool: {
                                            must: [
                                              { match: { "supplier.Mobile": supplier }}
                                            ]
                                          }
                                        }
                                      }
                                },
                                {
                                    nested: {
                                        path: "supplier",
                                        query: {
                                          bool: {
                                            must: [
                                              { match: { "supplier.Email": supplier }}
                                            ]
                                          }
                                        }
                                    }
                                }
                            ],
                            minimum_should_match: 1,
                        }
                } }
            });
            const courseResult = course.hits.hits.map(item => item._source)
            return res.status(HttpStatus.OK).json(courseResult)
        } catch (error) {
            next(error)
        }
    }
    async searchByText (req, res, next) {
        try {
            const {text} = req.params;
            const course = await elasticClient.search({
                index: indexCourse,
                query: {
                    match: {
                        text
                    }
                }
            });
            const courseResult = course.hits.hits.map(item => item._source)
            return res.status(HttpStatus.OK).json(courseResult)
        } catch (error) {
            next(error)
        }
    }
    async searchByTags (req, res, next) {
        try {
            const {tags} = req.params;
            const course = await elasticClient.search({
                index: indexCourse,
                query: {
                    match: {
                        tags
                    }
                }
            });
            const courseResult = course.hits.hits.map(item => item._source)
            return res.status(HttpStatus.OK).json(courseResult)
        } catch (error) {
            next(error)
        }
    }
    async searchTitleByRegexp (req, res, next) {
        try {
            const {search} = req.params;
            const course = await elasticClient.search({
                index: indexCourse,
                query: {
                    regexp: {
                        title: `.*${search}.*`
                    }
                }
            });
            const courseResult = course.hits.hits.map(item => item._source)
            return res.status(HttpStatus.OK).json(courseResult)
        } catch (error) {
            next(error)
        }
    }
    async searchTextByRegexp (req, res, next) {
        try {
            const {search} = req.params;
            const course = await elasticClient.search({
                index: indexCourse,
                query: {
                    regexp: {
                        text: `.*${search}.*`
                    }
                }
            });
            const courseResult = course.hits.hits.map(item => item._source)
            return res.status(HttpStatus.OK).json(courseResult)
        } catch (error) {
            next(error)
        }
    }
    async searchSupplierByRegexp (req, res, next) {
        try {
            const {search} = req.params;
            const course = await elasticClient.search({
                index: indexCourse,
                body: {
                    query: {
                        bool: {
                            should: [
                                {   
                                    nested: {
                                        path: "supplier",
                                        query: {
                                            regexp: {'supplier.First_Name': `.*${search}.*`}
                                        }
                                    }
                                },
                                {   
                                    nested: {
                                        path: "supplier",
                                        query: {
                                            regexp: {'supplier.Last_Name': `.*${search}.*`}
                                        }
                                    }
                                },
                                {   
                                    nested: {
                                        path: "supplier",
                                        query: {
                                            regexp: {'supplier.UserName': `.*${search}.*`}
                                        }
                                    }
                                },
                                {   
                                    nested: {
                                        path: "supplier",
                                        query: {
                                            regexp: {'supplier.Mobile': `.*${search}.*`}
                                        }
                                    }
                                },
                                {   
                                    nested: {
                                        path: "supplier",
                                        query: {
                                            regexp: {'supplier.Email': `.*${search}.*`}
                                        }
                                    }
                                },
                            ],
                            minimum_should_match: 1
                        }
                    }
                }
            });
            const courseResult = course.hits.hits.map(item => item._source)
            return res.status(HttpStatus.OK).json(courseResult)
        } catch (error) {
            next(error)
        }
    }
    async searchByMultiField (req, res, next) {
        try {
            const {search} = req.params;
            const course = await elasticClient.search({
                index: indexCourse,
                query: {
                    multi_match: {
                        query: search,
                        fields: ["title", "text", "short_text", "tags"]
                    }
                }
            });
            const courseResult = course.hits.hits.map(item => item._source)
            return res.status(HttpStatus.OK).json(courseResult)
        } catch (error) {
            next(error)
        }
    }
}
async function createNewCourseInElasticSearch(course) {
    const createResults = await elasticClient.index({
        index: indexCourse,
        body: {...course} 
    })
    return createResults
}
async function getAllCourseFromElasticSearch() {
    const courses = await elasticClient.search({
        index : indexCourse, 
        body: {
            query : {
                "match_all" : {}
            }
        }
    });
    const CoursesResult = courses.hits.hits.map(item => item._source)
    return CoursesResult
}
async function removeCourseFromElasticSearch(title) {
    const results = await elasticClient.search({
        index : indexCourse,
        q: title
    });
    const CourseID = results.hits.hits[0]._id;
    const deletedResult = await elasticClient.deleteByQuery({
        index : indexCourse,
        query : {
            match : {
                _id : CourseID
            }
        }
    });
    return deletedResult
}
async function updateCourseInElasticSearch(course, data) {
    Object.keys(data).forEach(key => {
        if(!data[key]) delete data[key]
    });
    const results = await elasticClient.search({
        index : indexCourse,
        q: course?.title || course?.text || course?.short_text || course?.tags || course?.image 
    });
    const courseID = results.hits.hits[0]._id;
    const updateResult = await elasticClient.update({
        index: indexCourse,
        id : courseID,
        doc: data
    })
    return updateResult
}
async function updateChaptersInElasticSearch(course, data) {
    Object.keys(data).forEach(key => {
        if(!data[key]) delete data[key]
    });
    console.log(data);
    const results = await elasticClient.search({
        index : indexCourse,
        q: course?.title || course?.text || course?.short_text || course?.tags || course?.image 
    });
    let mmd = results.hits.hits[0]
    
    // const courseID = results.hits.hits[0]._id;
    // const updateResult = await elasticClient.update({
    //     index: indexCourse,
    //     id : courseID,
    //     doc: data
    // })
    // return updateResult
}
module.exports = {
    ElasticCourseController: new ElasticCourseController(),
    createNewCourseInElasticSearch,
    getAllCourseFromElasticSearch,
    removeCourseFromElasticSearch,
    updateChaptersInElasticSearch,
    updateCourseInElasticSearch
}