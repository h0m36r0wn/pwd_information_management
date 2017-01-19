$(document).ready(function(){
  staffsForm.init();
})


var staffsForm = (function(){
  var $form = $('#staffAccForm');
  var $barangays = $('#barangays');
  var init = function(){
    validateForm();
  }

  var validateForm = function(){
    $form.validate({
      rules:{
        email:{
          required:true,
          email:true
        },
        first_name:"required",
        last_name:"required",
        mobile_number:"required",
        barangay:{
          required:{
            depends:function(e){
              if('none' == $barangays.val()){
                $disabilities.val('');
              }
              return true;
            }
          }
        }
      }
    })
  }
  return {
    init:init
  }
}())
