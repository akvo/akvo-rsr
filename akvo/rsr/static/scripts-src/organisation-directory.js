/*
    Akvo RSR is covered by the GNU Affero General Public License. See more
    details in the license.txt file located at the root folder of the Akvo RSR
    module. For additional details on the GNU license please see
    <http://www.gnu.org/licenses/agpl.html>.
*/

$(document).ready(function() {
  // Submit filter form on select change
  // $('#filter select').change(function() {
  //   $('#filterForm').submit();
  // });

  var organisations_text = JSON.parse(
    document.getElementById("organisations-text").innerHTML
  ).organisations_text;

  var organisations = new Bloodhound({
    datumTokenizer: Bloodhound.tokenizers.obj.whitespace("name", "long_name"),
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    prefetch: {
      url: "/rest/v1/typeaheads/organisations?format=json",
      thumbprint: AKVO_RSR.typeahead.thumbs.numberOfOrgs,
      filter: function(response) {
        return response.results;
      }
    }
  });

  organisations.initialize();

  $("#id_name").typeahead(
    {
      highlight: true
    },
    {
      name: "organisations",
      displayKey: "name",
      source: organisations.ttAdapter(),
      templates: {
        header: '<h3 class="dd-category">' + organisations_text + "</h3>",
        suggestion: _.template(
          '<a href="/organisation/<%= id %>"><p><%= name %></p></a>'
        )
      }
    }
  );
});

(function() {
  var applyFilterButton;

  applyFilterButton = document.getElementById("apply-filter");
  applyFilterButton.onclick = function() {
    document.getElementById("filterForm").submit();
  };
})();
