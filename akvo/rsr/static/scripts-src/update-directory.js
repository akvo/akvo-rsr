// Akvo RSR is covered by the GNU Affero General Public License.
// See more details in the license.txt file located at the root folder of the
// Akvo RSR module. For additional details on the GNU license please see
// < http://www.gnu.org/licenses/agpl.html >.


$(document).ready(function(){

  // Submit filter form on select change
  $('#filter select').change(function() {
    $('#filterForm').submit();
  });

  var updates_text = JSON.parse(document.getElementById("updates-text").innerHTML).updates_text;

    // setup Bloodhound for typeahead
  var updates = new Bloodhound({
    datumTokenizer: Bloodhound.tokenizers.obj.whitespace('title'),
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    prefetch: {
      url: '/rest/v1/typeaheads/project_updates?format=json',
      thumbprint: AKVO_RSR.typeahead.thumbs.numberOfUpdates,
      filter: function(response) {
        return response.results;
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
        header: '<h3 class="dd-category">' + updates_text + '</h3>',
        suggestion: _.template('<a href="/project/<%= project %>/update/<%= id %>"><p><%= title %></p></a>')
       }
    });

});
