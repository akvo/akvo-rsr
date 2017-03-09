// Akvo RSR is covered by the GNU Affero General Public License.
// See more details in the license.txt file located at the root folder of the
// Akvo RSR module. For additional details on the GNU license please see
// < http://www.gnu.org/licenses/agpl.html >.

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

  var projects_text = JSON.parse(document.getElementById("typeahead-header-text").innerHTML).projects_text;
  var organisations_text = JSON.parse(document.getElementById("typeahead-header-text").innerHTML).organisations_text;
  var locations_text = JSON.parse(document.getElementById("typeahead-header-text").innerHTML).locations_text;

  // setup Bloodhound for typeahead
  var organisations = new Bloodhound({
    datumTokenizer: Bloodhound.tokenizers.obj.whitespace('name'
                                                         // 'long_name'
                                                        ),
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    prefetch: {
      url: '/rest/v1/typeaheads/organisations?format=json',
      thumbprint: AKVO_RSR.typeahead.thumbs.numberOfOrgs,
      filter: function(response) {
        return response.results;
      }
    }
  });

  var locations = new Bloodhound({
    datumTokenizer: Bloodhound.tokenizers.obj.whitespace('name'),
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    prefetch: {
      url: '/static/data/m49.json'
    }

  });

  var projects = new Bloodhound({
    datumTokenizer: Bloodhound.tokenizers.obj.whitespace(// 'background',
                                                         // 'current_image_credit',
                                                         // 'current_status',
                                                         // 'project_plan',
                                                         // 'project_plan_summary',
                                                         // 'subtitle',
                                                         'title'),
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    prefetch: {
      url: '/rest/v1/typeaheads/projects?format=json&published=1',
      thumbprint: AKVO_RSR.typeahead.thumbs.numberOfProjects,

      filter: function(response) {
        return response.results;
      }

      // Do we need to filter client side to?
      // filter: function(response) {
      //   f = [ // Match fields in resource
      //     'id',
      //     'project_plan_summary',
      //     'subtitle',
      //     'title'
      //   ];
      //   return _.map(response.results, _.partialRight(_.pick, f));
      // }
    }
  });

  // var sectors = new Bloodhound({
  //   datumTokenizer: Bloodhound.tokenizers.obj.whitespace('name'),
  //   queryTokenizer: Bloodhound.tokenizers.whitespace,
  //   prefetch: {
  //     url: '/rest/v1/typeaheads/sectors?format=json',
  //     thumbprint: AKVO_RSR.typeahead.thumbs.numberOfSectors,
  //     filter: function(response) {
  //       return response.results;
  //     }

  //     // filter: function(response) {
  //     //   f = [
  //     //     'id',
  //     //     'name',
  //     //     'slug'
  //     //   ];
  //     //   return _.map(response.results, _.partialRight(_.pick, f));
  //     // }
  //   }
  // });

  organisations.initialize();
  projects.initialize();
  locations.initialize();
  // sectors.initialize();

  $('#id_title').typeahead(
    {
      highlight: true
    },
    {
      name: 'projects',
      displayKey: 'title',
      source: projects.ttAdapter(),
      templates: {
        header: '<h3 class="dd-category">' + projects_text + '</h3>',
        suggestion: _.template('<a href="/project/<%= id %>"><p><%= title %></p></a>')
        // suggestion: _.template('<a href="/project/<%= id %>"><p><%= title %></p><p><%= subtitle %></p></a>')
       }
    },
    {
      name: 'organisations',
      displayKey: 'name',
      source: organisations.ttAdapter(),
      templates: {
        header: '<h3 class="dd-category">' + organisations_text + '</h3>',
        suggestion: _.template('<a href="/projects/?organisation=<%= id %>"><p><%= name %></p></a>')
       }
    },
    {
      name: 'locations',
      displayKey: 'name',
      source: locations.ttAdapter(),
      templates: {
        header: '<h3 class="dd-category">' + locations_text + '</h3>',
        suggestion: _.template('<a href="/projects/?location=<%= code %>"><p><%= name %></p></a>')
       }
    }
    // ,
    // {
    //   name: 'sectors',
    //   displayKey: 'name',
    //   source: sectors.ttAdapter(),
    //   templates: {
    //     header: '<h3 class="dd-category">Sectors</h3>',
    //     suggestion: _.template('<a href="/project/?sector=<%= code %>"><p><%= name %></p></a>')
    //    }
    // }
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

(function() {

  var applyFilterButton;

  applyFilterButton= document.getElementById('apply-filter');
  applyFilterButton.onclick = function() {
      document.getElementById('filterForm').submit();
  };

}());
