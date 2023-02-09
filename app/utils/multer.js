const multer = require("multer");
const fs = require("fs");
const path = require("path");
const createHttpError = require("http-errors");

function createRouteForBlogs(req) {
    const date = new Date();
    const monthNumber = date.getMonth() + 1;
    const Year = date.getFullYear().toString();
    const Month = monthNumber.toString();
    const Day = date.getDate().toString();
    const directory = path.join(__dirname , ".." , ".." , "public" , "uploads" , "blogs" , Year , Month , Day);
    req.body.fileUploadPath = path.join("uploads" , "blogs" , Year , Month , Day)
    fs.mkdirSync(directory , {recursive : true});
    return directory
}
const storageForBlog = multer.diskStorage({
    destination : (req,file,cb) => {
        if(file?.originalname){
            const filePath = createRouteForBlogs(req);
            return cb(null , filePath)
        }
        cb(null, null)
    },
    filename : (req,file,cb) => {
        if(file.originalname){
            const ext = path.extname(file.originalname);
            const fileName = String(new Date().getTime() + ext);
            req.body.filename = fileName;
            return cb(null, fileName)
        }
        cb(null, null)
    }
});
function createRouteForEpisode(req) {
    const date = new Date();
    const monthNumber = date.getMonth() + 1;
    const Year = date.getFullYear().toString();
    const Month = monthNumber.toString();
    const Day = date.getDate().toString();
    const directory = path.join(__dirname , ".." , ".." , "public" , "uploads" , "episode" , Year , Month , Day);
    req.body.fileUploadPath = path.join("uploads" , "episode" , Year , Month , Day)
    fs.mkdirSync(directory , {recursive : true});
    return directory
}
const storageForEpisode = multer.diskStorage({
    destination : (req,file,cb) => {
        if(file?.originalname){
            const filePath = createRouteForEpisode(req);
            return cb(null , filePath)
        }
        cb(null, null)
    },
    filename : (req,file,cb) => {
        if(file.originalname){
            const ext = path.extname(file.originalname);
            const fileName = String(new Date().getTime() + ext);
            req.body.filename = fileName;
            return cb(null, fileName)
        }
        cb(null, null)
    }
});
function createRouteForProduct(req) {
    const date = new Date();
    const monthNumber = date.getMonth() + 1;
    const Year = date.getFullYear().toString();
    const Month = monthNumber.toString();
    const Day = date.getDate().toString();
    const directory = path.join(__dirname , ".." , ".." , "public" , "uploads" , "products" , Year , Month , Day);
    req.body.fileUploadPath = path.join("uploads" , "products" , Year , Month , Day)
    fs.mkdirSync(directory , {recursive : true});
    return directory
}
const storageForProduct = multer.diskStorage({
    destination : (req,file,cb) => {
        if(file?.originalname){
            const filePath = createRouteForProduct(req);
            return cb(null , filePath)
        }
        cb(null, null)
    },
    filename : (req,file,cb) => {
        if(file.originalname){
            const ext = path.extname(file.originalname);
            const fileName = String(new Date().getTime() + ext);
            req.body.filename = fileName;
            return cb(null, fileName)
        }
        cb(null, null)
    }
});
function createRouteForCourse(req) {
    const date = new Date();
    const monthNumber = date.getMonth() + 1;
    const Year = date.getFullYear().toString();
    const Month = monthNumber.toString();
    const Day = date.getDate().toString();
    const directory = path.join(__dirname , ".." , ".." , "public" , "uploads" , "courses" , Year , Month , Day);
    req.body.fileUploadPath = path.join("uploads" , "courses" , Year , Month , Day)
    fs.mkdirSync(directory , {recursive : true});
    return directory
}
const storageForCourse = multer.diskStorage({
    destination : (req,file,cb) => {
        if(file?.originalname){
            const filePath = createRouteForCourse(req);
            return cb(null , filePath)
        }
        cb(null, null)
    },
    filename : (req,file,cb) => {
        if(file.originalname){
            const ext = path.extname(file.originalname);
            const fileName = String(new Date().getTime() + ext);
            req.body.filename = fileName;
            return cb(null, fileName)
        }
        cb(null, null)
    }
});
function createRouteForSupport(req) {
    const date = new Date();
    const monthNumber = date.getMonth() + 1;
    const Year = date.getFullYear().toString();
    const Month = monthNumber.toString();
    const Day = date.getDate().toString();
    const directory = path.join(__dirname , ".." , ".." , "public" , "uploads" , "Support" , Year , Month , Day);
    req.body.fileUploadPath = path.join("uploads" , "Support" , Year , Month , Day)
    fs.mkdirSync(directory , {recursive : true});
    return directory
}
const storageForSupport = multer.diskStorage({
    destination : (req,file,cb) => {
        if(file?.originalname){
            const filePath = createRouteForSupport(req);
            return cb(null , filePath)
        }
        cb(null, null)
    },
    filename : (req,file,cb) => {
        if(file.originalname){
            const ext = path.extname(file.originalname);
            const fileName = String(new Date().getTime() + ext);
            req.body.filename = fileName;
            return cb(null, fileName)
        }
        cb(null, null)
    }
});
function fileFilter(req, file, cb) {
    const ext = path.extname(file.originalname);
    const mimetypes = [".jpg", ".jpeg", ".png", ".webp", ".gif"];
    if (mimetypes.includes(ext)) {
      return cb(null, true);
    }
    return cb(createHttpError.BadRequest("فرمت ارسال شده تصویر صحیح نمیباشد"));
}
function videoFilter(req, file, cb) {
    const ext = path.extname(file.originalname);
    const mimetypes = [".mp4", ".mpg", ".mov", ".avi", ".mkv"];
    if (mimetypes.includes(ext)) {
      return cb(null, true);
    }
    return cb(createError.BadRequest("فرمت ارسال شده ویدیو صحیح نمیباشد"));
  }
const pictureMaxSize = 2 * 1000 * 1000;     //2MB
const videoMaxSize = 300 * 1000 * 1000;//300MB
const uploadFileBlog = multer({storage : storageForBlog , fileFilter , limits : {fileSize : pictureMaxSize}});
const uploadFileProduct = multer({storage : storageForProduct , fileFilter , limits : {fileSize : pictureMaxSize}});
const uploadFileCourse = multer({storage : storageForCourse , fileFilter , limits : {fileSize : pictureMaxSize}});
const uploadFileSupport = multer({storage : storageForSupport , fileFilter , limits : {fileSize : pictureMaxSize}});
const uploadVideoEpisode = multer({storage : storageForEpisode , videoFilter , limits : {fileSize : videoMaxSize}});
module.exports = {
    uploadFileBlog,
    uploadFileProduct,
    uploadFileCourse,
    uploadVideoEpisode,
    uploadFileSupport
}