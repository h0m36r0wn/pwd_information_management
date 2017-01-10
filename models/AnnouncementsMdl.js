var mongoose = require('mongoose');
var Schema  = mongoose.Schema;

var announcementsMdl = new Schema({
  title:{
    type:String
  },
  content:{
    type:String
  },
  content_type:{
    type:String
  },
  barangay:{
    type:String
  },
  date_created:{
    type:Date,
    default:() => {
      return Date.now();
    }
  },
  created_by:{
    type:Schema.Types.ObjectId,
    ref:'Staffs'
  }
})

module.exports = mongoose.model('Announcements',announcementsMdl);
