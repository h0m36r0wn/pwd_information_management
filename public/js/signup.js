$(document).ready(function(){
  signUp.init();
});

var signUp = (function(){
  var $form = $('#signupForm');
  var $disabilities = $('#disability-type');
  var $barangays = $('#barangays');
  var $hasCompanion = $('#has-companion');
  var $companionLabel = $('#companion-label');



  //Companion segment

  var $relationship = $('#companionRel');
  var $companionInfo  = $('.companion-info');
  var $companionFname = $('#compFname');
  var $companionLname = $('#compLname');
  var $compMobileNum = $('#compMobNum');
  //Companion segment end
  var init = function(){
    validateForm();
    showCompanionForm();
     $('[data-toggle="tooltip"]').tooltip();
  }

  var showCompanionForm = function(){
    $hasCompanion.change(function(){
      var hasCompanion = $(this).val();

      if(hasCompanion == 'true'){
        $companionInfo.css('display','inherit');
      }else{
        $companionInfo.css('display','none');
        $relationship.val("");
        $companionFname.val(null);
        $companionLname.val(null);
        $compMobileNum.val(null);
      }
    })
  }
  var validateForm = function(){
    $form.validate({
      rules:{
        email:{
          required:true,
          email:true
        },
        password:{
          required:true
        },
        confirm_pass:{
          equalTo:'#password',
          required:true
        },
        first_name:{
          required:true
        },
        last_name:{
          required:true
        },
        disability:{
          required:{
            depends:function(e){
              if('none' == $disabilities.val()){
                $disabilities.val('');
              }
              return true;
            }
          }
        },
        barangays:{
          required:{
            depends:function(e){
              if('none' == $barangays.val()){
                $barangays.val('');
              }
              return true;
            }
          }
        },
        address:{
          required:true
        },
        has_companion:{
          required:{
            depends:function(e){
              if('none'== $hasCompanion.val()){
                $hasCompanion.val('');
              }
              return true;
            }
          }
        },
        relationship:{
          required:{
            depends:function(e){
              if($hasCompanion.val() == 'true'){
                return true
              }else{
                return false;
              }
            }
          }
        },
        companion_fname:{
          required:{
            depends:function(e){
              if($hasCompanion.val() == 'true'){
                return true;
              }else{
                return false;
              }
            }
          }
        },
        companion_lname:{
          required:{
            depends:function(e){
              if($hasCompanion.val() == 'true'){
                return true;
              }else{
                return false;
              }
            }
          }
        },
        companion_mobile_num:{
          required:{
            depends:function(e){
              if($hasCompanion.val() == 'true'){
                return true;
              }else{
                return false;
              }
            }
          }
        }

      },
      messages:{
        confirm_pass:{
          equalTo:"Password not match"
        }
      }
    });
  }
  return {
    init:init
  }
}())
