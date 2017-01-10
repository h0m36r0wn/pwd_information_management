var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var staffsMdl = new Schema({
  first_name:{
    type:String
  },
  last_name:{
    type:String
  },
  full_name:{
    type:String
  },
  barangay:{
    type:String,
    default:"global"
  },
  staff_id:{
    type:String
  },
  mobile_number:{
    type:String
  },
  user:{
    type:Schema.Types.ObjectId,
    ref:'Users'
  }
})

module.exports = mongoose.model('Staffs',staffsMdl);
