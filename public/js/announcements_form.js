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
  var createWysiwg = function(){
    tinymce.init({
  selector: 'textarea.editor',
  height: 300,
  theme: 'modern',
  plugins: [
    'advlist autolink lists link image charmap print preview hr anchor pagebreak',
    'searchreplace wordcount visualblocks visualchars code fullscreen',
    'insertdatetime media nonbreaking save table contextmenu directionality',
    'emoticons template paste textcolor colorpicker textpattern imagetools codesample toc'
  ],
  toolbar1: 'undo redo | insert | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image',
  toolbar2: 'print preview media | forecolor backcolor emoticons | codesample',
  image_advtab: true
 });
  }

  return {
    init:init
  }

}())
