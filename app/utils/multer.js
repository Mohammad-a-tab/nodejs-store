const multer = require("multer");
const fs = require("fs");
const path = require("path");
const createHttpError = require("http-errors");
function createRoute(req) {
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
const storage = multer.diskStorage({
    destination : (req,file,cb) => {
        if(file?.originalname){
            const filePath = createRoute(req);
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
const pictureMaxSize = 2 * 1000 * 1000;     //2MB
const uploadFile = multer({storage , fileFilter , limits : {fileSize : pictureMaxSize}});
module.exports = {
    uploadFile
}