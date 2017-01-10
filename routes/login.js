var express = require('express');
var router = express.Router();
var passport = require('../bin/passport');

router.route('/')
  .get(function(req, res){
    res.render('pages/login/login', { message:req.flash('loginMessage'), signUpSuccess:req.flash('signUpSuccess') });
  })
  .post(passport.authenticate)

module.exports = router;
