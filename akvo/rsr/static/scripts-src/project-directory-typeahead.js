/** @jsx React.DOM */
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
                    loadAsync(url, retryCount++, retryLimit);
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
    allEntry.name = "All";
    orgs.unshift(allEntry);    

    currentFilter = getCurrentOrgFilter(orgs);
    updateIdElement(currentFilter);

    typeaheadOptions = getTypeaheadOptions(orgs);    
    typeaheadPlaceholder = getPlaceholder(currentFilter);
    typeaheadCallback = function(option) {
        var id, idElement;

        id = getIdFromName(option, orgs);
        idElement = document.querySelector('#org-filter-input');

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

    idElement = document.querySelector('#org-filter-input');
    idElement.value = filter.id;
}

function getPlaceholder(filter) {
    var placeholder;

    placeholder = filter.name;

    return placeholder;
}

function buildReactComponents(placeholder, typeaheadOptions, typeaheadCallback) {
    var Typeahead, TypeaheadLabel, TypeaheadContainer;

    Typeahead = ReactTypeahead.Typeahead;

    TypeaheadLabel = React.createClass({displayName: 'TypeaheadLabel',
        render: function() {
            return (
                React.DOM.div(null, 
                    React.DOM.label( {className:'control-label'}, "organisation")
                )
            );
        }
    });    

    TypeaheadContainer = React.createClass({displayName: 'TypeaheadContainer',
        render: function() {
            return (
                React.DOM.div(null, 
                    TypeaheadLabel(null ),
                    Typeahead(
                        {placeholder:placeholder,
                        options:typeaheadOptions,
                        onOptionSelected:typeaheadCallback,
                        maxVisible:"10",
                        customClasses:{
                          typeahead: "",
                          input: "form-group form-control",
                          results: "",
                          listItem: "",
                          token: "",
                          customAdd: ""            
                        },
                        className:"partnerTest"} )
                )
            );
        }
    });

    React.render(
        TypeaheadContainer(null ),
        document.getElementById('org-filter-container')
    );
}

loadAsync('/rest/v1/typeaheads/organisations?format=json', 0, 3);