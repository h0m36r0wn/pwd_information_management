var express = require('express');
var router = express.Router();


router.route('/')
  .get(function(req, res){
    res.render('pages/homepage/index');
  })


module.exports = router;
