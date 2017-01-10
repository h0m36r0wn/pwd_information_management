$(document).ready(function(){
  createPwdAcc.init()
})


var createPwdAcc = (function(){
  var $camContainer = "#myCam";
  var $formWiz = $('#rootwizard');
  var $previewBtn = $('#previewBtn');
  var $reTake = $('#reTake');
  var $savePhoto = $('#savePhoto');
  var $photoInput = $('#photoInput');
  var $form = $('#createPwdForm');


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

  var init = function(){
    createWebCam();
    createFormWiz();
    previewPhoto();
    retakePhoto();
    freezeOnSave();
    validateForm();
  }
  var myCam = Webcam;
  var createWebCam = function(){
    Webcam.set({
      width:480,
      height:360,

      image_format: 'jpeg',
			jpeg_quality: 90
    })
    myCam.attach($camContainer);
  }

  var previewPhoto = function(){
    $previewBtn.click(function(){
      myCam.freeze();
      $(this).css('display','none');
      $reTake.css('display','inline');
    })
  }

  var retakePhoto = function(){

    $reTake.click(function(){
      myCam.unfreeze();
      $(this).css('display','none');
      $previewBtn.css('display','inline');
      $savePhoto.css('display','inline');
    })
  }

  var savePhoto = function(cb){
    myCam.snap(function(data_uri){
      $photoInput.val(data_uri);
      cb();
    })
  }
  var freezeOnSave = function(){
    $savePhoto.click(function(){
      var $this = $(this);
      savePhoto(function(){
        console.log('trigger');
        myCam.freeze();
        $previewBtn.css('display','none');
        $reTake.css('display','inline');
        $this.css ('display','none');

        $formWiz.bootstrapWizard('next');
      })
    })
  }
  var validateForm = function(){
    $form.validate({
      rules:{
        email:{
          required:true,
          email:true
        },
        pwd_picture:{
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

      }
    })
  }
  var createFormWiz = function(){
   $formWiz.bootstrapWizard({'tabClass': 'nav nav-tabs',
       onNext:function(tab, navigation, index){
         if($photoInput.val() == ""){
           swal("Take a photo!", "Please take a photo before proceeding", "error");
           return false;
         }
         var valid = $form.valid();
         console.log(valid);
         if(!valid){
           return false;
         }
         console.log(index);
         if(index == 2){
           console.log($hasCompanion.val());
           if($hasCompanion.val() == "false"){
              $relationship.prop('disabled','true');
              $companionInfo.prop('disabled','true');
              $companionFname.prop('disabled','true');
              $companionLname.prop('disabled','true');
             $compMobileNum.prop('disabled','true');
           }else{
             $relationship.prop('disabled', false);
             $companionInfo.prop('disabled',false);
             $companionFname.prop('disabled',false);
             $companionLname.prop('disabled',false);
            $compMobileNum.prop('disabled',false );
           }
         }
       },
       onTabClick:function(){
         return false;
       }
    });
  }


  return{
    init:init
  }
}())
