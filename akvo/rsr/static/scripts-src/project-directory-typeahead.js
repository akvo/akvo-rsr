/** @jsx React.DOM */

// Akvo RSR is covered by the GNU Affero General Public License.
// See more details in the license.txt file located at the root folder of the
// Akvo RSR module. For additional details on the GNU license please see
// < http://www.gnu.org/licenses/agpl.html >.

var i18n,
    Typeahead;

function loadAsync(url, retryCount, retryLimit) {
    var xmlHttp;

    xmlHttp = new XMLHttpRequest();

    xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState == XMLHttpRequest.DONE) {

            if(xmlHttp.status == 200){
                processResponse(xmlHttp.responseText);
            } else {
                if (retryCount >= retryLimit) {
                    return;
                } else {
                    retryCount = retryCount + 1;
                    loadAsync(url, retryCount, retryLimit);
                }
            }
        } else {
            return;
        }
    };

    xmlHttp.open("GET", url, true);
    xmlHttp.send();
}

function processResponse(response) {
    var orgs, typeaheadOptions, typeaheadPlaceholder, typeaheadCallback, allEntry, currentFilter;

    orgs = JSON.parse(response);
    orgs = orgs.results;

    // Add an "All" entry so user can reset filter
    allEntry = {};
    allEntry.id = "";
    allEntry.name = i18n.all_text;
    orgs.unshift(allEntry);

    currentFilter = getCurrentOrgFilter(orgs);
    updateIdElement(currentFilter);

    typeaheadOptions = getTypeaheadOptions(orgs);
    typeaheadPlaceholder = getPlaceholder(currentFilter);
    typeaheadCallback = function(option) {
        var id, idElement;

        id = getIdFromName(option, orgs);
        idElement = document.getElementById('org-filter-input');

        idElement.value = id;
    };

    buildReactComponents(typeaheadPlaceholder, typeaheadOptions, typeaheadCallback);
}

function getTypeaheadOptions(orgs) {
    var orgNames;

    orgNames = [];

    for (var i = 0; i < orgs.length; i++) {
        orgNames[i] = orgs[i].name;
    }

    return orgNames;
}

function getCurrentOrgFilter(orgs) {

    var currentFilterId, currentFilterName, filter;

    currentFilterId = JSON.parse(document.getElementById("react-typeahead-org").innerHTML).currentOrg;
    currentFilterName = getNameFromId(currentFilterId, orgs);

    filter = {};
    filter.id = currentFilterId;
    filter.name = currentFilterName;

    return filter;
}

function getNameFromId(id, orgs) {
    for (var i = 0; i < orgs.length; i++) {
        if (id.toString().toLowerCase() === orgs[i].id.toString().toLowerCase()) {
            return orgs[i].name;
        }
    }
    return "All";
}

function getIdFromName(name, orgs) {
    for (var i = 0; i < orgs.length; i++) {
        if (name.toString().toLowerCase() === orgs[i].name.toString().toLowerCase()) {
            return orgs[i].id;
        }
    }
    return "";
}

function updateIdElement(filter) {
    var idElement, typeaheadPlaceholder;

    idElement = document.getElementById('org-filter-input');
    idElement.value = filter.id;
}

function getPlaceholder(filter) {
    return filter.name;
}

function buildReactComponents(placeholder, typeaheadOptions, typeaheadCallback) {
    var TypeaheadLabel = React.createClass({displayName: 'TypeaheadLabel',
        render: function() {
            return React.createElement('div', null,
                React.createElement('label', {className: 'control-label'}, i18n.organisation_text)
            );
        }
    });

    var TypeaheadContainer = React.createClass({displayName: 'TypeaheadContainer',
        render: function() {
            return React.createElement('div', null,
                React.createElement(TypeaheadLabel),
                React.createElement(Typeahead, {
                    placeholder: placeholder,
                    options: typeaheadOptions,
                    onOptionSelected: typeaheadCallback,
                    maxVisible: 10,
                    customClasses: {
                        typeahead: "",
                        input: "form-group form-control",
                        results: "",
                        listItem: "",
                        token: "",
                        customAdd: ""
                    },
                    className: "partnerTest"
                })
            );
        }
    });

    ReactDOM.render(
        React.createElement(TypeaheadContainer), document.getElementById('org-filter-container')
    );
}

function initReact() {
    // Load globals
    Typeahead = ReactTypeahead.Typeahead;
    loadAsync('/rest/v1/typeaheads/organisations?format=json&partners=1', 0, 3);
}

var loadJS = function(url, implementationCode, location){
    //url is URL of external file, implementationCode is the code
    //to be called from the file, location is the location to
    //insert the <script> element

    var scriptTag = document.createElement('script');
    scriptTag.src = url;

    scriptTag.onload = implementationCode;
    scriptTag.onreadystatechange = implementationCode;

    location.appendChild(scriptTag);
};

function loadAndRenderReact() {
    function loadReactTypeahead() {
        var reactTypeaheadSrc = document.getElementById('react-typeahead').src;
        loadJS(reactTypeaheadSrc, initReact, document.body);
    }

    function loadReactDOM() {
        var reactDOMSrc = document.getElementById('react-dom').src;
        loadJS(reactDOMSrc, loadReactTypeahead, document.body);
    }

    console.log('No React, load again.');
    var reactSrc = document.getElementById('react').src;
    loadJS(reactSrc, loadReactDOM, document.body);
}

document.addEventListener('DOMContentLoaded', function() {
    // Initial data
    i18n = JSON.parse(document.getElementById("typeahead-header-text").innerHTML);

    // Check if React is loaded
    if (typeof React !== 'undefined' && typeof ReactDOM !== 'undefined' && typeof ReactTypeahead !== 'undefined') {
        initReact();
    } else {
        loadAndRenderReact();
    }
});
