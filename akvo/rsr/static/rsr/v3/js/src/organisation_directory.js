$(document).ready(function(){

  // Submit filter form on select change
  $('#filter select').change(function() {
    $('#filterForm').submit();
  });

  // setup Bloodhound for typeahead
  var organisations = new Bloodhound({
    datumTokenizer: Bloodhound.tokenizers.obj.whitespace('description',
                                                         'long_name',
                                                         'name'),
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    prefetch: {
      url: '/rest/v1/organisation/?format=json&limit=10000',
      filter: function(response) {
        f = [
          'id',
          'description',
          'long_name',
          'name'
        ];
        return _.map(response.results, _.partialRight(_.pick, f));
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
        suggestion: _.template('<a href="/organisation/<%= id %>"><p><%= name %>!</p></a>')
       }
    });


});
