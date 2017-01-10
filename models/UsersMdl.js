var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcryptjs = require('bcryptjs');

var userModel = new Schema({
  email:{
    type:String
  },
  password:{
    type:String
  },
  role:{
    type:String
  }
});

userModel.pre('save',function(next){
     var user = this;
     if(this.isModified('password') || this.isNew){
         bcryptjs.genSalt(10,function(err, salt){
             if(err)
                 return next(err)
             bcryptjs.hash(user.password,salt,function(err, hash){
                 if(err)
                     return next(err)
                 user.password = hash;
                 next();
             });
         });
     }else{
         return next();
     }
 })

var Users =  mongoose.model('Users',userModel);
module.exports = Users;

module.exports.getUserByEmail  = function(email){
  return new Promise(function(resolve, reject) {
      var query = {
        email:email
      };

      Users.findOne(query,function(err, user) {
        if(err) throw err;
        if(!user){
          reject()
        }
        if(user){
          resolve(user);
        }
      })

  })
}

module.exports.getUserById = function(id) {
  return new Promise(function(resovel, reject) {
      Users.findById(id, function(err, user){
        if(err) throw err;
        if(!user){
          reject({message:'User not found'})
        }
        if(user){
          resolve({message:'User found',user:user})
        }
      })
  })
}

module.exports.comparePassword = function(pw, hash){
  return new Promise(function(resolve, reject) {
    bcryptjs.compare(pw, hash, function(err, isMatch){
        if(err) throw err;
        if(isMatch){
          resolve(isMatch)
        }else{
          reject(isMatch);
        }
    })
  })
}
