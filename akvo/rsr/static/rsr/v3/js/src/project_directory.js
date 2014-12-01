$(document).ready(function(){

  // Submit filter form on select change
  $('#filter select').change(function() {
    $('#filterForm').submit();
  });

  // setup Bloodhound for typeahead
  var projects = new Bloodhound({
    datumTokenizer: Bloodhound.tokenizers.obj.whitespace('background',
                                                         'current_image_credit',
                                                         'current_status',
                                                         'project_plan',
                                                         'project_plan_summary',
                                                         'subtitle',
                                                         'title'),
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    prefetch: {
      url: '/rest/v1/project/?format=json&limit=10000',
      filter: function(response) {
        f = [
          'id',
          'background',
          'current_image_credit',
          'current_status',
          'project_plan',
          'project_plan_summary',
          'subtitle',
          'title'
        ];
        return _.map(response.results, _.partialRight(_.pick, f));
      }
    }
  });

  var focus_areas = new Bloodhound({
    datumTokenizer: Bloodhound.tokenizers.obj.whitespace('name'),
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    prefetch: {
      url: '/rest/v1/focus_area/?format=json&limit=1000',
      filter: function(response) {
        f = [
          'id',
          'name',
          'slug'
        ];
        return _.map(response.results, _.partialRight(_.pick, f));
      }
    }
  });

  projects.initialize();
  focus_areas.initialize();

  $('#id_title').typeahead(
    {
      highlight: true
    },
    {
      name: 'projects',
      displayKey: 'title',
      source: projects.ttAdapter(),
      templates: {
        header: '<h3 class="dd-category">Projects</h3>',
        suggestion: _.template('<a href="/project/<%= id %>"><p><%= title %>!</p><p><%= subtitle %></p></a>')
       }
    },
    {
      name: 'focus_areas',
      displayKey: 'name',
      source: focus_areas.ttAdapter(),
      templates: {
        header: '<h3 class="dd-category">Filter on focus area</h3>',
        suggestion: _.template('<a class="filter_focus_area"><%= name %></a>')
       }
    }
  );

  $('#filterForm').on('click', '.filter_focus_area', function (event) {
    var tmp = $('#id_title').val();
    $('select#id_focus_area option').filter(function() {
      return $(this).text() == tmp;
    }).prop('selected', true);
    $('#id_title').val('');
    $('#filterForm').submit();
  });

  $('#filterForm').on('mouseover', '.filter_focus_area', function (event) {
    $('#collapseOne').addClass('in');
    $('select#id_focus_area option').filter(function() {
      return $(this).text() == $(this).val();
    }).prop('selected', true);
  });

  $('#filterForm').on('mouseout', '.filter_focus_area', function (event) {
    $('#collapseOne').removeClass('in');
  });

});
