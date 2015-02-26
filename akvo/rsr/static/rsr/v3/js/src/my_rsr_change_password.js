$(function() {

  $('#passwordForm').submit(function(event) {

    serializedData = {};
    $.each($(this).serializeArray(), function(i, obj) { serializedData[obj.name] = obj.value; });

    $.ajax({
      type:"POST",
      url: JSON.parse(document.getElementById("akvo-rsr-ajax-url").innerHTML).ajaxUrl,
      data : JSON.stringify(serializedData),
      contentType : 'application/json; charset=UTF-8',
      success: function(response){
        $( "#password" ).prepend('<div class="alert alert-success alert-dismissible" role="alert"><button type="button" class="close" data-dismiss="alert"><span aria-hidden="true">×</span><span class="sr-only">Close</span></button>Password has been updated.</div>');
        window.setTimeout(function() {
          $(".alert").fadeTo(500, 0).slideUp(500, function(){
            $(this).remove();
          });
        }, 2000);
      },
      error: function(response)
      {
        jsonValue = $.parseJSON( response.responseText );

        $.each(jsonValue, function(key, value){
          $( "#password" ).prepend('<div class="alert alert-danger alert-dismissible" role="alert"><button type="button" class="close" data-dismiss="alert"><span aria-hidden="true">×</span><span class="sr-only">Close</span></button>' + value + '</div>');
          window.setTimeout(function() {
            $(".alert").fadeTo(500, 0).slideUp(500, function(){
              $(this).remove();
            });
          }, 2000);
        });
      }
    });

    event.preventDefault();

  });


});
