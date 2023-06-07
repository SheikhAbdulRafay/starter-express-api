const path = require('path');
const multer = require('multer');
const email=require('../Emails/emailWithoutAttachments')
const MineType={
    'image/jpg':'jpg',
    'image/png':'png',
    'image/jpeg':'jpeg',
}

const storage = multer.diskStorage({
    destination: function(req, file, callback) {
      
        callback(null, path.join(__dirname,'../../entityLogo'));
    },
    filename: function(req, file, callback) {
        callback(null,Date.now() + "-" + file.originalname);
    },
});
exports.upload= multer({ limits: { fileSize: 3000000 },  fileFilter:function(req, file, callback) {
   email({
       "html":"html"
   }).then((r)=>{
       console.log("se")
   })
    const isValid=!!MineType[file.mimetype];
    let error = isValid?null:new Error('Invalid mime type!');
    
    callback(error,isValid);
    return false;
}, storage:storage});