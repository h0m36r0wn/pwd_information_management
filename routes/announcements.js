var express = require('express');
var router = express.Router();
var Globals = require('../controllers/Globals');
var passport = require('../bin/passport');
var CONFIG = require('../bin/config');


router.route('/')
  .get(passport.checkAuthentication, function(req, res){
    var announcements = [];
    var annCreated = req.flash('annCreated');
    var updateSuccess = req.flash('updateSuccess');
    var updateFailed = req.flash('updateFailed');

      switch (req.user.role) {
        case CONFIG.ROLES.USER:
        var globals = new Globals({ barangay:req.user.pwd_info.barangay });
        globals.getAnnouncementsByBarangay().then(function(annObj){
          announcements = annObj;
          res.render('pages/announcements/announcements', { items: announcements , annCreated:annCreated ,updateSuccess:updateSuccess, updateFailed:updateFailed });
        })
        break;
        case CONFIG.ROLES.ADMIN:
        var globals = new Globals();
          globals.getAllAnnouncements().then(function(announcementObj){
            announcements = announcementObj;
            res.render('pages/announcements/announcements', { items: announcements , annCreated:annCreated ,updateSuccess:updateSuccess, updateFailed:updateFailed });
          })
          break;

        case CONFIG.ROLES.BRGYSTAFF:
          var globals = new Globals({ barangay:req.user.staff_info.barangay });
          globals.getAnnouncementsByBarangay().then(function(annObj){
            announcements = annObj;
            res.render('pages/announcements/announcements',{ items: announcements , annCreated:annCreated ,updateSuccess:updateSuccess, updateFailed:updateFailed } );
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
      req.flash('annCreated','Announcement successfully created');
      res.redirect('/announcements');
    })
  })

router.route('/details/:annId')
  .get(passport.checkAuthentication ,function(req, res){
    var annId = req.params.annId;
    var globals = new Globals();
    globals.announcement_id = annId;
    globals.getAllAnnouncementsDetails().then(function(annDetails){
      if(annDetails == null) res.redirect('/announcements')
      res.render('pages/announcements/details', { annDetails:annDetails });
    }, function(err){
      res.redirect('/announcements');
    })

  })
router.route('/edit/:annId')
  .get(passport.checkAuthentication, function(req, res){
    var annId = req.params.annId;
    var globals = new Globals();
    globals.announcement_id = annId;
    globals.getAllAnnouncementsDetails().then(function(annDetails){
      res.render('pages/announcements/edit', { annDetails:annDetails });
    }, function(err){
      res.redirect('/announcements');
    })
  })

  .post(passport.checkAuthentication, function(req, res){
    var body = req.body;
    var globals = new Globals();
    globals.title = body.title;
    globals.content = body.content;
    globals.announcement_id = body.announcement_id;
    globals.updateAnn().then(function(){
      req.flash('updateSuccess','Announcement successfully updated');
      res.redirect('/announcements');
    }, function(err){
      req.flash('updateFailed','Announcement  updated failed');
      res.redirect('/announcements');
    })
  })

router.route('/delete')
  .post(passport.checkAuthentication, function(req, res){
    var body = req.body;
    var globals = new Globals();
    globals.announcement_id = body.annId;
    globals.deleteAnnoucement().then(function(isDeleted){
      res.json({deleted:true})
    },function(err){
      res.status(500);
      res.json({deleted:false})
    })
  })
router.route('/manage')
  .get(passport.checkAuthentication, function(req ,res){
    res.render('pages/announcements/manage');
  })

  router.route('/listing')
    .get(passport.checkAuthentication, function(req, res){
        var announcements = [];
        switch (req.user.role) {
          case CONFIG.ROLES.ADMIN:
          var globals = new Globals();
            globals.getAllAnnouncements().then(function(announcementObj){
              announcements = announcementObj;
              res.json(announcements);
            })
            break;

          case CONFIG.ROLES.BRGYSTAFF:
            var globals = new Globals({ barangay:req.user.staff_info.barangay });
            globals.getAnnouncementsByBarangay().then(function(annObj){
              announcements = annObj;
              res.json(announcements);
            })
            break;
        }
    })
module.exports = router;
