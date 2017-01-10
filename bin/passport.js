'use strict';

var passport = require('passport');
var LocalStrategy = require('passport-local');
var UsersMdl = require('../models/UsersMdl');
var Users = require('../controllers/Users');
var CONFIG = require('./config');
class Passport {
  constructor() {
    this.strategy = new LocalStrategy(
      { usernameField:'email', passwordField:'password',passReqToCallback:true },
      function(req, email, password, done){
        UsersMdl.getUserByEmail(email).then(function(user){
          UsersMdl.comparePassword(password, user.password).then(function(isMatched){
            if(isMatched){
              return done(null, user);
            }else{
              return done(null, false, req.flash('loginMessage','You have entered a wrong email or password'));
            }
          },function(err) {
            return done(null, false, req.flash('loginMessage','You have entered a wrong email or password'));
          });
        },function(err){
          return done(null, false, req.flash('loginMessage','The account you entered does not exists. Email and password are both case sensitive'))
        })
      }
    )
  }

  initialize(){
    passport.use(this.strategy);
    passport.serializeUser(function(user, done){
      done(null, user);
    })

      passport.deserializeUser(function(userObj, done){
      var user = new Users({
        user_id:userObj._id
      })
      var role = userObj.role;
      switch (role) {
        case CONFIG.ROLES.USER:
            user.getProfile().then(function(profile){
              profile.role = userObj.role;
              profile.email = userObj.email;
              done(null, profile);
            },function(err){
              done(err, null);
            })
          break;
        case CONFIG.ROLES.ADMIN:
           user.getStaffProfile().then(function(staffProfile){
             staffProfile.role = userObj.role;
             staffProfile.email = userObj.email;
             done(null, staffProfile);
           },function(err){
             done(err, null);
           })
           break;
        case  CONFIG.ROLES.BRGYSTAFF:
            user.getStaffProfile().then(function(staffProfile){
              staffProfile.role = userObj.role;
              staffProfile.email = userObj.email;
              done(null, staffProfile);
            },function(err){
              done(err, null);
            })
            break;
      }
    })
    return passport.initialize();
  }

  session(){
    return passport.session();
  }

  authenticate(req, res, next){
   passport.authenticate('local',function(err, user, info){
     if(err) return next(err);
     if(!user) return res.redirect('/login');

     req.logIn(user, function(err){
        if (err) { return next(err); }
        switch (user.role) {
          case CONFIG.ROLES.USER:
          console.log('user');
            return res.redirect('/announcements');
            break;
          case CONFIG.ROLES.BRGYSTAFF:
            return res.redirect('/announcements');
            break;

          case CONFIG.ROLES.ADMIN:
            return res.redirect('/dashboard');
            break;
        }
     })
    })(req, res, next);
  }

  checkAuthentication(req, res, next){
    if(req.isAuthenticated()){
      return next();
    }else{
      res.redirect('/login');
    }
  }
}

var passportObj = new Passport();

module.exports = passportObj;
