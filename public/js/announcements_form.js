$(document).ready(function(){
   annForm.init();
})

var annForm = (function(){
  var $form = $('#announcementForm');
  var editor = $('#contentMce');
  var init = function(){
    //createWysiwg();
    validateForm();
  }

  var validateForm = function(){
    // var validator = $form.submit(function(){
    //   tinyMCE.triggerSave();
    // }).validate({
		// 	ignore: "",
		// 	rules: {
		// 		title: "required",
		// 		content: "required"
		// 	}
		// })
    $form.validate({
      rules:{
        title:"required",
        content:"required"
      }
    })
  }
  

  return {
    init:init
  }

}())
