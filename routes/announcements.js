var express = require('express');
var router = express.Router();
var Globals = require('../controllers/Globals');
var passport = require('../bin/passport');
var CONFIG = require('../bin/config');
router.route('/')
  .get(passport.checkAuthentication, function(req, res){
    var announcements = [];
      switch (req.user.role) {
        case CONFIG.ROLES.USER:
          res.render('pages/announcements/announcements', { items: announcements});
          break;
        case CONFIG.ROLES.ADMIN:
        var globals = new Globals();
          globals.getAllAnnouncements().then(function(announcementObj){
            announcements = announcementObj;
            res.render('pages/announcements/announcements', { items: announcements});
          })
          break;

        case CONFIG.ROLES.BRGYSTAFF:
          var globals = new Globals({ barangay:req.user.staff_info.barangay });
          globals.getAnnouncementsByBarangay().then(function(annObj){
            announcements = annObj;
            res.render('pages/announcements/announcements', { items: announcements});
          })
          break;
        default:

      }

  })

router.route('/create')
  .get(passport.checkAuthentication, function(req, res){
    res.render('pages/announcements/form')
  })
  .post(passport.checkAuthentication, function(req, res){
    var body = req.body;
    var globals = new Globals();
    globals.title = body.title;
    globals.content = body.content;
    if(req.user.role == CONFIG.ROLES.ADMIN){
      globals.content_type = "global";
      globals.barangay = "global";
    }
    if(req.user.role == CONFIG.ROLES.BRGYSTAFF){
      globals.content_type = "barangay";
      globals.barangay = req.user.staff_info.barangay;
    }
    globals.created_by = req.user.staff_info._id;
    globals.createContent().then(function(resp){
      res.redirect('/announcements');
    })
  })

module.exports = router;
