const { CourseType } = require("../typeDefs/course.type");
const { GraphQLList, GraphQLString } = require("graphql");
const { CourseModel } = require("../../models/course");

const CourseResolver = {
    type : new GraphQLList(CourseType),
    args : {
        category : {type : GraphQLString}
    },
    resolve : async (_, args) => {
        const {category} = args
        const findQuery = category? {category} : {}
        return await CourseModel.find(findQuery).populate([
            {path : 'teacher'}, 
            {path: "category"},
            {path: "comments.user"},
            {path: "likes"},
            {path: "dislikes"},
            {path: "bookmarks"},
        ]);
    }
}
module.exports = {
    CourseResolver
}