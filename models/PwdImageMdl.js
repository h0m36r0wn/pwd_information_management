var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var pwdImgMdl = new Schema({
    image_uri:{
      type:String
    },
    pwd:{
      type:Schema.Types.ObjectId,
      ref:'pwds'
    }
})


module.exports = mongoose.model('Images',pwdImgMdl);
