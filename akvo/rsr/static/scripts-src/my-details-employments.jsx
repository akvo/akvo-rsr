/** @jsx React.DOM */

// Akvo RSR is covered by the GNU Affero General Public License.
// See more details in the license.txt file located at the root folder of the
// Akvo RSR module. For additional details on the GNU license please see
// < http://www.gnu.org/licenses/agpl.html >.


/* Global variables */
var Button = ReactBootstrap.Button,
    Modal = ReactBootstrap.Modal,
    ModalTrigger = ReactBootstrap.ModalTrigger,
    Typeahead = ReactTypeahead.Typeahead;

var countries,
    i18n,
    initial_data,
    organisations,
    request_link;

var orgsAPIUrl = '/rest/v1/typeaheads/organisations?format=json',
    countriesAPIUrl = '/rest/v1/typeaheads/countries?format=json';

// CSRF TOKEN
function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) == (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

var csrftoken = getCookie('csrftoken');

var Employment = React.createClass({
    getInitialState: function() {
        return {visible: true };
    },

    render: function() {
        if (!this.state.visible) {
            return React.createElement("li");
        }

        if (this.props.employment.is_approved) {
            return React.createElement("li", null, this.props.employment.organisation_full.name);
        } else {
            var notApproved = React.createElement("i", null, '(', i18n.not_approved_text, ')');
            return React.createElement("li", null, this.props.employment.organisation_full.name, ' ', notApproved);
        }
    }

});


var EmploymentList = React.createClass({
    render: function() {
        var employments = this.props.employments.map(function(job) {
            return React.createElement(Employment, {key: job.organisation_full.id, employment: job});
        });

        return React.createElement("ul", null, employments);
    }
});

var OrganisationInput = React.createClass({
    typeaheadCallback: function(option) {
        document.getElementById('organisationInput').setAttribute('value', option.id);
    },

    render: function() {
        var orgTypeahead = React.createElement(Typeahead, {
            placeholder: i18n.organisation_text,
            maxVisible: 10,
            options: organisations,
            onOptionSelected: this.typeaheadCallback,
            displayOption: 'displayOption',
            filterOption: 'filterOption',
            customClasses: {input: 'form-control'},
            inputProps: {id: 'organisationInput'}
        });
        var div = React.createFactory('div');
        var formGroupClass = this.props.orgError ? 'form-group has-error' : 'form-group';
        return div({className: formGroupClass}, orgTypeahead);
    }
});

var CountryInput = React.createClass({
    typeaheadCallback: function(option) {
        document.getElementById('countryInput').setAttribute('value', option.id);
    },

    render: function() {
        var div = React.createFactory('div');
        var countryTypeahead = React.createElement(Typeahead, {
            placeholder: i18n.country_text,
            maxVisible: 5,
            options: countries,
            onOptionSelected: this.typeaheadCallback,
            displayOption: 'name',
            filterOption: 'name',
            customClasses: {input: 'form-control'},
            inputProps: {id: 'countryInput'}
        });
        return div({className: 'form-group'}, countryTypeahead);
    }
});

var JobTitleInput = React.createClass({
    render: function() {
        var input = React.createFactory('input');
        var div = React.createFactory('div');
        var jobTitleInput = input({className: 'form-control', type: 'text', 'placeholder': i18n.job_title_text, id: "jobtitleInput"});
        return div({className: 'form-group'}, jobTitleInput);
    }
});

var AddEmploymentForm = React.createClass({
    getInitialState: function () {
        return {
            buttonText: i18n.request_join_text,
            loading: false,
            orgError: false
        };
    },

    handleAddEmployment: function (employment) {
        this.props.addEmployment(employment);
    },


    getFormData: function () {
        var orgValue = document.getElementById('organisationInput').getAttribute('value');
        var countryValue = document.getElementById('countryInput').getAttribute('value');
        var jobTitleValue = document.getElementById('jobtitleInput').value;

        return {
            organisation: orgValue,
            country: countryValue,
            job_title: jobTitleValue
        };
    },

    addEmployment: function () {
        this.setState({orgError: false});

        var formData = this.getFormData();
        if (formData.organisation === '') {
            this.setState({orgError: true});
        } else {
            var xmlHttp = new XMLHttpRequest();
            var thisForm = this;
            xmlHttp.onreadystatechange = function() {
                if (xmlHttp.readyState == XMLHttpRequest.DONE) {
                    var response = JSON.parse(xmlHttp.responseText);
                    if (xmlHttp.status == 200){
                        thisForm.handleAddEmployment(response);
                        return false;
                    } else if (xmlHttp.status == 409) {
                        thisForm.setState({
                            title: i18n.request_failed_text,
                            response: i18n.already_connected_text
                        });
                        return false;
                    } else {
                        thisForm.setState({
                            title: i18n.request_failed_text,
                            response: i18n.not_connected_text
                        });
                        return false;
                    }
                }
            };
            xmlHttp.open("POST", this.props.link + "?format=json", true);
            xmlHttp.setRequestHeader("X-CSRFToken", csrftoken);
            xmlHttp.setRequestHeader("Content-type", "application/json; charset=UTF-8");
            xmlHttp.send(JSON.stringify(formData));
        }
    },

    render: function() {
        var heading = React.createElement("h4", null, i18n.connect_employer_text);
        var orgInput = React.createElement(OrganisationInput, {orgError: this.state.orgError});
        var countryInput = React.createElement(CountryInput);
        var jobTitleInput = React.createElement(JobTitleInput);
        var button = React.createFactory('button');
        var formButton = button({onClick: this.addEmployment, className: 'btn btn-primary', type: "button"}, i18n.request_join_text);
        var form = React.createElement("form", null, orgInput, countryInput, jobTitleInput, formButton);
        return React.createElement("span", null, heading, form);
    }

});

var EmploymentApp = React.createClass({
    getInitialState: function() {
        return {employments: []};
    },

    componentDidMount: function() {
        if (this.isMounted()) {
            this.setState(
                {employments: this.props.employments}
            );
        }
    },

    addEmployment: function(employment) {
        this.setState(
            {employments: this.state.employments.concat([employment])}
        );
    },

    render: function() {
        var icon = React.createFactory("i");
        var headingIcon = icon({className: 'fa fa-users'});
        var heading = React.createElement("h3", null, headingIcon, ' ', i18n.my_organisations_text);
        var employmentList = React.createElement(EmploymentList, {employments: this.state.employments});
        var addEmploymentForm = React.createElement(AddEmploymentForm, {link: this.props.link, org_link: this.props.org_link, country_link: this.props.country_link, addEmployment: this.addEmployment});
        return React.createElement("span", null, heading, employmentList, addEmploymentForm);
    }
});

/* Build React components of Employments app */
function buildEmploymentsApp() {
    ReactDOM.render(
        React.createElement(
            EmploymentApp,
            {
                employments: initial_data.user.employments,
                link: request_link.link,
                org_link: request_link.org_rest_link,
                country_link: request_link.country_rest_link
            }
        ),
        document.getElementById('organisations')
    );
}

/* Process organisations results */
function processOrgs(orgResults) {
    function getDisplayOption(short, long) {
        if (short === long) {
            return short;
        }
        if (!long) {
            return short;
        }
        return short + ' (' + long + ')';
    }

    organisations = orgResults;
    organisations.forEach(function (o) {
        var newName = getDisplayOption(o.name, o.long_name);

        o.filterOption = o.name + ' ' + o.long_name;
        o.displayOption = newName;
    });
}

/* Retrieve all organisations and countries for the typeaheads */
function getOrgsandCountries() {
    // KB: Nasty implementation with nested API calls
    var xmlHttpOrgs = new XMLHttpRequest();
    xmlHttpOrgs.onreadystatechange = function() {
        // Get organisations first
        if (xmlHttpOrgs.readyState == XMLHttpRequest.DONE && xmlHttpOrgs.status == 200) {
            var orgResult = JSON.parse(xmlHttpOrgs.responseText);
            processOrgs(orgResult.results);
            var xmlHttpCountries = new XMLHttpRequest();
            xmlHttpCountries.onreadystatechange = function() {
                // Then get countries
                if (xmlHttpCountries.readyState == XMLHttpRequest.DONE && xmlHttpCountries.status == 200) {
                    var countriesResult = JSON.parse(xmlHttpCountries.responseText);
                    countries = countriesResult.results;
                    // Finally, build the app
                    buildEmploymentsApp();
                }
            };
            xmlHttpCountries.open("GET", countriesAPIUrl, true);
            xmlHttpCountries.send();
        }
    };
    xmlHttpOrgs.open("GET", orgsAPIUrl, true);
    xmlHttpOrgs.send();
}

/* Get initial data from HTML and store in global variables */
function getInitialData() {
    initial_data = JSON.parse(document.getElementById("initial-data").innerHTML);
    request_link = JSON.parse(document.getElementById("user-request-link").innerHTML);
    i18n = JSON.parse(document.getElementById("my-details-text").innerHTML);
}

document.addEventListener('DOMContentLoaded', function() {
    getInitialData();
    getOrgsandCountries();
});

