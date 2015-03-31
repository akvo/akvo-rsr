$(document).ready(function(){

  // Submit filter form on select change
  $('#filter select').change(function() {
    $('#filterForm').submit();
  });

  var organisations = new Bloodhound({
    datumTokenizer: Bloodhound.tokenizers.obj.whitespace('name',
                                                         'long_name'),
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    prefetch: {
      url: '/rest/v1/typeaheads/organisations?format=json',
      thumbprint: AKVO_RSR.typeahead.thumbs.numberOfOrgs,
      filter: function(response) {
        return response.results;
      }
    }
  });

  organisations.initialize();

  $('#id_name').typeahead(
    {
      highlight: true
    },
    {
      name: 'organisations',
      displayKey: 'name',
      source: organisations.ttAdapter(),
      templates: {
        header: '<h3 class="dd-category">Organisations</h3>',
        suggestion: _.template('<a href="/organisation/<%= id %>"><p><%= name %></p></a>')
       }
    }
  )
  ;

});
