function insertParam(key, value)
{
    key = encodeURI(key); value = encodeURI(value);
    var kvp = document.location.search.substr(1).split('&');
    var i=kvp.length; var x; while(i--)
    {
        x = kvp[i].split('=');
        if (x[0]==key)
        {
            x[1] = value;
            kvp[i] = x.join('=');
            break;
        }
    }
    if(i<0) {kvp[kvp.length] = [key,value].join('=');}

    // Reload the page
    document.location.search = kvp.join('&');
}


$(document).ready(function() {

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
      cacheKey: 'akvoRsrProjects',
      thumbprint: AKVO_RSR.typeahead.thumbs.numberOfProjects,
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

  var sectors = new Bloodhound({
    datumTokenizer: Bloodhound.tokenizers.obj.whitespace('name'),
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    prefetch: {
      url: '/rest/v1/sector/?format=json&limit=1000',
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
  sectors.initialize();

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

  $('#sortByDropdown').on('click', 'a', (function(event) {
    insertParam('sort_by', $(event.target).attr('param'));
  }));

});
