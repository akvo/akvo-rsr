/** @jsx React.DOM */

// Akvo RSR is covered by the GNU Affero General Public License.
// See more details in the license.txt file located at the root folder of the
// Akvo RSR module. For additional details on the GNU license please see
// < http://www.gnu.org/licenses/agpl.html >.

var endpoints,
    i18n,
    Typeahead;

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

function initReact() {
    // Load globals
    Typeahead = ReactBootstrapTypeahead.Typeahead;

    var ProjectTypeahead = React.createClass({
        selectProject: function(selections) {
            var project = selections[0];
            var resultsURL = endpoints.results_url
            var resultsURL = resultsURL.substr(0, resultsURL.length - 2);
            if (project.id !== '') {
                window.location.assign(resultsURL + project.id + '/');
            }
        },

        render: function() {
            return (
                <div>
                    {React.createElement(Typeahead, {
                        placeholder: i18n.typeahead_placeholder,
                        options: this.props.projects,
                        onChange: this.selectProject,
                        filterBy: ['filterOption', 'subtitle'],
                        labelKey: 'displayOption'})}
                </div>
            );
        }

    });

    var MyResultsSelectApp  = React.createClass({
        getInitialState: function() {
            return {
                projects: [],
                loading: false
            };
        },

        componentDidMount: function() {
            this.setState({loading: true});
            this.getProjects();
        },

        processProjects: function(projects) {
            projects.forEach(function (project) {
                project.filterOption = project.title + ' ' + project.id;
                project.displayOption = project.title + ' (id: ' + project.id + ')';
            });
            return projects;
        },

        getProjects: function() {
            var xmlHttp = new XMLHttpRequest();
            var url = endpoints.base_url + endpoints.impact_projects + '?format=json';
            var thisApp = this;
            xmlHttp.onreadystatechange = function() {
                if (xmlHttp.readyState == XMLHttpRequest.DONE && xmlHttp.status == 200) {
                    thisApp.setState({
                        projects: thisApp.processProjects(JSON.parse(xmlHttp.responseText).results),
                        loading: false
                    });
                }
            };
            xmlHttp.open("GET", url, true);
            xmlHttp.send();
        },

        renderLoading: function() {
            if (this.state.loading) {
                return (
                    <div className="loading">
                        <i className="fa fa-spin fa-spinner" /> {i18n.loading_projects}
                    </div>
                );
            } else {
                return (
                    <span />
                );
            }
        },

        renderProjectSelect: function() {
            if (!this.state.loading) {
                if (this.state.projects.length === 0) {
                    return (
                        <div className="noProjects">
                            {i18n.no_projects_found}
                        </div>
                    );
                } else {
                    return (
                        <div>
                            <label>{i18n.select_project}</label>
                            {React.createElement(ProjectTypeahead, {
                                projects: this.state.projects
                            })}
                        </div>
                    );
                }
            } else {
                return (
                    <span />
                );
            }
        },

        render: function() {
            return (
                <div id="my-results-select">
                    <h3>{i18n.my_results}</h3>
                    {this.renderLoading()}
                    {this.renderProjectSelect()}
                </div>
            );
        }
    });

    // Initialize the 'My reports' app
    ReactDOM.render(
        React.createElement(MyResultsSelectApp),
        document.getElementById('container')
    );
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
        var reactTypeaheadSrc = document.getElementById('react-bootstrap-typeahead').src;
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
    // Retrieve data endpoints and translations
    endpoints = JSON.parse(document.getElementById('data-endpoints').innerHTML);
    i18n = JSON.parse(document.getElementById('translation-texts').innerHTML);

    // Check if React is loaded
    if (typeof React !== 'undefined' && typeof ReactDOM !== 'undefined' && typeof ReactTypeahead !== 'undefined') {
        initReact();
    } else {
        loadAndRenderReact();
    }
});
