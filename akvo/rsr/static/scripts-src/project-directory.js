// Akvo RSR is covered by the GNU Affero General Public License.
// See more details in the license.txt file located at the root folder of the
// Akvo RSR module. For additional details on the GNU license please see
// < http://www.gnu.org/licenses/agpl.html >.

function insertParam(key, value) {
    key = encodeURI(key);
    value = encodeURI(value);
    var kvp = document.location.search.substr(1).split('&');
    var i = kvp.length;
    var x;
    while (i--) {
        x = kvp[i].split('=');
        if (x[0] == key) {
            x[1] = value;
            kvp[i] = x.join('=');
            break;
        }
    }
    if (i < 0) {
        kvp[kvp.length] = [key, value].join('=');
    }

    // Reload the page
    document.location.search = kvp.join('&');
}


$(document).ready(function () {

    var templateJSON = JSON.parse(document.getElementById("typeahead-header-text").innerHTML);
    var projects_text = templateJSON.projects_text;
    var organisations_text = templateJSON.organisations_text;
    var locations_text = templateJSON.locations_text;

    var locations = new Bloodhound({
        datumTokenizer: Bloodhound.tokenizers.obj.whitespace('name'),
        queryTokenizer: Bloodhound.tokenizers.whitespace,
        prefetch: {
            //  TODO: get a filtered set of locations for Pages
            thumbprint: "locations",
            url: '/static/data/m49.json'
        }
    });

    var keywords = new Bloodhound({
        datumTokenizer: Bloodhound.tokenizers.obj.whitespace('label'),
        queryTokenizer: Bloodhound.tokenizers.whitespace,
        prefetch: {
            url: '/rest/v1/typeaheads/keywords?format=json',
            thumbprint: "keywords",

            filter: function (response) {
                return response.results;
            }
        }
    });

    var projects = new Bloodhound({
        datumTokenizer: Bloodhound.tokenizers.obj.whitespace('title'),
        queryTokenizer: Bloodhound.tokenizers.whitespace,
        prefetch: {
            url: '/rest/v1/typeaheads/projects?format=json&published=1',
            thumbprint: "projects",

            filter: function (response) {
                return response.results;
            }
        }
    });

    projects.initialize();
    locations.initialize();
    keywords.initialize();

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
                suggestion: _.template(
                    '<a href="/project/<%= id %>"><p>(ID: <%= id %>) <%= title %></p></a>'
                )
            }
        },
        {
            name: 'locations',
            displayKey: 'name',
            source: locations.ttAdapter(),
            templates: {
                header: '<h3 class="dd-category">' + locations_text + '</h3>',
                suggestion: _.template(
                    '<a href="/projects/?location=<%= code %>"><p><%= name %></p></a>'
                )
            }
        },
        {
            name: 'keywords',
            displayKey: 'label',
            source: keywords.ttAdapter(),
            templates: {
                header: '<h3 class="dd-category">Keywords</h3>',
                suggestion: _.template(
                    '<a href="/projects/?keyword=<%= id %>"><p><%= label %></p></a>'
                )
            }
        }
    );

    $('#filterForm').on('click', '.filter_focus_area', function (event) {
        var tmp = $('#id_title').val();
        $('select#id_focus_area option').filter(function () {
            return $(this).text() == tmp;
        }).prop('selected', true);
        $('#id_title').val('');
        $('#filterForm').submit();
    });

    $('#filterForm').on('mouseover', '.filter_focus_area', function (event) {
        $('#collapseOne').addClass('in');
        $('select#id_focus_area option').filter(function () {
            return $(this).text() == $(this).val();
        }).prop('selected', true);
    });

    $('#filterForm').on('mouseout', '.filter_focus_area', function (event) {
        $('#collapseOne').removeClass('in');
    });

    $('#sortByDropdown').on('click', 'a', (function (event) {
        insertParam('sort_by', $(event.target).attr('param'));
    }));

});

(function () {

    var applyFilterButton;

    applyFilterButton = document.getElementById('apply-filter');
    applyFilterButton.onclick = function () {
        document.getElementById('filterForm').submit();
    };

}());
