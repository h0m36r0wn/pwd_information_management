$(document).ready(function(){
  takePicture.init();
});

var takePicture = (function(){
  var $camContainer = $('#camContainer')[0];
  var $previewBtn = $('#previewBtn');
  var $reTake = $('#reTake');
  var $savePhoto = $('#savePhoto');
  var $photoInput = $('#photoInput');
  var myCam = Webcam;
  var init = function(){
    createWebCam();
    retakePhoto();
    previewPhoto();
    freezeOnSave();
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
      $photoInput.val('');
      $photoInput.val(data_uri);
      cb();
    })
  }

  var freezeOnSave = function(){
    $savePhoto.click(function(){
      var $this = $(this);
      savePhoto(function(){
        myCam.freeze();
        $previewBtn.css('display','none');
        $reTake.css('display','inline');
        $this.css ('display','none');

      })
    })
  }
  var createWebCam = function(){
    myCam.set({
      width:480,
      height:360,

      image_format: 'jpeg',
      jpeg_quality: 90
    })
    myCam.attach($camContainer);
  }

  return {
    init:init
  }
}())
