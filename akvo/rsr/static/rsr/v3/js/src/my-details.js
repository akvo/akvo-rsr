// Akvo RSR is covered by the GNU Affero General Public License.
// See more details in the license.txt file located at the root folder of the
// Akvo RSR module. For additional details on the GNU license please see
// < http://www.gnu.org/licenses/agpl.html >.

// Typeahead for organisation and country input
var organisations = new Bloodhound({
  datumTokenizer: Bloodhound.tokenizers.obj.whitespace('long_name'),
  queryTokenizer: Bloodhound.tokenizers.whitespace,
  prefetch: {
    url: '/rest/v1/organisation/?format=json&limit=3000',
    filter: function(response) {
      return response.results;
    }
  }
});

var countries = new Bloodhound({
  datumTokenizer: Bloodhound.tokenizers.obj.whitespace('name'),
  queryTokenizer: Bloodhound.tokenizers.whitespace,
  prefetch: {
    url: '/rest/v1/country/?format=json&limit=150',
    filter: function(response) {
      return response.results;
    }
  }
});

organisations.initialize();
countries.initialize();

// Jquery dependent code
$(function() {

  // When an avatar image is selected
  $("#id_avatar").change(function () {
    var file = this.files[0],
        fileName = file.name,
        fileSize = file.size,
        msg;
    if (fileSize > 8388608) { // 8Mb
      msg = fileName + ' ' +
        AKVO_RSR.i18n.is-larger-than-the-allowed-limit +
        ' (8Mb)'; // should come from configs
      $('#profile').prepend(alertSnippet(msg));
      resetFormElement($('#id_avatar'));
      scheduleAlertFade(4000);
    } else {
      $( ".btn" ).prop('disabled', true);
      $( ".btn" ).attr('disabled', true);
      $( "#avatarForm" ).submit();
    }
  });


  // Auto dismiss alerts
  $(".alert").alert();
  window.setTimeout(function() { $(".alert").alert('close'); }, 2000);

    // Form for updating details
  $('#profileForm').submit(function(event) {
    serializedData = {};

    $.each($(this).serializeArray(), function(i, obj) {
      serializedData[obj.name] = obj.value;
    });

    $.ajax({
      type:"POST",
      url: JSON.parse(document.getElementById("akvo-rsr-ajax-url").innerHTML).ajaxUrl,
      // url: "{% url 'user_update_details' user.id %}" + "?format=json",
      data : JSON.stringify(serializedData),
      contentType : 'application/json; charset=UTF-8',
      success: function(response){
        $( "#profile" ).prepend('<div class="alert alert-success alert-dismissible" role="alert"><button type="button" class="close" data-dismiss="alert"><span aria-hidden="true">×</span><span class="sr-only">Close</span></button>Your details have been updated.</div>');
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
          $( "#profile" ).prepend('<div class="alert alert-danger alert-dismissible" role="alert"><button type="button" class="close" data-dismiss="alert"><span aria-hidden="true">×</span><span class="sr-only">Close</span></button>' + value + '</div>');
        });

        window.setTimeout(function() {
          $(".alert").fadeTo(500, 0).slideUp(500, function(){
            $(this).remove();
          });
        }, 2000);
      }
    });

    event.preventDefault();
  });


  $('#organisationInput').typeahead(
    {
      highlight: true
    },
    {
      name: 'organisations',
      displayKey: 'long_name',
      source: organisations.ttAdapter()
    });

  $('#countriesInput').typeahead(
    {
      highlight: true
    },
    {
      name: 'countries',
      displayKey: 'name',
      source: countries.ttAdapter()
    });

});
