var express = require('express');
var router = express.Router();
var passport = require('../bin/passport');


router.route('/')
  .get(passport.checkAuthentication, function(req, res){
    req.session.destroy();
    res.redirect('/login');
  })


module.exports = router;
