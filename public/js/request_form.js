$(document).ready(function(){
  requestForm.init();
})


var requestForm = (function(){
  var $form = $('#requestsForm');
  var init = function(){
    validateForm();
  }

  var validateForm = function(){
    $form.validate({
      rules:{
        title:{
          required:true
        },
        request:{
          required:true
        }
      }
    });
  }
  return {
    init:init
  }

}())
