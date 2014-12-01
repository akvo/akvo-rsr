$(document).ready(function(){

  // Submit filter form on select change
  $('#filter select').change(function() {
    $('#filterForm').submit();
  });

  // setup Bloodhound for typeahead
  var updates = new Bloodhound({
    datumTokenizer: Bloodhound.tokenizers.obj.whitespace('text',
                                                         'notes',
                                                         'photo_caption',
                                                         'title',
                                                         'video_caption'
                                                        ),
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    prefetch: {
      url: '/rest/v1/project_update/?format=json&limit=10000',
      filter: function(response) {
        f = [
          'id',
          'notes',
          'photo_caption',
          'project',
          'text',
          'title',
          'video_caption'
        ];
        return _.map(response.results, _.partialRight(_.pick, f));
      }
    }
  });

  updates.initialize();

  $('#id_title').typeahead(
    {
      highlight: true
    },
    {
      name: 'updates',
      displayKey: 'title',
      source: updates.ttAdapter(),
      templates: {
        header: '<h3 class="dd-category">Updates</h3>',
        suggestion: _.template('<a href="/project/<%= project %>/update/<%= id %>"><p><%= title %>!</p></a>')
       }
    });


});
