const createError = require("http-errors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

function createRoute(req) {
  const date = new Date();
  const monthNumber = date.getMonth() + 1;
  const Year = date.getFullYear().toString();
  const Month = monthNumber.toString();
  const Day = date.getDate().toString();
  const str = req.baseUrl;
  const folderName = str.split("/");
  const directory = path.join(
    __dirname,
    "..",
    "..",
    "public",
    "uploads",
    folderName[2],
    Year,
    Month,
    Day
  );
  req.body.fileUploadPath = path.join("uploads", folderName[2], Year, Month, Day);
  fs.mkdirSync(directory, { recursive: true });
  return directory;
}
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file?.originalname) {
      const filePath = createRoute(req);
      return cb(null, filePath);
    }
    cb(null, null);
  },
  filename: (req, file, cb) => {
    if (file.originalname) {
      const ext = path.extname(file.originalname);
      const fileName = String(new Date().getTime() + ext);
      req.body.filename = fileName;
      return cb(null, fileName);
    }
    cb(null, null);
  },
});
function fileFilter(req, file, cb) {
  const ext = path.extname(file.originalname);
  const mimetypes = [".jpg", ".jpeg", ".png", ".webp", ".gif"];
  if (mimetypes.includes(ext)) {
    return cb(null, true);
  }
  return cb(createError.BadRequest("فرمت ارسال شده تصویر صحیح نمیباشد"));
}
function videoFilter(req, file, cb) {
  const ext = path.extname(file.originalname);
  const mimetypes = [".mp4", ".mpg", ".mov", ".avi", ".mkv"];
  if (mimetypes.includes(ext)) {
    return cb(null, true);
  }
  return cb(createError.BadRequest("فرمت ارسال شده ویدیو صحیح نمیباشد"));
}
const pictureMaxSize = 1 * 1000 * 1000;//300MB
const videoMaxSize = 300 * 1000 * 1000;//300MB
const uploadFile = multer({ storage, fileFilter, limits: { fileSize: pictureMaxSize } }); 
const uploadVideo = multer({ storage, videoFilter, limits: { fileSize: videoMaxSize } }); 
module.exports = {
  uploadFile,
  uploadVideo
};