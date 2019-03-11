/*
    Akvo RSR is covered by the GNU Affero General Public License.
    See more details in the license.txt file located at the root folder of the
    Akvo RSR module. For additional details on the GNU license please see
    < http://www.gnu.org/licenses/agpl.html >.
 */

// Jquery dependent code
$(function() {

  $('#passwordForm').submit(function(event) {
    var close_text = JSON.parse(document.getElementById("password-change-strings").innerHTML).close_text;
    var password_update_text = JSON.parse(document.getElementById("password-change-strings").innerHTML).password_update_text;

    serializedData = {};
    $.each($(this).serializeArray(), function(i, obj) { serializedData[obj.name] = obj.value; });

    $.ajax({
      type:"POST",
      url: JSON.parse(document.getElementById("akvo-rsr-password-url").innerHTML).ajaxUrl,
      data : JSON.stringify(serializedData),
      contentType : 'application/json; charset=UTF-8',
      success: function(response) {
        $( "#password" ).prepend('<div class="alert alert-success alert-dismissible" role="alert"><button type="button" class="close" data-dismiss="alert"><span aria-hidden="true">×</span><span class="sr-only">' + close_text + '</span></button>' + password_update_text + '</div>');
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
          $( "#password" ).prepend('<div class="alert alert-danger alert-dismissible" role="alert"><button type="button" class="close" data-dismiss="alert"><span aria-hidden="true">×</span><span class="sr-only">' + close_text + '</span></button>' + value + '</div>');
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
